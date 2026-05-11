const { Scenario } = require('../models');
const { sequelize } = require('../config/database');

const newScenarios = [
  // ── PRODUCT OWNER – Freitext
  {
    phase: 'product_owner', type: 'text', difficulty: 'medium',
    title: 'User Story schreiben: Bluetooth-Entsperrung',
    description: 'Dein wichtigstes Feature: Das smarte VeloTech-Schloss soll sich per Bluetooth öffnen lassen. Schreibe dafür eine vollständige User Story im korrekten Format: "Als [Rolle] möchte ich [Funktion], damit [Nutzen]." Füge außerdem 2–3 Akzeptanzkriterien hinzu.',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Eine vollständige User Story folgt dem Format: "Als Radfahrer möchte ich mein Schloss per Bluetooth entsperren, damit ich ohne Schlüssel auskomme." Akzeptanzkriterien: App erkennt Schloss im 5m-Radius, Öffnung in < 3 Sek., Fehlermeldung bei schwachem Akku.' }]
  },
  {
    phase: 'product_owner', type: 'text', difficulty: 'hard',
    title: 'MVP definieren: Welche Features kommen zuerst?',
    description: 'Das VeloTech-Team hat begrenzte Zeit für den ersten Sprint. Erkläre schriftlich, welche 2–3 Features zum MVP gehören sollten und warum:\n\n- Bluetooth-Entsperrung (8 SP)\n- GPS-Tracking (5 SP)\n- Diebstahlalarm (5 SP)\n- Fingerabdruck-Sensor (8 SP)\n- Share-Funktion (3 SP)\n\nBegründe deine Auswahl mit Kundennutzen und Risiko.',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Gutes MVP-Denken! Sinnvolles MVP: Bluetooth-Entsperrung (Kernfunktion, höchster Kundennutzen) + Diebstahlalarm (Sicherheit = Vertrauen = Kaufentscheidung). GPS und Fingerabdruck können in Sprint 2 folgen. Share-Funktion ist ein Nice-to-have für später.' }]
  },

  // ── SCRUM MASTER – Freitext
  {
    phase: 'scrum_master', type: 'text', difficulty: 'medium',
    title: 'Retrospektive moderieren: Teamkonflikt lösen',
    description: 'In der Sprint-Retrospektive beklagen sich zwei Entwickler: Der Product Owner ändere ständig Anforderungen mitten im Sprint — das blockiert ihre Arbeit.\n\nBeschreibe als Scrum Master:\n- Wie moderierst du diese Situation?\n- Welche Methode nutzt du (z.B. Start-Stop-Continue)?\n- Welche konkreten Maßnahmen schlägst du vor?',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Als SM nimmst du keine Partei, sondern strukturierst das Gespräch (Start-Stop-Continue, Sailboat-Methode). Konkrete Maßnahmen: Sprint-Backlog nach Planning einfrieren, Änderungen erst für nächsten Sprint. Kurzer täglicher Sync PO <> Team. Das Impediment dokumentieren und nachverfolgen.' }]
  },
  {
    phase: 'scrum_master', type: 'text', difficulty: 'hard',
    title: 'Daily Scrum: Anti-Patterns erkennen und korrigieren',
    description: 'Analysiere dieses Daily Scrum und nenne mindestens 3 Probleme:\n\nDev A: "Gestern hab ich an der Bluetooth-API gearbeitet. Heute mache ich weiter. Keine Blocker."\nDev B: "Ich hab die Unit Tests fertig. Warte noch auf Code-Review von Dev A."\nPO (kommt dazu): "Können wir kurz die neuen Anforderungen besprechen? Dauert nur 5 Minuten."\nDas Meeting läuft bereits seit 25 Minuten.\n\nWelche Probleme siehst du und wie löst du sie als Scrum Master?',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Typische Anti-Patterns: 1) Meeting zu lang (max. 15 Min), 2) PO nimmt teil und lenkt ab (Daily ist für Entwickler), 3) Dev B wartet auf Review — das ist ein echter Blocker, der sofort adressiert werden muss, 4) Updates berichten statt Fortschritt zum Sprint-Ziel besprechen. Als SM: Timebox halten, PO höflich rausbitten, Blocker sofort lösen.' }]
  },

  // ── DEVELOPER – Freitext
  {
    phase: 'developer', type: 'text', difficulty: 'medium',
    title: 'Code Review: Konstruktives Feedback geben',
    description: 'Du reviewst diesen Pull Request für die Bluetooth-Entsperrung. Was ist dein Feedback?\n\nfunction unlockBike(userId) {\n  const user = db.query("SELECT * FROM users WHERE id = " + userId);\n  if (user) {\n    bluetooth.connect();\n    bluetooth.send("UNLOCK");\n    return true;\n  }\n}\n\nSchreibe ein konstruktives Code-Review. Nenne konkrete Probleme und wie du sie beheben würdest.',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Gutes Review! Kritische Punkte: 1) SQL-Injection-Lücke — niemals String-Konkatenation in Queries, Prepared Statements verwenden! 2) Kein Error-Handling (Bluetooth kann fehlschlagen), 3) Kein Return-Wert bei Fehler, 4) Async/Await fehlt — Bluetooth-Operationen sind asynchron. Das DoD-Kriterium "Security Review" wäre nicht erfüllt.' }]
  },
  {
    phase: 'developer', type: 'text', difficulty: 'hard',
    title: 'Technische Schulden: Jetzt oder später?',
    description: 'Das Team hat einen Workaround für den GPS-Tracker eingebaut: Statt einer sauberen Event-Architektur gibt es einen Polling-Mechanismus, der alle 5 Sekunden den GPS-Chip abfragt. Das kostet Akku, funktioniert aber. Der Sprint endet in 2 Tagen.\n\nSolltet ihr jetzt refactoren oder in den nächsten Sprint schieben? Begründe deine Entscheidung mit Vor- und Nachteilen.',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Gute Abwägung! Technische Schuld dokumentieren als Backlog-Item, Sprint-Ziel nicht gefährden. Entscheidung hängt ab vom Aufwand: Schnelle Lösung (< 4h) — jetzt angehen. Großes Refactoring — in Backlog und zeitnah einplanen. Wichtig: Tech-Schulden nicht anhäufen lassen, sonst wird das Team immer langsamer.' }]
  },

  // ── KANBAN – Freitext
  {
    phase: 'kanban', type: 'text', difficulty: 'medium',
    title: 'Kanban-Board aufsetzen: Spalten und WIP-Limits',
    description: 'Das VeloTech-Team wechselt nach dem Launch zu Kanban für Support und Weiterentwicklung. Definiere ein Kanban-Board:\n\n- Welche Spalten braucht ihr?\n- Welche WIP-Limits setzt du wo und warum?\n- Wie unterscheidet sich dein Board von einem Scrum Sprint Board?',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Gutes Board-Design! Typisch für Support-Kanban: Backlog → Ready → In Progress (WIP: 2-3) → Code Review (WIP: 2) → Testing → Done. WIP-Limits verhindern Multitasking und machen Engpässe sichtbar. Unterschied zu Scrum: Kein fixer Sprint-Zeitraum, Tickets fließen kontinuierlich durch.' }]
  },
  {
    phase: 'kanban', type: 'text', difficulty: 'hard',
    title: 'Flow-Problem analysieren: Engpass identifizieren',
    description: 'Das VeloTech Kanban-Board zeigt nach 2 Wochen dieses Bild:\n\nBacklog: 15 Tickets\nIn Progress: 6 Tickets (WIP-Limit eigentlich: 3)\nCode Review: 8 Tickets (WIP-Limit eigentlich: 4)\nDone: 2 Tickets in 2 Wochen\n\nAnalysiere: Wo sind die Engpässe? Was sind die Ursachen? Welche Maßnahmen schlägst du vor?',
    options: [{ id: 1, text: 'Freitext', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Sehr gute Analyse! Probleme: 1) WIP-Limits werden ignoriert (Teamdisziplin fehlt), 2) Code Review ist der Flaschenhals (8 Tickets stecken), 3) Wenig Throughput. Maßnahmen: WIP-Limits konsequent durchsetzen, Code Review priorisieren (Pair-Review statt asynchron), Retrospektive zur Ursache, Review-Rotation einführen.' }]
  }
];

sequelize.sync().then(async () => {
  let added = 0;
  for (const s of newScenarios) {
    const exists = await Scenario.findOne({ where: { title: s.title, phase: s.phase } });
    if (!exists) {
      await Scenario.create({ ...s, isActive: true });
      added++;
      console.log('+ [' + s.phase + '/' + s.type + '] ' + s.title);
    } else {
      console.log('= vorhanden: ' + s.title);
    }
  }
  console.log('\n' + added + ' neue Szenarien hinzugefügt.');
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
