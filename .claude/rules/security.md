# Security Rules

- Keine Secrets oder API-Keys im Code speichern.
- Verwende `.env` für vertrauliche Werte.
- Schütze Eingaben mit Validierung:
  - E-Mail-Format prüfen
  - Whitelist von Domains (`@smail.th-koeln.de`)
- Setze CORS bewusst ein und schränke Domains ein.
- Achte auf sichere Passwortspeicherung und Hashing.
- Keine unsicheren `eval`- oder `exec`-Aufrufe verwenden.
- Verberge interne Fehlerdetails in API-Antworten.
