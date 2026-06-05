/**
 * events.js
 * Überraschungsereignisse im SprintLock-Planspiel.
 * Ereignisse erscheinen an festgelegten Punkten, simulieren Praxisrealität
 * und testen die Reaktion des Spielers in unerwarteten Situationen.
 * Fachliche Grundlage: docs/spielkonzept.md, Abschnitt 5.2
 */

export const events = [
  {
    id: 'ceo-feature-request',
    title: 'CEO fordert neues Feature – mitten im Sprint',
    trigger: {
      sprint: 1,
      phase: 'execution',
    },
    description:
      'Sprint 1 läuft seit vier Tagen. Das Team hat einen guten Rhythmus gefunden – alle Stories sind klar verteilt, der Fortschritt ist sichtbar. Dann erscheint eine Nachricht vom CEO im Team-Chat: „Ich war auf der CES in Las Vegas. KI-gestützte Diebstahlerkennung ist überall Thema. Alle großen Anbieter zeigen das bereits. Wir können uns nicht leisten, das zu verschlafen – das muss noch in diesen Sprint."',
    type: 'freetext',
    freetextHint:
      'Wie reagierst du als Scrum Master? Erkläre konkret, was du dem CEO antwortest – ohne den Sprint zu gefährden und ohne den CEO vor den Kopf zu stoßen. Welchen Prozessschritt schlägst du vor?',
    ahaMessage:
      'Der Sprint-Backlog ist nach dem Planning committed – nicht weil Scrum das als starre Regel vorschreibt, sondern weil das Team auf dieser Grundlage plant und arbeitet. Eingriffe gefährden das Commitment und erzeugen technische Schulden. Die richtige Reaktion: Das Feature ins Backlog aufnehmen, beim Refinement bewerten, frühestens Sprint 3 einplanen. Der CEO wird nicht abgewiesen – er wird in den richtigen Kanal geleitet.',
  },

  {
    id: 'developer-sick',
    title: 'Entwickler fällt aus – Sprint 2 Planung muss angepasst werden',
    trigger: {
      sprint: 2,
      phase: 'planning',
    },
    description:
      'Sprint 2 Planning steht an. Das Team versammelt sich – aber einer fehlt: Entwickler Jonas ist krankgemeldet. Er war für zwei der geplanten Stories vorgesehen und seine Fehltage sind nicht absehbar. Das Team hat normalerweise 15 SP Kapazität. Ohne Jonas sind es realistisch nur noch 10 SP. Der Product Owner drängt: „Wir sollten die Planung trotzdem voll durchziehen – Jonas kommt bestimmt nächste Woche zurück."',
    type: 'choice',
    options: [
      {
        id: 'option-ignore-absence',
        label: 'Planung trotzdem mit 15 SP durchführen – Jonas kommt sicher zurück',
        consequence:
          'Jonas bleibt krank. Das Team übernimmt seine Stories, gerät in Überarbeitung. Zwei Stories bleiben halb-fertig. Sprint 2 endet wie Sprint 1: unvollständig.',
        stateChanges: {
          velocity: -3,
          teamMorale: -2,
          ceoRelation: -1,
          technicalDebt: 1,
          backlogHealth: -1,
        },
      },
      {
        id: 'option-adapt-capacity',
        label: 'Kapazität anpassen – Sprint mit 10 SP planen',
        consequence:
          'Das Team plant realistisch. Weniger Stories, aber alle fertig. Das Inkrement ist vollständig. Das Team ist nicht überlastet. Jonas\' Rückkehr in Sprint 3 kann direkt eingeplant werden.',
        stateChanges: {
          velocity: 0,
          teamMorale: 1,
          ceoRelation: 0,
          technicalDebt: 0,
          backlogHealth: 0,
        },
      },
    ],
    ahaMessage:
      'Velocity ist eine Messgröße für tatsächliche Kapazität – nicht für Wunschkapazität. Wenn ein Teammitglied fehlt, sinkt die Kapazität real. Das Sprint Planning muss diese Realität abbilden. Wer so plant, als ob alle da wären, setzt das Team unter Druck und wiederholt den Fehler des Overcommitments – diesmal nicht aus Ehrgeiz, sondern aus falscher Hoffnung.',
  },

  {
    id: 'negative-stakeholder-report',
    title: 'Stakeholder-Bericht fällt negativ aus – kurz vor dem Review',
    trigger: {
      sprint: 1,
      phase: 'review',
    },
    description:
      'Kurz vor dem Sprint 1 Review trifft ein Bericht des Sicherheitsbeauftragten ein. Er hat das bisherige Inkrement intern bewertet und ist nicht zufrieden: „Das Schloss entsperrt per Bluetooth – aber was passiert bei einem schwachen Signal? Und: Es gibt keine Fehlermeldung bei falscher PIN-Eingabe. Das sind sicherheitskritische Lücken. Ich kann dieses Produkt intern nicht weiterempfehlen." Der CEO hat den Bericht bereits gesehen.',
    type: 'choice',
    options: [
      {
        id: 'option-defensive',
        label: 'Das Feedback abwehren – das war im Sprint nicht eingeplant',
        consequence:
          'Der Sicherheitsbeauftragte fühlt sich nicht ernst genommen. Der CEO hat Bedenken. Im nächsten Sprint wird das Thema eskalieren und dann unter mehr Druck stehen.',
        stateChanges: {
          velocity: 0,
          teamMorale: 0,
          ceoRelation: -2,
          technicalDebt: 1,
          backlogHealth: -1,
        },
      },
      {
        id: 'option-absorb-feedback',
        label: 'Feedback aufnehmen und transparent kommunizieren',
        consequence:
          'Das Feedback wird ins Backlog aufgenommen und für Sprint 2 priorisiert. Der Sicherheitsbeauftragte und der CEO erleben: Das Team reagiert professionell. Das Vertrauen steigt trotz der Kritik.',
        stateChanges: {
          velocity: 0,
          teamMorale: 1,
          ceoRelation: 1,
          technicalDebt: 0,
          backlogHealth: 1,
        },
      },
    ],
    ahaMessage:
      'Negatives Stakeholder-Feedback kurz vor dem Review ist unangenehm – aber wertvoll. Der Sprint Review ist genau der Moment, an dem solche Rückmeldungen in das System fließen sollen. Ein defensiver Umgang verschiebt das Problem nur in den nächsten Sprint – mit mehr Druck und weniger Vertrauen. Transparenz und professionelle Aufnahme von Feedback stärken die Stakeholder-Beziehung langfristig.',
  },
];
