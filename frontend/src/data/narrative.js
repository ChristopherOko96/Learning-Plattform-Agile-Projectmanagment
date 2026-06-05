/**
 * narrative.js
 * Alle narrativen Texte des SprintLock-Planspiels:
 * Intro, Sprint-Briefings, Kanban-Briefing, Phasentitel und Abschlussbildschirm.
 * Fachliche Grundlage: docs/spielkonzept.md, Abschnitte 1–5
 */

export const narrative = {
  intro: `Willkommen bei SprintLock.

Du bist Scrum Master bei der VeloTech GmbH – einem Startup, das gerade dabei ist, ein smartes Fahrradschloss auf den Markt zu bringen. Die Idee ist überzeugend: Das VeloTech Smart Lock lässt sich per App entsperren, schlägt bei Diebstahl Alarm und bietet moderne Sicherheitsfunktionen für Stadtradler.

Das Team ist motiviert, die Stakeholder ungeduldig, das Backlog prall gefüllt. Deine Aufgabe: Führe das Team durch zwei Sprints und eine Kanban-Phase – und triff dabei Entscheidungen, die agile Projekte in der Praxis ausmachen.

Du wirst Situationen begegnen, die keine perfekte Antwort haben. Lautstärke, Zeitdruck und gut gemeinte Ratschläge werden dich auf die Probe stellen. Was zählt, ist nicht die schnelle Entscheidung – sondern die richtige.

Das Product Backlog liegt bereits vor dir. Du schreibst keine User Stories. Du wählst, priorisierst und reagierst.

Bereit? Der erste Sprint beginnt jetzt.`,

  sprintBriefings: {
    sprint1: `Sprint 1 – Los geht's.

Das Team hat eine Basis-Velocity von 14 Story Points. Das Backlog enthält mehr Items, als in einen Sprint passen – das ist gewollt. Im Sprint Planning entscheidest du gemeinsam mit dem Team, was realistisch machbar ist.

Denk daran: Ein vollständig fertiggestelltes Inkrement ist mehr wert als viele halb-fertige Stories. Was am Ende des Sprints nicht Done ist, existiert für den Stakeholder nicht.

Dein Ziel für Sprint 1: Plane realistisch, schütze den Sprint vor Unterbrechungen und beende ihn mit einem nutzbaren Inkrement.`,

    sprint2: `Sprint 2 – Was hast du aus Sprint 1 gelernt?

Der erste Sprint ist abgeschlossen. Was du entschieden hast, wirkt sich jetzt auf die Ausgangssituation aus: auf die Velocity des Teams, auf die Beziehung zum CEO, auf den Zustand des Backlogs.

Sprint 2 stellt neue Fragen: Welche Items sind wirklich wichtig? Wessen Wunsch verdient Priorität? Und was tust du, wenn das Unerwartete eintritt?

Der Scrum-Zyklus hat ein Ziel: Durch Erleben, Inspizieren und Anpassen kontinuierlich besser werden. Sprint 2 ist die erste Chance, das zu beweisen.`,
  },

  kanbanBriefing: `Kanban-Phase – Eine andere Art zu arbeiten.

Die Sprint-Struktur ist vorbei. Du wechselst in eine kontinuierliche Kanban-Umgebung. Kein festes Sprint-Ende, kein Sprint Planning – stattdessen: Flow.

Das Team arbeitet mit einem Kanban-Board. Tickets wandern von links nach rechts: vom Backlog über In Progress und Code Review bis zu Testing und Done. Der Fortschritt ist sichtbar – wenn man hinschaut.

Kanban hat eigene Regeln. WIP-Limits begrenzen, wie viele Tickets gleichzeitig in einer Spalte bearbeitet werden. Engpässe werden sichtbar, wenn Tickets sich stauen. Das Pull-Prinzip bestimmt, wer wann was zieht.

Deine Aufgabe in dieser Phase: Beobachte das System. Erkenne, wo Probleme entstehen. Und: Reagiere auf das, was das Board dir zeigt – nicht auf das, was sich intuitiv richtig anfühlt.`,

  phaseTitles: {
    planning: 'Sprint Planning',
    execution: 'Sprint Durchführung',
    review: 'Sprint Review',
    retro: 'Retrospektive',
    kanban: 'Kanban-Phase',
  },

  endScreen: `Gut gemacht – das Planspiel ist abgeschlossen.

Du hast zwei Sprints und eine Kanban-Phase durchgeführt und dabei die zentralen Mechanismen agiler Methoden aus einer Perspektive erlebt, die eine Vorlesung nicht bieten kann: aus der Entscheidungsperspektive.

Was du in diesem Planspiel gelernt hast:

Scrum lebt von klaren Commitments. Eine Velocity ist kein Ziel, das übertroffen werden soll – sie ist ein ehrlicher Spiegel der Teamkapazität. Overcommitment erzeugt halb-fertige Stories, keine Leistung.

Sprint-Schutz ist keine Sturheit. Wenn der CEO oder ein Stakeholder mid-Sprint eingreift, ist die professionelle Antwort nicht „Nein" – sie ist die Weiterleitung in den richtigen Prozess: Backlog, Refinement, nächster Sprint.

Priorisierung ist eine Entscheidung, keine Verhandlung. Der lauteste Stakeholder hat nicht automatisch recht. Wert für den Nutzer schlägt Sichtbarkeit für den Vertrieb.

Retrospektiven sind Investitionen, keine Zeitverschwendung. Wer den Prozess nicht reflektiert, wiederholt seine Fehler – Sprint für Sprint.

Kanban zeigt Probleme, es löst sie nicht automatisch. WIP-Limits, Engpass-Erkennung und das Pull-Prinzip sind Werkzeuge – aber nur dann wirksam, wenn man auf das Board schaut und systemisch denkt.

Agiles Arbeiten ist kein Regelwerk. Es ist eine Haltung: Transparenz, Inspektion, Adaption – in jedem Sprint, in jedem Ticket, in jeder Entscheidung.

Vielen Dank für deine Teilnahme an SprintLock.`,
};
