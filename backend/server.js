const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Anthropic = require('@anthropic-ai/sdk');
const { sequelize, testConnection } = require('./config/database');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { User, Scenario, UserAnswer, Document, UserTicket } = require('./models');

dotenv.config();

const app = express();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Multer – PDF-Upload in /uploads/
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_äöüÄÖÜß]/g, '_');
    const unique = `${Date.now()}-${safeName}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Nur PDF-Dateien erlaubt'));
  }
});
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection test
testConnection();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Kein Token vorhanden' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token ungültig oder abgelaufen' });
    }
    req.user = user;
    next();
  });
};

const calculateProgress = (userAnswers) => {
  if (userAnswers.length === 0) {
    return { totalScore: 0, currentMotivation: 50, completedScenarios: [] };
  }
  const totalScore = userAnswers.reduce((sum, a) => sum + a.scoreChange, 0);
  const avgMotivationChange = userAnswers.reduce((sum, a) => sum + a.motivationChange, 0) / userAnswers.length;
  const currentMotivation = Math.round(Math.max(0, Math.min(100, 50 + avgMotivationChange)));
  const completedScenarios = [...new Set(userAnswers.map(a => a.scenarioId))];
  return { totalScore, currentMotivation, completedScenarios };
};

app.get('/', (req, res) => {
  res.json({ message: 'APM Learning Platform API – TH Köln' });
});

// Get scenarios by phase (primary) or role (legacy)
app.get('/api/scenarios', authenticateToken, async (req, res) => {
  try {
    const { phase } = req.query;

    if (!phase) {
      return res.status(400).json({ success: false, error: 'phase parameter is required' });
    }

    const scenarios = await Scenario.findAll({
      where: { phase, isActive: true },
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      scenarios: scenarios.map(s => s.toJSON())
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch scenarios' });
  }
});

// Get user progress
app.get('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userAnswers = await UserAnswer.findAll({ where: { userId } });
    const { totalScore, currentMotivation, completedScenarios } = calculateProgress(userAnswers);

    // Phase-based progress: for each phase count total scenarios and how many the user answered
    const phases = ['product_owner', 'scrum_master', 'developer', 'kanban'];
    const phaseProgress = {};
    const scenarioProgress = {};

    for (const phase of phases) {
      const phaseScenarios = await Scenario.findAll({
        where: { phase, isActive: true },
        attributes: ['id']
      });
      const phaseIds = phaseScenarios.map(s => s.id);
      const answeredInPhase = [...new Set(
        userAnswers.filter(a => phaseIds.includes(a.scenarioId)).map(a => a.scenarioId)
      )];
      phaseProgress[phase] = { total: phaseIds.length, completed: answeredInPhase.length };
      scenarioProgress[phase] = answeredInPhase.length;
    }

    // Determine which phase to resume (first incomplete phase)
    const resumePhase = phases.find(p => phaseProgress[p].completed < phaseProgress[p].total) || null;

    // Calculate agile level based on overall progress
    const totalScenarios = Object.values(phaseProgress).reduce((s, p) => s + p.total, 0) || 29;
    const totalCompleted = Object.values(phaseProgress).reduce((s, p) => s + p.completed, 0);
    const overallPct = totalScenarios > 0 ? Math.round((totalCompleted / totalScenarios) * 100) : 0;

    const AGILE_LEVELS = [
      { min: 0,  max: 24,  level: 1, title: 'Agile Einsteiger',    icon: '🌱' },
      { min: 25, max: 49,  level: 2, title: 'Scrum Praktikant',    icon: '📋' },
      { min: 50, max: 74,  level: 3, title: 'Agile Practitioner',  icon: '🔄' },
      { min: 75, max: 89,  level: 4, title: 'Scrum Professional',  icon: '🚀' },
      { min: 90, max: 100, level: 5, title: 'Agile Champion',      icon: '🏆' }
    ];
    const currentLevel = AGILE_LEVELS.find(l => overallPct >= l.min && overallPct <= l.max) || AGILE_LEVELS[0];
    const nextLevel = AGILE_LEVELS.find(l => l.level === currentLevel.level + 1) || null;
    const agileLevel = {
      ...currentLevel,
      overallPct,
      nextLevelAt: nextLevel ? nextLevel.min : 100,
      progressToNext: nextLevel ? Math.round(((overallPct - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) : 100
    };

    res.json({
      success: true,
      progress: {
        totalScore,
        currentMotivation,
        completedScenarios,
        completedRoles: [],
        currentRole: null,
        phaseProgress,
        scenarioProgress,
        resumePhase,
        agileLevel
      }
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user progress' });
  }
});

// Submit answer
app.post('/api/game/answer', authenticateToken, async (req, res) => {
  try {
    const { scenarioId, optionId } = req.body;
    const userId = req.user.userId;

    if (!scenarioId || !optionId) {
      return res.status(400).json({
        success: false,
        error: 'scenarioId and optionId are required'
      });
    }

    const scenario = await Scenario.findByPk(scenarioId);
    if (!scenario) {
      return res.status(404).json({ success: false, error: 'Scenario not found' });
    }

    const selectedOption = scenario.options.find(opt => opt.id === optionId);
    if (!selectedOption) {
      return res.status(400).json({ success: false, error: 'Invalid option selected' });
    }

    await UserAnswer.create({
      userId,
      scenarioId,
      selectedOptionId: optionId,
      scoreChange: selectedOption.scoreChange,
      motivationChange: selectedOption.motivationChange
    });

    const userAnswers = await UserAnswer.findAll({ where: { userId } });
    const { totalScore, currentMotivation, completedScenarios } = calculateProgress(userAnswers);

    res.json({
      success: true,
      userProgress: { totalScore, currentMotivation, completedScenarios, completedRoles: [], currentRole: null },
      feedback: selectedOption.feedback,
      scoreChange: selectedOption.scoreChange,
      motivationChange: selectedOption.motivationChange
    });

  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ success: false, error: 'Failed to submit answer' });
  }
});

// Evaluate free-text answer with AI
app.post('/api/game/evaluate-text', authenticateToken, async (req, res) => {
  try {
    const { scenarioId, userAnswer } = req.body;
    const userId = req.user.userId;

    if (!scenarioId || !userAnswer || userAnswer.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'scenarioId und eine aussagekräftige Antwort (min. 10 Zeichen) sind erforderlich'
      });
    }

    const scenario = await Scenario.findByPk(scenarioId);
    if (!scenario) {
      return res.status(404).json({ success: false, error: 'Szenario nicht gefunden' });
    }

    const evaluationCriteria = scenario.options[0]?.feedback || '';

    let evaluation;
    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-20240307',
        max_tokens: 400,
        system: `Du bist ein agiler Coach, der Studierende durch Fragen und Hinweise zum Nachdenken bringt.
Deine Aufgabe: Prüfe ob die Antwort vollständig und inhaltlich korrekt ist.

WICHTIG:
- Verrate NIEMALS die Lösung oder nenne konkrete fehlende Punkte direkt
- Gib nur einen sanften Denkanstoß als Frage oder vagen Hinweis
- Wenn die Antwort gut genug ist, braucht es keinen Hinweis
- Antworte NUR als valides JSON: {"needsHint": boolean, "hint": "string"}
- needsHint: true wenn wichtige Aspekte fehlen oder falsch sind
- hint: maximal 2 kurze Sätze als Denkanstoß-Frage (z.B. "Hast du auch an die externen Stakeholder gedacht, die das Produkt indirekt beeinflussen?") — KEINE konkreten Antworten
- Wenn needsHint false: hint = ""`,
        messages: [{
          role: 'user',
          content: `Aufgabe: ${scenario.description}

Interne Bewertungsgrundlage (nicht an Studierenden weitergeben): ${evaluationCriteria}

Antwort des Studierenden: ${userAnswer}`
        }]
      });

      const rawText = message.content[0].text.trim();
      const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      evaluation = JSON.parse(jsonText);
    } catch (aiError) {
      console.error('AI evaluation error:', aiError);
      evaluation = { needsHint: false, hint: '' };
    }

    const scoreChange = 10;
    const motivationChange = 5;

    await UserAnswer.create({
      userId,
      scenarioId,
      selectedOptionId: 'text',
      scoreChange,
      motivationChange
    });

    const userAnswers = await UserAnswer.findAll({ where: { userId } });
    const { totalScore, currentMotivation, completedScenarios } = calculateProgress(userAnswers);

    res.json({
      success: true,
      needsHint: evaluation.needsHint ?? false,
      hint: evaluation.hint ?? '',
      userProgress: { totalScore, currentMotivation, completedScenarios, completedRoles: [], currentRole: null },
      scoreChange,
      motivationChange
    });
  } catch (error) {
    console.error('Error evaluating text answer:', error);
    res.status(500).json({ success: false, error: 'Fehler bei der Auswertung' });
  }
});

// ─── Wissensbibliothek Routes ────────────────────────────────────────────────

// POST upload PDF file (admin only)
app.post('/api/admin/documents/upload', authenticateToken, (req, res) => {
  upload.single('pdf')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Keine Datei hochgeladen' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, filename: req.file.filename, originalName: req.file.originalname });
  });
});

// GET all active documents
app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;
    const documents = await Document.findAll({ where, order: [['category', 'ASC'], ['title', 'ASC']] });
    res.json({ success: true, documents: documents.map(d => d.toJSON()) });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Dokumente' });
  }
});

// Admin: GET all documents (incl. inactive)
app.get('/api/admin/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await Document.findAll({ order: [['category', 'ASC'], ['id', 'ASC']] });
    res.json({ success: true, documents: documents.map(d => d.toJSON()) });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Fehler beim Laden' });
  }
});

// Admin: POST create document
app.post('/api/admin/documents', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, pdfUrl, tags } = req.body;
    if (!title || !pdfUrl) {
      return res.status(400).json({ success: false, error: 'title und pdfUrl sind Pflichtfelder' });
    }
    const doc = await Document.create({ title, description, category: category || 'Allgemein', pdfUrl, tags: tags || [], isActive: true });
    res.status(201).json({ success: true, document: doc.toJSON() });
  } catch (error) {
    console.error('Admin POST document error:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen' });
  }
});

// Admin: PUT update document
app.put('/api/admin/documents/:id', authenticateToken, async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Dokument nicht gefunden' });
    const { title, description, category, pdfUrl, tags, isActive } = req.body;
    await doc.update({ title, description, category, pdfUrl, tags, isActive });
    res.json({ success: true, document: doc.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren' });
  }
});

// Admin: DELETE document
app.delete('/api/admin/documents/:id', authenticateToken, async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Dokument nicht gefunden' });
    await doc.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Fehler beim Löschen' });
  }
});

// ─── Admin Middleware ────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@smail.th-koeln.de';

const requireAdmin = (req, res, next) => {
  if (req.user?.email !== ADMIN_EMAIL) {
    return res.status(403).json({ success: false, error: 'Admin-Zugriff erforderlich' });
  }
  next();
};

// ─── Admin Routes ────────────────────────────────────────────────────────────

// GET all scenarios (all phases)
app.get('/api/admin/scenarios', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const scenarios = await Scenario.findAll({ order: [['phase', 'ASC'], ['id', 'ASC']] });
    res.json({ success: true, scenarios: scenarios.map(s => s.toJSON()) });
  } catch (error) {
    console.error('Admin GET scenarios error:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Szenarien' });
  }
});

// PUT update scenario
app.put('/api/admin/scenarios/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, phase, type, difficulty, isActive, options } = req.body;

    const scenario = await Scenario.findByPk(id);
    if (!scenario) return res.status(404).json({ success: false, error: 'Szenario nicht gefunden' });

    await scenario.update({ title, description, phase, type, difficulty, isActive, options });
    res.json({ success: true, scenario: scenario.toJSON() });
  } catch (error) {
    console.error('Admin PUT scenario error:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren' });
  }
});

// POST create new scenario
app.post('/api/admin/scenarios', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, phase, type, difficulty, options } = req.body;
    if (!title || !description || !phase || !options?.length) {
      return res.status(400).json({ success: false, error: 'title, description, phase und options sind Pflichtfelder' });
    }
    const scenario = await Scenario.create({ title, description, phase, type: type || 'quiz', difficulty: difficulty || 'medium', options, isActive: true });
    res.status(201).json({ success: true, scenario: scenario.toJSON() });
  } catch (error) {
    console.error('Admin POST scenario error:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen' });
  }
});

// DELETE scenario
app.delete('/api/admin/scenarios/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const scenario = await Scenario.findByPk(req.params.id);
    if (!scenario) return res.status(404).json({ success: false, error: 'Szenario nicht gefunden' });
    await scenario.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE scenario error:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen' });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'E-Mail und Passwort sind erforderlich' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Passwort muss mindestens 6 Zeichen lang sein' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'E-Mail-Adresse ist bereits registriert' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registrierung erfolgreich',
      user: {
        id: user.id,
        email: user.email,
        role: 'student'
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler bei der Registrierung' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'E-Mail und Passwort sind erforderlich' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: 'student'
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Interner Serverfehler bei der Anmeldung' });
  }
});

// ─── User Tickets Routes ────────────────────────────────────────────────────────

// GET all tickets for the authenticated user
app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await UserTicket.findAll({
      where: { userId: req.user.userId },
      order: [['id', 'ASC']]
    });
    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Tickets' });
  }
});

// POST create a new ticket
app.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { title, description, storyPoints, priority } = req.body;

    if (!title || title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Titel muss mindestens 5 Zeichen haben'
      });
    }

    const ticket = await UserTicket.create({
      userId: req.user.userId,
      title: title.trim(),
      description: description?.trim() || '',
      storyPoints: storyPoints || 0,
      priority: priority || 'mittel'
    });

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen des Tickets' });
  }
});

// PUT update a ticket (Status, Story Points, etc.)
app.put('/api/tickets/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await UserTicket.findOne({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket nicht gefunden' });
    }

    const { title, description, storyPoints, priority, status } = req.body;

    await ticket.update({
      title: title ?? ticket.title,
      description: description ?? ticket.description,
      storyPoints: storyPoints ?? ticket.storyPoints,
      priority: priority ?? ticket.priority,
      status: status ?? ticket.status
    });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren des Tickets' });
  }
});

// DELETE a ticket
app.delete('/api/tickets/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await UserTicket.findOne({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket nicht gefunden' });
    }

    await ticket.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen des Tickets' });
  }
});

// POST seed templates – create initial template tickets for new user
app.post('/api/tickets/seed-templates', authenticateToken, async (req, res) => {
  try {
    const existing = await UserTicket.count({
      where: { userId: req.user.userId }
    });

    if (existing > 0) {
      return res.json({ success: true, message: 'Vorlagen bereits vorhanden' });
    }

    const templates = [
      {
        title: 'App-Entsperrung per Bluetooth',
        description: 'Als Radfahrer möchte ich mein Schloss per App entsperren, damit ich keinen physischen Schlüssel benötige.',
        storyPoints: 8,
        priority: 'hoch'
      },
      {
        title: 'GPS-Standort tracken',
        description: 'Als Nutzer möchte ich den Standort meines Fahrrads in Echtzeit sehen, damit ich es bei Diebstahl orten kann.',
        storyPoints: 5,
        priority: 'hoch'
      },
      {
        title: 'Diebstahlalarm Push-Nachricht',
        description: 'Als Nutzer möchte ich eine Push-Benachrichtigung erhalten, wenn jemand unbefugt mein Schloss öffnet.',
        storyPoints: 5,
        priority: 'hoch'
      }
    ];

    await UserTicket.bulkCreate(
      templates.map(t => ({
        ...t,
        userId: req.user.userId,
        isTemplate: true
      }))
    );

    res.json({ success: true, message: 'Vorlagen erfolgreich erstellt' });
  } catch (error) {
    console.error('Error seeding templates:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen der Vorlagen' });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await sequelize.sync();
    console.log(`Server running on port ${PORT}`);
    console.log('Connected to SQLite database');
  } catch (err) {
    console.error('Unable to sync database on startup:', err);
  }
});