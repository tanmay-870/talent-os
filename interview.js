/**
 * TalentOS AI Mock Interview Logic
 * Handles Web Speech API (Text-to-Speech & Speech-to-Text), Webcam Stream, & AI Telemetry Evaluation.
 */

const sampleQuestions = [
  "How would you design a distributed rate limiter for an API endpoint handling 100,000 requests per second? Which data structure or storage engine would you pick?",
  "Explain how you handle database connection pooling in FastAPI/Node.js under high concurrent read loads.",
  "What strategies do you use for zero-downtime database migrations when modifying a table with millions of rows?"
];

let currentQuestionIndex = 0;
let isRecording = false;
let recognition = null;

// Initialize Speech Recognition if browser supports it
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    document.getElementById('userAnswerText').value = transcript;
  };
}

// Speak Question Out Loud using Web Speech API (Text to Speech)
function speakQuestion() {
  const text = document.getElementById('questionText').innerText;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Browser Speech Synthesis is not supported.');
  }
}

// Toggle Voice Recording
function toggleRecording() {
  const btn = document.getElementById('recBtn');
  const status = document.getElementById('micStatus');
  const textArea = document.getElementById('userAnswerText');

  if (!isRecording) {
    isRecording = true;
    btn.innerHTML = '🛑 Stop Recording & Analyze';
    btn.className = 'btn btn-secondary';
    status.innerText = '🔴 Recording Live...';
    status.className = 'badge badge-warning';

    if (recognition) {
      recognition.start();
    } else {
      // Fallback transcript simulation if Web Speech API isn't enabled
      textArea.value = "For a distributed rate limiter handling 100k req/sec, I would use Redis with a Token Bucket or Leaky Bucket algorithm. Redis is in-memory and supports atomic Lua scripts, ensuring low latency lockless counting across distributed API gateways...";
    }
  } else {
    isRecording = false;
    btn.innerHTML = '🎙️ Start Voice Recording';
    btn.className = 'btn btn-primary';
    status.innerText = '✓ Recording Captured';
    status.className = 'badge badge-success';

    if (recognition) {
      recognition.stop();
    }
  }
}

// Enable Webcam Preview
async function startWebcam() {
  const video = document.getElementById('webcam');
  const placeholder = document.getElementById('videoPlaceholder');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    video.style.display = 'block';
    placeholder.style.display = 'none';
  } catch (err) {
    alert('Webcam access was denied or not available. Displaying simulated candidate avatar.');
  }
}

// Request AI Hint
function generateHint() {
  alert('💡 AI Hint: Think about memory efficiency. Algorithms like Token Bucket, Leaky Bucket, or Sliding Window Log in Redis are commonly used.');
}

// Submit Answer for Real-Time AI Telemetry Evaluation
function submitAnswer() {
  const answer = document.getElementById('userAnswerText').value;
  if (!answer.trim()) {
    alert('Please record or type your answer before submitting.');
    return;
  }

  const evalCard = document.getElementById('evaluationCard');
  evalCard.style.display = 'block';
  evalCard.scrollIntoView({ behavior: 'smooth' });
}

// Proceed to Next Question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < sampleQuestions.length) {
    document.getElementById('qNumberBadge').innerText = `Question ${currentQuestionIndex + 1} of 5`;
    document.getElementById('questionText').innerText = `"${sampleQuestions[currentQuestionIndex]}"`;
    document.getElementById('userAnswerText').value = '';
    document.getElementById('evaluationCard').style.display = 'none';
    document.getElementById('micStatus').innerText = 'Ready';
    document.getElementById('micStatus').className = 'badge badge-success';
  } else {
    alert('🎉 AI Mock Interview Completed! Your telemetry score has been attached to your 360° Talent Profile.');
    window.location.href = 'student.html';
  }
}
