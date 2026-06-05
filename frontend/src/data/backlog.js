/**
 * backlog.js
 * Vorgefertigtes Product Backlog für das VeloTech Smart Lock Projekt.
 * Der Spieler schreibt keine Stories – er wählt, priorisiert und reagiert.
 * Fachliche Grundlage: docs/spielkonzept.md, Abschnitt 3.2
 */

export const backlog = [
  {
    id: 'bl-bluetooth-unlock',
    title: 'Bluetooth-Entsperrung per App',
    storyPoints: 8,
    priority: 1,
    category: 'core',
    description:
      'Als Nutzer möchte ich mein VeloTech Smart Lock per Bluetooth über die App entsperren können, damit ich mein Fahrrad schnell und bequem sichern und freigeben kann.',
    stakeholder: 'Entwickler',
  },
  {
    id: 'bl-theft-alarm',
    title: 'Diebstahlalarm bei Bewegungserkennung',
    storyPoints: 5,
    priority: 2,
    category: 'core',
    description:
      'Als Nutzer möchte ich benachrichtigt werden, wenn mein gesichertes Fahrrad unbefugt bewegt wird, damit ich schnell reagieren und einen Diebstahl verhindern kann.',
    stakeholder: 'Sicherheitsbeauftragter',
  },
  {
    id: 'bl-battery-warning',
    title: 'Akkustand-Warnung',
    storyPoints: 2,
    priority: 2,
    category: 'ux',
    description:
      'Als Nutzer möchte ich rechtzeitig eine Warnung erhalten, wenn der Akku des Schlosses schwach ist, damit ich nicht versehentlich ausgesperrt werde.',
    stakeholder: 'Entwickler',
  },
  {
    id: 'bl-gps-tracking',
    title: 'GPS-Tracking des Fahrrads',
    storyPoints: 8,
    priority: 3,
    category: 'feature',
    description:
      'Als Nutzer möchte ich den aktuellen Standort meines Fahrrads jederzeit in der App einsehen können, damit ich es bei Diebstahl orten oder bei mehreren Fahrrädern den Überblick behalten kann.',
    stakeholder: 'Marketing',
  },
  {
    id: 'bl-nfc-backup',
    title: 'NFC-Entsperrung als Backup',
    storyPoints: 13,
    priority: 3,
    category: 'feature',
    description:
      'Als Nutzer möchte ich das Schloss alternativ per NFC-Karte öffnen können, damit ich auch ohne Smartphone-Akku Zugang zu meinem Fahrrad habe.',
    stakeholder: 'Sicherheitsbeauftragter',
  },
  {
    id: 'bl-fingerprint',
    title: 'Fingerabdruck-Entsperrung',
    storyPoints: 8,
    priority: 4,
    category: 'feature',
    description:
      'Als Nutzer möchte ich das Schloss per Fingerabdruck öffnen können, damit ich meinen Schlüssel oder das Smartphone nicht immer dabei haben muss.',
    stakeholder: 'Marketing',
  },
  {
    id: 'bl-push-notification',
    title: 'Push-Benachrichtigung bei Aktivitäten',
    storyPoints: 5,
    priority: 2,
    category: 'ux',
    description:
      'Als Nutzer möchte ich Push-Benachrichtigungen erhalten, wenn das Schloss geöffnet, geschlossen oder ausgelöst wird, damit ich jederzeit informiert bin.',
    stakeholder: 'UX',
  },
  {
    id: 'bl-dark-mode',
    title: 'Dark Mode für die App',
    storyPoints: 3,
    priority: 5,
    category: 'ux',
    description:
      'Als Nutzer möchte ich die App in einem dunklen Farbschema nutzen können, damit sie angenehmer zu bedienen ist und modern wirkt.',
    stakeholder: 'UX',
  },
];
