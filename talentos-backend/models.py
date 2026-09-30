from sqlalchemy import Column, Integer, String
from database import Base

class StudentProfile(Base):
    __tablename__ = "candidates_v2" 

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    talent_score = Column(Integer)
    skills = Column(String)
    skill_gaps = Column(String)  # Naya column gaps ke liye
    roadmap = Column(String)     # Naya column roadmap ke liye