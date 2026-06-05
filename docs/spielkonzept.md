# SprintLock – Spielkonzept v2.0

> Konzeptdokument für das fallstudienbasierte Planspiel zur Vermittlung agiler Projektmanagement-Methoden.
> Grundlage: Lerneinheit 10 (Scrum), Lerneinheit 11 (Kanban), GrundlagenScrumKanban (Abschnitt 2.5), Lastenheft.

---

## 1. Überblick

SprintLock ist ein digitales Einzelspieler-Planspiel im Story-Game-Format. Der Spieler durchläuft einen vereinfachten agilen Projektverlauf anhand der Fallstudie „VeloTech Smart Lock". Dabei wechselt er die Perspektive zwischen Product Owner, Scrum Master, Developer und Kanban-Rolle – verbunden durch einen durchgehenden narrativen roten Faden.

Jede Runde (Sprint) dauert ca. 10 Minuten. Die Anzahl der Runden ist durch den Admin konfigurierbar. Am Ende steht ein strukturiertes Debriefing.

**Kernprinzip:**
> Das Spiel stellt keine Wissensfragen. Es erzeugt Situationen in denen der Spieler Entscheidungen trifft, Konsequenzen erlebt und durch KI-Feedback reflektiert.

---

## 2. Lernziele

Bindende Grundlage ist die Auswahl aus GrundlagenScrumKanban Abschnitt 2.5.

### Scrum

| Element | Lernziel im Spiel |
|---|---|
| Sprint | Zeitbegrenzter Arbeitszyklus als Spielrunde erfahren |
| Product Backlog | Priorisierung nach Wert, nicht nach Druck |
| Sprint Planning | Realistisches Commitment, Velocity verstehen |
| Daily Scrum | Transparenz über Fortschritt und Hindernisse |
| Sprint Review | Feedback als Lernquelle, nicht als Abnahme |
| Sprint-Retrospektive | Prozessverbesserung als Investition |
| Product Owner | Wertmaximierung, Stakeholder-Management |
| Scrum Master | Sprint-Schutz, Impediment-Beseitigung |
| Developer | Selbstorganisation, Schätzung, DoD |
| Sprint Backlog | Commitment und Fokus pro Runde |

### Kanban

| Element | Lernziel im Spiel |
|---|---|
| Kanban-Board | Arbeit sichtbar machen, Zustand ablesen |
| Board-Spalten | Arbeitsfluss verstehen |
| WIP-Limits | Parallele Arbeit bewusst begrenzen |
| Blockaden | Engpässe erkennen und adressieren |
| Explizite Regeln | Pull-Kriterien pro Spalte |
| Feedback-Schleifen | Reflexion aus dem Spielverlauf |
| Gemeinsame Verbesserung | Verbesserungsmaßnahmen ableiten |

---

## 3. Fallstudie: VeloTech Smart Lock

### Funktion
Die Fallstudie liefert den narrativen Rahmen – nicht den Lerninhalt. Sie macht Entscheidungen real und greifbar.

### Inhalt
VeloTech GmbH entwickelt ein smartes Fahrradschloss. Das Team arbeitet mit Scrum und einem Kanban-Board. Der Spieler begleitet das Projekt über mehrere Sprints.

### Vorgefertigtes Backlog (Spielmaterial)

| Item | Story Points | Priorität | Stakeholder |
|---|---|---|---|
| Bluetooth-Entsperrung per App | 8 | 1 | Kernfunktion |
| Diebstahlalarm (Vibrationssensor) | 5 | 2 | Sicherheitsbeauftragter |
| Akkuwarnung bei schwachem Akku | 2 | 2 | Entwickler |
| Push-Benachrichtigung bei Bewegung | 5 | 2 | Nutzer |
| GPS-Tracking | 8 | 3 | Marketing |
| NFC-Entsperrung als Backup | 13 | 3 | PO |
| Fingerabdruck-Entsperrung | 8 | 4 | CEO |
| Dark Mode | 3 | 5 | Stakeholder |

Der Spieler schreibt keine Stories. Er wählt, priorisiert und reagiert.

### Erweiterung (kein MVP)
Admin kann eine neue Fallstudie als Text hochladen. KI analysiert sie und generiert Backlog, Situationen und Entscheidungsfragen automatisch. Architektur wird so gebaut dass diese Funktion nachrüstbar ist.

---

## 4. Spielstruktur

### 4.1 Gesamtablauf

```
INTRO
  Fallstudie kennenlernen
  Rolle und Kontext erhalten
  Backlog einsehen
        │
        ▼
SPRINT(S)  [Anzahl durch Admin konfigurierbar]
  Sprint Planning
  Sprint Execution  ← Überraschungsereignis
  Sprint Review
  Retrospektive
        │
        ▼  [Zustand akkumuliert sich über Sprints]
KANBAN-PHASE
  Board-Arbeit
  WIP-Limits
  Engpass-Erkennung
        │
        ▼
DEBRIEFING
  Entscheidungsprotokoll
  KI-Gesamtfeedback
  Reflexionsfragen
```

### 4.2 Rollenverteilung pro Phase

Der Spieler wechselt die Perspektive — aber die Story bleibt dieselbe.

| Phase | Perspektive | Typische Aufgabe |
|---|---|---|
| Sprint Planning | Product Owner | Backlog priorisieren, Velocity einschätzen |
| Sprint Execution | Scrum Master | Ereignis managen, Sprint schützen |
| Sprint Review | Product Owner + Team | Feedback aufnehmen |
| Retrospektive | Scrum Master | Prozessverbesserung wählen |
| Kanban-Phase | Developer / Team | Board steuern, Engpass erkennen |

### 4.3 Zustandssystem

Jede Entscheidung verändert den Spielzustand. Der nächste Sprint startet mit den Konsequenzen.

```javascript
gameState = {
  sprint: 1,
  velocity: 14,
  teamMorale: 3,       // 1–5
  backlogHealth: 'good',
  ceoRelation: 0,      // -2 bis +2
  technicalDebt: 0,    // 0–3
  decisions: []        // Protokoll für Debriefing
}
```

---

## 5. Entscheidungsmechanik

### 5.1 Story-Game mit konvergenten Pfaden

Jede Situation bietet mehrere Wege — alle führen zum Ende des Sprints. Der Unterschied liegt in den Konsequenzen die mitgenommen werden.

```
[Situation: CEO fordert Feature mid-Sprint]
        │
   ┌────┴────┬──────────┐
   ▼         ▼          ▼
Einbauen  Ablehnen  Backlog +
                    Refinement
   │         │          │
   ▼         ▼          ▼
Sprint    CEO        Sprint
scheitert verärgert  stabil
   │         │          │
   └────┬────┴──────────┘
        ▼
   [Sprint Review]
   — aber mit unterschiedlichem Zustand
```

### 5.2 Aufbau jeder Situation

```
1. KONTEXT        – Was passiert gerade? (2–3 Sätze, VeloTech-Bezug)
2. PERSPEKTIVE    – Aus wessen Sicht handelst du?
3. ENTSCHEIDUNG   – Was tust du? (Freitext ODER Auswahl)
4. KONSEQUENZ     – Was folgt? (Zustandsänderung + narrative Reaktion)
5. REFLEXION      – KI gibt Feedback auf deine Begründung
```

### 5.3 Entscheidungstypen

| Typ | Einsatz | KI-Rolle |
|---|---|---|
| **Freitext** | Lernkritische Momente | Progressive Evaluierung |
| **Multiple Choice** | Schnelle Situationen | Sofortiges Feedback |
| **Board-Interaktion** | Kanban-Phase | Regelbasierte Rückmeldung |

Faustregel: **Pro Sprint max. 2 Freitext-Aufgaben**, Rest Multiple Choice oder Board.

---

## 6. KI-Evaluierungssystem

### 6.1 Kernprinzip

Die KI gibt **nie** die richtige Antwort zurück. Sie evaluiert schrittweise und gibt Hinweise bis alle wichtigen Punkte genannt wurden.

### 6.2 Ablauf

```
Admin definiert (im Backend):
  situation_id: "ceo-mid-sprint"
  key_points: [
    "Sprint-Schutz erwähnt",
    "Item ins Backlog aufgenommen",
    "Refinement als nächsten Schritt genannt"
  ]

Spieler schreibt:
  "Ich würde den Sprint schützen und das Feature
   für später vormerken."

KI evaluiert:
  ✅ "Sprint-Schutz erwähnt"      → gefunden
  ✅ "Item ins Backlog"           → gefunden
  ❌ "Refinement erwähnt"        → fehlt noch

KI antwortet:
  "Du hast zwei wichtige Punkte erkannt: den Sprint-Schutz
   und die Backlog-Aufnahme. Was wäre der nächste konkrete
   Schritt damit das Feature nicht vergessen wird?"

Spieler ergänzt:
  "Beim nächsten Refinement besprechen."

KI:
  ✅ Alle Key-Points erreicht → Situation abgeschlossen
  → Aha-Moment + Konsequenz wird ausgelöst
```

### 6.3 KI-Rollen

| Rolle | Aufgabe |
|---|---|
| **Evaluator** | Key-Points prüfen, Abdeckungsgrad messen |
| **Narrator** | Konsequenz im VeloTech-Kontext erzählen |
| **Tutor** | Hinweis auf fehlende Punkte ohne Lösung zu nennen |

### 6.4 Prompt-Architektur

Drei Schichten pro Anfrage:

```
[System-Prompt — fest]
  Rolle, Regeln, VeloTech-Kontext, Ausgabeformat (JSON)

[Situations-Kontext — pro Situation fest]
  Lernziel, Key-Points, Musterlösung, Spielzustand

[Spieler-Input — dynamisch]
  Freitext-Antwort des Spielers
```

### 6.5 KI-Antwort-Format

```json
{
  "covered_points": ["Sprint-Schutz", "Backlog"],
  "missing_points_count": 1,
  "completed": false,
  "feedback": "Du hast... erkannt. Was wäre der nächste Schritt?",
  "consequence": null,
  "state_changes": null
}
```

Bei `completed: true` kommen zusätzlich `consequence` und `state_changes`.

---

## 7. Admin-Panel

### 7.1 Konfigurierbare Einstellungen

| Einstellung | Beschreibung |
|---|---|
| Anzahl Sprints | Wie viele Sprint-Runden pro Durchlauf |
| Aktive Situationen | Welche der vordefinierten Situationen aktiv sind |
| Eigene Aufgaben | Neue Situationen mit eigenem Kontext + Key-Points |
| Fallstudie | Standard (VeloTech) oder eigener Text |
| Spieler-Zugänge | Wer darf spielen |

### 7.2 Aufgaben-Editor

Admin kann eigene Situationen erstellen:

```
Titel:           [...]
Kontext:         [Freitext — wird dem Spieler angezeigt]
Perspektive:     [PO / SM / Dev / Kanban]
Entscheidungstyp:[Freitext / Multiple Choice]
Key-Points:      [Liste der Punkte die KI prüft]
Muster-Antwort:  [Nur intern — nie dem Spieler gezeigt]
Phase:           [Sprint 1 / Sprint 2 / Kanban]
```

Die KI kann auf jede gut definierte Aufgabe reagieren solange Key-Points und Muster-Antwort hinterlegt sind.

---

## 8. Überraschungsereignisse

Scripted Events die an festen aber für den Spieler unerwarteten Momenten erscheinen. Erzeugen Spannung und testen Reaktionsfähigkeit.

| Ereignis | Zeitpunkt | Lernziel |
|---|---|---|
| CEO fordert Feature | Sprint 1, Execution | Sprint-Schutz |
| Entwickler krank | Sprint 2, Planning | Velocity / Kapazität |
| Negativer Stakeholder-Report | Sprint 1, Review | Feedback aufnehmen |
| Technische Schulden melden sich | Sprint 2, Execution | Konsequenz aus Overcommit |
| Kanban-Stau | Kanban-Phase | Engpass erkennen |

Ereignisse sind kontextsensitiv: Inhalt und Dringlichkeit hängen vom aktuellen `gameState` ab.

---

## 9. Debriefing

Nach dem letzten Sprint und der Kanban-Phase:

1. **Entscheidungsprotokoll** — alle Situationen mit gewählter Antwort
2. **Zustandsverlauf** — wie hat sich velocity, teamMorale etc. entwickelt?
3. **KI-Gesamtfeedback** — Was lief gut? Wo waren Lücken?
4. **Reflexionsfragen** — 2–3 offene Fragen zur Selbstreflexion (Freitext, nicht bewertet)

---

## 10. Spieldesign-Prinzipien

| Prinzip | Quelle | Umsetzung |
|---|---|---|
| MDA-Framework | Hunicke et al. | Mechanics → Dynamics → Aesthetics bewusst designt |
| Experiential Learning | Kolb (1984) | Erleben → Reflektieren → Verstehen → Anwenden |
| Interest Curve | Schell (2008) | Leichter Einstieg, Höhepunkt durch Ereignisse, Auflösung im Debriefing |
| Flow-Theorie | Csikszentmihalyi | Falsche Optionen nie offensichtlich falsch — echter Denkprozess nötig |
| Planspiel-Debriefing | Klippert (2008) | Reflexion ist der eigentliche Lernmoment |

---

## 11. MVP vs. Erweiterungen

### MVP (Prototyp / Bachelorarbeit)
- VeloTech Smart Lock als feste Fallstudie
- 2 konfigurierbare Sprints + Kanban-Phase
- Feste Situationen aus Abschnitt 2.5
- Admin: manuelle Aufgaben-Definition + Key-Points
- KI: progressive Evaluierung für Freitext-Aufgaben
- Debriefing am Ende

### Erweiterungen (dokumentiert, nicht implementiert)
- KI liest hochgeladene Fallstudie und generiert Backlog + Situationen automatisch
- Mehrsprachigkeit (DE / EN)
- Lehrenden-Dashboard mit Spieler-Auswertungen
- Mehrspielermodus für Seminare

---

## 12. Offene Fragen

| Frage | Status |
|---|---|
| Welche 2–3 Freitext-Situationen pro Sprint? | Offen |
| Wie viele Multiple-Choice-Situationen pro Sprint? | Offen |
| Wie wird das Debriefing visuell dargestellt? | Offen |
| System-Prompts für alle Situationen ausformulieren | Nächster Schritt |

---

*Version: 2.0 — vollständige Neukonzeption*
*Datum: 2026-05-18*
