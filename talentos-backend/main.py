import io
import json
import os
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import PyPDF2
from google import genai
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
import os
from dotenv import load_dotenv

# Database tables automatically create hongi
Base.metadata.create_all(bind=engine)

# .env file se variables load karo
load_dotenv()

# Ab os.getenv() ke andar variable ka naam dena hai, key khud nahi!
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="TalentOS API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Uploads folder create karna aur static files ko serve karna (Recruiter CV dekh sake)
os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- ENDPOINT 1: RESUME UPLOAD & AI PARSING ---
@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        
        # PDF ko 'uploads' folder mein hard drive par save karna
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # PDF se text extract karna
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        resume_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                resume_text += text + "\n"
                
        # AI Prompt (Skills, Score, Gaps, Roadmap)
        prompt = f"""
        You are an expert technical recruiter AI. Analyze this resume for a "Software Engineer (SDE-1)" role.
        Provide the output in strict JSON format.
        
        Resume Text:
        {resume_text}
        
        Extract:
        1. "skills": Top 5 technical skills.
        2. "talent_score": Score out of 100.
        3. "skill_gaps": List of 2 missing skills or weak areas for an SDE-1 role.
        4. "roadmap": List of 2 short, actionable learning steps.
        
        Respond ONLY with a JSON object like this:
        {{"skills": ["skill1", "skill2"], "talent_score": 85, "skill_gaps": ["Docker", "System Design"], "roadmap": ["Learn Docker basics", "Practice API rate limiting"]}}
        """
        
        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=prompt,
        )
        
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '')
        ai_data = json.loads(cleaned_response)
        
        skills_list = ai_data.get("skills", [])
        talent_score = ai_data.get("talent_score", 0)
        skill_gaps = ai_data.get("skill_gaps", ["Cloud Deployment", "Advanced CI/CD"])
        roadmap = ai_data.get("roadmap", ["Build a full-stack project", "Practice LeetCode mediums"])

        # Naye columns ke sath PostgreSQL mein save karna
        new_profile = models.StudentProfile(
            filename=file.filename,
            talent_score=talent_score,
            skills=", ".join(skills_list),
            skill_gaps=", ".join(skill_gaps),
            roadmap="|".join(roadmap)  
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        
        return {
            "filename": file.filename,
            "ai_extracted_skills": skills_list,
            "talent_score": talent_score,
            "skill_gaps": skill_gaps,
            "roadmap": roadmap
        }
    except Exception as e:
        return {"error": str(e)}

# --- ENDPOINT 2: GET ALL CANDIDATES ---
@app.get("/api/profiles")
def get_all_profiles(db: Session = Depends(get_db)):
    try:
        profiles = db.query(models.StudentProfile).order_by(models.StudentProfile.talent_score.desc()).all()
        return {"status": "success", "data": profiles}
    except Exception as e:
        return {"error": str(e)}

# --- ENDPOINT 3: RECRUITER AI COPILOT CHATBOT ---
class CopilotQuery(BaseModel):
    question: str

@app.post("/api/copilot")
def recruiter_copilot(query: CopilotQuery, db: Session = Depends(get_db)):
    try:
        # Database se saare candidates ka data nikalna
        profiles = db.query(models.StudentProfile).all()
        candidates_data = [
            {"name": p.filename, "score": p.talent_score, "skills": p.skills} 
            for p in profiles
        ]
        
        prompt = f"""
        You are an expert HR AI Assistant. Here is the current candidate database:
        {candidates_data}
        
        The recruiter asked: "{query.question}"
        
        Answer the recruiter's question directly and professionally in 2-3 short sentences based ONLY on the provided candidate data. If no candidate matches the query, politely say so.
        """
        
        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=prompt,
        )
        return {"reply": response.text.strip()}
    except Exception as e:
        return {"error": str(e)}
class InterviewAnswer(BaseModel):
    question: str
    answer: str

@app.post("/api/evaluate-interview")
def evaluate_interview(data: InterviewAnswer):
    try:
        prompt = f"""
        You are an expert technical interviewer. Evaluate the candidate's answer to the technical question.
        Provide the output in strict JSON format.
        
        Question: {data.question}
        Candidate's Answer: {data.answer}
        
        Evaluate based on technical accuracy, clarity, and depth. Provide a score out of 100 and brief constructive feedback.
        
        Respond ONLY with a JSON object like this:
        {{"score": 85, "feedback": "Good understanding of core concepts, but could mention Redis token bucket algorithm for better scaling."}}
        """
        
        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=prompt,
        )
        
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '')
        eval_data = json.loads(cleaned_response)
        
        return {"status": "success", "evaluation": eval_data}
    except Exception as e:
        return {"error": str(e)}