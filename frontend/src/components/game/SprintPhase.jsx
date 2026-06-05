import React, { useState } from 'react'

/**
 * Zeigt eine Spielsituation und sammelt die Entscheidung des Spielers.
 *
 * Props:
 *   situation  – Situationsobjekt mit id, title, context, inputType, options/ahaMessage
 *   onComplete – Callback mit dem Decision-Objekt wenn der Spieler fertig ist
 *
 * inputType 'choice':   Zeigt klickbare Optionskarten
 * inputType 'freetext': Zeigt Textarea + Absenden-Button
 */
function SprintPhase({ situation, onComplete }) {
  const [ausgewaehlteOption, setAusgewaehlteOption] = useState(null)
  const [freitextEingabe, setFreitextEingabe] = useState('')
  const [zeigAhaMoment, setZeigAhaMoment] = useState(false)
  const [entscheidung, setEntscheidung] = useState(null)

  if (!situation) {
    return <p>Keine Situation geladen.</p>
  }

  // Spieler hat eine Option gewählt (choice-Modus)
  const handleOptionKlick = (option) => {
    if (ausgewaehlteOption) return // Bereits gewählt, keine Änderung mehr

    setAusgewaehlteOption(option)

    const neueEntscheidung = {
      situationId: situation.id,
      input: option,
      stateChanges: option.stateChanges || {},
      aiResponse: null
    }
    setEntscheidung(neueEntscheidung)
    setZeigAhaMoment(true)
  }

  // Spieler hat Freitext eingegeben und abgesendet (freetext-Modus)
  const handleFreitextAbsenden = () => {
    if (!freitextEingabe.trim()) return

    const neueEntscheidung = {
      situationId: situation.id,
      input: freitextEingabe.trim(),
      stateChanges: situation.defaultStateChanges || {},
      aiResponse: null // KI-Antwort wird später asynchron befüllt
    }
    setEntscheidung(neueEntscheidung)
    setZeigAhaMoment(true)
  }

  // Spieler bestätigt nach dem Aha-Moment: weiter zur nächsten Phase
  const handleWeiter = () => {
    if (entscheidung) {
      onComplete(entscheidung)
    }
  }

  return (
    <div className="sprint-phase">
      {/* Situationstitel */}
      <h2 className="sprint-phase__titel">{situation.title}</h2>

      {/* Kontext / Beschreibung der Situation */}
      <div className="sprint-phase__kontext">
        <p>{situation.context}</p>
      </div>

      {/* Eingabebereich – nur anzeigen wenn noch kein Aha-Moment */}
      {!zeigAhaMoment && (
        <div className="sprint-phase__eingabe">
          {situation.inputType === 'choice' && (
            <div className="sprint-phase__optionen">
              <p><strong>Was tust du?</strong></p>
              {situation.options && situation.options.map((option) => (
                <button
                  key={option.id}
                  className="sprint-phase__option-karte"
                  onClick={() => handleOptionKlick(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {situation.inputType === 'freetext' && (
            <div className="sprint-phase__freitext">
              <p><strong>Deine Antwort:</strong></p>
              <textarea
                value={freitextEingabe}
                onChange={(e) => setFreitextEingabe(e.target.value)}
                placeholder="Erkläre deine Entscheidung und Begründung..."
                rows={5}
              />
              <button
                onClick={handleFreitextAbsenden}
                disabled={!freitextEingabe.trim()}
              >
                Antwort absenden
              </button>
            </div>
          )}
        </div>
      )}

      {/* Aha-Moment: Feedback nach der Entscheidung */}
      {zeigAhaMoment && situation.ahaMessage && (
        <div className="sprint-phase__aha-moment">
          <h3>Aha-Moment</h3>
          <p>{situation.ahaMessage}</p>

          {/* Gewählte Option anzeigen */}
          {ausgewaehlteOption && (
            <p><em>Deine Wahl: {ausgewaehlteOption.label}</em></p>
          )}

          <button onClick={handleWeiter}>Weiter</button>
        </div>
      )}

      {/* Fallback: Kein Aha-Moment definiert, direkt weiter */}
      {zeigAhaMoment && !situation.ahaMessage && (
        <button onClick={handleWeiter}>Weiter</button>
      )}
    </div>
  )
}

export default SprintPhase
