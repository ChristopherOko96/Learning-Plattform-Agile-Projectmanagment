/**
 * situations.js
 * Die 8 Kernsituationen des SprintLock-Planspiels.
 * Fachliche Grundlage: docs/spielkonzept.md, Abschnitt 4.6
 */

export const situations = [
  {
    id: 'sprint-planning-capacity',
    phase: 'sprint1',
    title: 'Sprint Planning: Wie viel nehmen wir uns vor?',
    learningGoal:
      'Velocity als neutrales Planungsinstrument akzeptieren und die Kapazität des Teams realistisch einschätzen können.',
    thinkingModel: 'Commitment ≠ Versprechen',
    context:
      'Das Team hat in den letzten Sprints eine Velocity von 14 Story Points erreicht. Im Product Backlog liegen priorisierte Items für insgesamt 28 SP. Der Product Owner kommt ins Planning und sagt: „Wenn wir uns wirklich anstrengen, schaffen wir 20 SP – das würden die Stakeholder sehen wollen." Das Team schaut dich erwartungsvoll an.',
    question:
      'Wie viele Story Points nimmst du als Scrum Master ins Sprint Backlog auf?',
    inputType: 'choice',
    options: [
      {
        id: 'option-overcommit',
        label: '20 SP – wir geben Vollgas und zeigen, was wir können',
        consequence:
          'Der Sprint endet mit 9 SP Done und 11 SP halb-fertig. Halb-fertige Stories zählen nicht als Done – das Inkrement ist lückenhaft. Die Stakeholder sind enttäuscht. Die Velocity für Sprint 2 sinkt auf 11.',
        stateChanges: {
          velocity: -3,
          teamMorale: -1,
          ceoRelation: -1,
          technicalDebt: 1,
          backlogHealth: 0,
        },
      },
      {
        id: 'option-realistic',
        label: '14 SP – Velocity als Basis, kein Mehr, kein Weniger',
        consequence:
          'Der Sprint endet vollständig Done. Das Team ist entspannt, die Qualität stimmt. Der Stakeholder sieht ein nutzbares Inkrement und das Vertrauen steigt.',
        stateChanges: {
          velocity: 0,
          teamMorale: 1,
          ceoRelation: 1,
          technicalDebt: 0,
          backlogHealth: 0,
        },
      },
      {
        id: 'option-undercommit',
        label: '10 SP – lieber weniger, damit wir sicher fertig werden',
        consequence:
          'Der Sprint ist Done, aber Stakeholder hinterfragen die geringe Lieferleistung. Ungenutztes Potenzial bleibt im Backlog. Die Velocity sinkt mittelfristig durch fehlende Auslastung.',
        stateChanges: {
          velocity: -1,
          teamMorale: 0,
          ceoRelation: -1,
          technicalDebt: 0,
          backlogHealth: 0,
        },
      },
    ],
    ahaMessage:
      'Overcommitment fühlt sich nach Motivation an – liefert aber weniger als realistisches Planen. Halb-fertige Stories zählen laut Definition of Done nicht und erzeugen keinen Wert. Velocity ist kein Ziel, das übertroffen werden soll, sondern ein Werkzeug zur ehrlichen Selbsteinschätzung. Professionelles Planen bedeutet: Auf Basis der tatsächlichen Kapazität committen – nicht auf Basis von Wunschdenken.',
    scrumKanbanRef: 'Scrum Guide: Sprint Planning, Velocity als Planungsbasis',
  },

  {
    id: 'ceo-mid-sprint',
    phase: 'sprint1',
    title: 'Mid-Sprint: Der CEO meldet sich',
    learningGoal:
      'Den Sprint-Backlog als committed und geschützt verstehen und wissen, wie externe Anfragen korrekt in den Prozess gelenkt werden.',
    thinkingModel: 'Sprint = geschützter Raum',
    context:
      'Sprint 1 läuft seit 4 Tagen. Das Team ist im Flow, alle Stories sind klar. Plötzlich erscheint eine Nachricht vom CEO im Team-Chat: „Ich war auf der CES in Las Vegas. KI-gestützte Diebstahlerkennung ist der neue Trend – alle reden darüber. Das muss ins Produkt, am liebsten noch in diesem Sprint. Wir können uns das nicht leisten zu verschlafen."',
    question:
      'Wie reagierst du als Scrum Master auf die Anfrage des CEOs?',
    inputType: 'freetext',
    freetextHint:
      'Erkläre in eigenen Worten, wie du mit der Anfrage umgehst – ohne den CEO zu ignorieren, aber ohne den Sprint zu gefährden. Was sagst du dem CEO konkret? Welchen Prozessschritt schlägst du vor?',
    ahaMessage:
      'Option B ist die einzige Antwort, die sowohl den Prozess als auch die Stakeholder-Beziehung schützt. Sprint-Schutz ist keine Arroganz – er ist professionelles Prozessmanagement. Der CEO wird nicht abgewiesen, sondern in den richtigen Kanal gelenkt: Backlog aufnehmen, beim Refinement fachlich bewerten, frühestens Sprint 3 einplanen. Ein erfahrener Scrum Master sagt nicht „Nein" – er sagt „Hier ist der richtige Weg".',
    scrumKanbanRef: 'Scrum Guide: Sprint Backlog ist Commitment des Teams, Sprint-Schutz durch Scrum Master',
  },

  {
    id: 'backlog-prioritization',
    phase: 'sprint2',
    title: 'Backlog-Priorisierung: Wessen Wunsch gewinnt?',
    learningGoal:
      'Priorisierung als wertbasierte Entscheidung verstehen und Stakeholder-Druck von echtem Kundennutzen auseinanderhalten.',
    thinkingModel: 'Wert ≠ Lautstärke',
    context:
      'Sprint 2 Planning. Das Team hat 15 SP Kapazität. Fünf Items liegen im Backlog, jedes mit einem anderen Absender: Marketing drängt auf GPS-Tracking für die Pressemitteilung (8 SP), der Sicherheitsbeauftragte besteht auf dem Diebstahlalarm (5 SP), ein Stakeholder wünscht sich einen Dark Mode für ein modernes Erscheinungsbild (3 SP), ein Entwickler meldet die Akkuwarnung als technisch notwendig (2 SP), und NFC-Backup-Entsperrung wartet seit zwei Sprints im Backlog (8 SP).',
    question:
      'Welche Items nimmst du in den Sprint 2 auf?',
    inputType: 'choice',
    options: [
      {
        id: 'option-marketing-pressure',
        label: 'GPS-Tracking + Dark Mode (11 SP) – Marketing und Optik priorisieren',
        consequence:
          'Das Inkrement sieht modern aus. Aber: kein Diebstahlschutz, keine Akkuwarnung. Im Review berichten Nutzer von Frustrationen – das Schloss gibt keinen Hinweis bei leerem Akku. Sicherheitsbeauftragter eskaliert.',
        stateChanges: {
          velocity: 0,
          teamMorale: -1,
          ceoRelation: -1,
          technicalDebt: 1,
          backlogHealth: -1,
        },
      },
      {
        id: 'option-value-based',
        label: 'Diebstahlalarm + Akkuwarnung + Dark Mode (10 SP) – Nutzen und Sicherheit zuerst',
        consequence:
          'Solides Inkrement mit echtem Nutzerwert. GPS fehlt – aber der Product Owner kann das gegenüber Marketing gut begründen. Sicherheitsbeauftragter ist zufrieden. Stakeholder nehmen das Fehlen des GPS-Trackings an.',
        stateChanges: {
          velocity: 0,
          teamMorale: 1,
          ceoRelation: 0,
          technicalDebt: 0,
          backlogHealth: 1,
        },
      },
      {
        id: 'option-minimal',
        label: 'Diebstahlalarm + Akkuwarnung (7 SP) – fokussiert auf das Wesentliche',
        consequence:
          'Beide Items fertig, echter Wert. Ungenutztes Potenzial von 8 SP bleibt im Backlog. Stakeholder hinterfragen die geringe Auslastung des Teams.',
        stateChanges: {
          velocity: -1,
          teamMorale: 0,
          ceoRelation: -1,
          technicalDebt: 0,
          backlogHealth: 0,
        },
      },
      {
        id: 'option-overload',
        label: 'Diebstahlalarm + Akkuwarnung + NFC-Backup (16 SP) – alle wichtigen Items reinpacken',
        consequence:
          'Über Kapazität. NFC-Backup bleibt halb-fertig. Ähnliche Konsequenz wie in der Kapazitätssituation: unvollständiges Inkrement, sinkende Velocity.',
        stateChanges: {
          velocity: -2,
          teamMorale: -1,
          ceoRelation: 0,
          technicalDebt: 1,
          backlogHealth: -1,
        },
      },
    ],
    ahaMessage:
      'GPS-Tracking klingt attraktiv und der Marketing-Druck ist real. Aber ein Smart Lock, das bei leerem Akku nicht warnt, frustriert Nutzer unmittelbar – das ist ein konkreter Nutzerschaden, kein abstraktes Risiko. Priorisierung nach Kundennutzen und Risiko schlägt Priorisierung nach Stakeholder-Lautstärke. Der Product Owner trifft diese Entscheidung datenbasiert und begründbar – nicht politisch.',
    scrumKanbanRef: 'Scrum Guide: Product Backlog Ordering, wertbasierte Priorisierung',
  },

  {
    id: 'sprint-review-feedback',
    phase: 'sprint1',
    title: 'Sprint Review: Was machen wir mit dem Feedback?',
    learningGoal:
      'Den Sprint Review als Inspect-and-Adapt-Moment verstehen und Stakeholder-Feedback systematisch ins Backlog überführen.',
    thinkingModel: 'Review = Feedback-Schleife, keine Abnahme',
    context:
      'Sprint Review. Das Team zeigt das fertige Inkrement. Die Reaktionen sind gemischt: Der Vertrieb entdeckt, dass Familien das Schloss gemeinsam nutzen wollen – eine Familienfunktion fehlt komplett. Der Support meldet: Nutzer sind verwirrt, wenn sie eine falsche PIN eingeben – es gibt keine verständliche Fehlermeldung. Der CEO ist dagegen zufrieden und gibt grünes Licht für den nächsten Sprint.',
    question:
      'Wie gehst du mit dem Stakeholder-Feedback im Sprint Review um?',
    inputType: 'choice',
    options: [
      {
        id: 'option-full-adoption',
        label: 'Alles aufnehmen und strukturiert priorisieren',
        consequence:
          'Das Backlog wird aktualisiert. Sprint 2 hat eine klare, aktuelle Grundlage. Die Stakeholder erleben: ihr Feedback zählt und wird ernst genommen. Das Vertrauen in den Prozess steigt.',
        stateChanges: {
          velocity: 0,
          teamMorale: 1,
          ceoRelation: 1,
          technicalDebt: 0,
          backlogHealth: 1,
        },
      },
      {
        id: 'option-bug-only',
        label: 'Nur den Bug (fehlende Fehlermeldung) ins Backlog aufnehmen',
        consequence:
          'Das Backlog ist teilweise aktuell. Der Vertrieb meldet sich in Sprint 2 erneut – diesmal dringlicher und mit mehr Druck. Das Thema kehrt wieder, nur ungünstiger.',
        stateChanges: {
          velocity: 0,
          teamMorale: 0,
          ceoRelation: 0,
          technicalDebt: 0,
          backlogHealth: 0,
        },
      },
      {
        id: 'option-ignore',
        label: 'Zur Kenntnis nehmen, erst mal nichts tun',
        consequence:
          'Das Backlog ist veraltet. Sprint 2 wird an Items gearbeitet, die nicht mehr zu den Bedürfnissen der Stakeholder passen. Beim nächsten Review kommt die Ernüchterung.',
        stateChanges: {
          velocity: 0,
          teamMorale: -1,
          ceoRelation: -1,
          technicalDebt: 0,
          backlogHealth: -1,
        },
      },
      {
        id: 'option-immediate-plan',
        label: 'Familienfunktion sofort für Sprint 2 einplanen',
        consequence:
          'Sprint 2 ist überladen, bevor er begonnen hat. Kein Puffer für Unvorhergesehenes. Wenn ein weiteres Ereignis eintritt, bricht der Sprint zusammen.',
        stateChanges: {
          velocity: -1,
          teamMorale: -1,
          ceoRelation: 0,
          technicalDebt: 1,
          backlogHealth: -1,
        },
      },
    ],
    ahaMessage:
      'Der Sprint Review ist nicht dekorativ. Er ist die wichtigste Informationsquelle für das nächste Sprint Planning. Wer Feedback ignoriert, arbeitet in einer Echokammer und liefert am Ende Dinge, die niemand mehr braucht. Ein Sprint Review ohne Backlog-Update ist eine verpasste Lerngelegenheit – und verschwendete Kapazität im nächsten Sprint.',
    scrumKanbanRef: 'Scrum Guide: Sprint Review, Inspect and Adapt, Backlog-Aktualisierung',
  },

  {
    id: 'retrospective',
    phase: 'sprint2',
    title: 'Retrospektive: Investition oder Zeitverschwendung?',
    learningGoal:
      'Die Retrospektive als Investition in den nächsten Sprint begreifen und den Zusammenhang zwischen Prozessreflexion und Lieferleistung erkennen.',
    thinkingModel: 'Empirie: Adaption ist Pflicht, nicht Kür',
    context:
      'Nach Sprint 1. Das Team hat geliefert, aber zwei Stories wurden nicht fertig, weil Code Reviews zu lange dauerten und sich stauten. Das Team ist erschöpft. Der Product Owner kommt mit einem Anliegen: „Können wir die Retro heute kürzen oder ganz auslassen? Wir haben noch so viel zu tun für Sprint 2 – die Zeit könnten wir besser nutzen."',
    question:
      'Wie gehst du mit dem Vorschlag um, die Retrospektive zu kürzen oder zu überspringen? Begründe deine Entscheidung.',
    inputType: 'freetext',
    freetextHint:
      'Was sagst du dem Product Owner? Was ist der Zweck einer Retrospektive – und was kostet es, sie zu überspringen? Welches konkrete Problem aus Sprint 1 würdest du in der Retro ansprechen?',
    ahaMessage:
      'Die Retrospektive kostet 60 Minuten. Das Ignorieren kann einen halben Sprint kosten. In Sprint 1 hat sich ein konkretes Problem gezeigt: Code Reviews ohne klare Zeitslots führen zum Stau. Wer das in der Retro benennt und eine Regel einführt, startet Sprint 2 mit einer verbesserten Arbeitsweise. Wer die Retro überspringt, wiederholt denselben Fehler. Kontinuierliche Verbesserung ist kein Bonus – sie ist das Fundament dafür, dass Scrum über mehrere Sprints funktionsfähig bleibt.',
    scrumKanbanRef: 'Scrum Guide: Sprint Retrospective, kontinuierliche Prozessverbesserung',
  },

  {
    id: 'wip-limit',
    phase: 'kanban',
    title: 'Kanban: WIP-Limit einhalten oder ignorieren?',
    learningGoal:
      'WIP-Limits als Steuerungswerkzeug für Flow verstehen und den Unterschied zwischen Auslastung und Durchsatz erkennen.',
    thinkingModel: 'Aktivität ≠ Fortschritt',
    context:
      'Das Team arbeitet nun mit einem Kanban-Board. Das WIP-Limit für die Spalte „In Progress" ist auf 3 Tickets gesetzt. Es gibt 7 priorisierte Tickets im Backlog. Ein erfahrener Entwickler meldet sich: „Ich könnte jetzt noch zwei weitere Tickets starten – die sind beide fast fertig und ich könnte parallel vorantreiben. Das WIP-Limit scheint mir etwas künstlich."',
    question:
      'Wie reagierst du auf den Vorschlag des Entwicklers?',
    inputType: 'choice',
    options: [
      {
        id: 'option-ignore-wip',
        label: 'WIP-Limit ignorieren – 5 Tickets gleichzeitig starten',
        consequence:
          'Nach einer Woche: alle 5 Tickets bei 70–80 %. Keines ist Done. Kontextwechsel erhöht die Fehlerquote. Viel Aktivität, null Lieferung. Die Durchlaufzeit steigt messbar – genau das Gegenteil von Effizienz.',
        stateChanges: {
          velocity: -3,
          teamMorale: -1,
          ceoRelation: -1,
          technicalDebt: 1,
          backlogHealth: -1,
        },
      },
      {
        id: 'option-hold-wip',
        label: 'WIP-Limit halten – erst aktive Tickets fertigstellen, dann neue starten',
        consequence:
          'Nach einer Woche: 3 Tickets Done, 3 neue startbereit. Flow ist stabil, Durchlaufzeit kurz. Das Team merkt: weniger gleichzeitig bedeutet mehr fertig.',
        stateChanges: {
          velocity: 1,
          teamMorale: 1,
          ceoRelation: 0,
          technicalDebt: 0,
          backlogHealth: 1,
        },
      },
    ],
    ahaMessage:
      'Das WIP-Limit fühlt sich wie eine Bremse an. Es ist eine Strömungssteuerung. Das Prinzip dahinter – bekannt als Little\'s Law – besagt: Durchlaufzeit = WIP ÷ Durchsatz. Mehr parallele Arbeit bedeutet automatisch längere Wartezeit pro Ticket. Wer weniger gleichzeitig bearbeitet, liefert schneller. Das ist kontraintuitiv – aber messbar.',
    scrumKanbanRef: 'Kanban-Prinzipien: WIP-Limits, Little\'s Law, Flow-Optimierung',
  },

  {
    id: 'bottleneck-detection',
    phase: 'kanban',
    title: 'Kanban: Wo ist der Engpass?',
    learningGoal:
      'Ein Kanban-Board als Diagnosewerkzeug nutzen und den Engpass als Systemphänomen erkennen und adressieren.',
    thinkingModel: 'Das System ist das Problem – nicht die Person',
    context:
      'Das Board nach zwei Wochen zeigt ein klares Bild: Im Backlog warten 12 Tickets, In Progress laufen 3 Tickets (WIP-Limit: 3 – okay), in der Spalte Code Review stauen sich 9 Tickets (WIP-Limit: 4 – weit überschritten!), in Testing liegt 1 Ticket, Done stehen 4. Der Teamleiter betrachtet das Board und sagt: „Wir brauchen mehr Entwickler. Die Entwicklung ist zu langsam."',
    question:
      'Wie reagierst du auf die Diagnose des Teamleiters?',
    inputType: 'choice',
    options: [
      {
        id: 'option-more-devs',
        label: 'Mehr Entwickler einstellen – Entwicklung beschleunigen',
        consequence:
          'Noch mehr Tickets strömen in Code Review. Der Stau verschlimmert sich. Das Problem wird größer, nicht kleiner. Die Diagnose war falsch – und die Maßnahme macht es schlimmer.',
        stateChanges: {
          velocity: -2,
          teamMorale: -1,
          ceoRelation: -1,
          technicalDebt: 1,
          backlogHealth: -1,
        },
      },
      {
        id: 'option-stop-dev',
        label: 'Entwicklung stoppen – alle helfen bei Code Reviews',
        consequence:
          'Der Stau in Code Review löst sich auf. Tickets fließen in Testing und dann in Done. Die Durchlaufzeit sinkt messbar. Das Team erlebt: Das Board zeigt das Problem – man muss nur hinschauen.',
        stateChanges: {
          velocity: 2,
          teamMorale: 1,
          ceoRelation: 0,
          technicalDebt: 0,
          backlogHealth: 1,
        },
      },
      {
        id: 'option-speed-testing',
        label: 'Testing beschleunigen – dort liegt die Verzögerung',
        consequence:
          'Testing hat nur 1 Ticket – dort gibt es keinen Engpass. Die Maßnahme verpufft. Ressourcen werden falsch eingesetzt und der Stau in Code Review bleibt.',
        stateChanges: {
          velocity: 0,
          teamMorale: -1,
          ceoRelation: 0,
          technicalDebt: 0,
          backlogHealth: 0,
        },
      },
    ],
    ahaMessage:
      'Der Engpass ist nicht dort, wo am meisten gearbeitet wird – er ist dort, wo Arbeit steckt. Das Board zeigt es sichtbar: 9 Tickets in Code Review bei einem WIP-Limit von 4 ist ein Systemversagen, kein Personalproblem. Mehr Entwickler produzieren nur noch mehr Input in den Engpass. Die Lösung ist, den Engpass selbst zu beheben – durch Ressourcen dorthin lenken, wo der Stau ist. Das ist systemisches Denken statt Symptombekämpfung.',
    scrumKanbanRef: 'Kanban: Theory of Constraints, Engpass-Analyse, systemisches Denken',
  },

  {
    id: 'stop-starting-start-finishing',
    phase: 'kanban',
    title: 'Kanban: Stop Starting, Start Finishing',
    learningGoal:
      'Den Wert von Fertigstellung über Neubeginn erkennen und das Pull-Prinzip als bewusstes Handlungsprinzip anwenden.',
    thinkingModel: 'Pull schlägt Push – Fertigstellen schlägt Starten',
    context:
      'Entwicklerin Mia hat Ticket A fast fertig – es liegt bei 90 % und wartet nur noch auf ein finales Code Review, das etwa 2 Stunden dauern wird. Im Backlog liegt Ticket B – neu hinzugekommen, frisch priorisiert und interessant. Ihre Kollegin fragt: „Soll ich mit Ticket B anfangen? Ticket A wartet doch nur auf Review – da kann ich gerade nichts tun."',
    question:
      'Was empfiehlst du der Kollegin?',
    inputType: 'choice',
    options: [
      {
        id: 'option-start-new',
        label: 'Ticket B starten – Ticket A wartet sowieso nur',
        consequence:
          'Ticket A bleibt liegen. Ticket B braucht 3 Tage. Danach erst wird das Review für A durchgeführt. A wartet insgesamt weitere 3 Tage. Gesamtdurchlaufzeit für beide Tickets: +3 Tage. Noch kein einziges Ticket ist Done.',
        stateChanges: {
          velocity: -1,
          teamMorale: 0,
          ceoRelation: -1,
          technicalDebt: 0,
          backlogHealth: -1,
        },
      },
      {
        id: 'option-finish-first',
        label: 'Ticket A fertigstellen – Review priorisieren, dann B starten',
        consequence:
          'Ticket A ist in 2 Stunden Done. Ein fertiges Ticket liefert sofort Wert. Danach kann mit Ticket B begonnen werden. Gesamtdurchlaufzeit für beide Tickets: deutlich kürzer. Ein Ticket erzeugt bereits Wert.',
        stateChanges: {
          velocity: 1,
          teamMorale: 1,
          ceoRelation: 0,
          technicalDebt: 0,
          backlogHealth: 1,
        },
      },
    ],
    ahaMessage:
      'Ein fast fertiges Ticket repräsentiert bereits investierte Arbeit und wartet darauf, Wert zu liefern. Neues anzufangen fühlt sich produktiv an – ist es aber nicht, solange Fertiges noch nicht abgeschlossen ist. „Stop Starting, Start Finishing" ist kein Slogan, sondern eine messbare Optimierungsstrategie. Jedes Done-Ticket liefert sofort Wert; jedes halb-fertige Ticket ist gebundenes Kapital ohne Ertrag.',
    scrumKanbanRef: 'Kanban: Pull-Prinzip, Stop Starting Start Finishing, Durchlaufzeit-Optimierung',
  },
];
