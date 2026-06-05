import React from 'react'

// Alle Schritte im Spielverlauf in der richtigen Reihenfolge
const SCHRITTE = [
  { id: 'intro',    label: 'Intro',    phasen: ['intro'] },
  { id: 'sprint-1', label: 'Sprint 1', phasen: ['planning', 'execution', 'review', 'retro'], sprint: 1 },
  { id: 'sprint-2', label: 'Sprint 2', phasen: ['planning', 'execution', 'review', 'retro'], sprint: 2 },
  { id: 'kanban',   label: 'Kanban',   phasen: ['kanban'] },
  { id: 'end',      label: 'Ende',     phasen: ['end'] }
]

/**
 * Gibt zurück ob ein Schritt der aktuell aktive ist.
 */
function istAktiv(schritt, aktuellePhase, aktuellerSprint) {
  if (!schritt.phasen.includes(aktuellePhase)) return false
  if (schritt.sprint !== undefined && schritt.sprint !== aktuellerSprint) return false
  return true
}

/**
 * Gibt zurück ob ein Schritt bereits abgeschlossen ist.
 */
function istAbgeschlossen(schritt, aktuellePhase, aktuellerSprint) {
  const aktuellerIndex = SCHRITTE.findIndex((s) => istAktiv(s, aktuellePhase, aktuellerSprint))
  const schrittIndex = SCHRITTE.findIndex((s) => s.id === schritt.id)
  return schrittIndex < aktuellerIndex
}

/**
 * Fortschrittsanzeige des Spielverlaufs.
 * Zeigt alle Spielschritte in einer Leiste, aktueller Schritt hervorgehoben.
 *
 * Props:
 *   sprint – aktueller Sprint (Zahl)
 *   phase  – aktuelle Phase (String)
 */
function ProgressBar({ sprint, phase }) {
  return (
    <nav className="progress-bar" aria-label="Spielfortschritt">
      <ol className="progress-bar__schritte">
        {SCHRITTE.map((schritt) => {
          const aktiv = istAktiv(schritt, phase, sprint)
          const abgeschlossen = istAbgeschlossen(schritt, phase, sprint)

          let klassen = 'progress-bar__schritt'
          if (aktiv) klassen += ' progress-bar__schritt--aktiv'
          if (abgeschlossen) klassen += ' progress-bar__schritt--abgeschlossen'

          return (
            <li key={schritt.id} className={klassen}>
              <span className="progress-bar__schritt-label">
                {abgeschlossen && '✓ '}
                {schritt.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ProgressBar
