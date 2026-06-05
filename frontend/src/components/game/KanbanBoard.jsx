import React from 'react'

// Standard WIP-Limits falls keine übergeben werden
const DEFAULT_WIP_LIMITS = {
  inProgress: 3,
  review: 4
}

// Spaltenkonfiguration: interne Schlüssel und Anzeigenamen
const SPALTEN = [
  { key: 'backlog',    label: 'Backlog' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'review',     label: 'Review' },
  { key: 'done',       label: 'Done' }
]

// Gibt die nächste Spalte für ein Ticket zurück
function naechsteSpalte(aktuelleKey) {
  const index = SPALTEN.findIndex((s) => s.key === aktuelleKey)
  if (index === -1 || index === SPALTEN.length - 1) return null
  return SPALTEN[index + 1].key
}

/**
 * Interaktives Kanban-Board mit 4 Spalten und WIP-Limit-Anzeige.
 * Klick auf ein Ticket verschiebt es in die nächste Spalte.
 *
 * Props:
 *   board         – kanbanBoard-Objekt aus dem Spielzustand
 *   onTicketMove  – Callback(ticketId, fromColumn, toColumn)
 *   wipLimits     – WIP-Limits pro Spalte (optional)
 */
function KanbanBoard({ board, onTicketMove, wipLimits = DEFAULT_WIP_LIMITS }) {
  if (!board) {
    return <p>Kein Board-Zustand vorhanden.</p>
  }

  // Prüft ob das WIP-Limit einer Spalte überschritten ist
  const istUeberschritten = (spalteKey) => {
    const limit = wipLimits[spalteKey]
    if (!limit) return false
    const anzahl = (board[spalteKey] || []).length
    return anzahl > limit
  }

  // WIP-Anzeige formatieren: "2/3" oder "–" wenn kein Limit
  const wipAnzeige = (spalteKey) => {
    const limit = wipLimits[spalteKey]
    if (!limit) return null
    const anzahl = (board[spalteKey] || []).length
    return `${anzahl}/${limit}`
  }

  // Ticket anklicken: in nächste Spalte verschieben
  const handleTicketKlick = (ticket, aktuelleKey) => {
    const zielKey = naechsteSpalte(aktuelleKey)
    if (!zielKey) return // Bereits in 'done', kein Verschieben möglich
    onTicketMove(ticket.id, aktuelleKey, zielKey)
  }

  return (
    <div className="kanban-board">
      <h2>Kanban-Board</h2>

      <div className="kanban-board__spalten">
        {SPALTEN.map((spalte) => {
          const tickets = board[spalte.key] || []
          const ueberschritten = istUeberschritten(spalte.key)
          const wip = wipAnzeige(spalte.key)
          const istLetzte = spalte.key === 'done'

          return (
            <div
              key={spalte.key}
              className={`kanban-board__spalte ${ueberschritten ? 'kanban-board__spalte--ueberlastet' : ''}`}
            >
              {/* Spalten-Header */}
              <div className="kanban-board__spalte-header">
                <span className="kanban-board__spalte-titel">{spalte.label}</span>

                {/* WIP-Limit-Anzeige */}
                {wip && (
                  <span
                    className={`kanban-board__wip ${ueberschritten ? 'kanban-board__wip--rot' : ''}`}
                  >
                    {wip}
                  </span>
                )}
              </div>

              {/* Tickets in dieser Spalte */}
              <div className="kanban-board__tickets">
                {tickets.length === 0 && (
                  <p className="kanban-board__leer">Keine Tickets</p>
                )}

                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    className="kanban-board__ticket"
                    onClick={() => handleTicketKlick(ticket, spalte.key)}
                    disabled={istLetzte}
                    title={istLetzte ? 'Bereits fertig' : `Weiter nach ${naechsteSpalte(spalte.key)}`}
                  >
                    <span className="kanban-board__ticket-titel">{ticket.title}</span>

                    {ticket.points && (
                      <span className="kanban-board__ticket-punkte">{ticket.points} SP</span>
                    )}

                    {ticket.blocked && (
                      <span className="kanban-board__ticket-blockiert">⛔ Blockiert</span>
                    )}

                    {!istLetzte && (
                      <span className="kanban-board__ticket-hinweis">→ Klicken zum Weiterziehen</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KanbanBoard
