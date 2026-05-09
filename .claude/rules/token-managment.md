# Token Management Rules

## Ziel

Halte den Kontext klein, relevant und sauber. Lade nur Dateien, die für die aktuelle Aufgabe wirklich nötig sind.

## Kontext-Regeln

- Nicht den ganzen Codebase lesen, wenn nur wenige Dateien relevant sind.
- Zuerst mit Glob/Grep nach relevanten Dateien suchen.
- Danach nur die wahrscheinlich betroffenen Dateien lesen.
- Große Dateien nur abschnittsweise lesen.
- Keine langen Logs vollständig in den Kontext laden.
- Keine generierten Dateien analysieren, außer sie sind direkt relevant.
- Keine node_modules, dist, build, .git, coverage oder lock-Dateien lesen, außer ausdrücklich nötig.

## Vor Änderungen

- Erst Problem verstehen.
- Dann relevante Dateien identifizieren.
- Dann maximal 3–6 relevante Dateien lesen.
- Dann Plan erstellen.
- Erst danach Code ändern.

## Während langer Sessions

- Wenn der Kontext groß wird, Zwischenstand zusammenfassen.
- Bei Themenwechsel neue Session empfehlen.
- Bei vielen Änderungen nach jedem Meilenstein kurz zusammenfassen.
- Alte, nicht mehr relevante Details nicht erneut wiederholen.

## Token-sparende Antworten

- Keine kompletten Dateien ausgeben, außer der User verlangt es.
- Keine riesigen Erklärungen, wenn eine kurze Lösung reicht.
- Keine Wiederholung von bereits bekannten Projektregeln.
- Bei Codeänderungen lieber Diff/Zusammenfassung statt vollständigem Code, außer anders gewünscht.
- Große Aufgaben in kleine Schritte aufteilen.

## Wann /compact nutzen

Nutze oder empfehle /compact, wenn:
- die Session sehr lang wurde,
- viele Dateien gelesen wurden,
- ein Teilziel abgeschlossen ist,
- Claude anfängt, alte Details durcheinanderzubringen,
- vor einem neuen großen Arbeitsschritt.

Vor /compact eine kurze Zusammenfassung erzeugen:
- aktuelles Ziel
- erledigte Schritte
- geänderte Dateien
- offene Probleme
- nächster sinnvoller Schritt