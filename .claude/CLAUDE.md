# Claude Code Project Instructions

## Allgemeines Verhalten

- Antworte auf Deutsch, außer der User fragt ausdrücklich auf Englisch.
- Arbeite ruhig, strukturiert und wie ein Senior Developer.
- Erkläre technische Entscheidungen kurz und verständlich.
- Keine unnötigen langen Erklärungen, wenn der User Code oder konkrete Schritte braucht.
- Stelle Rückfragen nur, wenn wichtige Informationen fehlen.
- Triff kleine sinnvolle Annahmen selbst und nenne sie kurz.
- Bevor Code geändert wird, immer zuerst einen kurzen Plan mit 6–10 Schritten erstellen.
- Nach jeder Änderung kurz zusammenfassen:
  - Welche Dateien geändert wurden
  - Was geändert wurde
  - Warum es geändert wurde
  - Was als Nächstes getestet werden sollte

## Arbeitsweise

- Erst Projektstruktur analysieren.
- Dann relevante Dateien lesen.
- Dann minimalen Änderungsplan erstellen.
- Dann gezielt umsetzen.
- Keine Dateien ändern, die nicht zur Aufgabe gehören.
- Keine großen Refactorings ohne explizite Zustimmung.
- Keine neuen Frameworks, Libraries oder Tools einbauen, außer es wurde gefragt.
- Keine geheimen Keys, Tokens oder Zugangsdaten anzeigen oder speichern.
- Bei Unsicherheit lieber kleine, sichere Änderungen machen.

## Code-Stil

- Schreibe sauberen, verständlichen und wartbaren Code.
- Nutze sprechende Namen für Variablen, Funktionen und Dateien.
- Vermeide doppelten Code.
- Kommentiere nur dort, wo es wirklich hilft.
- Halte Funktionen möglichst klein und fokussiert.
- Bevorzuge einfache Lösungen statt Overengineering.

## Fehlerbehandlung

- Prüfe bei Bugs zuerst die Ursache, nicht nur Symptome.
- Erkläre kurz:
  - Was kaputt war
  - Warum es kaputt war
  - Wie es behoben wurde
- Bei Frontend-Problemen immer prüfen:
  - HTML-Struktur
  - CSS-Selektoren
  - JavaScript-EventListener
  - Browser-Konsole
  - Dateipfade
- Bei Backend-Problemen immer prüfen:
  - Request/Response
  - Datenvalidierung
  - Fehlerbehandlung
  - Datenbankzugriff
  - Sicherheitsrisiken

## Sicherheitsregeln

- Niemals Secrets, API Keys, Passwörter oder Tokens in Code schreiben.
- Keine unsicheren eval-/exec-Lösungen verwenden.
- User-Eingaben immer validieren.
- Datenbankzugriffe sicher behandeln.
- Keine destruktiven Befehle ohne ausdrückliche Zustimmung ausführen.