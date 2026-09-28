/**
 * TalentOS Core JavaScript Application Logic
 * Handles Candidate Data, Table Rendering, 360 Digital Twin Radar Chart, & Copilot queries.
 */

// Mock Database of Candidates for Recruiter Dashboard
const candidateDatabase = [
  {
    id: 1,
    name: "Aarav Sharma",
    avatar: "A",
    role: "SDE-1",
    talentScore: 94,
    techScore: 95,
    githubRating: "A+ (14 Repos)",
    interviewScore: 92,
    commScore: 90,
    cultureScore: 88,
    problemSolving: 96,
    recommendation: "STRONG HIRE",
    techDetail: "Top-tier DSA & Distributed Systems knowledge. Active open-source contributor.",
    gitDetail: "Verified 8 production microservices. Automatic CI/CD workflows detected.",
    interviewDetail: "Spot-on answers on Redis Token Bucket and Database Indexing."
  },
  {
    id: 2,
    name: "Priya Verma",
    avatar: "P",
    role: "Backend Engineer",
    talentScore: 89,
    techScore: 90,
    githubRating: "A (9 Repos)",
    interviewScore: 88,
    commScore: 94,
    cultureScore: 92,
    problemSolving: 86,
    recommendation: "HIRE",
    techDetail: "FastAPI & Async Python expert. Great architectural clarity.",
    gitDetail: "Solid project structure. Unit test coverage > 85%.",
    interviewDetail: "Strong articulation of REST vs GraphQL design choices."
  },
  {
    id: 3,
    name: "Rohan Gupta",
    avatar: "R",
    role: "AI/ML Specialist",
    talentScore: 87,
    techScore: 92,
    githubRating: "A (11 Repos)",
    interviewScore: 82,
    commScore: 80,
    cultureScore: 85,
    problemSolving: 94,
    recommendation: "HIRE",
    techDetail: "PyTorch & LLM Fine-tuning specialist. Strong math foundation.",
    gitDetail: "Published 3 HuggingFace model spaces and fine-tuning pipelines.",
    interviewDetail: "Deep technical insight on RAG & Vector databases."
  },
  {
    id: 4,
    name: "Sneha Patel",
    avatar: "S",
    role: "SDE-1",
    talentScore: 78,
    techScore: 76,
    githubRating: "B+ (5 Repos)",
    interviewScore: 80,
    commScore: 85,
    cultureScore: 88,
    problemSolving: 75,
    recommendation: "INTERVIEW NEXT",
    techDetail: "Good React & Node.js basics. Needs improvement in System Design.",
    gitDetail: "Standard portfolio projects. Clean JavaScript code.",
    interviewDetail: "Good communication, but struggled slightly on Redis caching."
  }
];

// Initialize Recruiter Candidate Leaderboard Table
function renderCandidateTable(data) {
  const tbody = document.getElementById('candidateTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  data.forEach((cand, index) => {
    const tr = document.createElement('tr');
    
    let badgeClass = 'badge-success';
    if (cand.talentScore < 80) badgeClass = 'badge-warning';

    tr.innerHTML = `
      <td style="font-weight: bold; color: var(--text-muted);">#${index + 1}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">
            ${cand.avatar}
          </div>
          <span style="font-weight: 600;">${cand.name}</span>
        </div>
      </td>
      <td><span class="badge badge-primary">${cand.role}</span></td>
      <td>
        <span style="font-size: 1.1rem; font-weight: 800; color: var(--accent-primary);">${cand.talentScore}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">/100</span>
      </td>
      <td><span style="font-size: 0.85rem; color: var(--accent-secondary); font-weight: 500;">${cand.githubRating}</span></td>
      <td><span class="badge ${badgeClass}">${cand.interviewScore}/100</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="openDigitalTwinModal(${cand.id})">
          🔍 360° Digital Twin
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Filter Candidates by Role
function filterCandidates() {
  const role = document.getElementById('roleFilter').value;
  if (role === 'All') {
    renderCandidateTable(candidateDatabase);
  } else {
    const filtered = candidateDatabase.filter(c => c.role.includes(role));
    renderCandidateTable(filtered);
  }
}

// Global Radar Chart Instance reference for destruction/re-creation
let modalChartInstance = null;

// Open 360° Digital Twin Modal
function openDigitalTwinModal(candidateId) {
  const cand = candidateDatabase.find(c => c.id === candidateId);
  if (!cand) return;

  document.getElementById('modalAvatar').innerText = cand.avatar;
  document.getElementById('modalName').innerText = cand.name;
  document.getElementById('modalRole').innerText = `Target Role: ${cand.role}`;
  document.getElementById('modalScore').innerText = `${cand.talentScore}/100`;
  document.getElementById('modalRecommendation').innerText = cand.recommendation;
  
  document.getElementById('modalTechDetail').innerText = cand.techDetail;
  document.getElementById('modalGitDetail').innerText = cand.gitDetail;
  document.getElementById('modalInterviewDetail').innerText = cand.interviewDetail;

  const modal = document.getElementById('twinModal');
  modal.classList.add('active');

  // Destroy existing chart instance before re-drawing
  if (modalChartInstance) {
    modalChartInstance.destroy();
  }

  // Draw 360 Radar Chart on Modal Canvas
  const ctx = document.getElementById('modalRadarChart').getContext('2d');
  modalChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical', 'GitHub Proof', 'Interview', 'Communication', 'Culture Fit', 'Problem Solving'],
      datasets: [{
        label: `${cand.name} Profile`,
        data: [cand.techScore, 85, cand.interviewScore, cand.commScore, cand.cultureScore, cand.problemSolving],
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#38bdf8'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: { color: '#94a3b8', font: { size: 11, weight: 'bold' } },
          ticks: { display: false, max: 100 }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function closeModal() {
  document.getElementById('twinModal').classList.remove('active');
}

// Copilot Queries
function queryCopilot(questionText) {
  const box = document.getElementById('copilotResponse');
  if (!box) return;

  box.innerHTML = '⚡ <em>Gemini AI analyzing candidate pool...</em>';
  
  setTimeout(() => {
    if (questionText.includes('Backend')) {
      box.innerHTML = '<strong>Copilot Answer:</strong><br>🏆 <strong>Priya Verma</strong> (89/100) is your top candidate for Backend Node.js/FastAPI. She has 9 production repos and 94% score in communication.';
    } else {
      box.innerHTML = '<strong>Copilot Answer:</strong><br>🏆 <strong>Aarav Sharma</strong> (94/100) leads technical communication with a 90/100 articulation rating during AI telemetry.';
    }
  }, 700);
}

// Student Resume Upload Simulation
function handleResumeUpload(event) {
  const status = document.getElementById('uploadStatus');
  if (status) {
    status.style.display = 'block';
    status.innerHTML = '⏳ <em>Gemini AI Parsing PDF structure...</em>';
    setTimeout(() => {
      status.innerHTML = '✓ <strong>Resume Successfully Analyzed!</strong> Extracted 14 skills: React, FastAPI, Node.js, PostgreSQL, Docker.';
    }, 1200);
  }
}

function generateTalentScore() {
  alert('✨ Recalculated Talent 360° Score! Your target readiness index is now 88% Match.');
}

function exportShortlist() {
  alert('📥 Exporting Top Candidates as CSV...');
}

// Auto-run on Page Load
window.addEventListener('DOMContentLoaded', () => {
  renderCandidateTable(candidateDatabase);
});
