# Technische Implementierungsdokumentation
## APM Learning Platform – TH Köln
**Projekt:** Agiles Projektmanagement Planspiel | Fallstudie: Smartes Fahrradschloss (VeloTech GmbH)
**Autor:** Christopher Warren Okoh
**Betreuer:** Prof. Dr. Kai Kreisköther

---

## 1. Systemarchitektur

### 1.1 Technologie-Stack

| Schicht | Technologie | Version | Zweck |
|---|---|---|---|
| Frontend | React + Vite | 18.x / 5.x | Single-Page-Application |
| Styling | CSS (Custom) | – | Dark Neon Glassmorphism + Light Mode |
| HTTP-Client | Axios | – | API-Kommunikation |
| Backend | Node.js + Express | 24.x / 4.x | REST-API-Server |
| Datenbank | SQLite (via Sequelize) | – | Persistenz (Datei-basiert, kein Server nötig) |
| Authentifizierung | JWT (jsonwebtoken) | – | 7-Tage-Token, stateless |
| Passwort-Hashing | bcryptjs | – | Sicheres Hashing (Salt 10) |
| KI-Bewertung | Anthropic SDK (Claude Haiku) | – | Freitextauswertung |
| Datei-Upload | multer | – | PDF-Upload in /uploads/ |

### 1.2 Projektstruktur

```
Bachelor-Projekt/
├── frontend/                   # React-Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx             # Hauptkomponente (alle Views, State)
│   │   ├── App.css             # Globales Styling
│   │   └── assets/images/      # TH Köln Logo (SVG)
│   └── index.html              # Browser-Titel: APM Learning Platform
│
├── backend/                    # Node.js-Backend
│   ├── server.js               # Express-Server, alle API-Routen
│   ├── models/index.js         # Sequelize-Modelle (User, Scenario, UserAnswer, Document)
│   ├── config/database.js      # SQLite-Verbindung
│   ├── scripts/setupDatabase.js # DB-Initialisierung + Seed-Daten
│   ├── uploads/                # Hochgeladene PDFs (lokal, .gitignore)
│   └── .env                    # Umgebungsvariablen (Secrets)
│
└── docs/                       # Projektdokumentation
    ├── IMPLEMENTIERUNG.md      # Diese Datei
    ├── ANTHROPIC_API_SETUP.md  # KI-Einrichtungsanleitung
    ├── SPIELINHALTE_SORTIERT.md
    └── Vorhaben der Implementierung ProjektZiel.txt
```

### 1.3 Kommunikationsfluss

```
Browser (React)
    │
    │ HTTP / REST (JSON)
    ▼
Express-Server :5001
    │          │
    │          └── /uploads/ → statische PDF-Dateien
    │
    ├── SQLite-Datenbank (Sequelize ORM)
    └── Anthropic API (Claude Haiku) → KI-Bewertung
```

---

## 2. Datenbankmodelle

### 2.1 User
| Feld | Typ | Beschreibung |
|---|---|---|
| id | INTEGER (PK) | Auto-increment |
| email | STRING (unique) | Nur @smail.th-koeln.de erlaubt |
| password | STRING | bcrypt-Hash |
| totalScore | INTEGER | Gesamtpunkte (default: 0) |
| currentMotivation | INTEGER | 0–100 (default: 50) |
| completedScenarios | JSON | Array der abgeschlossenen Szenario-IDs |

### 2.2 Scenario
| Feld | Typ | Beschreibung |
|---|---|---|
| id | INTEGER (PK) | Auto-increment |
| phase | ENUM | product_owner, scrum_master, developer, kanban |
| type | ENUM | quiz, scenario, text |
| title | STRING | Szenario-Titel |
| description | TEXT | Aufgabenstellung |
| options | JSON | Array der Antwortoptionen |
| difficulty | ENUM | easy, medium, hard |
| isActive | BOOLEAN | Sichtbarkeit im Spiel |

**Optionen-Struktur (quiz/scenario):**
```json
{
  "id": 1,
  "text": "Antworttext",
  "isCorrect": true,
  "scoreChange": 20,
  "motivationChange": 5,
  "feedback": "Erklärung warum diese Antwort richtig/falsch ist"
}
```

**Optionen-Struktur (text):**
```json
{
  "id": 1,
  "text": "Freitextantwort",
  "isCorrect": false,
  "scoreChange": 0,
  "motivationChange": 0,
  "feedback": "Bewertungskriterien für die KI (intern, nicht sichtbar für User)"
}
```

### 2.3 UserAnswer
| Feld | Typ | Beschreibung |
|---|---|---|
| id | INTEGER (PK) | Auto-increment |
| userId | INTEGER (FK) | Referenz auf User |
| scenarioId | INTEGER (FK) | Referenz auf Scenario |
| selectedOptionId | INTEGER / 'text' | Gewählte Option oder 'text' |
| scoreChange | INTEGER | Erzielte Punkte |
| motivationChange | INTEGER | Motivationsänderung |
| answeredAt | DATE | Zeitstempel |

### 2.4 Document (Wissensbibliothek)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | INTEGER (PK) | Auto-increment |
| title | STRING | Dokumenttitel |
| description | TEXT | Kurzbeschreibung |
| category | STRING | Agiles PM, Scrum, Kanban, Allgemein |
| pdfUrl | STRING | Externe URL oder /uploads/datei.pdf |
| tags | JSON | Array von Schlagwörtern |
| isActive | BOOLEAN | Sichtbarkeit in der Bibliothek |

---

## 3. API-Endpunkte

### 3.1 Authentifizierung (öffentlich)
| Methode | Route | Beschreibung |
|---|---|---|
| POST | /api/auth/register | Registrierung (nur @smail.th-koeln.de) |
| POST | /api/auth/login | Login, gibt JWT zurück |

### 3.2 Spiel (authentifiziert via Bearer Token)
| Methode | Route | Beschreibung |
|---|---|---|
| GET | /api/scenarios?phase=X | Szenarien einer Phase laden |
| GET | /api/user/progress | Fortschritt inkl. phaseProgress + resumePhase |
| POST | /api/game/answer | Multiple-Choice-Antwort absenden |
| POST | /api/game/evaluate-text | Freitext-Antwort per KI bewerten |

### 3.3 Wissensbibliothek (authentifiziert)
| Methode | Route | Beschreibung |
|---|---|---|
| GET | /api/documents | Alle aktiven Dokumente laden |

### 3.4 Admin (nur admin@smail.th-koeln.de)
| Methode | Route | Beschreibung |
|---|---|---|
| GET | /api/admin/scenarios | Alle Szenarien |
| POST | /api/admin/scenarios | Neues Szenario erstellen |
| PUT | /api/admin/scenarios/:id | Szenario bearbeiten |
| DELETE | /api/admin/scenarios/:id | Szenario löschen |
| GET | /api/admin/documents | Alle Dokumente (inkl. inaktive) |
| POST | /api/admin/documents | Neues Dokument erstellen |
| PUT | /api/admin/documents/:id | Dokument bearbeiten |
| DELETE | /api/admin/documents/:id | Dokument löschen |
| POST | /api/admin/documents/upload | PDF-Datei hochladen (multer, max. 50 MB) |

---

## 4. Frontend – Views und Navigation

### 4.1 View-Übersicht
| View-ID | Beschreibung | Zugang |
|---|---|---|
| login | Anmelde-/Registrierungsseite | Öffentlich |
| dashboard | Übersicht: Donuts, Score, Badges, CTA | Nach Login |
| intro | Fallstudie-Einführung + Backlog-Vorschau | Nach Spielstart |
| scenario | Aktives Szenario (Quiz / Szenario / Freitext) | Während Spiel |
| feedback | Ergebnis + Erklärung nach Antwort | Nach Antwort |
| phase_complete | Phasen-Abschluss-Screen | Phasenende |
| kanban_board | Interaktives Kanban-Board (Drag-ähnlich) | Letzte Phase |
| game_complete | Abschluss-Screen mit Gesamtergebnis | Spielende |
| library | Wissensbibliothek + PDF-Viewer | Header-Button |
| admin_dashboard | Admin: Szenarien + Bibliothek verwalten | Nur Admin |

### 4.2 Spielphasen
```
1. 🎯 Product Owner (8 Szenarien: 6 Quiz/Szenario + 2 Freitext)
2. 🚀 Scrum Master   (7 Szenarien: 6 Quiz/Szenario + 1 Freitext)
3. 💻 Developer      (8 Szenarien: 6 Quiz/Szenario + 2 Freitext)
4. 📊 Kanban         (6 Szenarien: 5 Quiz/Szenario + 1 Freitext)
   → Abschluss: Interaktives Kanban-Board
```
**Gesamt: 29 Szenarien** (Stand: aktuell)

### 4.3 Szenario-Typen
| Typ | Mechanik | KI-Beteiligung |
|---|---|---|
| quiz | 4 Antworten, 1 richtig, sofortiges Feedback | Nein |
| scenario | 4 Antworten, unterschiedliche Scores, Entscheidungslogik | Nein |
| text | Freitextfeld, Abgabe-Button | Ja – Claude Haiku bewertet |

---

## 5. KI-Bewertung (Freitextaufgaben)

### 5.1 Funktionsweise
1. User gibt Antwort ein (mind. 10 Zeichen)
2. Frontend sendet `POST /api/game/evaluate-text`
3. Backend lädt Szenario + Bewertungskriterien aus DB
4. Anfrage an Claude Haiku (claude-haiku-20240307, max. 400 Token)
5. KI gibt zurück: `{ needsHint: boolean, hint: string }`
6. Bei `needsHint: true` → gelbe Sprechblase rechts neben Textarea
7. Bei `needsHint: false` → grüne Bestätigungs-Bubble
8. User klickt "Weiter" → nächste Aufgabe

### 5.2 KI-Prompt-Prinzipien
- Antwortet **nicht** mit der Lösung
- Gibt nur einen Denkanstoß als Frage oder vagen Hinweis
- Interne Bewertungskriterien werden **nicht** an den User weitergegeben
- Fallback bei nicht verfügbarem API-Key: `needsHint: false` (kein Hinweis, 10 Punkte)

### 5.3 Konfiguration
```env
# backend/.env
ANTHROPIC_API_KEY=sk-ant-api03-...
```
→ Anleitung: `docs/ANTHROPIC_API_SETUP.md`

---

## 6. Gamification-Elemente

### 6.1 Punkte-System
| Ereignis | Punkte |
|---|---|
| Richtige Quiz-Antwort | +20 |
| Gute Szenario-Entscheidung | +5 bis +20 |
| Schlechte Entscheidung | -5 bis -15 |
| Freitextaufgabe abgegeben | +10 (pauschal) |
| Kanban-Karte auf Done | +10 |

### 6.2 Errungenschaften (Badges)
| Badge | Bedingung |
|---|---|
| 🚀 Erster Schritt | Erste Aufgabe abgeschlossen |
| 💡 Wissenshungrig | 50+ Punkte |
| ⭐ Experte | 150+ Punkte |
| 🎯 Product Owner | PO-Phase abgeschlossen |
| 🛡️ Scrum Master | SM-Phase abgeschlossen |
| 💻 Developer | Developer-Phase abgeschlossen |
| 🏆 Agile Champion | Alle Phasen abgeschlossen |

### 6.3 Fortschrittsanzeige (Dashboard)
- 4 SVG-Donut-Charts (eine pro Phase), füllen sich dynamisch
- Gesamtscore als große Zahl
- "Nächste Aufgabe"-Karte mit direktem Einstiegspunkt
- Abbruch-Schutz: Warnhinweis wenn User Szenario vorzeitig verlässt

---

## 7. Wissensbibliothek

### 7.1 Funktion
- Zugänglich über "📚 Bibliothek"-Button im Header
- Zeigt Dokument-Karten nach Kategorie gefiltert
- Klick öffnet PDF-Viewer (iframe, browser-nativ)
- "↗ Extern öffnen"-Button als Fallback

### 7.2 PDF-Hosting
- **Externe URL:** Direktlink zu einem Online-PDF
- **Lokal:** PDF in `backend/uploads/` ablegen → URL: `/uploads/datei.pdf`
- **Admin-Upload:** Über Admin-Panel → "📚 Bibliothek"-Tab → "+ Neues Dokument"

---

## 8. Sicherheit

| Maßnahme | Implementierung |
|---|---|
| E-Mail-Whitelist | Nur @smail.th-koeln.de erlaubt (Sequelize-Validator) |
| Passwort-Hashing | bcrypt, Salt 10 |
| JWT-Authentifizierung | 7-Tage-Token, Bearer-Header |
| Admin-Schutz | E-Mail-Vergleich (admin@smail.th-koeln.de) |
| Secrets | Ausschließlich in .env, nie im Code |
| Upload-Filter | Nur PDFs (MIME-Type-Check), max. 50 MB |

---

## 9. Lokale Entwicklung

### 9.1 Backend starten
```bash
cd backend
npm install
node scripts/setupDatabase.js   # DB initialisieren (einmalig)
node server.js                  # Server auf Port 5001
```

### 9.2 Frontend starten
```bash
cd frontend
npm install
npm run dev                     # Dev-Server auf Port 5173
```

### 9.3 Zugangsdaten (Demo)
| Account | E-Mail | Passwort |
|---|---|---|
| Demo-User | demo@smail.th-koeln.de | demo123 |
| Admin | admin@smail.th-koeln.de | Admin2026! |

---

## 10. Abdeckung der Muss-Anforderungen

| Anforderung | Status | Implementierung |
|---|---|---|
| M-01: Agile Basis | ✅ | Szenarien zu Empirie, Transparenz, Adaption |
| M-02: Scrum-Framework | ✅ | Alle 3 Rollen, Events, Artefakte abgedeckt |
| M-03: Fallstudie Smart Lock | ✅ | Roter Faden durch alle 29 Szenarien |
| M-04: Scrum-Rollen | ✅ | PO-, SM-, Developer-Phase je als eigene Spielphase |
| M-05: Scrum-Artefakte | ✅ | Backlog-Vorschau in Intro, DoD-Aufgabe in Dev-Phase |
| M-06: Sprint-Zyklus | ✅ | Planning/Execution/Review durch Szenario-Phasen simuliert |
| M-07: Kanban-Integration | ✅ | Interaktives Kanban-Board mit WIP-Limits |
| M-08: User Stories | ✅ | INVEST-Szenarien + Freitextaufgabe "User Story schreiben" |
| M-09: Lernerfolgskontrolle | ✅ | Quiz + Freitext mit KI-Feedback + Badges |
| M-10: Web-MVP | ✅ | React/Node.js, JWT-Auth, Phasen-Navigation, Fortschritt |
| M-11: Wissenschaftliche Konsistenz | ✅ | Alle Inhalte basieren auf Scrum Guide 2020 |
