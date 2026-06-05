import { useState, useCallback } from 'react'

// Reihenfolge der Spielphasen
const PHASE_ORDER = ['intro', 'planning', 'execution', 'review', 'retro', 'kanban', 'end']

const initialState = {
  sprint: 1,
  phase: 'intro',          // intro | planning | execution | review | retro | kanban | end
  velocity: 14,
  teamMorale: 3,           // 1–5
  backlogHealth: 'good',   // good | outdated | overloaded
  ceoRelation: 0,          // -2 bis +2
  technicalDebt: 0,        // 0–3
  decisions: [],
  currentSituationId: null,
  kanbanBoard: {
    backlog: [],
    inProgress: [],
    review: [],
    done: []
  }
}

/**
 * Zentraler Spielzustand-Hook für das SprintLock Planspiel.
 * Verwaltet alle Spielparameter und stellt Aktionsfunktionen bereit.
 */
export function useGameState() {
  const [gameState, setGameState] = useState(initialState)

  /**
   * Merged eine Zustandsänderung in den aktuellen Spielzustand.
   * Erlaubt das partielle Aktualisieren einzelner Felder.
   * Beispiel: applyStateChanges({ teamMorale: -1, velocity: -3 })
   */
  const applyStateChanges = useCallback((changes) => {
    setGameState((prev) => {
      const updated = { ...prev }

      for (const [key, value] of Object.entries(changes)) {
        // Numerische Felder: addieren wenn Delta, sonst direkt setzen
        if (typeof value === 'number' && typeof prev[key] === 'number') {
          updated[key] = prev[key] + value
        } else {
          updated[key] = value
        }
      }

      // Grenzen einhalten
      updated.teamMorale = Math.max(1, Math.min(5, updated.teamMorale))
      updated.technicalDebt = Math.max(0, Math.min(3, updated.technicalDebt))
      updated.ceoRelation = Math.max(-2, Math.min(2, updated.ceoRelation))
      updated.velocity = Math.max(1, updated.velocity)

      return updated
    })
  }, [])

  /**
   * Rückt die aktuelle Phase um einen Schritt vor.
   * Nach 'retro' folgt entweder Sprint 2 (planning) oder kanban (ab Sprint 3).
   * Nach 'kanban' folgt 'end'.
   */
  const advancePhase = useCallback(() => {
    setGameState((prev) => {
      const currentIndex = PHASE_ORDER.indexOf(prev.phase)

      // Wenn Phase nicht gefunden oder bereits 'end', nichts tun
      if (currentIndex === -1 || prev.phase === 'end') {
        return prev
      }

      // Nach Retro: Sprint erhöhen oder zur Kanban-Phase wechseln
      if (prev.phase === 'retro') {
        const nextSprint = prev.sprint + 1

        // Ab Sprint 3 geht es in die Kanban-Phase
        if (nextSprint > 2) {
          return { ...prev, phase: 'kanban' }
        }

        // Sonst nächsten Sprint starten
        return { ...prev, sprint: nextSprint, phase: 'planning' }
      }

      // Intro direkt zu planning
      if (prev.phase === 'intro') {
        return { ...prev, phase: 'planning' }
      }

      // Kanban → End
      if (prev.phase === 'kanban') {
        return { ...prev, phase: 'end' }
      }

      // Standard: nächste Phase in der Reihenfolge
      const nextPhase = PHASE_ORDER[currentIndex + 1]
      return { ...prev, phase: nextPhase }
    })
  }, [])

  /**
   * Speichert eine getroffene Entscheidung im Protokoll.
   * @param {string} situationId - ID der Spielsituation
   * @param {string|object} input - Spielereingabe (Text oder ausgewählte Option)
   * @param {string|null} aiResponse - KI-Feedback falls vorhanden
   */
  const recordDecision = useCallback((situationId, input, aiResponse = null) => {
    setGameState((prev) => ({
      ...prev,
      decisions: [
        ...prev.decisions,
        {
          situationId,
          input,
          aiResponse,
          timestamp: Date.now(),
          sprint: prev.sprint,
          phase: prev.phase
        }
      ]
    }))
  }, [])

  /**
   * Setzt das Spiel vollständig auf den Ausgangszustand zurück.
   */
  const resetGame = useCallback(() => {
    setGameState(initialState)
  }, [])

  /**
   * Befüllt das Kanban-Board mit Backlog-Items zu Beginn der Kanban-Phase.
   * @param {Array} backlogItems - Liste der Backlog-Einträge
   */
  const initKanbanBoard = useCallback((backlogItems) => {
    setGameState((prev) => ({
      ...prev,
      kanbanBoard: {
        backlog: backlogItems,
        inProgress: [],
        review: [],
        done: []
      }
    }))
  }, [])

  return {
    gameState,
    applyStateChanges,
    advancePhase,
    recordDecision,
    resetGame,
    initKanbanBoard
  }
}
