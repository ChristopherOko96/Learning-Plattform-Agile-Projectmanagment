# Agent-Aufgaben – SprintLock Neuimplementierung

> Dieses Dokument beschreibt exakt, welcher Agent welche Aufgabe übernimmt.
> Alle drei Agents arbeiten parallel und greifen nicht in dieselben Dateien ein.

---

## Übersicht

| Agent | Name | Bereich | Dateien |
|---|---|---|---|
| Agent 1 | Data-Layer | Spieldaten als JS-Objekte | `frontend/src/data/` |
| Agent 2 | Frontend-Skeleton | Komponenten & Game State | `frontend/src/components/`, `frontend/src/hooks/` |
| Agent 3 | Backend KI-Endpunkt | Situationsbewertung via API | `backend/server.js` (neuer Endpunkt) |

---

## Agent 1 – Data-Layer

**Ziel:** Alle Spielinhalte als saubere JavaScript-Datendateien anlegen.
Der Rest des Spiels baut auf diesen Daten auf. Kein UI, keine Logik – nur Daten.

### Zu erstellende Dateien

#### `frontend/src/data/situations.js`
Alle 8 Kernsituationen als Array von Objekten. Jede Situation hat:
- `id` – eindeutiger Bezeichner (z.B. `'sprint-planning-capacity'`)
- `phase` – zu welcher Spielphase sie gehört (`'sprint1'`, `'sprint2'`, `'kanban'`)
- `title` – kurzer Titel
- `learningGoal` – das Lernziel in einem Satz
- `thinkingModel` – das Denkmodell (z.B. `'Commitment ≠ Versprechen'`)
- `context` – narrativer Kontext (2–4 Sätze, VeloTech-Bezug)
- `question` – die konkrete Frage an den Spieler
- `inputType` – `'freetext'` (KI-bewertet) oder `'choice'` (Multiple Choice)
- `options` – Array mit Optionen (nur bei `'choice'`), jede mit `label`, `consequence`, `stateChanges`
- `ahaMessage` – Erklärung nach der Entscheidung
- `scrumKanbanRef` – Bezug zum Scrum Guide oder Kanban-Prinzip

Die 8 Situationen (aus `docs/spielkonzept.md`, Abschnitt 4.6):
1. Sprint Planning – Kapazität (`sprint1`, `choice`)
2. CEO mid-Sprint (`sprint1`, `freetext`)
3. Backlog-Priorisierung (`sprint2`, `choice`)
4. Sprint Review Feedback (`sprint1`, `choice`)
5. Retrospektive (`sprint1`, `freetext`)
6. WIP-Limit (`kanban`, `choice`)
7. Engpass erkennen (`kanban`, `choice`)
8. Stop Starting, Start Finishing (`kanban`, `choice`)

#### `frontend/src/data/backlog.js`
Das vorgefertigte VeloTech Smart Lock Product Backlog als Array. Jedes Item hat:
- `id`, `title`, `storyPoints`, `priority` (1–5), `category`
- `description` – kurze Beschreibung aus Nutzerperspektive
- `stakeholder` – wer dieses Item fordert (z.B. `'CEO'`, `'Marketing'`, `'Sicherheitsbeauftragter'`)

Mindestens 8 Backlog-Items (aus `docs/spielkonzept.md`):
Bluetooth-Entsperrung (8 SP), GPS-Tracking (8 SP), Diebstahlalarm (5 SP),
Dark Mode (3 SP), Fingerabdruck (8 SP), Akkuwarnung (2 SP),
NFC-Backup (13 SP), Push-Benachrichtigung (5 SP)

#### `frontend/src/data/events.js`
Die Überraschungsereignisse als Array. Jedes Event hat:
- `id`, `title`, `trigger` – wann es erscheint (z.B. `{ sprint: 1, phase: 'execution' }`)
- `condition` – optionale Bedingung aus dem Spielzustand (z.B. `{ ceoRelation: { gte: 0 } }`)
- `description` – narrative Beschreibung des Ereignisses
- `type` – `'freetext'` oder `'choice'`
- `options` / Freitext-Kontext analog zu `situations.js`

Mindestens 3 Events:
1. CEO fordert KI-Feature (Sprint 1, Execution)
2. Entwickler krank (Sprint 2, Beginn)
3. Negativer Stakeholder-Report (Sprint 1, Review)

#### `frontend/src/data/narrative.js`
Alle Texte für Intro, Phasen-Übergänge und Abschluss:
- `intro` – Einstiegstext (Wer bin ich? Was ist VeloTech? Was ist meine Aufgabe?)
- `sprintBriefings` – kurze Einleitung vor jedem Sprint
- `phaseTitles` – Bezeichnungen für jede Phase
- `endScreen` – Abschlusstext

---

## Agent 2 – Frontend-Skeleton

**Ziel:** Die neue Komponentenstruktur anlegen – als funktionsfähiges Skelett ohne finale Inhalte.
Kein Styling, keine finalen Texte – nur saubere Struktur und State-Management.

### Zu erstellende Dateien

#### `frontend/src/hooks/useGameState.js`
Zentraler React Hook für den gesamten Spielzustand.

```javascript
// Initialer Zustand
const initialState = {
  sprint: 1,
  phase: 'intro',           // intro | planning | execution | review | retro | kanban | end
  velocity: 14,
  teamMorale: 3,            // 1–5
  backlogHealth: 'good',    // good | outdated | overloaded
  ceoRelation: 0,           // -2 bis +2
  technicalDebt: 0,         // 0–3
  decisions: [],            // Protokoll aller Entscheidungen
  currentSituationId: null,
  kanbanBoard: {
    backlog: [],
    inProgress: [],
    review: [],
    done: []
  }
}
```

Exportierte Funktionen:
- `applyStateChanges(changes)` – Zustandsänderungen aus Entscheidungen anwenden
- `advancePhase()` – zur nächsten Spielphase wechseln
- `recordDecision(situationId, input, aiResponse)` – Entscheidung protokollieren
- `resetGame()` – Spiel neu starten

#### `frontend/src/components/layout/GameShell.jsx`
Äußere Hülle des Spiels. Enthält:
- Navigation (aktueller Sprint, aktuelle Phase)
- `StateIndicator` (Teamzustand sichtbar)
- Router zwischen den Phasen (welche Komponente wird angezeigt?)
- Kein eigener Inhalt – nur Rahmen

#### `frontend/src/components/game/SprintPhase.jsx`
Zeigt eine Spielsituation an. Props:
- `situation` – Situationsobjekt aus `situations.js`
- `onComplete(decision)` – Callback wenn Spieler entschieden hat
- Rendert je nach `inputType` entweder Freitext-Eingabe oder Choice-Karten

#### `frontend/src/components/game/EventCard.jsx`
Für Überraschungsereignisse. Ähnlich wie `SprintPhase`, aber mit anderem visuellen Stil
(deutlich markiert als unerwartetes Ereignis).

#### `frontend/src/components/game/KanbanBoard.jsx`
Interaktives Kanban-Board. Zeigt vier Spalten:
- Backlog, In Progress (mit WIP-Limit-Anzeige), Review, Done
- Tickets können per Klick in die nächste Spalte verschoben werden
- WIP-Limit wird rot wenn überschritten
- Daten kommen aus `gameState.kanbanBoard`

#### `frontend/src/components/game/ReflectionScreen.jsx`
Debriefing nach jedem Sprint und am Spielende.
- Zeigt getroffene Entscheidungen als Liste
- Zeigt Zustandsänderungen (vorher / nachher)
- Zeigt KI-Feedback zur Freitext-Antwort (wenn vorhanden)
- Weiter-Button zur nächsten Phase

#### `frontend/src/components/ui/StateIndicator.jsx`
Kleine Anzeige im Header: Teamzustand als Icons/Balken.
Zeigt: Velocity, Team Morale (als Emoji-Skala), Technical Debt (als Warnung wenn > 0).

#### `frontend/src/components/ui/ProgressBar.jsx`
Fortschrittsanzeige: Welcher Sprint, welche Phase. Einfache Schritt-Anzeige.

---

## Agent 3 – Backend KI-Endpunkt

**Ziel:** Einen neuen API-Endpunkt implementieren, der die Freitext-Antworten des Spielers
durch die KI bewertet und strukturiertes Feedback zurückgibt.

### Zu ändernde / erstellende Dateien

#### `backend/server.js` – neuer Endpunkt `POST /api/game/evaluate`

Request-Body:
```json
{
  "situationId": "ceo-mid-sprint",
  "playerInput": "Ich würde dem CEO erklären dass...",
  "gameState": {
    "sprint": 1,
    "velocity": 14,
    "teamMorale": 3,
    "ceoRelation": 0,
    "technicalDebt": 0
  }
}
```

Response:
```json
{
  "evaluation": "correct | partial | incorrect",
  "feedback": "Sehr gute Reaktion. Du hast...",
  "consequence": "Sprint läuft stabil. Das Team liefert...",
  "stateChanges": {
    "teamMorale": 0,
    "ceoRelation": 0,
    "technicalDebt": 0
  },
  "ahaMessage": "Option B ist korrekt weil..."
}
```

#### `backend/config/prompts.js` – neue Datei
System-Prompts für alle 8 Situationen als exportiertes Objekt.
Jeder Prompt enthält:
- Den fachlichen Kontext (Was ist das Lernziel?)
- Die Musterlösung (Was wäre die ideale Antwort?)
- Bewertungsregeln (Was macht eine Antwort korrekt / teilweise korrekt / falsch?)
- Anweisung zur Konsequenz-Generierung

Struktur:
```javascript
export const situationPrompts = {
  'ceo-mid-sprint': {
    systemPrompt: `Du bist Spielleiter des Planspiels SprintLock...`,
    learningGoal: 'Sprint-Schutz',
    idealAnswer: 'Sprint schützen, Item ins Backlog, Refinement kommunizieren',
    evaluationCriteria: {
      correct: ['Sprint-Schutz erwähnt', 'Backlog-Aufnahme erwähnt'],
      partial: ['Nur eines der beiden Kriterien'],
      incorrect: ['Feature einbauen', 'ablehnen ohne Begründung']
    }
  },
  // ... alle 8 Situationen
}
```

### Wichtige Hinweise für Agent 3
- Bestehende Endpunkte in `server.js` nicht anfassen
- Bestehende KI-Konfiguration (Anthropic API Key, Model) wiederverwenden
- Fehlerbehandlung: Wenn KI-API nicht erreichbar → Fallback auf statisches Feedback
- Input validieren: `situationId` muss in `prompts.js` existieren

---

## Was die Agents NICHT tun

- Bestehende Dateien (`App.jsx`, `App.css`, `index.css`) nicht anfassen
- Keine Packages installieren
- Keine Datenbank-Änderungen
- Kein Styling / keine visuellen Designs – nur Struktur und Logik
- Nicht gegenseitig in dieselben Dateien schreiben

---

## Abhängigkeiten zwischen den Agents

```
Agent 1 (Daten)        Agent 2 (Frontend)      Agent 3 (Backend)
      │                       │                       │
      │  situations.js ───────► SprintPhase.jsx        │
      │  backlog.js ──────────► KanbanBoard.jsx         │
      │  events.js ───────────► EventCard.jsx           │
      │                       │                       │
      │                       │   /api/game/evaluate ◄─┤
      │                       │   (fetch call)         │
      └───────────────────────┴───────────────────────┘
               Alle drei können parallel starten.
         Agent 2 importiert später Daten aus Agent 1.
         Agent 2 ruft später Endpunkt von Agent 3 auf.
```

---

*Erstellt: 2026-05-18*
*Status: Bereit zur Ausführung*
