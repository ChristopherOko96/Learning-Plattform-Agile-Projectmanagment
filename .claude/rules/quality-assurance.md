# Quality Assurance Rules

## Code Review nach jeder Implementierung

- Nach jeder nicht-trivialen Implementierung den **review**-Skill ausführen.
- Prüfe dabei:
  - Logikfehler und Edge Cases
  - Sicherheitslücken (XSS, Injection, unsichere Eingaben)
  - Lesbarkeit und Wartbarkeit
  - Konsistenz mit bestehendem Code-Stil
- Kleine Fixes (Typo, Farbe, Text) benötigen kein vollständiges Review.
- Größere Features, API-Integrationen und Auth-Flows immer reviewen.

## Unit Tests

- Nach der Implementierung einer Funktion, API-Route oder Komponente: Unit Tests schreiben.
- Tests decken ab:
  - Happy Path (erwartetes Verhalten)
  - Edge Cases (leere Eingaben, ungültige Werte)
  - Fehlerfälle (API-Fehler, Validierungsfehler)
- Testdatei liegt neben der Quelldatei oder in einem `__tests__`/`tests`-Ordner.
- Keine Implementierung als "fertig" markieren, ohne dass die Tests grün sind.

## Funktionalitätsprüfung

- Nach der Implementierung immer prüfen:
  1. Läuft der Dev-Server fehlerfrei?
  2. Funktioniert der implementierte Flow im Browser?
  3. Zeigt die Browser-Konsole keine Fehler?
  4. Sind API-Calls erfolgreich (Network Tab)?
- Bei Frontend-Komponenten: visuell im Browser überprüfen (Desktop + Mobile).
- Bei Backend-Routen: mit einem einfachen Request testen (z. B. curl oder Testskript).

## Reihenfolge nach Implementierung

1. Code Review (review-Skill oder manuell)
2. Unit Tests schreiben und ausführen
3. Manuelle Funktionalitätsprüfung
4. Zusammenfassung erstellen (was wurde implementiert, was getestet, was offen)
