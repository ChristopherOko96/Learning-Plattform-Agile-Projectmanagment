import React, { useState } from 'react'

/**
 * Zeigt ein Überraschungsereignis im Spielverlauf.
 * Ähnlich wie SprintPhase, aber visuell als unerwartetes Ereignis markiert.
 *
 * Props:
 *   event      – Ereignisobjekt mit id, title, description, inputType, options/ahaMessage
 *   onComplete – Callback mit dem Decision-Objekt wenn der Spieler reagiert hat
 */
function EventCard({ event, onComplete }) {
  const [ausgewaehlteOption, setAusgewaehlteOption] = useState(null)
  const [freitextEingabe, setFreitextEingabe] = useState('')
  const [zeigAhaMoment, setZeigAhaMoment] = useState(false)
  const [entscheidung, setEntscheidung] = useState(null)

  if (!event) {
    return <p>Kein Ereignis geladen.</p>
  }

  // Spieler wählt eine Option (choice-Modus)
  const handleOptionKlick = (option) => {
    if (ausgewaehlteOption) return

    setAusgewaehlteOption(option)

    const neueEntscheidung = {
      situationId: event.id,
      input: option,
      stateChanges: option.stateChanges || {},
      aiResponse: null
    }
    setEntscheidung(neueEntscheidung)
    setZeigAhaMoment(true)
  }

  // Spieler sendet Freitext ab
  const handleFreitextAbsenden = () => {
    if (!freitextEingabe.trim()) return

    const neueEntscheidung = {
      situationId: event.id,
      input: freitextEingabe.trim(),
      stateChanges: event.defaultStateChanges || {},
      aiResponse: null
    }
    setEntscheidung(neueEntscheidung)
    setZeigAhaMoment(true)
  }

  const handleWeiter = () => {
    if (entscheidung) {
      onComplete(entscheidung)
    }
  }

  return (
    <div className="event-card">
      {/* Überraschungs-Banner */}
      <div className="event-card__banner">
        ⚡ Unerwartetes Ereignis!
      </div>

      {/* Ereignistitel */}
      <h2 className="event-card__titel">{event.title}</h2>

      {/* Beschreibung des Ereignisses */}
      <div className="event-card__beschreibung">
        <p>{event.description}</p>
      </div>

      {/* Eingabebereich – nur vor dem Aha-Moment */}
      {!zeigAhaMoment && (
        <div className="event-card__eingabe">
          {event.inputType === 'choice' && (
            <div className="event-card__optionen">
              <p><strong>Wie reagierst du?</strong></p>
              {event.options && event.options.map((option) => (
                <button
                  key={option.id}
                  className="event-card__option-karte"
                  onClick={() => handleOptionKlick(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {event.inputType === 'freetext' && (
            <div className="event-card__freitext">
              <p><strong>Deine Reaktion:</strong></p>
              <textarea
                value={freitextEingabe}
                onChange={(e) => setFreitextEingabe(e.target.value)}
                placeholder="Beschreibe, wie du auf dieses Ereignis reagierst..."
                rows={5}
              />
              <button
                onClick={handleFreitextAbsenden}
                disabled={!freitextEingabe.trim()}
              >
                Reaktion absenden
              </button>
            </div>
          )}
        </div>
      )}

      {/* Aha-Moment nach der Reaktion */}
      {zeigAhaMoment && event.ahaMessage && (
        <div className="event-card__aha-moment">
          <h3>Was ist passiert?</h3>
          <p>{event.ahaMessage}</p>

          {ausgewaehlteOption && (
            <p><em>Deine Reaktion: {ausgewaehlteOption.label}</em></p>
          )}

          <button onClick={handleWeiter}>Weiter</button>
        </div>
      )}

      {zeigAhaMoment && !event.ahaMessage && (
        <button onClick={handleWeiter}>Weiter</button>
      )}
    </div>
  )
}

export default EventCard
