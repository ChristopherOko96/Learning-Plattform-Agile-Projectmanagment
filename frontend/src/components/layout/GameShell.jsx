import React from 'react'
import { useGameState } from '../../hooks/useGameState'
import ProgressBar from '../ui/ProgressBar'
import StateIndicator from '../ui/StateIndicator'
import SprintPhase from '../game/SprintPhase'
import KanbanBoard from '../game/KanbanBoard'
import ReflectionScreen from '../game/ReflectionScreen'

// Platzhalter-Komponenten für Phasen, die noch nicht implementiert sind
const IntroScreen = ({ onContinue }) => (
  <div>
    <h1>Willkommen bei SprintLock</h1>
    <p>
      Du übernimmst die Rolle eines Scrum Masters bei der VeloTech GmbH.
      Dein Team entwickelt ein smartes Fahrradschloss – und du triffst die Entscheidungen.
    </p>
    <button onClick={onContinue}>Spiel starten</button>
  </div>
)

const EndScreen = ({ gameState, onRestart }) => (
  <div>
    <h1>Spiel beendet</h1>
    <p>Du hast alle Sprints und die Kanban-Phase abgeschlossen.</p>
    <p>Insgesamt {gameState.decisions.length} Entscheidungen getroffen.</p>
    <button onClick={onRestart}>Nochmal spielen</button>
  </div>
)

// Beispiel-Situation für den Platzhalter (wird später aus situations.js geladen)
const BEISPIEL_SITUATION = {
  id: 'situation-1',
  title: 'Sprint Planning: Wie viel nehmen wir uns vor?',
  context: 'Das Team hat eine Velocity von 14 Story Points. Im Backlog liegen Items für 28 SP. Der Product Owner sagt: „Wir könnten eigentlich 20 SP schaffen, wenn wir uns anstrengen."',
  inputType: 'choice',
  options: [
    { id: 'a', label: '20 SP – wir geben Vollgas', stateChanges: { velocity: -3, teamMorale: -1 } },
    { id: 'b', label: '14 SP – Velocity als Basis', stateChanges: {} },
    { id: 'c', label: '10 SP – lieber weniger', stateChanges: { ceoRelation: -1 } }
  ],
  ahaMessage: 'Overcommitment fühlt sich nach Motivation an – liefert aber weniger als realistisches Planen. Velocity ist kein Ziel das übertroffen werden muss, sondern ein Werkzeug zur realistischen Planung.'
}

/**
 * Rahmenkomponente des Spiels.
 * Koordiniert Header (Fortschritt + Zustandsanzeige) und den phasenabhängigen Inhalt.
 */
function GameShell() {
  const {
    gameState,
    applyStateChanges,
    advancePhase,
    recordDecision,
    resetGame,
    initKanbanBoard
  } = useGameState()

  // Behandelt den Abschluss einer Spielsituation
  const handleSituationComplete = (decision) => {
    if (decision.stateChanges) {
      applyStateChanges(decision.stateChanges)
    }
    recordDecision(decision.situationId, decision.input, decision.aiResponse)
    advancePhase()
  }

  // Gibt die zur aktuellen Phase passende Komponente zurück
  const renderPhase = () => {
    switch (gameState.phase) {
      case 'intro':
        return <IntroScreen onContinue={advancePhase} />

      case 'planning':
      case 'execution':
      case 'review':
        // Platzhalter: später wird die richtige Situation aus situations.js geladen
        return (
          <SprintPhase
            situation={BEISPIEL_SITUATION}
            onComplete={handleSituationComplete}
          />
        )

      case 'retro':
        return (
          <ReflectionScreen
            decisions={gameState.decisions}
            gameState={gameState}
            onContinue={advancePhase}
          />
        )

      case 'kanban':
        return (
          <KanbanBoard
            board={gameState.kanbanBoard}
            onTicketMove={(ticketId, from, to) => {
              // Kanban-Logik wird später implementiert
              console.log('Ticket verschoben:', ticketId, from, '->', to)
            }}
            wipLimits={{ inProgress: 3, review: 4 }}
          />
        )

      case 'end':
        return <EndScreen gameState={gameState} onRestart={resetGame} />

      default:
        return <p>Unbekannte Phase: {gameState.phase}</p>
    }
  }

  return (
    <div className="game-shell">
      {/* Header: Fortschritt und Zustandsanzeige */}
      <header className="game-shell__header">
        <ProgressBar sprint={gameState.sprint} phase={gameState.phase} />
        <StateIndicator gameState={gameState} />
      </header>

      {/* Hauptinhalt: phasenabhängige Komponente */}
      <main className="game-shell__content">
        {renderPhase()}
      </main>
    </div>
  )
}

export default GameShell
