const startButton = document.getElementById('startButton');
const overview = document.getElementById('overview');
const resultPanel = document.getElementById('resultPanel');
const finalScreen = document.getElementById('finalScreen');
const options = document.getElementById('options');
const scenarioTitle = document.getElementById('scenarioTitle');
const scenarioText = document.getElementById('scenarioText');
const currentPhase = document.getElementById('currentPhase');
const motivation = document.getElementById('motivation');
const budget = document.getElementById('budget');
const resultText = document.getElementById('resultText');
const nextPhaseButton = document.getElementById('nextPhaseButton');
const finalSummary = document.getElementById('finalSummary');
const finalMotivation = document.getElementById('finalMotivation');
const finalBudget = document.getElementById('finalBudget');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let state = {
  phase: 0,
  motivation: 50,
  budget: 500,
  score: 0,
};

const phases = [
  {
    title: 'Semesterplan erstellen',
    text: 'Du hast viele Aufgaben im Studium. Wählst du eine feste Wochenstruktur oder lässt du Flexibilität für spontane Projekte?',
    options: [
      {
        title: 'Fester Lernplan',
        description: 'Du arbeitest strukturiert, sparst später Zeit und verbesserst den Lernfortschritt.',
        motivation: 10,
        budget: 0,
        score: 20,
        feedback: 'Gute Planung! Dein Schreibtisch bleibt aufgeräumt und du hast mehr Ruhephasen.',
      },
      {
        title: 'Flexibler Tagesplan',
        description: 'Du nimmst dir Zeit für spontane Aufgaben, riskierst aber höhere Last kurz vor Abgaben.',
        motivation: 5,
        budget: 0,
        score: 10,
        feedback: 'Flexibel sein kann helfen, solange du deine Deadlines im Blick behältst.',
      },
      {
        title: 'Alle Termine in einem Tag',
        description: 'Du konzentrierst dich auf einen intensiven Tag mit Lernmarathon.',
        motivation: -5,
        budget: 0,
        score: 5,
        feedback: 'Intensiv zu arbeiten bringt Punkte, aber deine Energie sinkt schnell.',
      },
    ],
  },
  {
    title: 'Projektteam auswählen',
    text: 'Du hast ein Gruppenprojekt. Welches Team wählst du aus und wie unterstützt du das Team?',
    options: [
      {
        title: 'Aktive Kommunikation',
        description: 'Du leitest Teammeetings und verteilst Aufgaben klar.',
        motivation: 10,
        budget: -50,
        score: 25,
        feedback: 'Teamarbeit läuft besser, weil alle wissen, was zu tun ist.',
      },
      {
        title: 'Selbstständig arbeiten',
        description: 'Du erledigst den Großteil alleine, um Zeit zu sparen.',
        motivation: -5,
        budget: 0,
        score: 10,
        feedback: 'Du erreichst Ergebnisse, riskierst aber Stress und Unzufriedenheit im Team.',
      },
      {
        title: 'Kreative Idee priorisieren',
        description: 'Du investierst in ein innovatives Konzept, das Zeit und Ressourcen braucht.',
        motivation: 5,
        budget: -100,
        score: 30,
        feedback: 'Eine kreative Lösung kann sich auszahlen, wenn du das Team gut führst.',
      },
    ],
  },
  {
    title: 'Prüfungsvorbereitung',
    text: 'Die Prüfungsphase beginnt. Nutzt du Nachhilfe, Studiengruppen oder Selbststudium?',
    options: [
      {
        title: 'Studiengruppe bilden',
        description: 'Du lernst mit Kommilitonen gemeinsam und teilst Wissen.',
        motivation: 10,
        budget: 0,
        score: 20,
        feedback: 'Gemeinsam lernen stärkt die Motivation und hilft bei der Prüfungsvorbereitung.',
      },
      {
        title: 'Online-Nachhilfe buchen',
        description: 'Du investierst in externe Unterstützung, um gezielt Lücken zu schließen.',
        motivation: 5,
        budget: -120,
        score: 25,
        feedback: 'Eine gute Investition, aber achte auf dein Budget.',
      },
      {
        title: 'Allein durchbüffeln',
        description: 'Du setzt auf Eigenmotivation und intensives Selbststudium.',
        motivation: -10,
        budget: 0,
        score: 10,
        feedback: 'Du sammelst Punkte, aber deine Energie kann erschöpfen.',
      },
    ],
  },
];

function startGame() {
  state = {
    phase: 0,
    motivation: 50,
    budget: 500,
    score: 0,
  };
  document.getElementById('startButton').classList.add('hidden');
  overview.classList.remove('hidden');
  resultPanel.classList.add('hidden');
  finalScreen.classList.add('hidden');
  updateStatus();
  renderPhase();
}

function updateStatus() {
  currentPhase.textContent = state.phase + 1;
  motivation.textContent = state.motivation;
  budget.textContent = state.budget;
}

function renderPhase() {
  const phase = phases[state.phase];
  scenarioTitle.textContent = phase.title;
  scenarioText.textContent = phase.text;
  options.innerHTML = '';
  phase.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.innerHTML = `<strong>${option.title}</strong><span>${option.description}</span>`;
    button.addEventListener('click', () => chooseOption(index));
    options.appendChild(button);
  });
}

function chooseOption(optionIndex) {
  const phase = phases[state.phase];
  const choice = phase.options[optionIndex];
  state.motivation = Math.max(0, Math.min(100, state.motivation + choice.motivation));
  state.budget = Math.max(0, state.budget + choice.budget);
  state.score += choice.score;
  updateStatus();

  resultText.textContent = choice.feedback;
  resultPanel.classList.remove('hidden');
  options.querySelectorAll('button').forEach(btn => btn.disabled = true);
}

function nextPhase() {
  resultPanel.classList.add('hidden');
  state.phase += 1;
  if (state.phase >= phases.length) {
    showFinalScreen();
    return;
  }
  renderPhase();
}

function showFinalScreen() {
  overview.classList.add('hidden');
  finalScreen.classList.remove('hidden');
  finalSummary.textContent = 'Du hast dein Semester erfolgreich abgeschlossen. Schau dir deine Ergebnisse an und starte erneut, um andere Entscheidungen zu testen.';
  finalMotivation.textContent = state.motivation;
  finalBudget.textContent = state.budget;
  finalScore.textContent = state.score;
}

startButton.addEventListener('click', startGame);
nextPhaseButton.addEventListener('click', nextPhase);
restartButton.addEventListener('click', startGame);
