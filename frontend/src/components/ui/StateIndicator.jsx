import React from 'react'

// Emoji-Mapping für Team-Moral (1–5)
const MORAL_EMOJIS = {
  1: '😟',
  2: '😐',
  3: '😊',
  4: '😄',
  5: '🚀'
}

/**
 * Kleine Header-Komponente zur Anzeige des aktuellen Spielzustands.
 * Zeigt Velocity, Team-Moral als Emoji und eine Warnung bei technischen Schulden.
 *
 * Props:
 *   gameState – aktueller Spielzustand
 */
function StateIndicator({ gameState }) {
  if (!gameState) return null

  const { velocity, teamMorale, technicalDebt } = gameState

  // Moral-Emoji bestimmen (Fallback auf 😐 wenn Wert außerhalb 1–5)
  const moralEmoji = MORAL_EMOJIS[teamMorale] ?? '😐'

  return (
    <div className="state-indicator">
      {/* Velocity */}
      <div className="state-indicator__wert">
        <span className="state-indicator__label">Velocity</span>
        <span className="state-indicator__zahl">{velocity}</span>
      </div>

      {/* Team-Moral als Emoji */}
      <div className="state-indicator__wert">
        <span className="state-indicator__label">Moral</span>
        <span
          className="state-indicator__emoji"
          title={`Team-Moral: ${teamMorale}/5`}
        >
          {moralEmoji}
        </span>
      </div>

      {/* Technische Schulden – nur anzeigen wenn > 0 */}
      {technicalDebt > 0 && (
        <div
          className="state-indicator__wert state-indicator__wert--warnung"
          title={`Technische Schulden: ${technicalDebt}/3`}
        >
          <span className="state-indicator__label">Tech-Schulden</span>
          <span className="state-indicator__warnung-symbol">
            {'⚠️'.repeat(technicalDebt)}
          </span>
        </div>
      )}
    </div>
  )
}

export default StateIndicator
