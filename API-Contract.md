# API Contract: Scrum Learning Platform

## Übersicht
Dieses Dokument definiert die API-Schnittstellen zwischen Frontend und Backend für die Scrum-Lernplattform.

## Basis-URL
- Development: `http://localhost:5001`
- Production: `https://api.scrum-platform.th-koeln.de`

## Authentifizierung
- Alle geschützten Endpunkte verwenden JWT-Tokens im `Authorization: Bearer <token>` Header
- Token wird bei Login/Register zurückgegeben

## Endpunkte

### 1. Authentifizierung

#### POST /api/auth/register
Registriert einen neuen User mit TH Köln E-Mail.

**Request Body:**
```json
{
  "email": "student@smail.th-koeln.de",
  "password": "securepassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registrierung erfolgreich",
  "user": {
    "id": 1,
    "email": "student@smail.th-koeln.de",
    "role": "student"
  },
  "token": "jwt-token-here"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "E-Mail muss @smail.th-koeln.de sein"
}
```

#### POST /api/auth/login
Loggt einen User ein.

**Request Body:**
```json
{
  "email": "student@smail.th-koeln.de",
  "password": "securepassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "student@smail.th-koeln.de",
    "role": "student"
  },
  "token": "jwt-token-here"
}
```

### 2. Spiel-Inhalte

#### GET /api/scenarios
Holt alle verfügbaren Szenarien für eine Rolle.

**Query Parameters:**
- `role`: "product-owner", "scrum-master", "developer", "stakeholder"

**Response:**
```json
{
  "success": true,
  "scenarios": [
    {
      "id": 1,
      "role": "product-owner",
      "title": "Backlog Priorisierung",
      "description": "Du musst entscheiden, welche User Stories zuerst bearbeitet werden sollen...",
      "options": [
        {
          "id": 1,
          "text": "Nach Business Value sortieren",
          "scoreChange": 20,
          "motivationChange": 5,
          "feedback": "Gute Entscheidung! Business Value hilft bei der Priorisierung."
        },
        {
          "id": 2,
          "text": "Nach Komplexität sortieren",
          "scoreChange": 10,
          "motivationChange": -5,
          "feedback": "Komplexität ist wichtig, aber Business Value sollte Priorität haben."
        }
      ]
    }
  ]
}
```

#### POST /api/game/answer
Sendet eine Antwort auf ein Szenario und erhält Feedback.

**Request Body:**
```json
{
  "scenarioId": 1,
  "optionId": 1
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "scoreChange": 20,
    "motivationChange": 5,
    "feedback": "Gute Entscheidung! Business Value hilft bei der Priorisierung.",
    "nextScenarioId": 2
  },
  "userProgress": {
    "totalScore": 120,
    "currentMotivation": 85,
    "completedScenarios": [1]
  }
}
```

### 3. User-Progress

#### GET /api/user/progress
Holt den aktuellen Fortschritt des Users.

**Response:**
```json
{
  "success": true,
  "progress": {
    "totalScore": 120,
    "currentMotivation": 85,
    "completedRoles": ["product-owner"],
    "currentRole": "scrum-master",
    "completedScenarios": [1, 2, 3]
  }
}
```

## Datenformate

### Szenario-Objekt
```json
{
  "id": number,
  "role": string,
  "title": string,
  "description": string,
  "options": [
    {
      "id": number,
      "text": string,
      "scoreChange": number,
      "motivationChange": number,
      "feedback": string
    }
  ]
}
```

### User-Objekt
```json
{
  "id": number,
  "email": string,
  "role": string
}
```

## Fehlerbehandlung
Alle Endpunkte geben bei Fehlern folgendes Format zurück:
```json
{
  "success": false,
  "message": "Beschreibung des Fehlers"
}
```

## Platzhalter-Daten
Für Entwicklung verwende diese Dummy-Daten:
- 3 Szenarien pro Rolle
- 3 Optionen pro Szenario
- Score/Motivation Änderungen: -10 bis +20
- Feedback-Texte als Platzhalter