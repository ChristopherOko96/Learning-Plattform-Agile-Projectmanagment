# Backend Rules

- Plane API-Endpunkte vor dem Coden.
- Nutze klar definierte Routen:
  - GET /api/scenarios
  - POST /api/game/answer
  - POST /api/auth/register
  - POST /api/auth/login
- Der Backend-Agent arbeitet parallel zum Frontend-Agent: definiere Datenformate vor dem Verbinden.
- Verwende environment-variablen für Ports und Secrets.
- Implementiere Platzhalterlogik / Dummy-Daten, wenn echte Inhalte später folgen.
- Schreibe saubere Fehlerbehandlung und valide Eingaben.
- Halte den Server leichtgewichtig und modular.
