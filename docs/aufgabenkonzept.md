# Aufgabenkonzept – APM Planspiel „VeloTech Smart Lock"

> Didaktisches Konzept für das digitale Planspiel zur Vermittlung agilen Projektmanagements.  
> Fallstudie: Entwicklung eines smarten Fahrradschlosses (VeloTech GmbH)

---

## Aufgaben-Übersicht nach Phase

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PHASEN & AUFGABEN                                     │
├──────────────────┬──────────────────┬──────────────────┬────────────────────┤
│  PRODUCT OWNER   │   SCRUM MASTER   │    DEVELOPER     │      KANBAN        │
│                  │                  │                  │                    │
│  PO-1 ★★         │  SM-Bereich:     │  DEV-Bereich:    │  KB-1 ★★           │
│  Sprint-Ziel     │  Sprint Planning │  User Stories    │  Engpass erkennen  │
│                  │                  │                  │                    │
│  PO-2 ★★★        │  SP-1 ★★         │  US-1 ★          │  KB-2 ★★           │
│  Stakeholder     │  Stories für     │  Story           │  Nächstes Ticket   │
│  unter Druck     │  Sprint 3 wählen │  reparieren      │  wählen            │
│                  │                  │                  │                    │
│  PO-3 ★★         │  SP-2 ★★★        │  US-2 ★★         │  KB-3 ★★★          │
│  Wert vs. Risiko │  Realistisch     │  Gute Story      │  Parallele Arbeit  │
│                  │  planen          │  erkennen        │  analysieren       │
│                  │                  │                  │                    │
│  AK-1 ★          │  SR-1 ★★         │  US-3 ★★★        │                    │
│  Was gehört      │  Feedback        │  Epic zerlegen   │                    │
│  dazu?           │  auswerten       │                  │                    │
│                  │                  │                  │                    │
│  AK-2 ★★         │  SR-2 ★★★        │  AK-3 ★★★        │                    │
│  Vage Kriterien  │  Nächsten Sprint │  Fehlendes       │                    │
│  verbessern      │  planen          │  Kriterium       │                    │
│                  │                  │                  │                    │
└──────────────────┴──────────────────┴──────────────────┴────────────────────┘

  ★ = Leicht    ★★ = Mittel    ★★★ = Schwer
```

---

## Aufgaben-Flow im Spiel

```
START
  │
  ▼
┌─────────────────────────────────┐
│        PRODUCT OWNER            │
│                                 │
│  [PO-1] Sprint-Ziel setzen      │  → Entscheidungsaufgabe
│  [PO-2] Stakeholder abwimmeln   │  → Entscheidungsaufgabe
│  [PO-3] Wert vs. Risiko         │  → Entscheidungsaufgabe
│  [AK-1] AK auswählen            │  → Multiple Select
│  [AK-2] AK verbessern           │  → Analyse
│  [US-1] Story reparieren        │  → Freitext (KI-bewertet)
│  [US-2] Gute Story erkennen     │  → Multiple Choice
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│         SCRUM MASTER            │
│                                 │
│  [SP-1] Stories auswählen       │  → Multiple Select
│  [SP-2] Kapazität planen        │  → Entscheidungsaufgabe
│  [SR-1] Feedback klassifizieren │  → Freitext (KI-bewertet)
│  [SR-2] Sprint neu planen       │  → Auswahl + Begründung
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│          DEVELOPER              │
│                                 │
│  [US-3] Epic zerlegen           │  → Freitext (KI-bewertet)
│  [AK-3] Fehlendes AK ergänzen   │  → Freitext (KI-bewertet)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│            KANBAN               │
│                                 │
│  [KB-1] Engpass erkennen        │  → Multiple Choice
│  [KB-2] Nächstes Ticket wählen  │  → Multiple Choice
│  [KB-3] Multitasking-Problem    │  → Multiple Select
└────────────────┬────────────────┘
                 │
                 ▼
               ENDE
           Agile Champion 🏆
```

---

## Detailkonzept der Aufgaben

---

### Phase: Product Owner

---

#### PO-1 | „Das erste Sprint-Ziel"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Szenario (Multiple Choice)
- **Lernziel:** Priorisierung nach Kundennutzen, Machbarkeit und Risiko

**Ausgangssituation:**
Du bist frisch als Product Owner bei VeloTech GmbH eingestiegen. Das Team hat Kapazität für genau **18 Story Points** im ersten Sprint. Im Backlog liegen folgende Items:

| # | Titel | SP | Begründung Stakeholder |
|---|-------|----|------------------------|
| A | Bluetooth-Entsperrung per App | 8 | Kernfunktion – ohne sie ist das Produkt wertlos |
| B | GPS-Tracking (Live-Position) | 8 | Marketing will es für die Pressemitteilung |
| C | Diebstahlalarm (Vibrationssensor) | 5 | Sicherheitsbeauftragter fordert es dringend |
| D | Dark Mode in der App | 3 | Ein Stakeholder findet ihn „modern" |
| E | Fingerabdruck-Entsperrung | 8 | CEO liebt die Idee |
| F | Fehlermeldung bei schwachem Akku | 2 | Entwickler halten es für kritisch |

**Aufgabenstellung:**
Wähle die Stories für Sprint 1. Das Team hat 18 SP Kapazität. Welche Kombination wählst du?

**Antwortmöglichkeiten:**
- A + B + D = 19 SP ❌ (zu viel)
- **A + C + F = 15 SP ✅ (Musterlösung)**
- B + E = 16 SP
- A + E = 16 SP
- C + D + F = 10 SP

**Feedback (richtig):**
Sehr gute Entscheidung. Du hast die Kernfunktion (Entsperrung) gewählt, die ohne sie das Produkt gar keinen Wert hat. Der Diebstahlalarm baut Vertrauen bei Käufern auf – das ist echter Produktwert. Die Akkuwarnung kostet nur 2 SP und verhindert frustrierte Nutzer. GPS und Fingerabdruck sind wertvoll, aber kein MVP-Muss. Dark Mode ist reines Nice-to-have.

**Feedback (falsch):**
Denk noch mal nach: Was braucht ein Nutzer am Tag 1 wirklich? Ein GPS ohne funktionierende Entsperrung ist wertlos. Der Dark Mode begeistert niemanden, wenn das Schloss nicht aufgeht. Priorisiere immer: Was liefert den größten Kundennutzen bei vertretbarem Aufwand?

**Scrum-Bezug:** Product Backlog Refinement, Sprint Planning, Value-based Prioritization

---

#### PO-2 | „Stakeholder unter Druck"
- **Schwierigkeit:** ★★★ Schwer
- **Typ:** Szenario (Multiple Choice)
- **Lernziel:** Sprint-Schutz und Stakeholder-Management

**Ausgangssituation:**
Sprint 2 läuft. Plötzlich meldet sich der CEO persönlich: „Ich war heute auf einer Messe. Alle reden über KI. Wir brauchen sofort eine KI-basierte Fahrraddiebstahl-Erkennung per Kamera. Das muss ins nächste Sprint!" Das Team hat bereits Stories committed und der Sprint endet in 5 Tagen.

**Aufgabenstellung:**
Wie reagierst du als Product Owner?

**Antwortmöglichkeiten:**
- A) „Natürlich, wir bauen das sofort ein."
- **B) „Das klingt spannend. Ich nehme es ins Backlog auf, wir besprechen es beim nächsten Refinement und priorisieren es für Sprint 3." ✅**
- C) „Das ist technisch unmöglich."
- D) „Das entscheidet das Team, nicht ich."

**Feedback (richtig):**
Exzellent. Du hast den Sprint geschützt (keine Änderungen mid-Sprint!) und gleichzeitig den CEO nicht abgewiesen. Du hast das Item ins Backlog aufgenommen – das ist deine Pflicht. Beim Refinement wird es richtig bewertet: Aufwand, Nutzen, technische Machbarkeit.

**Feedback (A – falsch):**
Das verletzt ein Scrum-Grundprinzip: Der Sprint-Backlog wird nach dem Planning nicht verändert. Das Team hat sich committet. Wenn du jeden CEO-Impuls sofort einbaust, verliert das Team Vertrauen in dich und in den Prozess.

**Feedback (C – falsch):**
„Unmöglich" ist keine Antwort, bevor du es bewertet hast. Eine gute PO-Antwort ist: „Interessant – lass uns das konkretisieren und bewerten."

**Feedback (D – falsch):**
Der Product Owner ist verantwortlich für das Backlog und die Priorisierung – nicht das Entwicklungsteam.

**Scrum-Bezug:** Sprint-Schutz, Stakeholder-Management, Backlog-Ownership

---

#### PO-3 | „Wert gegen Risiko abwägen"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Szenario (Multiple Choice)
- **Lernziel:** Nutzen-Risiko-Verhältnis bewerten

**Ausgangssituation:**
Im Refinement-Meeting diskutiert ihr zwei mögliche Stories für Sprint 4:

- **Option X:** NFC-Entsperrung als Backup → 13 SP, Nutzen: hoch, Risiko: niedrig
- **Option Y:** Sprachsteuerung (Alexa/Google) → 13 SP, Nutzen: mittel, Risiko: hoch (externe API-Abhängigkeit)

Das Team hat 13 SP frei.

**Aufgabenstellung:**
Welche Story priorisierst du und warum?

**Antwortmöglichkeiten:**
- **A) Option X (NFC) ✅**
- B) Option Y (Sprachsteuerung)
- C) Keine von beiden – erst mehr Refinement nötig (akzeptabel mit Begründung)

**Feedback (A – richtig):**
Gute Entscheidung. NFC ist eine robuste Backup-Methode mit hohem Nutzen und kalkulierbarem Risiko. Sprachsteuerung klingt sexy, aber Alexa-API-Änderungen können euren Sprint sprengen.

**Feedback (B – falsch):**
Sprachsteuerung hat ein hohes Risiko durch externe API-Abhängigkeit. Was passiert, wenn Amazon die Schnittstelle ändert? Du lieferst dem Team eine Story, die im Sprint möglicherweise nicht abgeschlossen werden kann.

**Scrum-Bezug:** Backlog Refinement, Value vs. Risk, Definition of Ready

---

### Phase: Product Owner → User Stories & Akzeptanzkriterien

---

#### US-1 | „Diese Story ist kaputt – repariere sie"
- **Schwierigkeit:** ★ Leicht
- **Typ:** Freitext (KI-bewertet)
- **Lernziel:** Korrektes User-Story-Format verstehen

**Ausgangssituation:**
Im Backlog findest du folgenden Eintrag:

> *„Bluetooth-Stack implementieren und API-Endpoint für Lock/Unlock-Funktion bauen."*

**Aufgabenstellung:**
Das ist keine User Story – das ist eine technische Aufgabe. Schreibe sie um. Nutze das Format:
*„Als [Rolle] möchte ich [Funktion], damit [Nutzen]."*

**Musterlösung:**
„Als Fahrradbesitzer möchte ich mein Schloss über die App per Bluetooth öffnen können, damit ich ohne physischen Schlüssel auskomme."

**Bewertungskriterien KI:**
- Nutzerrolle vorhanden (Fahrradbesitzer / Nutzer)
- Konkrete Funktion (App, Bluetooth, Entsperren)
- Nutzenargument (kein Schlüssel / Komfort / Schnelligkeit)

**Feedback (richtig):**
Sehr gut! Du hast aus einer technischen Aufgabe eine echte User Story gemacht. Der entscheidende Unterschied: Eine User Story beschreibt den Nutzen für den Anwender, nicht die technische Implementierung.

**Feedback (unvollständig):**
Fehlt die Rolle? Fehlt der Nutzen? Das „Damit"-Feld ist das Wichtigste – es zeigt dem Team, welchen Wert sie liefern.

**Scrum-Bezug:** User Story Format, Product Backlog, Nutzerorientierung

---

#### US-2 | „Welche Story ist wirklich gut?"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Multiple Choice
- **Lernziel:** INVEST-Kriterien anwenden

**Ausgangssituation:**
Dein Team hat vier Story-Entwürfe eingereicht. Nur einer erfüllt alle Qualitätskriterien.

**Antwortmöglichkeiten:**
- A) „Das System soll sicher sein."
- B) „Als Nutzer möchte ich alles mit dem Schloss machen können."
- **C) „Als Fahrradbesitzer möchte ich nach 3 fehlgeschlagenen Entsperrversuchen eine Push-Benachrichtigung erhalten, damit ich weiß, ob jemand versucht mein Fahrrad zu stehlen." ✅**
- D) „Als Nutzer möchte ich die gesamte Backend-Architektur verstehen."

**Feedback (C – richtig):**
Genau. Story C ist konkret, testbar, hat eine klare Rolle und einen echten Nutzen. Ein Entwickler weiß sofort, was zu bauen ist. Ein Tester weiß, wie er es prüft.

**Feedback (A – falsch):**
„Sicher sein" ist nicht testbar und nicht schätzbar – verletzt INVEST.

**Feedback (B – falsch):**
Viel zu breit. Eine gute Story ist small und estimable.

**Feedback (D – falsch):**
Das ist kein Nutzerwunsch. Kein Produktwert.

**Scrum-Bezug:** INVEST-Kriterien, User Story Qualität

---

#### US-3 | „Die Story ist zu groß – zerlege sie"
- **Schwierigkeit:** ★★★ Schwer
- **Typ:** Freitext (KI-bewertet)
- **Lernziel:** Story Splitting üben

**Ausgangssituation:**
Im Backlog steht folgende Epic (34 SP – zu groß für einen Sprint):

> *„Als Nutzer möchte ich mein Smart Lock vollständig über die App verwalten können, damit ich immer die Kontrolle über mein Fahrrad habe."*

**Aufgabenstellung:**
Teile diese Epic in mindestens 3 kleinere, sprintfähige User Stories auf. Jede Story soll unabhängig lieferbar sein.

**Musterlösung:**
1. „Als Nutzer möchte ich mein Schloss per App entsperren/sperren." (8 SP)
2. „Als Nutzer möchte ich den Akkustand meines Schlosses in der App sehen." (3 SP)
3. „Als Nutzer möchte ich eine Benachrichtigung bei Bewegungserkennung erhalten." (5 SP)
4. „Als Nutzer möchte ich den Entsperrverlauf der letzten 30 Tage einsehen." (5 SP)

**Bewertungskriterien KI:**
- Jede Story hat Rolle, Funktion, Nutzen
- Jede Story ist unabhängig lieferbar
- Keine Story > 8 SP (Faustregel)

**Feedback (richtig):**
Exzellent. Du hast eine nicht-planbare Epic in handhabbare Liefereinheiten zerlegt. Jede dieser Stories liefert echten Wert, auch wenn die anderen noch nicht fertig sind.

**Feedback (falsch):**
Achte darauf: Wenn deine Stories voneinander abhängen, sind sie nicht wirklich unabhängig. Enthält jede Story einen klaren Nutzen?

**Scrum-Bezug:** Epic vs. Story, Story Splitting, Backlog Refinement

---

#### AK-1 | „Was gehört dazu, was nicht?"
- **Schwierigkeit:** ★ Leicht
- **Typ:** Multiple Select
- **Lernziel:** Testbare und relevante Akzeptanzkriterien erkennen

**User Story:**
„Als Fahrradbesitzer möchte ich mein Schloss per Bluetooth in der App entsperren, damit ich schnell und ohne Schlüssel zugreifen kann."

**Auswahlmöglichkeiten:**
- ✅ A) Die App erkennt das Schloss im Radius von 5 Metern.
- ✅ B) Das Schloss öffnet sich innerhalb von 3 Sekunden nach Tippen auf „Entsperren".
- ❌ C) Die App hat einen Dark Mode.
- ✅ D) Bei fehlgeschlagener Verbindung erscheint eine verständliche Fehlermeldung.
- ❌ E) Das Schloss kann auch per NFC geöffnet werden.
- ✅ F) Der Nutzer muss in der App eingeloggt sein, um das Schloss zu öffnen.

**Musterlösung:** A, B, D, F

**Feedback (richtig):**
Genau. Gute Akzeptanzkriterien beantworten: „Woran erkennt der Tester, dass die Story fertig ist?" Dark Mode und NFC sind separate Backlog Items.

**Feedback (falsch):**
Ist das Kriterium direkt testbar? Gehört es wirklich zu dieser Story oder ist es ein eigenes Feature?

**Scrum-Bezug:** Definition of Done, Akzeptanzkriterien, Testbarkeit

---

#### AK-2 | „Diese Kriterien sind zu vage"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Analyse / Multiple Choice
- **Lernziel:** Qualität von Akzeptanzkriterien beurteilen

**User Story:**
„Als Nutzer möchte ich eine Push-Benachrichtigung erhalten, wenn mein Schloss bewegt wird."

**Vorgeschlagene Kriterien:**
1. „Die Benachrichtigung soll schnell ankommen." ❌
2. „Die Benachrichtigung erscheint innerhalb von 10 Sekunden nach Bewegungserkennung." ✅
3. „Die Benachrichtigung soll irgendwie auf Bewegung hinweisen." ❌
4. „Die Benachrichtigung enthält: Uhrzeit, Schloss-Name und den Text ‚Bewegung erkannt'." ✅
5. „Es soll gut aussehen." ❌

**Musterlösung:** 2 und 4 sind gut. 1, 3, 5 sind problematisch.

**Feedback (richtig):**
Sehr gutes Urteil. Akzeptanzkriterien müssen objektiv überprüfbar sein. Konkrete Zahlen, Inhalte und Bedingungen sind der Schlüssel.

**Scrum-Bezug:** Akzeptanzkriterien, Testbarkeit, Definition of Done

---

#### AK-3 | „Welches Kriterium fehlt?"
- **Schwierigkeit:** ★★★ Schwer
- **Typ:** Freitext (KI-bewertet)
- **Lernziel:** Edge Cases erkennen und als Akzeptanzkriterien formulieren

**User Story:**
„Als Nutzer möchte ich mich mit E-Mail und Passwort registrieren, damit ich die VeloTech-App nutzen kann."

**Vorhandene Kriterien:**
1. Die E-Mail-Adresse wird auf korrektes Format geprüft.
2. Das Passwort muss mindestens 8 Zeichen lang sein.
3. Nach erfolgreicher Registrierung wird der Nutzer auf das Dashboard weitergeleitet.

**Aufgabenstellung:**
Welche wichtigen Akzeptanzkriterien fehlen noch? Nenne mindestens 2.

**Musterlösung:**
- „Wenn eine E-Mail bereits registriert ist, erscheint Fehlermeldung: ‚Diese E-Mail ist bereits vergeben.'"
- „Das Passwort wird nicht im Klartext gespeichert."
- „Bei ungültigem Format erscheint eine spezifische Fehlermeldung direkt am Feld."
- „Das Passwort-Feld zeigt Sternchen statt Klartext."

**Feedback (richtig):**
Ausgezeichnet. Du denkst in Edge Cases. Was passiert, wenn jemand eine bereits verwendete E-Mail eingibt? Diese Szenarien fehlen oft in ersten Entwürfen und führen später zu Bugs.

**Feedback (unvollständig):**
Denk an Fehlerfälle: Gute Akzeptanzkriterien decken Happy Path UND Error Cases ab.

**Scrum-Bezug:** Akzeptanzkriterien, Edge Cases, Qualitätssicherung

---

### Phase: Scrum Master → Sprint Planning

---

#### SP-1 | „Wähle die richtigen Stories für Sprint 3"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Multiple Select
- **Lernziel:** Sprint-Ziel als Filter für Story-Auswahl nutzen

**Sprint-Ziel:** „Nach diesem Sprint kann ein Nutzer sein Smart Lock vollständig über die App registrieren und verwalten."

**Verfügbare Stories (Kapazität: 20 SP):**

| ID | Story | SP | Passt zum Ziel? |
|----|-------|----|-----------------|
| S1 | Schloss per App registrieren (QR-Code) | 5 | ✅ Kernfunktion |
| S2 | Schloss aus der App entfernen | 3 | ✅ Verwaltung |
| S3 | Schloss umbenennen | 2 | ✅ Verwaltung |
| S4 | Nutzerprofil-Foto hochladen | 3 | ❌ Anderes Feature |
| S5 | Schloss-Firmware-Update via App | 8 | ⚠️ Nice-to-have |
| S6 | Benachrichtigung bei Entsperrung | 5 | ⚠️ Separat |
| S7 | Fehlermeldung bei bereits registriertem Schloss | 2 | ✅ Fehlerfall |

**Musterlösung:** S1 + S2 + S3 + S7 = 12 SP (fokussiert auf Sprint-Ziel)

**Feedback (richtig):**
Sehr gut. Du hast dich am Sprint-Ziel orientiert, nicht daran, möglichst viele SP zu füllen. Lieber 12 fokussierte SP als 20 SP, die in alle Richtungen zeigen.

**Feedback (falsch):**
Hast du das Sprint-Ziel als Filter verwendet? Profilfoto und Firmware-Update erfüllen das Ziel nicht. Fülle keinen Sprint um des Füllens willen.

**Scrum-Bezug:** Sprint Planning, Sprint Goal, Fokus

---

#### SP-2 | „Das Team schätzt zu optimistisch"
- **Schwierigkeit:** ★★★ Schwer
- **Typ:** Szenario (Multiple Choice)
- **Lernziel:** Velocity und realistische Kapazitätsplanung

**Ausgangssituation:**
Sprint 1 abgeschlossen: Team hat 14 SP geliefert. Sprint 2 Planning: Team schätzt 24 SP. Ein Entwickler krank (Woche), ein anderer hat 2 Tage Urlaub.

**Aufgabenstellung:**
Was ist die realistisch planbare Kapazität für Sprint 2?

**Antwortmöglichkeiten:**
- A) 24 SP – das Team wird sich schon strecken.
- **B) Velocity (14 SP) kürzen für Ausfälle → ca. 10–11 SP ✅**
- C) Gar nichts committen – zu unsicher.
- D) 18 SP – Kompromiss zwischen Wunsch und Realität.

**Feedback (B – richtig):**
Genau. Velocity ist das wichtigste Planungsinstrument. 14 SP Baseline – wegen Ausfällen realistisch 10–12 SP. Lieber weniger committen und liefern als viel versprechen und scheitern.

**Feedback (A – falsch):**
„Sich strecken" ist kein Plan. Übercommitment führt zu Qualitätsproblemen und Frust.

**Feedback (D – falsch):**
Kompromisse funktionieren nicht bei Kapazitätsplanung. Die Zahlen zeigen klar, was realistisch ist.

**Scrum-Bezug:** Velocity, Kapazitätsplanung, Sustainable Pace

---

### Phase: Scrum Master → Sprint Review

---

#### SR-1 | „Stakeholder-Feedback auswerten"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Freitext / Tabelle (KI-bewertet)
- **Lernziel:** Feedback in Backlog-Items übersetzen und klassifizieren

**Ausgangssituation:**
Sprint Review nach Sprint 2. Folgendes Feedback kommt von Stakeholdern:

1. **CEO:** „Die App öffnet sich manchmal sehr langsam beim Starten."
2. **Vertrieb:** „Kunden fragen nach Familienoption – mehrere Nutzer pro Schloss."
3. **Support:** „Bei falscher PIN erscheint keine Fehlermeldung."
4. **Investor:** „Könnt ihr eine Smartwatch-Integration bauen?"

**Aufgabenstellung:**
Klassifiziere jedes Item als **Bug**, **Verbesserung** oder **Neues Feature** und formuliere je ein Backlog-Item.

**Musterlösung:**

| Feedback | Typ | Backlog-Item |
|----------|-----|--------------|
| App startet langsam | Verbesserung | App-Startzeit auf < 2 Sekunden reduzieren |
| Familienoption | Neues Feature | Als Hauptnutzer weitere Nutzer einladen können |
| Keine Fehlermeldung bei falscher PIN | Bug | Bei falscher PIN: „Falsche PIN – noch X Versuche" anzeigen |
| Smartwatch-Integration | Neues Feature | Schloss von Smartwatch öffnen können |

**Feedback (richtig):**
Sehr gut. Die Unterscheidung Bug/Verbesserung/Feature hilft bei der Priorisierung: Bugs schaden aktiven Nutzern sofort. Features schaffen neuen Wert – aber erst wenn das Fundament solide ist.

**Scrum-Bezug:** Sprint Review, Backlog-Pflege, Priorisierung

---

#### SR-2 | „Was kommt in den nächsten Sprint?"
- **Schwierigkeit:** ★★★ Schwer
- **Typ:** Auswahl + Begründung
- **Lernziel:** Backlog nach Sprint Review neu priorisieren

**Ausgangssituation:**
6 neue Backlog-Items nach Sprint Review. Kapazität Sprint 3: **15 SP**.

| Item | Typ | SP | Druck |
|------|-----|----|----|
| Bug: keine Fehlermeldung bei falscher PIN | Bug | 2 | Support: sehr hoch |
| App-Startzeit verbessern | Verbesserung | 5 | CEO: mittel |
| Familienoption (Multi-User) | Feature | 13 | Vertrieb: hoch |
| Smartwatch-Integration | Feature | 21 | Investor: mittel |
| Akkustand-Anzeige fehlt im Widget | Bug | 3 | Nutzer: hoch |
| Onboarding-Tutorial | Feature | 8 | UX: mittel |

**Musterlösung:**
Bug PIN (2) + Bug Widget (3) + App-Startzeit (5) = 10 SP ✅  
Oder: Bug PIN (2) + Bug Widget (3) + Onboarding (8) = 13 SP ✅

**Feedback (richtig):**
Ausgezeichnet. Bugs zuerst. Smartwatch mit 21 SP passt nicht rein und ist kein Must-have. Product Owner bedeutet: Nein sagen können, wenn die Daten es fordern.

**Feedback (falsch):**
Hast du Bugs ausreichend gewichtet? Solange Nutzer keine Fehlermeldung bei falscher PIN sehen, leidet das Vertrauen ins Produkt.

**Scrum-Bezug:** Sprint Review Outcomes, Backlog-Neubewertung, Priorisierung

---

### Phase: Developer

---

*(Freitext-Aufgaben sind bereits in `seed-scenarios.js` integriert.  
US-1, US-3, AK-3 können hier als ergänzende Aufgaben eingebettet werden.)*

---

### Phase: Kanban

---

#### KB-1 | „Wo steckt der Engpass?"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Multiple Choice
- **Lernziel:** Engpässe im Kanban-Flow erkennen

**Ausgangssituation:**
Nach 2 Wochen zeigt das VeloTech Kanban-Board:

```
┌──────────┬─────────────┬─────────────┬─────────┬──────┐
│ Backlog  │ In Progress │ Code Review │ Testing │ Done │
│          │  WIP: 3     │  WIP: 4     │  WIP: 3 │      │
├──────────┼─────────────┼─────────────┼─────────┼──────┤
│ 12 Tkts  │  3 Tkts ✓   │ 9 Tkts ❌   │ 1 Tkt   │  2   │
└──────────┴─────────────┴─────────────┴─────────┴──────┘
                              ↑
                          ENGPASS!
                    WIP-Limit 4, aber 9 Tkts
```

**Aufgabenstellung:**
Wo ist der Engpass? Was sollte das Team jetzt tun?

**Musterlösung:** Code Review – deutlich über WIP-Limit

**Feedback (richtig):**
Richtig. WIP-Limits machen Engpässe sichtbar. Das Team sollte: a) alle verfügbaren Entwickler auf Reviews fokussieren, b) keine neuen Tickets in „In Progress" starten. Stop starting, start finishing.

**Scrum/Kanban-Bezug:** WIP-Limits, Flow, Engpass-Analyse, Theory of Constraints

---

#### KB-2 | „Welches Ticket bewegst du als Nächstes?"
- **Schwierigkeit:** ★★ Mittel
- **Typ:** Multiple Choice
- **Lernziel:** Pull-Prinzip und Near-Done-Priorität verstehen

**Ausgangssituation:**
- **In Progress** (WIP 3/3) – voll
- **Code Review** (WIP 3/4) – noch ein Platz
- Ticket A: seit 5 Tagen in Progress, fast fertig
- Ticket B: neu, gerade priorisiert
- Ticket C: seit 3 Tagen in Code Review, wartet auf zweites Review

**Musterlösung:** C zuerst reviewen → dann A fertigstellen

**Feedback (richtig):**
Exzellent. Kanban-Prinzip: Fast-fertige Arbeit hat immer Vorrang. „Stop starting, start finishing." Wenn du B direkt startest, überschreitest du das WIP-Limit.

**Kanban-Bezug:** Pull-Prinzip, WIP-Limits, Stop Starting / Start Finishing

---

#### KB-3 | „Warum ist parallele Arbeit ein Problem?"
- **Schwierigkeit:** ★★★ Schwer
- **Typ:** Multiple Select
- **Lernziel:** Multitasking-Kosten und WIP-Limit-Sinn verstehen

**Ausgangssituation:**
Entwickler Kai hat gleichzeitig 5 Tickets in Bearbeitung. Alle sind „fast fertig".

**Auswahlmöglichkeiten:**
- ✅ A) Die Durchlaufzeit jedes Tickets steigt – alles dauert länger.
- ❌ B) Das Team liefert schneller, weil mehr gleichzeitig bearbeitet wird.
- ✅ C) Kontextwechsel kostet Konzentration und erhöht die Fehlerquote.
- ✅ D) Keine der 5 Stories wird bis Sprint-Ende fertig – kein Done.
- ✅ E) WIP-Limits sollen genau das verhindern.

**Musterlösung:** A, C, D, E

**Feedback (richtig):**
Gut analysiert. Multitasking fühlt sich produktiv an – ist es aber nicht. Kai liefert am Sprint-Ende wahrscheinlich nichts – fünf halbfertige Stories, aber keine einzige Done.

**Feedback (B – falsch):**
Das ist der häufigste Irrtum. Der Durchsatz sinkt, weil kein Ticket fertig wird. Lieber 1 Story vollständig Done als 5 Stories 80% fertig.

**Kanban-Bezug:** WIP-Limits, Durchlaufzeit, Little's Law, Multitasking-Kosten

---

## Übersichtstabelle aller Aufgaben

| ID | Titel | Phase | Typ | Schwierigkeit | KI-bewertet |
|----|-------|-------|-----|---------------|-------------|
| PO-1 | Das erste Sprint-Ziel | Product Owner | Szenario | ★★ | Nein |
| PO-2 | Stakeholder unter Druck | Product Owner | Szenario | ★★★ | Nein |
| PO-3 | Wert gegen Risiko | Product Owner | Szenario | ★★ | Nein |
| US-1 | Story reparieren | Product Owner | Freitext | ★ | Ja |
| US-2 | Gute Story erkennen | Product Owner | Multiple Choice | ★★ | Nein |
| US-3 | Epic zerlegen | Developer | Freitext | ★★★ | Ja |
| AK-1 | Was gehört dazu? | Product Owner | Multiple Select | ★ | Nein |
| AK-2 | Vage Kriterien | Product Owner | Analyse | ★★ | Nein |
| AK-3 | Fehlendes Kriterium | Developer | Freitext | ★★★ | Ja |
| SP-1 | Stories für Sprint 3 | Scrum Master | Multiple Select | ★★ | Nein |
| SP-2 | Realistisch planen | Scrum Master | Szenario | ★★★ | Nein |
| SR-1 | Feedback klassifizieren | Scrum Master | Freitext | ★★ | Ja |
| SR-2 | Nächsten Sprint planen | Scrum Master | Auswahl | ★★★ | Nein |
| KB-1 | Engpass erkennen | Kanban | Multiple Choice | ★★ | Nein |
| KB-2 | Nächstes Ticket wählen | Kanban | Multiple Choice | ★★ | Nein |
| KB-3 | Parallele Arbeit | Kanban | Multiple Select | ★★★ | Nein |

---

## Verteilung nach Schwierigkeit

```
Leicht  ★      : US-1, AK-1                              (2 Aufgaben)
Mittel  ★★     : PO-1, PO-3, US-2, AK-2, SP-1,
                  SR-1, KB-1, KB-2                        (8 Aufgaben)
Schwer  ★★★    : PO-2, US-3, AK-3, SP-2, SR-2, KB-3      (6 Aufgaben)
```

## Verteilung nach Aufgabentyp

```
Multiple Choice / Select  : PO-1, PO-2, PO-3, US-2, AK-1, AK-2, SP-1, SP-2, KB-1, KB-2, KB-3
Freitext (KI-bewertet)    : US-1, US-3, AK-3, SR-1
Analyse / Tabelle         : SR-2
```
