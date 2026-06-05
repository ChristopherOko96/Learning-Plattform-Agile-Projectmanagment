import React from 'react'

/**
 * Debriefing-Bildschirm nach jedem Sprint.
 * Zeigt getroffene Entscheidungen, aktuellen Spielzustand und KI-Feedback.
 *
 * Props:
 *   decisions  – Array aller Entscheidungen aus dem Spielzustand
 *   gameState  – aktueller Spielzustand (velocity, teamMorale, etc.)
 *   onContinue – Callback für den "Weiter"-Button
 */
function ReflectionScreen({ decisions, gameState, onContinue }) {
  // Nur Entscheidungen des aktuellen Sprints anzeigen
  const aktuellerSprint = gameState?.sprint ?? 1
  const entscheidungenDieserSprint = (decisions || []).filter(
    (d) => d.sprint === aktuellerSprint
  )

  return (
    <div className="reflection-screen">
      <h2 className="reflection-screen__titel">
        Sprint {aktuellerSprint} – Rückblick
      </h2>

      {/* Aktueller Spielzustand */}
      <section className="reflection-screen__zustand">
        <h3>Aktueller Teamzustand</h3>

        <div className="reflection-screen__metriken">
          <div className="reflection-screen__metrik">
            <span className="reflection-screen__metrik-label">Velocity</span>
            <span className="reflection-screen__metrik-wert">{gameState?.velocity ?? '–'} SP</span>
          </div>

          <div className="reflection-screen__metrik">
            <span className="reflection-screen__metrik-label">Team-Moral</span>
            <span className="reflection-screen__metrik-wert">{gameState?.teamMorale ?? '–'} / 5</span>
          </div>

          <div className="reflection-screen__metrik">
            <span className="reflection-screen__metrik-label">Technische Schulden</span>
            <span className="reflection-screen__metrik-wert">{gameState?.technicalDebt ?? 0}</span>
          </div>

          <div className="reflection-screen__metrik">
            <span className="reflection-screen__metrik-label">CEO-Beziehung</span>
            <span className="reflection-screen__metrik-wert">{gameState?.ceoRelation ?? 0}</span>
          </div>
        </div>
      </section>

      {/* Getroffene Entscheidungen */}
      <section className="reflection-screen__entscheidungen">
        <h3>Deine Entscheidungen in Sprint {aktuellerSprint}</h3>

        {entscheidungenDieserSprint.length === 0 && (
          <p>Keine Entscheidungen in diesem Sprint protokolliert.</p>
        )}

        {entscheidungenDieserSprint.map((entscheidung, index) => (
          <div key={index} className="reflection-screen__entscheidung">
            {/* Situationstitel */}
            <p className="reflection-screen__situation-id">
              <strong>Situation:</strong> {entscheidung.situationId}
            </p>

            {/* Gewählte Option oder Freitext */}
            <p className="reflection-screen__eingabe">
              <strong>Deine Wahl:</strong>{' '}
              {typeof entscheidung.input === 'object'
                ? entscheidung.input.label
                : entscheidung.input}
            </p>

            {/* KI-Feedback falls vorhanden */}
            {entscheidung.aiResponse && (
              <div className="reflection-screen__ki-feedback">
                <p><strong>KI-Feedback:</strong></p>
                <p>{entscheidung.aiResponse}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Weiter-Button */}
      <div className="reflection-screen__aktionen">
        <button
          className="reflection-screen__weiter-button"
          onClick={onContinue}
        >
          {aktuellerSprint < 2 ? `Weiter zu Sprint ${aktuellerSprint + 1}` : 'Zur Kanban-Phase'}
        </button>
      </div>
    </div>
  )
}

export default ReflectionScreen
