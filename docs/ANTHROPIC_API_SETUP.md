# Anthropic API Key einrichten

Diese Anleitung beschreibt, wie du den Anthropic API Key für die KI-Bewertung von Freitextaufgaben einrichtest.

---

## Hintergrund

Die Plattform nutzt **Claude Haiku** von Anthropic, um Freitextantworten der Studierenden automatisch zu bewerten.  
Ein ChatGPT-Abo (OpenAI) reicht dafür nicht — du brauchst einen separaten Anthropic API Key.

> Neue Accounts erhalten ca. **5 $ Gratis-Guthaben** — das reicht für hunderte KI-Bewertungen.

---

## Schritt 1 — Anthropic Account erstellen

1. Geh auf [console.anthropic.com](https://console.anthropic.com)
2. Klick auf **"Sign Up"**
3. Mit E-Mail registrieren (oder Google / GitHub Login)
4. E-Mail bestätigen

---

## Schritt 2 — API Key erstellen

1. Nach dem Login: linke Seitenleiste → **"API Keys"**
2. Klick auf **"Create Key"**
3. Name vergeben, z. B. `bachelor-projekt`
4. Key sofort kopieren — er sieht so aus:

```
sk-ant-api03-xxxxx...
```

> ⚠️ Der Key wird nur einmal angezeigt — sofort kopieren und sicher aufbewahren!

---

## Schritt 3 — Key in die `.env` eintragen

Öffne die Datei `backend/.env` und ersetze die Platzhalter-Zeile:

```env
ANTHROPIC_API_KEY=sk-ant-api03-deinEchterKeyHier
```

Die vollständige `.env` sieht dann so aus:

```env
NODE_ENV=development
PORT=5001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=scrum_platform
DB_USER=postgres
DB_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@localhost:5432/scrum_platform

JWT_SECRET=your-super-secret-jwt-key-here

ANTHROPIC_API_KEY=sk-ant-api03-deinEchterKeyHier
```

---

## Schritt 4 — Backend neu starten

```bash
cd backend
node server.js
```

---

## Schritt 5 — Testen

1. Im Planspiel eine Freitextaufgabe aufrufen (erkennbar am Badge **✍️ Freitextaufgabe**)
2. Eine Antwort eintippen (mindestens 10 Zeichen)
3. Auf **"Von KI bewerten lassen"** klicken
4. Die KI gibt strukturiertes Feedback mit Stärken und Verbesserungsvorschlägen zurück

---

## Fallback-Verhalten

Wenn kein API Key gesetzt ist oder der Dienst nicht erreichbar ist, greift automatisch ein Fallback:

- Der Studierende erhält **5 Teilpunkte**
- Eine Meldung erklärt, dass der KI-Dienst nicht verfügbar ist
- Das Spiel läuft trotzdem normal weiter

---

## Kosten

| Modell | Kosten (ca.) |
|--------|-------------|
| claude-haiku-20240307 | ~0,25 $ / 1 Mio. Input-Token |
| Pro Bewertung (ca. 500 Token) | ~0,000125 $ |
| 1.000 Bewertungen | ~0,13 $ |

Das Gratis-Guthaben reicht also für mehrere tausend Bewertungen.
