const { sequelize, testConnection } = require('../config/database');
const { User, Scenario, UserAnswer, Document } = require('../models');
const bcrypt = require('bcryptjs');

// Fallstudie "Smartes Fahrradschloss" — VeloTech GmbH
// Alle Spieler durchlaufen alle 4 Phasen: Product Owner → Scrum Master → Developer → Kanban
const initialScenarios = [

  // ─── PHASE 1: PRODUCT OWNER ─────────────────────────────────────────────────

  {
    phase: 'product_owner',
    type: 'quiz',
    title: 'Die Hauptverantwortung des Product Owners',
    description: 'Du bist neu als Product Owner bei der VeloTech GmbH und arbeitest am Smart Lock Projekt. Dein Team fragt dich beim ersten Sprint Planning: "Was ist eigentlich deine wichtigste Aufgabe?"',
    options: [
      { id: 1, text: 'Den Entwicklern erklären, wie sie ihren Code schreiben sollen', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das ist nicht die Aufgabe des PO. Technische Entscheidungen trifft das Entwicklerteam selbst — der PO fokussiert sich auf das WAS, nicht das WIE.' },
      { id: 2, text: 'Den Wert des Produkts maximieren und das Product Backlog managen', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Der Product Owner ist verantwortlich für den maximalen Produktwert. Er pflegt das Product Backlog, priorisiert nach Geschäftswert und ist die Schnittstelle zu den Stakeholdern.' },
      { id: 3, text: 'Die Daily Scrums moderieren und das Team koordinieren', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Daily Scrums moderiert der Scrum Master, nicht der PO. Der PO kann teilnehmen, ist aber kein Pflichtbeteiligter — außer das Team bittet ihn darum.' },
      { id: 4, text: 'Die Sprint-Dauer festlegen und das Projektbudget verwalten', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Die Sprint-Dauer wird im Team gemeinsam festgelegt. Budgetverwaltung ist keine Scrum-Rolle — das Scrum-Team fokussiert sich auf Produktwert und Lieferung.' }
    ],
    difficulty: 'easy'
  },

  {
    phase: 'product_owner',
    type: 'quiz',
    title: 'INVEST-Kriterien: Was bedeutet "Negotiable"?',
    description: 'Bei der User Story "Als Radfahrer möchte ich das Smart Lock per Fingerabdruck öffnen" diskutiert das Team die INVEST-Kriterien. Ein Entwickler fragt: "Was bedeutet eigentlich Negotiable?"',
    options: [
      { id: 1, text: 'Die Story darf nachverhandelt werden — sie ist kein starrer Vertrag', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Negotiable bedeutet, dass User Stories kein fixer Vertrag sind. Details, Umsetzung und Umfang können und sollen im Dialog zwischen PO und Team angepasst werden — das fördert kollaborative Lösungsfindung.' },
      { id: 2, text: 'Die Story muss sofort im nächsten Sprint umgesetzt werden', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das beschreibt keine INVEST-Eigenschaft. Negotiable bedeutet Verhandelbarkeit — die Story ist ein Gesprächsstarter, kein Pflichtenheft-Eintrag.' },
      { id: 3, text: 'Der PO kann die Story jederzeit ohne Teamabstimmung löschen', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Falsch — Negotiable bezieht sich auf die gemeinsame Aushandlung von Details, nicht auf einseitige Entscheidungen des PO.' },
      { id: 4, text: 'Die Story braucht keine Akzeptanzkriterien', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Akzeptanzkriterien sind gerade bei User Stories wichtig (INVEST: Testable). Negotiable beschreibt nur, dass Details verhandelbar bleiben.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'product_owner',
    type: 'quiz',
    title: 'Wer priorisiert das Product Backlog?',
    description: 'Im Sprint Planning des Smart Lock Teams entsteht eine Diskussion: Im Backlog liegen Bluetooth-Entsperrung, GPS-Tracking und Diebstahlalarm. Alle wollen mitreden. Wer hat das letzte Wort?',
    options: [
      { id: 1, text: 'Das Entwicklungsteam, weil es die technische Komplexität am besten kennt', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das Team schätzt Aufwand und Komplexität, aber die Priorisierung nach Geschäftswert ist allein Sache des Product Owners.' },
      { id: 2, text: 'Der Scrum Master, um Konflikte zwischen PO und Team zu vermeiden', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Der Scrum Master coacht den Prozess, entscheidet aber nicht über Produktinhalte. Das würde seine Rolle überschreiten.' },
      { id: 3, text: 'Der Product Owner allein — das ist seine Kernverantwortung', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Die Priorisierung des Product Backlogs ist die exklusive Verantwortung des Product Owners. Er hört zwar auf Stakeholder und Team, die finale Entscheidung liegt aber beim PO.' },
      { id: 4, text: 'Stakeholder und PO gemeinsam im Konsens-Voting', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Stakeholder-Input ist wertvoll, aber der PO ist nicht verpflichtet, im Konsens zu entscheiden. Er trägt die Verantwortung für den Produktwert.' }
    ],
    difficulty: 'easy'
  },

  {
    phase: 'product_owner',
    type: 'scenario',
    title: 'Sprint Planning: Zu viele Stories, zu wenig Kapazität',
    description: 'Sprint Planning bei VeloTech. Das Team hat Kapazität für genau 2 Stories (je 8 Story Points). Im Backlog liegen: (1) Bluetooth-Entsperrung — Kernfunktion, ohne die das Produkt nicht nutzbar ist. (2) GPS-Tracking — praktisch, aber kein Must-Have für den Launch. (3) Diebstahlalarm — wichtig für die Sicherheit des Produkts. Dein Hauptstakeholder besteht darauf, alle drei in diesem Sprint zu haben.',
    options: [
      { id: 1, text: 'Alle 3 Stories in den Sprint aufnehmen — der Stakeholder ist wichtig', isCorrect: false, scoreChange: -15, motivationChange: -10, feedback: 'Falsche Entscheidung. Mehr Stories als Kapazität führt dazu, dass keine fertig wird. Das Team überlastet sich, die DoD wird nicht erfüllt, und am Sprint-Ende gibt es nichts Lieferbares. Das untergräbt das Vertrauen der Stakeholder dauerhaft mehr als eine klare Priorisierung.' },
      { id: 2, text: 'Bluetooth-Entsperrung + Diebstahlalarm priorisieren — Kernwert und Sicherheit zuerst', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Exzellente Entscheidung! Als PO priorisierst du nach Business Value und Risiko. Ohne Bluetooth-Entsperrung ist das Produkt nicht nutzbar — das hat höchste Priorität. Der Diebstahlalarm adressiert ein zentrales Kundenbedürfnis. GPS-Tracking ist wertvoll, aber kein Blocker für Sprint 1.' },
      { id: 3, text: 'Den Stakeholder selbst entscheiden lassen, welche zwei Stories er will', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Als PO gibst du hier deine Kernverantwortung ab. Der Stakeholder kennt die technischen Abhängigkeiten und Kapazitätsgrenzen nicht so gut wie du. Priorisierung ist deine Aufgabe — hole Stakeholder-Input ein, aber triff die Entscheidung selbst.' },
      { id: 4, text: 'Bluetooth-Entsperrung + GPS-Tracking — beides ist sichtbar und macht guten Eindruck', isCorrect: false, scoreChange: 5, motivationChange: 0, feedback: 'Nicht optimal. Sichtbarkeit ist kein Priorisierungskriterium. Der Diebstahlalarm ist für Nutzersicherheit kritischer als GPS-Tracking. Eine gute Priorisierung basiert auf Nutzervalue und Risiko, nicht auf Außenwirkung.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'product_owner',
    type: 'scenario',
    title: 'Sprint Planning: Story ohne Definition of Ready',
    description: 'Sprint Planning, zweiter Sprint. Eine User Story lautet: "Als Radfahrer möchte ich das Schloss per App öffnen." Keine Akzeptanzkriterien definiert, kein Aufwand vom Team geschätzt, technische Abhängigkeiten unklar. Entwicklerin Sara fragt: "Können wir damit loslegen?"',
    options: [
      { id: 1, text: 'Ja — Details klären wir agil während des Sprints, das ist doch der Vorteil von Scrum', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Agil bedeutet nicht "ohne Vorbereitung starten". Unklare Stories führen zu Nacharbeit mitten im Sprint, zu falschen Implementierungen und zu Frust im Team. Die Definition of Ready schützt den Sprint.' },
      { id: 2, text: 'Nein — zuerst Akzeptanzkriterien definieren und die Definition of Ready prüfen', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Richtig! Eine Story ist "Ready", wenn das Team sie verstehen, schätzen und in einem Sprint fertigstellen kann. Akzeptanzkriterien definieren, was "fertig" bedeutet. Das verhindert Missverständnisse und Nacharbeit — und schützt das Sprint-Ziel.' },
      { id: 3, text: 'Nur den technischen Backend-Teil starten, App-Anbindung kommt später', isCorrect: false, scoreChange: 5, motivationChange: 0, feedback: 'Pragmatisch, aber riskant. Ohne klare Akzeptanzkriterien weißt du nicht, ob der Backend-Teil später zum Frontend passt. Halbfertige Stories erzeugen technische Schulden. Besser: Story vollständig vorbereiten.' },
      { id: 4, text: 'Story aufteilen und nur die kleinere Hälfte nehmen', isCorrect: false, scoreChange: 5, motivationChange: 0, feedback: 'Story-Splitting kann sinnvoll sein, aber nur wenn die Teile in sich abgeschlossen und testbar sind. Ohne Akzeptanzkriterien weißt du nicht, wie du sie sinnvoll aufteilen kannst — zuerst Definition of Ready herstellen.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'product_owner',
    type: 'scenario',
    title: 'Stakeholder-Anfrage mitten im Sprint',
    description: 'Tag 5 von 10 im aktuellen Sprint. Das Team arbeitet fokussiert an der Bluetooth-Entsperrung — Sprint-Ziel fast erreicht. Plötzlich ruft Marketing-Leiter Thomas an: "Wir brauchen sofort eine Social-Share-Funktion in der App — Marketingkampagne läuft nächste Woche, das kann viral gehen!" Das Team ist zu 80% ausgelastet.',
    options: [
      { id: 1, text: 'Sofort ins Sprint Backlog aufnehmen — Marketing ist wichtig für das Unternehmen', isCorrect: false, scoreChange: -15, motivationChange: -10, feedback: 'Das gefährdet das Sprint-Ziel und untergräbt die Verlässlichkeit des Teams. Ein Sprint ist ein Commitment — wenn jede Stakeholder-Anfrage den Sprint ändert, verliert das Team die Fähigkeit, sicher zu planen. Das Vertrauen leidet langfristig.' },
      { id: 2, text: 'Feature ins Product Backlog aufnehmen, für Sprint 3 priorisieren und Thomas erklären warum', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Perfekt! Du schützt den laufenden Sprint und sein Commitment, nimmst das Feature dennoch ernst und kommunizierst transparent. Thomas versteht: Das Feature kommt in Sprint 3, gut vorbereitet. Sprint-Integrität ist kein Hindernis — sie ist eine Qualitätszusicherung.' },
      { id: 3, text: 'Den Sprint abbrechen und neu planen mit dem neuen Feature', isCorrect: false, scoreChange: -5, motivationChange: -5, feedback: 'Sprint-Abbrüche sind für Extremfälle reserviert — z.B. wenn das Sprint-Ziel vollständig wertlos geworden ist. Eine neue Marketing-Idee rechtfertigt das nicht. Häufige Abbrüche zerstören die Team-Stabilität.' },
      { id: 4, text: 'Das Team selbst entscheiden lassen, ob sie Kapazität haben', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das Team schützen ist deine Aufgabe als PO. Wenn du die Entscheidung delegierst, unter Druck eine Sprint-Änderung zu akzeptieren, setzt du das Team unfairem Druck aus. Du bist der Puffer zwischen Stakeholdern und Team.' }
    ],
    difficulty: 'hard'
  },

  // ─── PHASE 1: PRODUCT OWNER — Interaktive Textaufgaben ─────────────────────

  {
    phase: 'product_owner',
    type: 'text',
    title: 'Stakeholder-Analyse: Wer hat Einfluss auf das Smart Lock?',
    description: `Du startest als Product Owner bei VeloTech. Bevor du das erste Sprint Planning durchführst, musst du wissen: Wer sind die Stakeholder dieses Projekts?

Deine Aufgabe:
Identifiziere mindestens 4 Stakeholder des VeloTech Smart Lock Projekts. Erkläre für jeden kurz:
• Wer ist diese Person/Gruppe?
• Welches Interesse oder welchen Einfluss haben sie auf das Produkt?

Beispiel-Format:
"1. Endnutzer (Radfahrer): Sie nutzen das Schloss täglich und haben höchstes Interesse an Sicherheit und Benutzerfreundlichkeit."`,
    options: [
      {
        id: 1, text: 'Freitextantwort', isCorrect: false, scoreChange: 0, motivationChange: 0,
        feedback: `Bewertungskriterien: Die Antwort sollte mindestens 4 Stakeholder nennen. Erwartete Stakeholder-Gruppen: (1) Endnutzer/Radfahrer – Sicherheit, Komfort, App-Bedienbarkeit; (2) VeloTech Management / Geschäftsführung – ROI, Marktanteil, Budgeteinhaltung; (3) Entwicklungsteam – technische Machbarkeit, klare Anforderungen; (4) Marketing/Vertrieb – Features für Kampagnen, Launch-Termin; (5) Händler/Distributoren – Verkaufbarkeit, Support-Aufwand; (6) Regulierungsbehörden – Datenschutz (GPS), CE-Zertifizierung. Für jede Stakeholdergruppe sollte Interesse UND Einfluss erklärt werden.`
      }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'product_owner',
    type: 'text',
    title: 'User Story schreiben: Benachrichtigungen bei Diebstahlversuch',
    description: `Das Team wartet auf eine klar formulierte User Story für den Diebstahlalarm. Als Product Owner schreibst du jetzt die User Story nach dem Standard-Format.

Deine Aufgabe:
Schreibe eine vollständige User Story für das Feature "Diebstahlalarm" inkl.:
• Das "Als … möchte ich … damit …"-Format
• Mindestens 3 Akzeptanzkriterien (Was muss erfüllt sein, damit die Story "Done" ist?)

Kontext: Das Smart Lock soll eine Push-Benachrichtigung senden, wenn jemand versucht, das Schloss ohne Autorisierung zu öffnen.`,
    options: [
      {
        id: 1, text: 'Freitextantwort', isCorrect: false, scoreChange: 0, motivationChange: 0,
        feedback: `Bewertungskriterien: Die User Story muss das korrekte Format verwenden ("Als Radfahrer möchte ich ... damit ..."). Es müssen mindestens 3 konkrete, testbare Akzeptanzkriterien vorhanden sein. Beispiel-Akzeptanzkriterien: (1) Push-Benachrichtigung erscheint innerhalb von 5 Sekunden nach Diebstahlversuch; (2) Benachrichtigung enthält Uhrzeit und Standort des Vorfalls; (3) Nutzer kann in der App den Alarm-Verlauf einsehen; (4) Bei ausgeschalteten Push-Benachrichtigungen gibt es einen In-App-Hinweis. Die Kriterien müssen spezifisch, messbar und testbar sein – keine vagen Aussagen wie "funktioniert gut".`
      }
    ],
    difficulty: 'hard'
  },

  // ─── PHASE 2: SCRUM MASTER ──────────────────────────────────────────────────

  {
    phase: 'scrum_master',
    type: 'quiz',
    title: 'Ziel des Daily Scrums',
    description: 'Du bist jetzt Scrum Master des Smart Lock Teams. Beim ersten Daily Scrum fragt Entwickler Max: "Was ist eigentlich der Zweck dieses 15-Minuten-Meetings?"',
    options: [
      { id: 1, text: 'Den Fortschritt an den Product Owner oder das Management reporten', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das Daily Scrum ist kein Status-Report-Meeting für externe Stakeholder. Es gehört dem Entwicklungsteam. Externe Berichte würden das Team abhängig von Kontrolle machen — das widerspricht der Selbstorganisation.' },
      { id: 2, text: 'Das Team synchronisieren und den Plan für die nächsten 24 Stunden anpassen', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Das Daily Scrum dient der Synchronisation des Teams. Jeder teilt, was er getan hat, was er vorhat und was ihn blockiert — damit das Team kollektiv den Sprint-Plan anpassen kann. 15 Minuten, nur für das Team.' },
      { id: 3, text: 'Neue User Stories ins Sprint Backlog aufnehmen und Prioritäten neu setzen', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Sprint Backlog-Änderungen gehören nicht ins Daily Scrum. Neue Stories oder Prioritätsänderungen werden im Sprint Planning oder in einem separaten Gespräch mit dem PO geklärt.' },
      { id: 4, text: 'Impediments so lange besprechen, bis sie gelöst sind', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Impediments werden im Daily Scrum nur identifiziert, nicht gelöst. Die Lösung passiert danach — in einem separaten Gespräch, oft koordiniert vom Scrum Master. Das hält die 15-Minuten-Timebox ein.' }
    ],
    difficulty: 'easy'
  },

  {
    phase: 'scrum_master',
    type: 'quiz',
    title: 'Was ist ein Impediment?',
    description: 'Im Daily Scrum sagt Entwicklerin Sara: "Ich komme seit 2 Tagen nicht weiter — ich warte auf Zugriff auf den Test-Server." Als Scrum Master erkennst du sofort: Das ist ein Impediment. Was bedeutet das?',
    options: [
      { id: 1, text: 'Ein technischer Bug im Code, den das Team selbst lösen muss', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Bugs sind technische Probleme, die das Team selbst löst. Ein Impediment ist ein externes Hindernis, das das Team nicht selbst überwinden kann und das den Scrum Master erfordert.' },
      { id: 2, text: 'Ein Hindernis, das das Team blockiert und das der SM aktiv beseitigen soll', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Impediment Removal ist eine Kernaufgabe des Scrum Masters. Er schützt das Team vor externen Blockaden — IT-Zugänge, organisatorische Hürden, fehlende Ressourcen. Der SM handelt, damit das Team fließend arbeiten kann.' },
      { id: 3, text: 'Ein negatives Ergebnis aus dem Sprint Review', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Sprint Review-Ergebnisse sind Feedback, keine Impediments. Ein Impediment blockiert die aktuelle Arbeit — es ist ein Hindernis auf dem Weg zum Sprint-Ziel.' },
      { id: 4, text: 'Eine schlecht geschriebene User Story, die umgeschrieben werden muss', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Schlechte User Stories sind ein Product-Backlog-Qualitätsproblem — Verantwortung des PO. Impediments sind externe Blocker, die das Team daran hindern, zu liefern.' }
    ],
    difficulty: 'easy'
  },

  {
    phase: 'scrum_master',
    type: 'quiz',
    title: 'Die Rolle des Scrum Masters: Servant Leader',
    description: 'Ein neuer Stakeholder fragt dich bei einem Kennenlern-Gespräch: "Du bist Scrum Master — also der Chef des Teams? Du sagst denen, was sie wann machen müssen?"',
    options: [
      { id: 1, text: 'Ja, ich koordiniere das Team, verteile Aufgaben und stelle sicher, dass der Plan eingehalten wird', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'Das wäre ein klassischer Projektmanager, kein Scrum Master. Der SM ist kein Vorgesetzter — er coacht, facilitiert und schützt den Prozess. Das Team organisiert sich selbst.' },
      { id: 2, text: 'Nein — ich bin Servant Leader: Ich coache, entferne Hindernisse und schütze den Scrum-Prozess', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Genau! Der Scrum Master dient dem Team, dem PO und der Organisation. Er hat keine Weisungsbefugnis. Seine Wirkung kommt durch Coaching, Facilitation und das Schaffen optimaler Arbeitsbedingungen — nicht durch Kontrolle.' },
      { id: 3, text: 'Ich entscheide, welche Stories in den Sprint kommen und wie sie priorisiert werden', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'Das ist die Aufgabe des Product Owners. Der SM greift nicht in Produktentscheidungen ein — das würde seine Neutralität als Prozess-Coach gefährden.' },
      { id: 4, text: 'Ich bin für die technische Architektur und Code-Qualität des Teams verantwortlich', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Technische Entscheidungen trifft das Entwicklungsteam. Der SM coacht den Prozess, nicht die Technik.' }
    ],
    difficulty: 'easy'
  },

  {
    phase: 'scrum_master',
    type: 'scenario',
    title: 'Impediment: Entwicklerin wartet auf Server-Zugang',
    description: 'Daily Scrum, Tag 3 des zweiten Sprints. Entwicklerin Sara sagt: "Ich warte seit 3 Tagen auf den Zugang zum Test-Server der IT-Abteilung. Ohne Tests kann ich die Bluetooth-Entsperrung nicht als \'Done\' markieren." Sprint-Ende ist in 7 Tagen. Das Sprint-Ziel hängt direkt an dieser Story.',
    options: [
      { id: 1, text: '"Sara, ruf die IT selbst nochmal an — du kennst die ja besser als ich"', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Impediment Removal ist deine Aufgabe als SM, nicht Saras. Wenn du es an sie delegierst, gibst du deine Kernverantwortung ab. Sara hat bereits versucht, das Problem zu lösen — jetzt bist du dran.' },
      { id: 2, text: 'Sofort nach dem Daily die IT-Leitung kontaktieren und Server-Zugang bis heute Mittag eskalieren', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Genau so! Du handelst sofort, eskalierst auf der richtigen Ebene und gibst Sara ein konkretes Commitment: "Bis 12 Uhr hast du Zugang." Das ist Servant Leadership in Aktion — du beseitigst das Hindernis, damit das Team fließend arbeiten kann.' },
      { id: 3, text: 'Die Story aus dem Sprint nehmen — wenn die IT nicht kooperiert, können wir nichts machen', isCorrect: false, scoreChange: -5, motivationChange: -5, feedback: 'Zu früh aufgegeben! Das Impediment hast du noch gar nicht versucht zu lösen. Story entfernen ist ein letztes Mittel, nicht der erste Schritt. Versuch zuerst aktiv zu eskalieren.' },
      { id: 4, text: 'Den PO informieren und warten, dass er mit der IT-Abteilung spricht', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Zu passiv. Impediments zu beseitigen ist deine Aufgabe. Den PO einzubeziehen kann sinnvoll sein, aber als parallele Maßnahme — nicht als Ersatz für dein eigenes Handeln.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'scrum_master',
    type: 'scenario',
    title: 'Retrospektive: Negative Stimmung, keine Lösungsvorschläge',
    description: 'Retrospektive nach Sprint 2. Das Smart Lock Team ist frustriert. Alle reden durcheinander: "Immer zu viel Druck", "Anforderungen ändern sich ständig", "Die Meetings nerven". Stimmung: angespannt und demotiviert. Niemand macht konkrete Verbesserungsvorschläge. Was tust du als Scrum Master?',
    options: [
      { id: 1, text: 'Retro nach 20 Minuten beenden — das Team braucht einfach eine Pause', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'Abbrechen verhindert Inspect & Adapt — den Kernmechanismus von Scrum. Die Probleme bleiben ungelöst, der nächste Sprint läuft genauso. Deine Aufgabe ist es, dem Team zu helfen, konstruktiv zu werden — nicht die Situation zu vermeiden.' },
      { id: 2, text: 'Start-Stop-Continue-Methode einführen und auf konkrete, umsetzbare Actions bestehen', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Perfekte Facilitation! Start-Stop-Continue gibt der Frustration Struktur: Was sollen wir anfangen? Was aufhören? Was beibehalten? Durch das Bestehen auf konkreten Actions (wer macht was bis wann?) verwandelst du Kritik in Verbesserungen. Das ist der Zweck der Retrospektive.' },
      { id: 3, text: 'Den Product Owner zur Retro einladen, damit er die Team-Perspektive direkt hört', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'Die Retrospektive gehört dem Scrum Team — also Developers und SM, ohne PO (außer das Team lädt ihn explizit ein). Mit dem PO anwesend sprechen Entwickler nicht offen über Probleme, die den PO betreffen. Das zerstört den psychologischen Sicherheitsraum der Retro.' },
      { id: 4, text: 'Alle Kritikpunkte dokumentieren und beim nächsten Sprint Planning ansprechen', isCorrect: false, motivationChange: -5, scoreChange: -10, feedback: 'Probleme zu verschieben löst sie nicht. Die Retrospektive ist der richtige Moment für Teamreflexion — nicht das Sprint Planning, das für die Produktplanung reserviert ist. Außerdem verliert das Team das Vertrauen in dich, wenn du Probleme vertrödelst.' }
    ],
    difficulty: 'hard'
  },

  {
    phase: 'scrum_master',
    type: 'scenario',
    title: 'PO gibt Entwicklern direkte Arbeitsanweisungen',
    description: 'Entwickler Max schreibt dir: "Ich brauche kurz deine Meinung — der PO hat mir gerade direkt geschrieben: \'Max, mach heute noch die Login-Funktion fertig, die brauche ich dringend.\' Aber die ist gar nicht in unserem Sprint Backlog. Was soll ich tun?"',
    options: [
      { id: 1, text: 'Max soll dem PO gehorchen — der PO ist der Produktverantwortliche und hat das letzte Wort', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'Nein. Der PO hat das letzte Wort über das Product Backlog, aber nicht über die tägliche Arbeit des Teams. Wenn Entwickler direkte Anweisungen außerhalb des Sprint Backlogs befolgen, bricht das Sprint-Commitment und die Selbstorganisation des Teams zusammen.' },
      { id: 2, text: 'Mit dem PO sprechen: Aufgaben kommen aus dem Sprint Backlog, nicht als direkte Anweisungen', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Genau deine Aufgabe! Du schützt das Team und klärst Rollen. Das Sprint Backlog ist das einzige Commitment des Teams für diesen Sprint — externe Aufgaben laufen über den PO ins Backlog, nicht direkt an Entwickler. Du coachst den PO und schützt Max gleichzeitig.' },
      { id: 3, text: 'Die Login-Story sofort ins Sprint Backlog aufnehmen, damit alles seine Ordnung hat', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Ohne Kapazitätsprüfung und Absprache mit dem Team das Sprint Backlog zu ändern untergräbt das Sprint-Commitment. Jede Sprint-Änderung braucht eine bewusste Team-Entscheidung — nicht eine spontane SM-Anpassung.' },
      { id: 4, text: 'Max sagen, er soll das selbst mit dem PO klären', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Max hat dich gefragt, weil er unsicher ist — das zeigt Vertrauen in dich als SM. Ihn allein mit dem PO-Konflikt zu lassen ist keine Servant-Leadership. Das Klären von Rollenkonflikten ist genau deine Aufgabe.' }
    ],
    difficulty: 'medium'
  },

  // ─── PHASE 3: DEVELOPER ─────────────────────────────────────────────────────

  {
    phase: 'developer',
    type: 'quiz',
    title: 'Was ist die Definition of Done?',
    description: 'Du bist jetzt Entwickler im Smart Lock Team. Im ersten Sprint Planning fragt ein neues Teammitglied: "Wann ist eine User Story eigentlich wirklich \'fertig\'? Reicht es, wenn der Code funktioniert?"',
    options: [
      { id: 1, text: 'Ja — wenn der Entwickler sagt, dass es fertig ist und keine offensichtlichen Bugs gibt', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Nein. "Es funktioniert auf meinem Rechner" ist kein valides Fertig-Kriterium. Die DoD existiert genau deshalb — um subjektive Einschätzungen durch objektive Qualitätsstandards zu ersetzen.' },
      { id: 2, text: 'Wenn Code funktioniert, getestet ist und alle vereinbarten Qualitätskriterien des Teams erfüllt sind', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Die Definition of Done ist eine gemeinsame Qualitätsdefinition des Teams. Typisch: Code Review durchgeführt, Unit Tests geschrieben und grün, auf Testumgebung deployed, Akzeptanzkriterien der Story erfüllt. Sie verhindert technische Schulden.' },
      { id: 3, text: 'Wenn der Product Owner die Story im Sprint Review abgenommen hat', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Die DoD prüft das Team selbst während des Sprints — nicht erst im Sprint Review. Im Sprint Review wird die fertige Arbeit präsentiert, aber "fertig" entscheidet das Team anhand der DoD.' },
      { id: 4, text: 'Wenn keine bekannten Bugs mehr im Code sind', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Bug-Freiheit ist ein Teil der DoD, aber nicht die vollständige Definition. Code Review, Tests, Deployment, Akzeptanzkriterien-Erfüllung — all das gehört zur DoD.' }
    ],
    difficulty: 'easy'
  },

  {
    phase: 'developer',
    type: 'quiz',
    title: 'Nicht fertige Stories am Sprint-Ende',
    description: 'Sprint-Ende beim Smart Lock Projekt. Die Story "GPS-Tracking" ist zu etwa 80% fertig — der Code läuft, aber Tests fehlen noch. Was passiert mit dieser Story?',
    options: [
      { id: 1, text: 'Sie wird als 80% fertig gewertet und anteilig zur Velocity gezählt', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'In Scrum gibt es kein "halb fertig". Eine Story ist entweder Done oder nicht Done. 80% zählen als 0% — die Velocity-Berechnung basiert nur auf vollständig abgeschlossenen Stories. Das klingt hart, verhindert aber geschönte Fortschrittsberichte.' },
      { id: 2, text: 'Sie kommt zurück ins Product Backlog und der PO entscheidet über die Repriorisierung', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Unfertige Stories werden nicht automatisch in den nächsten Sprint gezogen. Sie gehen zurück ins Product Backlog und der PO priorisiert sie neu — vielleicht kommen sie sofort wieder rein, vielleicht auch nicht. Das erhält die Transparenz.' },
      { id: 3, text: 'Sie wird automatisch in den nächsten Sprint übernommen', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Automatische Übernahme würde den Sprint-Planungsprozess und die PO-Priorisierung umgehen. Der PO muss bewusst entscheiden, ob die Story im nächsten Sprint dieselbe Priorität hat.' },
      { id: 4, text: 'Das Team arbeitet nach Sprint-Ende weiter daran, bis sie fertig ist', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Nach dem Sprint-Ende beginnt ein neuer Sprint — mit neuem Planning und neuen Commitments. Weitermachen über Sprint-Grenzen hinweg unterhöhlt die Sprint-Struktur und macht Sprint Planning bedeutungslos.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'developer',
    type: 'quiz',
    title: 'Was messen Story Points?',
    description: 'Im Sprint Planning diskutiert das Smart Lock Team über die Schätzung der "Diebstahlalarm"-Story. Teammitglied Jonas fragt: "Warum schätzen wir in Story Points und nicht einfach in Stunden? Das wäre doch konkreter."',
    options: [
      { id: 1, text: 'Story Points messen den Zeitaufwand in Stunden — nur abstrakter formuliert', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Nein. Story Points sind bewusst keine Stunden. Zeit ist zu stark personenabhängig — eine Aufgabe dauert für einen Senior 2 Stunden, für einen Junior 8. Story Points messen relative Komplexität, unabhängig von der Person.' },
      { id: 2, text: 'Story Points messen relativen Aufwand, Komplexität und Unsicherheit — nicht den Zeitaufwand', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! Story Points sind eine relative Einheit. "Diese Story ist doppelt so komplex wie jene." Sie berücksichtigen Aufwand, Komplexität und Unbekanntes. Das macht Teams im Schätzen konsistenter und schützt vor zu optimistischen Zeitplänen.' },
      { id: 3, text: 'Story Points messen die Qualität der User Story — gut formulierte Stories bekommen mehr Punkte', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Falsch. Story Points bewerten die Implementierungskomplexität, nicht die Story-Qualität. Eine gut formulierte einfache Story bekommt wenige Punkte, eine komplex zu implementierende Story viele.' },
      { id: 4, text: 'Story Points geben an, wie viele Entwickler an der Story arbeiten müssen', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Falsch. Story Points haben nichts mit der Anzahl der Personen zu tun. Sie messen die Gesamtkomplexität der Story, unabhängig von der Teambesetzung.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'developer',
    type: 'scenario',
    title: 'Definition of Done: Feature fertig — aber Tests fehlen',
    description: 'Tag 9 von 10. Du hast die Bluetooth-Entsperrung vollständig implementiert und sie funktioniert auf deinem Rechner einwandfrei. Die Definition of Done eures Teams lautet: Code Review abgeschlossen, Unit Tests vorhanden und grün, auf Testumgebung deployed. Code Review ist done. Tests fehlen noch. Morgen ist Sprint Review.',
    options: [
      { id: 1, text: 'Als "Done" markieren — es funktioniert einwandfrei, Tests kommen im nächsten Sprint', isCorrect: false, scoreChange: -20, motivationChange: -10, feedback: 'Das wäre ein schwerwiegender Fehler. "Es funktioniert auf meinem Rechner" ist explizit kein Done-Kriterium. Tests verschieben erzeugt technische Schulden und ein falsches Sicherheitsgefühl. Beim nächsten Sprint Planning wird bereits auf diesem "fertigen" Code aufgebaut — ohne Sicherheitsnetz.' },
      { id: 2, text: 'Story auf "In Progress" lassen und die Tests heute noch fertigstellen', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Richtig! Die DoD ist nicht verhandelbar. Du hast noch einen Tag — nutze ihn für die Tests. Lieber eine Story "nicht Done" als eine Story mit falschen Done-Markierung. Transparenz über den echten Status ist ein Scrum-Kernwert.' },
      { id: 3, text: 'Die DoD für diese Story ausnahmsweise anpassen — es ist ja nur einmal', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: '"Nur einmal" wird zur Gewohnheit. Eine DoD, die bei Bedarf angepasst wird, ist keine DoD mehr. Sie verliert ihre Schutzfunktion. Wenn die DoD dauerhaft zu streng ist, ändert sie das Team gemeinsam in der Retrospektive — aber nie ad-hoc für eine Story.' },
      { id: 4, text: 'Story für den nächsten Sprint vormerken und im Review transparent kommunizieren', isCorrect: false, scoreChange: 5, motivationChange: 0, feedback: 'Transparenz ist gut — aber du hast noch heute Zeit! Zuerst alles versuchen, um die Tests zu schreiben. Wenn das wirklich nicht gelingt, ist diese Option okay. Aber aufzugeben ohne es zu versuchen wäre nicht optimal.' }
    ],
    difficulty: 'hard'
  },

  {
    phase: 'developer',
    type: 'scenario',
    title: 'Scope Creep: Die "5-Minuten-Änderung"',
    description: 'Tag 6 von 10. Du arbeitest konzentriert an der Diebstahlalarm-Funktion. Der PO schreibt dir direkt: "Hey, kannst du kurz das App-Icon austauschen? Neue CI-Richtlinien von Marketing. Dauert doch nur 5 Minuten." Du weißt aus Erfahrung: Solche Kleinigkeiten kosten meistens 45-60 Minuten inklusive Abstimmung, Testing und Deployment.',
    options: [
      { id: 1, text: 'Sofort erledigen — der PO will es, und 5 Minuten sind vertretbar', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das klingt harmlos, ist es aber nicht. Jede nicht geplante Aufgabe stört den Flow und gefährdet das Sprint-Ziel. Wenn du jetzt einwilligst, signalisierst du: "Sprint Backlog ist verhandelbar." Das öffnet die Tür für immer mehr solche Anfragen.' },
      { id: 2, text: 'Ablehnen: Sprint Backlog ist fixiert, Item für den nächsten Sprint ins Backlog vorschlagen', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Richtig! Du schützt dein Sprint-Commitment und kommunizierst klar: Das Icon-Update kommt ins Product Backlog, du informierst den SM. Das ist keine Sturheit — das ist professionelle Selbstorganisation. Der PO kann die Priorität dann für Sprint 3 setzen.' },
      { id: 3, text: 'Den Scrum Master fragen, ob du das machen sollst', isCorrect: false, scoreChange: 10, motivationChange: 2, feedback: 'Gut, dass du den SM einbeziehst — als Entwickler hast du aber das Recht, Sprint-Änderungen direkt abzulehnen. Das ist Selbstorganisation. Den SM informieren ist sinnvoll, aber du brauchst keine Erlaubnis, um das Sprint-Backlog zu schützen.' },
      { id: 4, text: 'PO ignorieren und nicht antworten', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Ignorieren ist keine Kommunikation. Das erzeugt Frustration beim PO und löst das Problem nicht. Eine klare, freundliche Ablehnung mit Verweis auf das Sprint-Commitment ist viel professioneller.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'developer',
    type: 'scenario',
    title: 'Sprint-Ziel in Gefahr: Transparenz oder Schweigen?',
    description: 'Tag 8 von 10. Im Team-Check erkennt ihr: Von 5 geplanten Stories werden nur 3 fertig. Das Sprint-Ziel — "Nutzer können das Smart Lock über die App entsperren" — ist noch erreichbar, wenn ihr die letzten 2 Tage fokussiert auf die kritischen Stories investiert und die anderen 2 ins Backlog zurückgebt. Was tust du?',
    options: [
      { id: 1, text: 'Nichts sagen und am letzten Tag alles halbfertig präsentieren', isCorrect: false, scoreChange: -20, motivationChange: -10, feedback: 'Das wäre ein gravierender Transparenzverstoß. Halbfertige Arbeit zu präsentieren als wäre sie fertig untergräbt das Vertrauen des PO und der Stakeholder. Scrum-Wert Nr. 1 ist Mut — auch der Mut, schlechte Nachrichten früh zu kommunizieren.' },
      { id: 2, text: 'SM und PO sofort informieren, Sprint-Ziel retten, 2 Stories transparent zurück ins Backlog', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Exzellent! Das ist Transparenz und Inspect & Adapt in Aktion. Frühes Kommunizieren ermöglicht bewusste Entscheidungen: Sprint-Ziel retten oder Stories neu priorisieren. Das Vertrauen des PO in dich wächst, wenn du ehrlich und früh kommunizierst — nicht wenn du überlieferst.' },
      { id: 3, text: 'Überstunden machen um alle 5 Stories zu schaffen', isCorrect: false, scoreChange: -10, motivationChange: -8, feedback: 'Überstunden lösen das Problem einmal, schaffen aber falsche Erwartungen für die Zukunft. Scrum basiert auf nachhaltiger Entwicklungsgeschwindigkeit. Eine unrealistische Velocity durch Überstunden macht die Velocity-Planung für alle zukünftigen Sprints falsch.' },
      { id: 4, text: 'Den Sprint abbrechen — das Sprint-Ziel ist nicht mehr erreichbar', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das Sprint-Ziel ist noch erreichbar — mit 3 von 5 Stories. Ein Abbruch wäre überreagiert und falsch. Sprint-Abbrüche sind für Fälle reserviert, in denen das Sprint-Ziel vollständig wertlos geworden ist.' }
    ],
    difficulty: 'hard'
  },

  // ─── PHASE 3: DEVELOPER — Interaktive Textaufgaben ──────────────────────────

  {
    phase: 'developer',
    type: 'text',
    title: 'Definition of Done erstellen',
    description: `Das Smart Lock Entwicklungsteam braucht eine gemeinsame Definition of Done (DoD) — bevor der erste Sprint startet.

Deine Aufgabe:
Erstelle eine praxistaugliche Definition of Done für das VeloTech Smart Lock Projekt. Die DoD sollte:
• Mindestens 5 konkrete Kriterien enthalten
• Für jedes Kriterium kurz begründen, warum es wichtig ist

Kontext: Das Team entwickelt eine mobile App (iOS/Android) + eingebettete Software für das Schloss-Hardware. Das Produkt muss sicher, getestet und deploybar sein.`,
    options: [
      {
        id: 1, text: 'Freitextantwort', isCorrect: false, scoreChange: 0, motivationChange: 0,
        feedback: `Bewertungskriterien: Die DoD muss mindestens 5 konkrete, für das Projekt passende Kriterien enthalten. Erwartete Kriterien: (1) Code Review von mindestens einem weiteren Entwickler durchgeführt; (2) Unit Tests geschrieben, alle grün (Testabdeckung > 70%); (3) Integration Tests für API-Schnittstellen bestanden; (4) Keine kritischen Security-Findings (besonders wichtig bei App + Bluetooth/GPS); (5) Feature auf Testumgebung deployed und verifiziert; (6) Akzeptanzkriterien der User Story vollständig erfüllt; (7) Dokumentation aktualisiert (API-Docs, README); (8) Keine bekannten kritischen Bugs offen. Jedes Kriterium sollte klar testbar und objektiv nachprüfbar sein.`
      }
    ],
    difficulty: 'hard'
  },

  {
    phase: 'developer',
    type: 'text',
    title: 'Task-Breakdown: Bluetooth-Entsperrung implementieren',
    description: `Im Sprint Planning muss das Team die User Story "Als Radfahrer möchte ich das Smart Lock per Bluetooth öffnen, damit ich keinen Schlüssel brauche" (8 Story Points) in konkrete Tasks aufteilen.

Deine Aufgabe als Entwickler:
Erstelle einen Task-Breakdown für diese User Story. Zerlege sie in 4-7 konkrete, umsetzbare Einzelaufgaben. Schätze für jeden Task die benötigte Zeit in Stunden (realistisch für einen Entwickler).

Bedenke: Das System besteht aus App (React Native), Backend (Node.js) und Schloss-Firmware (Embedded C).`,
    options: [
      {
        id: 1, text: 'Freitextantwort', isCorrect: false, scoreChange: 0, motivationChange: 0,
        feedback: `Bewertungskriterien: Der Breakdown muss 4-7 Tasks enthalten, die zusammen alle Schichten des Systems abdecken. Erwartete Tasks: (1) Bluetooth-Protokoll recherchieren und Technologie wählen (BLE) – 2h; (2) Firmware: BLE-Advertising und Pairing-Logik im Schloss implementieren – 6h; (3) App: Bluetooth-Scanner und Verbindungsmanagement implementieren – 4h; (4) App: Autorisierungs-Logik (welche Geräte dürfen entsperren?) – 3h; (5) Backend: API-Endpoint für Geräteverwaltung – 3h; (6) End-to-End-Test: App öffnet Schloss via BLE – 2h; (7) Edge Cases: Reichweite, Verbindungsabbruch, mehrere Geräte – 2h. Wichtig: Tasks müssen spezifisch und selbstständig durchführbar sein – keine vagen "App entwickeln"-Einträge.`
      }
    ],
    difficulty: 'hard'
  },

  // ─── PHASE 2: SCRUM MASTER — Interaktive Textaufgabe ────────────────────────

  {
    phase: 'scrum_master',
    type: 'text',
    title: 'Sprint-Ziel formulieren: Sprint 1 bei VeloTech',
    description: `Sprint Planning für Sprint 1. Das Smart Lock Team hat sich auf folgende User Stories geeinigt:
• Bluetooth-Entsperrung (8 SP) – Kernfunktion
• Login & Registrierung (5 SP) – Voraussetzung
• Push-Benachrichtigungen bei Diebstahlversuch (5 SP) – kritisches Sicherheitsfeature

Deine Aufgabe als Scrum Master:
Formuliere ein klares, motivierendes Sprint-Ziel für Sprint 1. Das Sprint-Ziel soll:
• In 1-2 Sätzen den Wert dieses Sprints ausdrücken (WARUM, nicht WAS)
• Das Team motivieren und ausrichten
• Kein bloßes Aufzählen der Stories sein`,
    options: [
      {
        id: 1, text: 'Freitextantwort', isCorrect: false, scoreChange: 0, motivationChange: 0,
        feedback: `Bewertungskriterien: Das Sprint-Ziel muss den Wert des Sprints ausdrücken, nicht nur die Stories aufzählen. Es sollte motivierend und klar formuliert sein. Beispiel-Sprint-Ziele: "Am Ende von Sprint 1 können registrierte Nutzer ihr Smart Lock erstmals per Bluetooth entsperren und werden sofort benachrichtigt, wenn jemand unbefugten Zugriff versucht." NICHT akzeptabel: "In Sprint 1 implementieren wir Bluetooth, Login und Benachrichtigungen." – das ist eine Story-Liste, kein Ziel. Das Ziel sollte das WARUM des Sprints transportieren: Was ändert sich für den Nutzer? Welchen Wert liefert der Sprint?`
      }
    ],
    difficulty: 'medium'
  },

  // ─── PHASE 4: KANBAN ────────────────────────────────────────────────────────

  {
    phase: 'kanban',
    type: 'quiz',
    title: 'Was bewirkt ein WIP-Limit?',
    description: 'Das Smart Lock Team hat Scrum durchgespielt und schaut sich jetzt Kanban als ergänzendes Werkzeug an. Du erklärst dem Team: Was bewirkt ein Work-in-Progress-Limit (WIP-Limit)?',
    options: [
      { id: 1, text: 'Es begrenzt die Anzahl der Stories im Product Backlog', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das Product Backlog wird durch das WIP-Limit nicht begrenzt. WIP-Limits betreffen die aktiven Spalten des Kanban-Boards — "In Progress", "Review" etc. Das Backlog kann beliebig groß sein.' },
      { id: 2, text: 'Es begrenzt die gleichzeitig bearbeiteten Aufgaben je Spalte und optimiert den Fluss', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Richtig! WIP-Limits zwingen das Team, Aufgaben zu Ende zu bringen bevor neue gestartet werden. Das optimiert den Flow, reduziert Kontextwechsel und macht Engpässe sichtbar. Laut Queuing Theory: Über 80% Auslastung steigt die Durchlaufzeit exponentiell.' },
      { id: 3, text: 'Es legt die maximale Dauer eines Kanban-Sprints fest', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Kanban hat keine festen Sprints oder Timeboxen — das ist ein wesentlicher Unterschied zu Scrum. WIP-Limits betreffen Aufgaben, nicht Zeit.' },
      { id: 4, text: 'Es bestimmt, wie viele Entwickler gleichzeitig im Team arbeiten dürfen', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'WIP-Limits beziehen sich auf Aufgaben, nicht auf Personen. Ein Team von 5 Entwicklern kann durchaus ein WIP-Limit von 3 haben — dann werden 3 Aufgaben gleichzeitig fokussiert bearbeitet.' }
    ],
    difficulty: 'easy'
  },

  {
    phase: 'kanban',
    type: 'quiz',
    title: 'Durchlaufzeit vs. Bearbeitungszeit',
    description: 'Das Smart Lock Team möchte seinen Kanban-Flow messen. Kollege Jonas fragt: "Was ist der Unterschied zwischen Bearbeitungszeit und Durchlaufzeit?"',
    options: [
      { id: 1, text: 'Kein Unterschied — beide messen wie lange ein Entwickler an einer Aufgabe arbeitet', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Es gibt einen wichtigen Unterschied. Bearbeitungszeit (Touch Time) = aktive Arbeitszeit. Durchlaufzeit (Lead Time) = Zeit vom Eingang bis zur Auslieferung, inklusive Wartezeiten. In vielen Teams macht aktive Arbeit nur 20-30% der Lead Time aus — der Rest ist Warten.' },
      { id: 2, text: 'Durchlaufzeit = Zeit vom Eingang der Anforderung bis zur Auslieferung, inkl. Wartezeiten', isCorrect: true, scoreChange: 20, motivationChange: 5, feedback: 'Genau! Die Durchlaufzeit (Lead Time) ist die Gesamtzeit aus Kundensicht — von "Anforderung gestellt" bis "Feature geliefert". Sie enthält Wartezeiten, Übergangszeiten und aktive Arbeit. Kanban zielt darauf ab, die Lead Time durch WIP-Limits und Flow-Optimierung zu reduzieren.' },
      { id: 3, text: 'Durchlaufzeit = Dauer eines Sprint-Zyklus', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Das ist ein Scrum-Begriff. In Kanban gibt es keine Sprints. Durchlaufzeit misst den Fluss einer einzelnen Aufgabe durch das Board — nicht die Zykluslänge.' },
      { id: 4, text: 'Durchlaufzeit ist immer kürzer als Bearbeitungszeit', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Es ist umgekehrt: Die Durchlaufzeit ist fast immer länger als die Bearbeitungszeit, weil sie Wartezeiten einschließt. Das Ziel von Kanban ist, die Differenz zu minimieren.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'kanban',
    type: 'scenario',
    title: 'WIP-Limit überschritten: Was tun?',
    description: 'Das Smart Lock Team nutzt Kanban. WIP-Limit für "In Progress" = 3. Aktuell sind 5 Tasks in dieser Spalte: Bluetooth-Entsperrung, GPS-Tracking, App-Design, Login-Screen, Diebstahlalarm. Entwickler Lukas möchte einen weiteren Task starten: "Fingerabdruck-Sensor".',
    options: [
      { id: 1, text: 'Erlauben — mehr Aufgaben parallel bedeutet schnellere Gesamtlieferung', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'Genau das Gegenteil ist wahr. Je mehr Aufgaben parallel, desto mehr Kontextwechsel, desto langsamer werden alle. Laut Little\'s Law: Durchlaufzeit = WIP / Durchsatz. Mehr WIP = längere Durchlaufzeit. Das WIP-Limit schützt den Flow.' },
      { id: 2, text: 'Zuerst eine laufende Aufgabe fertigstellen, bevor Lukas mit Fingerabdruck beginnt', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Richtig! "Stop starting, start finishing" ist das Kanban-Mantra. Das WIP-Limit ist kein bürokratisches Hindernis — es ist ein Flow-Werkzeug. Lukas hilft am besten, indem er eine der laufenden 5 Aufgaben zu Ende bringt, bevor er eine neue startet.' },
      { id: 3, text: 'WIP-Limit von 3 auf 6 erhöhen — das Team ist groß genug', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'WIP-Limits einfach zu erhöhen wenn sie unbequem werden, macht sie wertlos. Sie sind bewusst gesetzt, um Flow zu erzwingen. Wenn das Limit dauerhaft zu restriktiv ist, passt man es in einer Retrospektive an — nicht ad-hoc.' },
      { id: 4, text: 'Den PO fragen, welche der laufenden Tasks er zurückstellen soll', isCorrect: false, scoreChange: 5, motivationChange: 0, feedback: 'In Kanban organisiert sich das Team selbst — du brauchst keine Genehmigung vom PO. Das Team entscheidet gemeinsam, welche Aufgabe als nächste zu Ende gebracht wird. Den PO einzubeziehen bei technischen Flow-Entscheidungen schafft unnötige Abhängigkeiten.' }
    ],
    difficulty: 'medium'
  },

  {
    phase: 'kanban',
    type: 'scenario',
    title: 'Blocked Story: Fingerabdruck-Sensor hängt seit 5 Tagen',
    description: 'Das Kanban-Board des Smart Lock Teams zeigt: Die Story "Fingerabdruck-Sensor-Integration" hängt seit 5 Tagen unverändert in der "In Progress"-Spalte. Kein Fortschritt, keine Kommunikation im Team. Das WIP-Limit ist dadurch dauerhaft ausgeschöpft — neue Aufgaben können nicht gestartet werden.',
    options: [
      { id: 1, text: 'Warten — der Entwickler weiß schon, was er tut, man soll ihm nicht auf die Finger schauen', isCorrect: false, scoreChange: -15, motivationChange: -8, feedback: 'Nach 5 Tagen ohne Fortschritt ist Warten keine Option mehr. Blocked Stories sind ein Systemfehler, kein persönliches Versagen. In Kanban macht Transparenz solche Probleme sichtbar — damit man sie lösen kann, nicht ignorieren.' },
      { id: 2, text: 'Im Team-Meeting aktiv ansprechen: Was blockiert die Story? Impediment identifizieren und lösen', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Genau richtig! Blocked Stories explizit zu machen ist Kern des Kanban-Prinzips "Make Policies Explicit". Durch offene Kommunikation im Team-Meeting wird das Impediment sichtbar — vielleicht ist es fehlende Hardware, ein externer Zulieferer oder eine technische Unklarheit. Erst wenn bekannt, kann es gelöst werden.' },
      { id: 3, text: 'Story zurück in "To Do" verschieben und frisch starten', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Zurückschieben ohne das Grundproblem zu verstehen löst nichts. Beim nächsten Versuch läuft man in dasselbe Hindernis. Zuerst das Impediment identifizieren, dann entscheiden ob die Story neu gestartet oder anders angegangen wird.' },
      { id: 4, text: 'Eine andere Person die Story übernehmen lassen', isCorrect: false, scoreChange: 5, motivationChange: 0, feedback: 'Möglicherweise eine Option, aber nur wenn das Impediment verstanden ist. Wenn das Hindernis extern ist (fehlender Sensor, API-Zugang etc.), hilft auch ein anderer Entwickler nicht weiter. Erst Ursache verstehen, dann handeln.' }
    ],
    difficulty: 'hard'
  },

  // ─── PHASE 4: KANBAN — Interaktive Textaufgabe ───────────────────────────────

  {
    phase: 'kanban',
    type: 'text',
    title: 'Engpass analysieren: Warum stockt der Flow?',
    description: `Das VeloTech Kanban-Board sieht nach 2 Wochen so aus:

| To Do | In Progress | Review | Done |
|-------|-------------|--------|------|
| 6 Tasks | 4 Tasks | 7 Tasks | 2 Tasks |

WIP-Limit für "In Progress" = 4, für "Review" = 3 (aktuell überschritten!).
Das Team liefert kaum etwas — nur 2 Tasks in "Done" nach 2 Wochen.

Deine Aufgabe:
Analysiere den Engpass und schlage 3 konkrete Maßnahmen vor:
• Wo steckt der Flow? Warum?
• Was sind die 3 wichtigsten Maßnahmen, um den Flow sofort zu verbessern?
• Wie würdest du das WIP-Limit anpassen?`,
    options: [
      {
        id: 1, text: 'Freitextantwort', isCorrect: false, scoreChange: 0, motivationChange: 0,
        feedback: `Bewertungskriterien: Der Engpass liegt klar im "Review"-Schritt (7 Tasks, WIP-Limit 3 überschritten). Korrekte Analyse-Kernpunkte: (1) "Review" ist der Bottleneck – zu viele Tasks warten auf Review/Abnahme; (2) Neue Tasks können nicht fertiggestellt werden, weil sie in Review feststecken; (3) Das Prinzip "Stop starting, start finishing" greift hier. Erwartete Maßnahmen: (1) Alle Entwickler stoppen neue Tasks und helfen stattdessen beim Review; (2) WIP-Limit für "Review" sofort auf das erlaubte Maximum reduzieren (3 erzwingen, nicht ignorieren); (3) Review-Prozess analysieren: Warum dauert es so lang? Fehlt ein Reviewer? Sind die Kriterien unklar? (4) Pair-Reviews einführen um Review-Stau zu reduzieren. WIP-Limit-Anpassung: Review-WIP sollte beibehalten werden, um den Bottleneck sichtbar zu machen und zu lösen – nicht erhöhen!`
      }
    ],
    difficulty: 'hard'
  },

  {
    phase: 'kanban',
    type: 'quiz',
    title: 'Scrum und Kanban im Vergleich',
    description: 'Als Abschluss des Planspiels: Du hast jetzt alle drei Scrum-Rollen gespielt und Kanban kennengelernt. Was haben Scrum und Kanban gemeinsam?',
    options: [
      { id: 1, text: 'Beide verwenden Sprints mit fester Länge und definierte Rollen', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Sprints und feste Rollen gibt es nur in Scrum. Kanban arbeitet mit kontinuierlichem Fluss ohne Timeboxen und ohne vorgeschriebene Rollen — das ist ein zentraler Unterschied.' },
      { id: 2, text: 'Beide zielen auf kontinuierliche Verbesserung, Transparenz und Wertlieferung', isCorrect: true, scoreChange: 20, motivationChange: 8, feedback: 'Richtig! Beide Methoden teilen agile Grundwerte: kontinuierliche Verbesserung (Kaizen/Retrospektiven), Transparenz über den Arbeitsstatus und das Ziel, dem Kunden schnell Wert zu liefern. Scrum macht das durch Sprints, Kanban durch kontinuierlichen Flow.' },
      { id: 3, text: 'Beide erfordern einen Product Owner als Rolle', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: 'Den Product Owner gibt es nur in Scrum. Kanban kennt keine vorgeschriebenen Rollen — bestehende Titel und Verantwortlichkeiten bleiben erhalten. Das macht Kanban oft einsteigerfreundlicher in bestehenden Organisationen.' },
      { id: 4, text: 'Beide basieren auf täglichen Stand-ups als Pflichtmeeting', isCorrect: false, scoreChange: -5, motivationChange: -3, feedback: 'Daily Stand-ups sind in Scrum ein definiertes Event (Daily Scrum). In Kanban gibt es keine vorgeschriebenen Meetings — Teams können Stand-ups einführen, müssen es aber nicht. Kanban schreibt keine Events vor.' }
    ],
    difficulty: 'medium'
  }

];

const initialDocuments = [
  {
    title: 'Grundlagen Agiles Projektmanagement',
    description: 'Einführung in agile Werte, das Agile Manifesto und die Grundprinzipien iterativer Entwicklung.',
    category: 'Agiles PM',
    pdfUrl: 'https://agilemanifesto.org/iso/de/manifesto.html',
    tags: ['Agil', 'Grundlagen', 'Manifesto'],
    isActive: true
  },
  {
    title: 'Scrum Guide (Deutsch) – 2020',
    description: 'Der offizielle Scrum Guide von Ken Schwaber & Jeff Sutherland. Die Grundlage aller Scrum-Regeln.',
    category: 'Scrum',
    pdfUrl: 'https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-German.pdf',
    tags: ['Scrum', 'Guide', 'Offiziell'],
    isActive: true
  },
  {
    title: 'Kanban – Praktischer Einstieg',
    description: 'Grundlagen von Kanban: WIP-Limits, Flow, Visualisierung und kontinuierliche Verbesserung.',
    category: 'Kanban',
    pdfUrl: 'https://kanbanize.com/kanban-resources/getting-started/what-is-kanban',
    tags: ['Kanban', 'WIP', 'Flow'],
    isActive: true
  },
  {
    title: 'User Stories & Akzeptanzkriterien',
    description: 'Wie schreibt man gute User Stories? INVEST-Kriterien, Akzeptanzkriterien und Story-Splitting.',
    category: 'Scrum',
    pdfUrl: 'https://www.mountaingoatsoftware.com/agile/user-stories',
    tags: ['User Stories', 'INVEST', 'PO'],
    isActive: true
  }
];

async function setupDatabase() {
  try {
    await testConnection();
    await sequelize.sync({ force: true });
    console.log('Datenbank-Schema erstellt (force: true)');

    const [demoHash, adminHash] = await Promise.all([
      bcrypt.hash('demo123', 10),
      bcrypt.hash('Admin2026!', 10)
    ]);
    await Promise.all([
      User.create({ email: 'demo@smail.th-koeln.de',  password: demoHash }),
      User.create({ email: 'admin@smail.th-koeln.de', password: adminHash }),
      Scenario.bulkCreate(initialScenarios),
      Document.bulkCreate(initialDocuments)
    ]);
    console.log('Demo-User:  demo@smail.th-koeln.de  / demo123');
    console.log('Admin-User: admin@smail.th-koeln.de / Admin2026!');
    console.log(`${initialScenarios.length} Szenarien eingefügt`);
    console.log(`${initialDocuments.length} Dokumente eingefügt`);

    const counts = initialScenarios.reduce((acc, s) => {
      acc[s.phase] = (acc[s.phase] || 0) + 1;
      return acc;
    }, {});
    console.log('Szenarien pro Phase:', counts);

    console.log('\nDatenbank erfolgreich eingerichtet!');
    process.exit(0);
  } catch (error) {
    console.error('Fehler beim Setup:', error);
    process.exit(1);
  }
}

setupDatabase();
