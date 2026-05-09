import React, { useState, useEffect } from 'react'
import axios from 'axios'
import logoImage from './assets/images/th-koeln-logo.svg'
import './App.css'

const API_BASE_URL = 'http://localhost:5001/api'

const KANBAN_WIP_LIMIT = 3

const INITIAL_BOARD_CARDS = [
  { id: 'k1', title: 'Login & Registrierung', points: 3, priority: 'hoch',   column: 'done',        blocked: false, description: 'Nutzer können sich per E-Mail registrieren und anmelden.' },
  { id: 'k2', title: 'Bluetooth-Entsperrung', points: 8, priority: 'hoch',   column: 'in_progress', blocked: false, description: 'Schloss öffnet sich automatisch wenn autorisiertes Smartphone in Reichweite.' },
  { id: 'k3', title: 'App-Design & Navigation', points: 3, priority: 'mittel', column: 'in_progress', blocked: false, description: 'Grundlegendes UI-Design und Navigationsstruktur der App.' },
  { id: 'k4', title: 'Diebstahlalarm', points: 8, priority: 'hoch',   column: 'todo',        blocked: false, description: 'Push-Benachrichtigung bei unbefugtem Öffnungsversuch.' },
  { id: 'k5', title: 'Fingerabdruck-Sensor', points: 5, priority: 'mittel', column: 'todo',        blocked: true,  description: 'Entsperrung per Fingerabdruck. ⛔ Blockiert: Warte auf Hardware-Lieferung.' },
  { id: 'k6', title: 'GPS-Tracking', points: 5, priority: 'mittel', column: 'todo',        blocked: false, description: 'Echtzeit-Standort des Fahrrads in der App anzeigen.' },
  { id: 'k7', title: 'Push-Benachrichtigungen', points: 5, priority: 'mittel', column: 'todo',        blocked: false, description: 'Statusmeldungen und Alarme direkt aufs Smartphone.' },
  { id: 'k8', title: 'Share-Funktion', points: 3, priority: 'niedrig', column: 'todo',        blocked: false, description: 'Fahrrad-Standort mit anderen Nutzern teilen.' },
]

const getDecisionLabel = (score) => {
  if (score >= 15) return '⭐ Sehr gute Entscheidung!'
  if (score >= 0)  return '👍 Gute Entscheidung'
  return '⚠️ Nicht optimal'
}

const PHASES = [
  { id: 'product_owner', label: 'Product Owner', icon: '🎯', role: 'Product Owner', description: 'Backlog priorisieren, Wert maximieren, Stakeholder managen' },
  { id: 'scrum_master',  label: 'Scrum Master',  icon: '🚀', role: 'Scrum Master',  description: 'Team coachen, Prozess schützen, Impediments beseitigen' },
  { id: 'developer',     label: 'Developer',      icon: '💻', role: 'Developer',     description: 'Sprint-Ziel erreichen, Qualität sichern, selbst organisieren' },
  { id: 'kanban',        label: 'Kanban',          icon: '📊', role: null,            description: 'Workflow visualisieren, Flow optimieren, WIP-Limits verstehen' },
]

const DonutChart = ({ pct, size = 80, strokeWidth = 9, color, isDone }) => {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={isDone ? 'var(--accent-green)' : color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fontSize={size * 0.19} fontWeight="700"
        fill={isDone ? 'var(--accent-green)' : 'var(--text-primary)'}>
        {isDone ? '✓' : `${pct}%`}
      </text>
    </svg>
  )
}

const BADGE_DEFINITIONS = [
  { id: 'first_step',  icon: '🚀', label: 'Erster Schritt',    desc: 'Erste Aufgabe abgeschlossen',          check: (p) => (p.completedScenarios?.length || 0) >= 1 },
  { id: 'score_50',   icon: '💡', label: 'Wissenshungrig',    desc: '50+ Punkte gesammelt',                 check: (p) => (p.totalScore || 0) >= 50 },
  { id: 'score_150',  icon: '⭐', label: 'Experte',           desc: '150+ Punkte gesammelt',                check: (p) => (p.totalScore || 0) >= 150 },
  { id: 'po_done',    icon: '🎯', label: 'Product Owner',     desc: 'PO-Phase abgeschlossen',               check: (p) => p.phaseProgress?.product_owner?.completed >= p.phaseProgress?.product_owner?.total && p.phaseProgress?.product_owner?.total > 0 },
  { id: 'sm_done',    icon: '🛡️', label: 'Scrum Master',      desc: 'SM-Phase abgeschlossen',               check: (p) => p.phaseProgress?.scrum_master?.completed >= p.phaseProgress?.scrum_master?.total && p.phaseProgress?.scrum_master?.total > 0 },
  { id: 'dev_done',   icon: '💻', label: 'Developer',         desc: 'Developer-Phase abgeschlossen',        check: (p) => p.phaseProgress?.developer?.completed >= p.phaseProgress?.developer?.total && p.phaseProgress?.developer?.total > 0 },
  { id: 'all_done',   icon: '🏆', label: 'Agile Champion',    desc: 'Alle Phasen abgeschlossen!',           check: (p) => ['product_owner','scrum_master','developer','kanban'].every(k => p.phaseProgress?.[k]?.completed >= p.phaseProgress?.[k]?.total && p.phaseProgress?.[k]?.total > 0) },
]

const DONUT_COLORS = ['#e91e8c', '#4361ee', '#4cc9f0', '#f77f00']

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [selectedRole, setSelectedRole] = useState(null)
  const [scenarios, setScenarios] = useState([])
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const currentScenario = scenarios[currentQuestionIndex] ?? null
  const [userProgress, setUserProgress] = useState({
    totalScore: 0,
    currentMotivation: 50,
    completedRoles: [],
    currentRole: null,
    completedScenarios: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSelectedOption, setLastSelectedOption] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [boardCards, setBoardCards] = useState(INITIAL_BOARD_CARDS)
  const [wipWarning, setWipWarning] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [aiFeedback, setAiFeedback] = useState(null)
  const [aiEvaluating, setAiEvaluating] = useState(false)
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)
  const [documents, setDocuments] = useState([])
  const [activePdfDoc, setActivePdfDoc] = useState(null)
  const [libCategoryFilter, setLibCategoryFilter] = useState('Alle')
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  // Admin state
  const [adminScenarios, setAdminScenarios] = useState([])
  const [adminPhaseFilter, setAdminPhaseFilter] = useState('product_owner')
  const [editingScenario, setEditingScenario] = useState(null)
  const [adminTab, setAdminTab] = useState('scenarios') // 'scenarios' | 'documents'
  const [adminDocuments, setAdminDocuments] = useState([])
  const [editingDocument, setEditingDocument] = useState(null)

  // Auth state
  const [user, setUser] = useState(null)
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState('settings')

  const INITIAL_PROGRESS = {
    totalScore: 0,
    currentMotivation: 50,
    completedRoles: [],
    currentRole: null,
    completedScenarios: []
  }

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      loadUserData()
    } else {
      setCurrentView('login')
    }
  }, []) // intentionally runs only on mount; authToken from localStorage is stable at init

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(prev => !prev)
  const toggleSettings = () => setShowSettings(prev => !prev)
  const openSettingsTab = (tab) => { setSettingsTab(tab); setShowSettings(true) }

  const handleAuthSuccess = (token, userData) => {
    setAuthToken(token)
    setUser(userData)
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setCurrentView('dashboard')
  }

  const loadUserData = async () => {
    const storedUser = localStorage.getItem('userData')
    if (storedUser) setUser(JSON.parse(storedUser))
    setCurrentView('dashboard')
    await Promise.all([loadUserProgress(), loadDocuments()])
  }

  const loadDocuments = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/documents`)
      if (data.success) setDocuments(data.documents)
    } catch (err) {
      console.error('Error loading documents:', err)
    }
  }

  const loadUserProgress = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/progress`)
      if (response.data.success) setUserProgress(response.data.progress)
    } catch (err) {
      console.error('Error loading progress:', err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: loginForm.email,
        password: loginForm.password
      })
      if (data.success) {
        handleAuthSuccess(data.token, data.user)
        await loadUserProgress()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Anmeldung fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      setLoading(false)
      return
    }
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: registerForm.email,
        password: registerForm.password
      })
      if (data.success) {
        handleAuthSuccess(data.token, data.user)
        await loadUserProgress()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registrierung fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setAuthToken(null)
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    delete axios.defaults.headers.common['Authorization']
    setCurrentView('login')
    setUserProgress(INITIAL_PROGRESS)
  }

  const loadScenarios = async (phase) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE_URL}/scenarios?phase=${phase}`)
      if (response.data.success) {
        setScenarios(response.data.scenarios)
        setCurrentQuestionIndex(0)
      }
    } catch (err) {
      setError('Fehler beim Laden der Fragen')
      console.error('Error loading scenarios:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartGame = () => {
    setCurrentPhaseIndex(0)
    setCurrentQuestionIndex(0)
    setLastSelectedOption(null)
    setCurrentView('intro')
  }

  const handleStartPhase = async () => {
    await loadScenarios(PHASES[currentPhaseIndex].id)
    setCurrentView('scenario')
  }

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    setTextAnswer('')
    setAiFeedback(null)
    if (nextIndex < scenarios.length) {
      setCurrentQuestionIndex(nextIndex)
      setLastSelectedOption(null)
      setCurrentView('scenario')
    } else {
      const nextPhaseIndex = currentPhaseIndex + 1
      if (nextPhaseIndex < PHASES.length) {
        setCurrentPhaseIndex(nextPhaseIndex)
        setCurrentView('phase_complete')
      } else {
        setBoardCards(INITIAL_BOARD_CARDS)
        setCurrentView('kanban_board')
      }
    }
  }

  const handleNextPhase = async () => {
    setLastSelectedOption(null)
    setCurrentQuestionIndex(0)
    await loadScenarios(PHASES[currentPhaseIndex].id)
    setCurrentView('scenario')
  }

  const handleTextSubmit = async () => {
    if (!textAnswer.trim() || textAnswer.trim().length < 10) return
    setAiEvaluating(true)
    setError(null)
    try {
      const response = await axios.post(`${API_BASE_URL}/game/evaluate-text`, {
        scenarioId: currentScenario.id,
        userAnswer: textAnswer.trim()
      })
      if (response.data.success) {
        setAiFeedback(response.data)
        setUserProgress(response.data.userProgress)
      }
    } catch (err) {
      // On error still show submitted state without hint
      setAiFeedback({ needsHint: false, hint: '' })
      console.error('AI evaluation error:', err)
    } finally {
      setAiEvaluating(false)
    }
  }

  const handleTextNext = () => {
    setTextAnswer('')
    setAiFeedback(null)
    handleNextQuestion()
  }

  const handleAnswer = async (optionId) => {
    setLoading(true)
    setError(null)
    setLastSelectedOption(optionId)
    try {
      const response = await axios.post(`${API_BASE_URL}/game/answer`, {
        scenarioId: currentScenario.id,
        optionId: optionId
      })
      if (response.data.success) {
        setUserProgress(response.data.userProgress)
        setCurrentView('feedback')
      }
    } catch (err) {
      setError('Fehler beim Senden der Antwort')
      console.error('Error submitting answer:', err)
    } finally {
      setLoading(false)
    }
  }

  const ADMIN_EMAIL = 'admin@smail.th-koeln.de'
  const isAdmin = user?.email === ADMIN_EMAIL

  const loadAdminScenarios = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/scenarios`)
      if (data.success) setAdminScenarios(data.scenarios)
    } catch (err) {
      console.error('Admin load error:', err)
    }
  }

  const handleAdminSave = async () => {
    if (!editingScenario) return
    try {
      if (editingScenario.id) {
        await axios.put(`${API_BASE_URL}/admin/scenarios/${editingScenario.id}`, editingScenario)
      } else {
        await axios.post(`${API_BASE_URL}/admin/scenarios`, editingScenario)
      }
      await loadAdminScenarios()
      setEditingScenario(null)
    } catch (err) {
      console.error('Admin save error:', err)
    }
  }

  const handleAdminDelete = async (id) => {
    if (!window.confirm('Szenario wirklich löschen?')) return
    try {
      await axios.delete(`${API_BASE_URL}/admin/scenarios/${id}`)
      await loadAdminScenarios()
    } catch (err) {
      console.error('Admin delete error:', err)
    }
  }

  const loadAdminDocuments = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/documents`)
      if (data.success) setAdminDocuments(data.documents)
    } catch (err) {
      console.error('Admin doc load error:', err)
    }
  }

  const handleDocSave = async () => {
    if (!editingDocument) return
    try {
      if (editingDocument.id) {
        await axios.put(`${API_BASE_URL}/admin/documents/${editingDocument.id}`, editingDocument)
      } else {
        await axios.post(`${API_BASE_URL}/admin/documents`, editingDocument)
      }
      await Promise.all([loadAdminDocuments(), loadDocuments()])
      setEditingDocument(null)
    } catch (err) {
      console.error('Doc save error:', err)
    }
  }

  const handleDocDelete = async (id) => {
    if (!window.confirm('Dokument wirklich löschen?')) return
    try {
      await axios.delete(`${API_BASE_URL}/admin/documents/${id}`)
      await Promise.all([loadAdminDocuments(), loadDocuments()])
    } catch (err) {
      console.error('Doc delete error:', err)
    }
  }

  const updateOption = (optionIndex, field, value) => {
    setEditingScenario(prev => {
      const options = prev.options.map((opt, i) =>
        i === optionIndex ? { ...opt, [field]: field === 'scoreChange' || field === 'motivationChange' ? Number(value) : value } : opt
      )
      return { ...prev, options }
    })
  }

  const addOption = () => {
    const newId = Math.max(...editingScenario.options.map(o => o.id), 0) + 1
    setEditingScenario(prev => ({
      ...prev,
      options: [...prev.options, { id: newId, text: '', isCorrect: false, scoreChange: 0, motivationChange: 0, feedback: '' }]
    }))
  }

  const removeOption = (index) => {
    setEditingScenario(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }))
  }

  const handleMoveCard = (cardId, targetColumn) => {
    const inProgressCount = boardCards.filter(c => c.column === 'in_progress').length
    const card = boardCards.find(c => c.id === cardId)

    if (targetColumn === 'in_progress' && inProgressCount >= KANBAN_WIP_LIMIT) {
      setWipWarning(`WIP-Limit erreicht! Maximal ${KANBAN_WIP_LIMIT} Karten gleichzeitig "In Progress". Bring zuerst eine Aufgabe zu "Done".`)
      return
    }
    if (card.blocked && targetColumn === 'in_progress') {
      setWipWarning('Diese Story ist blockiert und kann noch nicht gestartet werden. Zuerst das Hindernis beseitigen!')
      return
    }

    setWipWarning(null)
    setBoardCards(prev => prev.map(c => c.id === cardId ? { ...c, column: targetColumn } : c))

    if (targetColumn === 'done') {
      setUserProgress(prev => ({ ...prev, totalScore: prev.totalScore + 10 }))
    }
  }

  const renderLibrary = () => {
    const categories = ['Alle', ...new Set(documents.map(d => d.category))]
    const filtered = libCategoryFilter === 'Alle'
      ? documents
      : documents.filter(d => d.category === libCategoryFilter)

    const CATEGORY_ICONS = {
      'Agiles PM': '🌀', 'Scrum': '⚡', 'Kanban': '📋', 'Allgemein': '📖'
    }

    return (
      <div className="library-page">
        {/* PDF Viewer Modal */}
        {activePdfDoc && (
          <div className="pdf-overlay" onClick={() => setActivePdfDoc(null)}>
            <div className="pdf-modal" onClick={e => e.stopPropagation()}>
              <div className="pdf-modal-header">
                <div>
                  <span className="pdf-modal-category">{activePdfDoc.category}</span>
                  <h3 className="pdf-modal-title">{activePdfDoc.title}</h3>
                </div>
                <div className="pdf-modal-actions">
                  <a href={activePdfDoc.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="pdf-open-external-btn">↗ Extern öffnen</a>
                  <button className="pdf-close-btn" onClick={() => setActivePdfDoc(null)}>✕</button>
                </div>
              </div>
              <iframe
                src={activePdfDoc.pdfUrl}
                className="pdf-iframe"
                title={activePdfDoc.title}
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="library-header">
          <button className="back-to-dashboard-btn" onClick={() => setCurrentView('dashboard')}>
            ← Dashboard
          </button>
          <div>
            <h2 className="library-title">📚 Wissensbibliothek</h2>
            <p className="library-subtitle">Lernmaterialien zu Agilem Projektmanagement, Scrum & Kanban</p>
          </div>
        </div>

        {/* Kategorie-Filter */}
        <div className="lib-filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`lib-filter-btn ${libCategoryFilter === cat ? 'active' : ''}`}
              onClick={() => setLibCategoryFilter(cat)}
            >
              {CATEGORY_ICONS[cat] || '📄'} {cat}
            </button>
          ))}
        </div>

        {/* Dokumente */}
        {filtered.length === 0 ? (
          <div className="lib-empty">
            <p>Noch keine Dokumente in dieser Kategorie.</p>
            {isAdmin && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Als Admin kannst du Dokumente über das Admin-Panel hinzufügen.
              </p>
            )}
          </div>
        ) : (
          <div className="lib-grid">
            {filtered.map(doc => (
              <div key={doc.id} className="lib-card" onClick={() => setActivePdfDoc(doc)}>
                <div className="lib-card-icon">{CATEGORY_ICONS[doc.category] || '📄'}</div>
                <div className="lib-card-body">
                  <span className="lib-card-category">{doc.category}</span>
                  <h4 className="lib-card-title">{doc.title}</h4>
                  {doc.description && <p className="lib-card-desc">{doc.description}</p>}
                  {doc.tags?.length > 0 && (
                    <div className="lib-card-tags">
                      {doc.tags.map(tag => <span key={tag} className="lib-tag">{tag}</span>)}
                    </div>
                  )}
                </div>
                <div className="lib-card-arrow">→</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderAuth = () => {
    return (
      <div className="auth-container">
        <div className="auth-toolbar">
          <div className="auth-toolbar-badge">
            <span className="auth-badge-label">TH Köln</span>
            <span className="auth-badge-chip">Scrum</span>
          </div>
          <div className="auth-toolbar-actions">
            <div className="settings-dropdown">
              <button className="settings-button" onClick={toggleSettings} aria-label="Einstellungen öffnen">
                ⚙️ Einstellungen
              </button>
              {showSettings && (
                <div className="settings-popover">
                  <div className="settings-panel-header">
                    <div>
                      <h3>{settingsTab === 'impressum' ? 'Impressum' : 'Einstellungen'}</h3>
                      <p className="settings-panel-subtitle">Kleine Schnellansicht direkt am Button.</p>
                    </div>
                    <button className="close-settings" onClick={toggleSettings} aria-label="Schließen">✕</button>
                  </div>
                  <div className="settings-panel-tabs">
                    <button className={settingsTab === 'settings' ? 'settings-tab active' : 'settings-tab'} onClick={() => openSettingsTab('settings')}>Einstellungen</button>
                    <button className={settingsTab === 'impressum' ? 'settings-tab active' : 'settings-tab'} onClick={() => openSettingsTab('impressum')}>Impressum</button>
                  </div>
                  <div className="settings-panel-content">
                    {settingsTab === 'settings' ? (
                      <>
                        <div className="settings-row">
                          <div>
                            <p className="settings-label">Darkmode</p>
                            <p className="settings-description">Schalte zwischen hellem und dunklem Design um.</p>
                          </div>
                          <button className="theme-toggle settings-toggle" onClick={toggleTheme}>
                            {isDarkMode ? '☀️' : '🌙'}
                          </button>
                        </div>
                        <div className="settings-row">
                          <div>
                            <p className="settings-label">Account</p>
                            <p className="settings-description">Später hier: Benutzername, Sprache und Personalisierung.</p>
                          </div>
                          <span className="settings-pill">Bald verfügbar</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>TH Köln – APM Learning Platform</p>
                        <p>Adresse: Claudiusstraße 1, 50678 Köln</p>
                        <p>Kontakt: info@th-koeln.de</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <img src={logoImage} alt="TH Köln Logo" className="th-koeln-logo-large" />
            <h1>TH Köln</h1>
            <h2>APM Learning Platform</h2>
            <p>Agiles Projektmanagement – Scrum & Kanban interaktiv lernen</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email">TH Köln E-Mail</label>
                <input
                  type="email"
                  id="login-email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="student@smail.th-koeln.de"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Passwort</label>
                <input
                  type="password"
                  id="login-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Anmeldung...' : 'Anmelden'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="register-email">TH Köln E-Mail</label>
                <input
                  type="email"
                  id="register-email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  placeholder="student@smail.th-koeln.de"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Passwort</label>
                <input
                  type="password"
                  id="register-password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  placeholder="Mindestens 6 Zeichen"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-confirm">Passwort bestätigen</label>
                <input
                  type="password"
                  id="register-confirm"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Registrierung...' : 'Registrieren'}
              </button>
            </form>
          )}

          <div className="auth-switch">
            {authMode === 'login' ? (
              <p>Noch kein Konto? <button onClick={() => setAuthMode('register')} className="link-button">Registrieren</button></p>
            ) : (
              <p>Bereits registriert? <button onClick={() => setAuthMode('login')} className="link-button">Anmelden</button></p>
            )}
          </div>
          <div className="auth-info">
            <p className="auth-info-text">
              🎓 Dieses Planspiel vermittelt Scrum-Konzepte spielerisch und praxisnah.<br/>
              Als TH Köln Studierende:r kannst du verschiedene Rollen übernehmen und Entscheidungen treffen.
            </p>
          </div>

        </div>
      </div>
    )
  }

  const renderDashboard = () => {
    const pp = userProgress.phaseProgress || {}
    const hasProgress = userProgress.completedScenarios?.length > 0
    const totalAnswered = userProgress.completedScenarios?.length || 0
    const totalQuestions = Object.values(pp).reduce((s, p) => s + (p.total || 0), 0) || 29
    const overallPct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0
    const resumePhase = userProgress.resumePhase
    const resumePhaseIndex = resumePhase ? PHASES.findIndex(p => p.id === resumePhase) : -1
    const earnedBadges = BADGE_DEFINITIONS.filter(b => b.check(userProgress))
    const nextPhase = resumePhase ? PHASES.find(p => p.id === resumePhase) : PHASES[0]

    const handleResume = async () => {
      if (resumePhaseIndex >= 0) {
        setCurrentPhaseIndex(resumePhaseIndex)
        await loadScenarios(PHASES[resumePhaseIndex].id)
        setCurrentView('scenario')
      } else {
        handleStartGame()
      }
    }

    return (
      <div className="dashboard">

        {/* ── Kopfbereich: Begrüßung + Score ── */}
        <div className="dashboard-hero">
          <div className="dashboard-welcome">
            <h2>Hey, {user?.email?.split('@')[0]}! 👋</h2>
            <p>Fallstudie: Smartes Fahrradschloss — VeloTech GmbH</p>
          </div>
          <div className="dashboard-score-box">
            <span className="score-number">{userProgress.totalScore || 0}</span>
            <span className="score-label">Punkte</span>
          </div>
        </div>

        {/* ── Nächste Aufgabe (prominenter CTA) ── */}
        <div className="dashboard-next-card">
          <div className="next-card-info">
            <span className="next-card-eyebrow">
              {hasProgress ? 'Weiter wo du aufgehört hast' : 'Starte deine Lernreise'}
            </span>
            <strong className="next-card-title">
              {nextPhase?.icon} {nextPhase?.label}
              {resumePhase && pp[resumePhase] && (
                <span className="next-card-sub">
                  — {pp[resumePhase].completed}/{pp[resumePhase].total} Aufgaben
                </span>
              )}
            </strong>
          </div>
          <button className="start-game-button next-card-btn" onClick={hasProgress && resumePhase ? handleResume : handleStartGame}>
            {hasProgress && resumePhase ? 'Weiterspielen →' : 'Jetzt starten →'}
          </button>
        </div>

        {/* ── Donut-Charts: Phase-Fortschritt ── */}
        <div className="dashboard-section">
          <h3 className="section-title">Lernfortschritt</h3>
          <div className="donut-grid">
            {PHASES.map((phase, i) => {
              const p = pp[phase.id] || { total: 0, completed: 0 }
              const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0
              const isDone = p.completed >= p.total && p.total > 0
              const isCurrent = phase.id === resumePhase
              return (
                <div key={phase.id} className={`donut-card ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}>
                  <DonutChart pct={pct} size={84} color={DONUT_COLORS[i]} isDone={isDone} />
                  <span className="donut-icon">{phase.icon}</span>
                  <span className="donut-label">{phase.label}</span>
                  <span className="donut-sub">{p.completed}/{p.total}</span>
                  {isCurrent && <span className="donut-badge-current">Aktuell</span>}
                  {isDone && <span className="donut-badge-done">✓</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Errungenschaften ── */}
        <div className="dashboard-section">
          <h3 className="section-title">
            Errungenschaften
            <span className="badge-count">{earnedBadges.length}/{BADGE_DEFINITIONS.length}</span>
          </h3>
          <div className="badges-grid">
            {BADGE_DEFINITIONS.map(badge => {
              const earned = badge.check(userProgress)
              return (
                <div key={badge.id} className={`badge-item ${earned ? 'earned' : 'locked'}`} title={badge.desc}>
                  <span className="badge-icon">{earned ? badge.icon : '🔒'}</span>
                  <span className="badge-label">{badge.label}</span>
                  {earned && <span className="badge-earned-glow" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Neustart ── */}
        {hasProgress && (
          <button className="secondary-button" onClick={handleStartGame}
            style={{ width: '100%', marginTop: '0.5rem' }}>
            Von vorne beginnen
          </button>
        )}
      </div>
    )
  }

  const renderIntro = () => (
    <div className="intro-screen">
      <div className="intro-header">
        <div className="intro-logo">🔒</div>
        <h2>Willkommen bei VeloTech GmbH</h2>
        <p className="intro-subtitle">Fallstudie: Entwicklung eines smarten Fahrradschlosses</p>
      </div>

      <div className="intro-story">
        <p>
          Die <strong>VeloTech GmbH</strong> entwickelt ein innovatives smartes Fahrradschloss.
          Das Produkt soll Radfahrern maximale Sicherheit und Komfort bieten —
          entsperrbar per App, Bluetooth und Fingerabdruck, ergänzt durch GPS-Tracking
          und einen Diebstahlalarm.
        </p>
        <p>
          Das Team arbeitet agil nach <strong>Scrum</strong>. Du wirst im Laufe des Planspiels
          alle drei Scrum-Rollen übernehmen und dabei typische Situationen aus dem Projektalltag meistern.
        </p>
      </div>

      <div className="intro-backlog">
        <h3>Product Backlog — Smart Lock (Auszug)</h3>
        <div className="backlog-table">
          <div className="backlog-header">
            <span>Priorität</span>
            <span>User Story</span>
            <span>Story Points</span>
          </div>
          <div className="backlog-row high">
            <span className="priority-badge high">Hoch</span>
            <span>Als Radfahrer möchte ich das Schloss per Bluetooth öffnen, damit ich ohne Schlüssel auskomme.</span>
            <span className="sp-badge">8 SP</span>
          </div>
          <div className="backlog-row high">
            <span className="priority-badge high">Hoch</span>
            <span>Als Radfahrer möchte ich bei Diebstahlversuch sofort benachrichtigt werden, damit ich reagieren kann.</span>
            <span className="sp-badge">8 SP</span>
          </div>
          <div className="backlog-row medium">
            <span className="priority-badge medium">Mittel</span>
            <span>Als Radfahrer möchte ich das Schloss per Fingerabdruck öffnen, damit es noch bequemer ist.</span>
            <span className="sp-badge">5 SP</span>
          </div>
          <div className="backlog-row medium">
            <span className="priority-badge medium">Mittel</span>
            <span>Als Nutzer möchte ich den Standort meines Fahrrads per GPS tracken, damit ich es immer finde.</span>
            <span className="sp-badge">5 SP</span>
          </div>
          <div className="backlog-row low">
            <span className="priority-badge low">Niedrig</span>
            <span>Als Nutzer möchte ich Fahrrad-Standorte mit Freunden teilen können.</span>
            <span className="sp-badge">3 SP</span>
          </div>
        </div>
      </div>

      <div className="intro-roles-preview">
        <h3>Deine Rollen im Planspiel</h3>
        <div className="intro-roles-grid">
          {PHASES.map(phase => (
            <div key={phase.id} className="intro-role-card">
              <span className="intro-role-icon">{phase.icon}</span>
              <div>
                <strong>{phase.label}</strong>
                <p>{phase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="start-game-button" onClick={handleStartPhase}>
        Los geht's — Als Product Owner starten →
      </button>
    </div>
  )

  const renderScenario = () => {
    if (loading) {
      return (
        <div className="scenario">
          <div className="loading">Lade Szenario...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="scenario">
          <div className="error">{error}</div>
          <button onClick={() => setCurrentView('dashboard')}>Zurück</button>
        </div>
      )
    }

    if (!currentScenario) {
      return (
        <div className="scenario">
          <div>Keine Szenarien verfügbar für diese Rolle.</div>
          <button onClick={() => setCurrentView('dashboard')}>Zurück</button>
        </div>
      )
    }

    const phase = PHASES[currentPhaseIndex]
    const questionNum = currentQuestionIndex + 1
    const questionTotal = scenarios.length

    return (
      <div className="scenario">
        {/* Warnhinweis-Modal */}
        {showLeaveWarning && (
          <div className="leave-warning-overlay" onClick={() => setShowLeaveWarning(false)}>
            <div className="leave-warning-modal" onClick={e => e.stopPropagation()}>
              <div className="leave-warning-icon">⚠️</div>
              <h3>Fortschritt verlassen?</h3>
              <p>Deine Antworten in dieser Aufgabe werden <strong>nicht gespeichert</strong>, wenn du jetzt das Dashboard öffnest.</p>
              <div className="leave-warning-buttons">
                <button className="leave-confirm-btn" onClick={() => {
                  setShowLeaveWarning(false)
                  setLastSelectedOption(null)
                  setTextAnswer('')
                  setAiFeedback(null)
                  setCurrentView('dashboard')
                }}>
                  Trotzdem zurück
                </button>
                <button className="leave-cancel-btn" onClick={() => setShowLeaveWarning(false)}>
                  Weiterspielen
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="phase-progress-header">
          <button className="back-to-dashboard-btn" onClick={() => setShowLeaveWarning(true)}>
            ← Dashboard
          </button>
          <div className="phase-steps">
            {PHASES.map((p, i) => (
              <div key={p.id} className={`phase-step ${i < currentPhaseIndex ? 'done' : ''} ${i === currentPhaseIndex ? 'active' : ''}`}>
                <span className="phase-step-icon">{p.icon}</span>
                <span className="phase-step-label">{p.label}</span>
              </div>
            ))}
          </div>
          <div className="phase-question-counter">
            {phase.icon} {phase.label} — Frage {questionNum} / {questionTotal}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-info">
            <div className="score">Score: {userProgress.totalScore}</div>
            <div className="motivation">Motivation: {userProgress.currentMotivation}%</div>
          </div>
          <div className="phase-bar-track">
            <div className="phase-bar-fill" style={{ width: `${(questionNum / questionTotal) * 100}%` }} />
          </div>
        </div>
        <div className="scenario-type-badge">
          {currentScenario.type === 'quiz' ? '🧠 Wissensfrage' : currentScenario.type === 'text' ? '✍️ Freitextaufgabe' : '⚙️ Entscheidungsszenario'}
        </div>
        <h2>{currentScenario.title}</h2>
        <p className="scenario-description">{currentScenario.description}</p>

        {currentScenario.type === 'text' ? (
          renderTextTask()
        ) : (
          <div className="options">
            {currentScenario.options.map(option => (
              <button
                key={option.id}
                className="option-button"
                onClick={() => handleAnswer(option.id)}
                disabled={loading}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderTextTask = () => {
    const isSubmitted = !!aiFeedback
    const showHint = isSubmitted && aiFeedback.needsHint && aiFeedback.hint

    return (
      <div className="text-task-container">
        <div className="text-task-body">
          {/* Linke Seite: Textarea + Buttons */}
          <div className="text-task-left">
            <textarea
              className={`text-task-input${isSubmitted ? ' submitted' : ''}`}
              placeholder="Schreibe deine Antwort hier... (mindestens 10 Zeichen)"
              value={textAnswer}
              onChange={e => !isSubmitted && setTextAnswer(e.target.value)}
              rows={8}
              readOnly={isSubmitted}
            />
            <div className="text-task-footer">
              {!isSubmitted ? (
                <>
                  <span className="text-char-count">{textAnswer.length} Zeichen</span>
                  <button
                    className="submit-text-button"
                    onClick={handleTextSubmit}
                    disabled={aiEvaluating || textAnswer.trim().length < 10}
                  >
                    {aiEvaluating ? (
                      <span className="ai-loading-spinner">
                        <span className="spinner-dot" />
                        Wird geprüft...
                      </span>
                    ) : 'Antwort abgeben →'}
                  </button>
                </>
              ) : (
                <button className="continue-button" onClick={handleTextNext}>
                  Weiter →
                </button>
              )}
            </div>
          </div>

          {/* Rechte Seite: Sprechblase (nur wenn Hinweis vorhanden) */}
          {showHint && (
            <div className="hint-bubble-wrapper">
              <div className="hint-bubble">
                <div className="hint-bubble-avatar">🤖</div>
                <div className="hint-bubble-content">
                  <span className="hint-bubble-label">Denk nochmal nach…</span>
                  <p>{aiFeedback.hint}</p>
                </div>
              </div>
              <div className="hint-bubble-tail" />
            </div>
          )}

          {/* Bestätigung ohne Hinweis */}
          {isSubmitted && !showHint && (
            <div className="hint-bubble-wrapper">
              <div className="hint-bubble confirmed">
                <div className="hint-bubble-avatar">🤖</div>
                <div className="hint-bubble-content">
                  <span className="hint-bubble-label">Gut gemacht!</span>
                  <p>Deine Antwort wurde abgegeben. Weiter zum nächsten Abschnitt.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderFeedback = () => {
    if (loading) return <div className="feedback"><div className="loading">Verarbeite Antwort...</div></div>
    if (error) return <div className="feedback"><div className="error">{error}</div><button onClick={() => setCurrentView('dashboard')}>Zurück</button></div>

    const selectedOption = currentScenario?.options.find(opt => opt.id === lastSelectedOption)
    const isQuiz = currentScenario?.type === 'quiz'
    const isCorrect = selectedOption?.isCorrect ?? null
    const isLastQuestion = currentQuestionIndex + 1 >= scenarios.length
    const isLastPhase = currentPhaseIndex + 1 >= PHASES.length

    let actionButton
    if (!isLastQuestion) {
      actionButton = <button className="continue-button" onClick={handleNextQuestion}>Nächste Frage →</button>
    } else if (isLastPhase) {
      actionButton = <button className="continue-button" onClick={() => setCurrentView('game_complete')}>Spiel abschließen 🏆</button>
    } else {
      actionButton = <button className="continue-button" onClick={() => { setCurrentPhaseIndex(p => p + 1); setCurrentView('phase_complete') }}>Nächste Phase →</button>
    }

    return (
      <div className="feedback">
        {isQuiz ? (
          <div className={`answer-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✅ Richtig!' : '❌ Leider falsch'}
          </div>
        ) : (
          <div className={`answer-badge ${selectedOption?.scoreChange >= 0 ? 'correct' : 'incorrect'}`}>
            {getDecisionLabel(selectedOption?.scoreChange)}
          </div>
        )}
        <h2>{currentScenario?.title}</h2>
        <p className="feedback-text">{selectedOption?.feedback || 'Feedback wird geladen...'}</p>
        <div className="result-stats">
          <div className={`stat-change ${selectedOption?.scoreChange >= 0 ? 'positive' : 'negative'}`}>
            Score: {selectedOption?.scoreChange > 0 ? '+' : ''}{selectedOption?.scoreChange}
          </div>
          <div className={`stat-change ${selectedOption?.motivationChange >= 0 ? 'positive' : 'negative'}`}>
            Motivation: {selectedOption?.motivationChange > 0 ? '+' : ''}{selectedOption?.motivationChange}%
          </div>
        </div>
        <div className="feedback-actions">
          {actionButton}
          <button className="secondary-button" onClick={() => setCurrentView('dashboard')}>
            Zum Dashboard
          </button>
        </div>
      </div>
    )
  }

  const renderPhaseComplete = () => {
    const completedPhase = PHASES[currentPhaseIndex - 1] || PHASES[currentPhaseIndex]
    const nextPhase = PHASES[currentPhaseIndex]
    const isRolePhase = !!completedPhase.role

    return (
      <div className="phase-complete">
        <div className="phase-complete-icon">{completedPhase.icon}</div>
        <h2>
          {isRolePhase ? `Rolle abgeschlossen!` : `Phase abgeschlossen!`}
        </h2>
        <p className="phase-complete-label">
          {isRolePhase
            ? `Du hast die Rolle des ${completedPhase.role} gemeistert.`
            : `${completedPhase.label} abgeschlossen.`}
        </p>
        <div className="phase-complete-stats">
          <div className="stat"><span className="stat-value">{userProgress.totalScore}</span><span className="stat-label">Gesamtscore</span></div>
          <div className="stat"><span className="stat-value">{userProgress.currentMotivation}%</span><span className="stat-label">Motivation</span></div>
        </div>
        {nextPhase && (
          <div className="next-phase-preview">
            <p>{nextPhase.role ? 'Nächste Rolle:' : 'Nächster Abschnitt:'}</p>
            <div className="next-phase-card">
              <span className="next-phase-icon">{nextPhase.icon}</span>
              <div>
                <strong>{nextPhase.label}</strong>
                <p>{nextPhase.description}</p>
              </div>
            </div>
          </div>
        )}
        <button className="continue-button" onClick={handleNextPhase}>
          {nextPhase.role ? `Als ${nextPhase.role} weitermachen →` : `${nextPhase.label} starten →`}
        </button>
      </div>
    )
  }

  const renderAdminDashboard = () => {
    const phaseLabels = { product_owner: '🎯 Product Owner', scrum_master: '🚀 Scrum Master', developer: '💻 Developer', kanban: '📊 Kanban' }
    const filtered = adminScenarios.filter(s => s.phase === adminPhaseFilter)
    const CATEGORY_ICONS = { 'Agiles PM': '🌀', 'Scrum': '⚡', 'Kanban': '📋', 'Allgemein': '📖' }

    return (
      <div className="admin-screen">
        <div className="admin-header">
          <div>
            <h2>🔧 Admin-Panel</h2>
            <p className="admin-subtitle">Szenarien und Bibliotheksinhalte verwalten.</p>
          </div>
          <button className="secondary-button" onClick={() => setCurrentView('dashboard')}>← Dashboard</button>
        </div>

        {/* ── Haupt-Tabs: Szenarien | Bibliothek ── */}
        <div className="admin-main-tabs">
          <button
            className={`admin-main-tab ${adminTab === 'scenarios' ? 'active' : ''}`}
            onClick={() => setAdminTab('scenarios')}
          >
            🎮 Szenarien
            <span className="admin-tab-count">{adminScenarios.length}</span>
          </button>
          <button
            className={`admin-main-tab ${adminTab === 'documents' ? 'active' : ''}`}
            onClick={() => { setAdminTab('documents'); loadAdminDocuments() }}
          >
            📚 Bibliothek
            <span className="admin-tab-count">{adminDocuments.length}</span>
          </button>
        </div>

        {/* ── Szenarien-Tab ── */}
        {adminTab === 'scenarios' && (
          <>
            <div className="admin-tab-toolbar">
              <div className="admin-phase-tabs">
                {Object.entries(phaseLabels).map(([id, label]) => (
                  <button
                    key={id}
                    className={`admin-tab ${adminPhaseFilter === id ? 'active' : ''}`}
                    onClick={() => setAdminPhaseFilter(id)}
                  >
                    {label}
                    <span className="admin-tab-count">{adminScenarios.filter(s => s.phase === id).length}</span>
                  </button>
                ))}
              </div>
              <button className="admin-new-btn" onClick={() => setEditingScenario({
                title: '', description: '', phase: adminPhaseFilter, type: 'quiz', difficulty: 'medium', isActive: true,
                options: [
                  { id: 1, text: '', isCorrect: true,  scoreChange: 20, motivationChange: 5,  feedback: '' },
                  { id: 2, text: '', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: '' },
                  { id: 3, text: '', isCorrect: false, scoreChange: -10, motivationChange: -5, feedback: '' },
                ]
              })}>
                + Neues Szenario
              </button>
            </div>
            <div className="admin-scenario-list">
              {filtered.length === 0 && <p className="admin-empty">Keine Szenarien in dieser Phase.</p>}
              {filtered.map(scenario => (
                <div key={scenario.id} className={`admin-scenario-card ${!scenario.isActive ? 'inactive' : ''}`}>
                  <div className="admin-scenario-info">
                    <div className="admin-scenario-badges">
                      <span className={`scenario-type-badge type-${scenario.type}`}>
                        {scenario.type === 'quiz' ? '🧠 Quiz' : scenario.type === 'text' ? '✍️ Freitext' : '⚙️ Szenario'}
                      </span>
                      <span className="admin-difficulty">{scenario.difficulty}</span>
                      {!scenario.isActive && <span className="admin-inactive-badge">inaktiv</span>}
                    </div>
                    <h4>{scenario.title}</h4>
                    <p className="admin-scenario-desc">{scenario.description.substring(0, 120)}…</p>
                    <span className="admin-options-count">{scenario.options.length} Antwortoptionen</span>
                  </div>
                  <div className="admin-scenario-actions">
                    <button className="admin-edit-btn" onClick={() => setEditingScenario({ ...scenario, options: JSON.parse(JSON.stringify(scenario.options)) })}>
                      ✏️ Bearbeiten
                    </button>
                    <button className="admin-delete-btn" onClick={() => handleAdminDelete(scenario.id)}>
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Bibliothek-Tab ── */}
        {adminTab === 'documents' && (
          <>
            <div className="admin-tab-toolbar">
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                PDFs per URL hinzufügen. Lokale Dateien in <code>backend/uploads/</code> legen → URL: <code>/uploads/datei.pdf</code>
              </p>
              <button className="admin-new-btn" onClick={() => setEditingDocument({
                title: '', description: '', category: 'Allgemein', pdfUrl: '', tags: [], isActive: true
              })}>
                + Neues Dokument
              </button>
            </div>
            <div className="admin-scenario-list">
              {adminDocuments.length === 0 && <p className="admin-empty">Noch keine Dokumente vorhanden.</p>}
              {adminDocuments.map(doc => (
                <div key={doc.id} className={`admin-scenario-card ${!doc.isActive ? 'inactive' : ''}`}>
                  <div className="admin-scenario-info">
                    <div className="admin-scenario-badges">
                      <span className="admin-doc-category-badge">
                        {CATEGORY_ICONS[doc.category] || '📄'} {doc.category}
                      </span>
                      {!doc.isActive && <span className="admin-inactive-badge">inaktiv</span>}
                    </div>
                    <h4>{doc.title}</h4>
                    {doc.description && <p className="admin-scenario-desc">{doc.description.substring(0, 120)}</p>}
                    <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer"
                      className="admin-doc-url-preview" onClick={e => e.stopPropagation()}>
                      ↗ {doc.pdfUrl.length > 60 ? doc.pdfUrl.substring(0, 60) + '…' : doc.pdfUrl}
                    </a>
                  </div>
                  <div className="admin-scenario-actions">
                    <button className="admin-edit-btn" onClick={() => setEditingDocument({ ...doc, tags: doc.tags || [] })}>
                      ✏️ Bearbeiten
                    </button>
                    <button className="admin-delete-btn" onClick={() => handleDocDelete(doc.id)}>
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  const renderAdminDocEditor = () => {
    if (!editingDocument) return null
    const isNew = !editingDocument.id
    const tagsStr = Array.isArray(editingDocument.tags) ? editingDocument.tags.join(', ') : ''

    return (
      <div className="admin-screen">
        <div className="admin-header">
          <div>
            <h2>{isNew ? '➕ Neues Dokument' : '✏️ Dokument bearbeiten'}</h2>
            <p className="admin-subtitle">{isNew ? 'Füge ein neues Lernmaterial zur Bibliothek hinzu.' : `ID: ${editingDocument.id}`}</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-save-btn" onClick={handleDocSave}>💾 Speichern</button>
            <button className="secondary-button" onClick={() => setEditingDocument(null)}>← Zurück</button>
          </div>
        </div>

        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 2 }}>
              <label>Titel *</label>
              <input type="text" value={editingDocument.title}
                onChange={e => setEditingDocument(p => ({ ...p, title: e.target.value }))}
                placeholder="z.B. Scrum Guide 2020 (Deutsch)" />
            </div>
            <div className="admin-form-group">
              <label>Kategorie</label>
              <select value={editingDocument.category}
                onChange={e => setEditingDocument(p => ({ ...p, category: e.target.value }))}>
                <option>Agiles PM</option>
                <option>Scrum</option>
                <option>Kanban</option>
                <option>Allgemein</option>
              </select>
            </div>
            <div className="admin-form-group admin-toggle-group">
              <label>Aktiv</label>
              <input type="checkbox" checked={editingDocument.isActive}
                onChange={e => setEditingDocument(p => ({ ...p, isActive: e.target.checked }))} />
            </div>
          </div>

          <div className="admin-form-group full-width">
            <label>PDF-Datei / URL *</label>
            <div className="admin-upload-row">
              <input type="text" value={editingDocument.pdfUrl}
                onChange={e => setEditingDocument(p => ({ ...p, pdfUrl: e.target.value }))}
                placeholder="https://... oder /uploads/mein-skript.pdf"
                style={{ flex: 1 }} />
              <label className={`admin-upload-btn ${uploadingPdf ? 'uploading' : ''}`}>
                {uploadingPdf ? (
                  <><span className="spinner-dot" /> Wird hochgeladen…</>
                ) : (
                  <>📤 PDF hochladen</>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  disabled={uploadingPdf}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploadingPdf(true)
                    setUploadError(null)
                    try {
                      const formData = new FormData()
                      formData.append('pdf', file)
                      const { data } = await axios.post(
                        `${API_BASE_URL}/admin/documents/upload`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                      )
                      if (data.success) {
                        setEditingDocument(p => ({
                          ...p,
                          pdfUrl: `http://localhost:5001${data.url}`,
                          title: p.title || data.originalName.replace('.pdf', '')
                        }))
                      }
                    } catch (err) {
                      setUploadError(err.response?.data?.error || 'Upload fehlgeschlagen')
                    } finally {
                      setUploadingPdf(false)
                      e.target.value = ''
                    }
                  }}
                />
              </label>
            </div>
            {uploadError && <p className="admin-upload-error">{uploadError}</p>}
            <p className="admin-field-hint">Datei hochladen (max. 50 MB) oder externe URL eingeben.</p>
          </div>

          <div className="admin-form-group full-width">
            <label>Beschreibung</label>
            <textarea rows={3} value={editingDocument.description || ''}
              onChange={e => setEditingDocument(p => ({ ...p, description: e.target.value }))}
              placeholder="Kurze Beschreibung des Dokuments (optional)" />
          </div>

          <div className="admin-form-group full-width">
            <label>Tags <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--text-muted)' }}>(kommagetrennt)</span></label>
            <input type="text" value={tagsStr}
              onChange={e => setEditingDocument(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
              placeholder="Scrum, Guide, Grundlagen" />
          </div>

          {editingDocument.pdfUrl && (
            <div className="admin-doc-preview">
              <p className="admin-form-group full-width" style={{ margin: 0 }}>
                <label>Vorschau</label>
              </p>
              <iframe src={editingDocument.pdfUrl} className="admin-doc-iframe" title="Vorschau" />
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderAdminEditor = () => {
    if (!editingScenario) return null
    const isNew = !editingScenario.id

    return (
      <div className="admin-screen">
        <div className="admin-header">
          <div>
            <h2>{isNew ? '➕ Neues Szenario' : '✏️ Szenario bearbeiten'}</h2>
            <p className="admin-subtitle">{isNew ? 'Erstelle ein neues Quiz oder Entscheidungsszenario.' : `ID: ${editingScenario.id}`}</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-save-btn" onClick={handleAdminSave}>💾 Speichern</button>
            <button className="secondary-button" onClick={() => setEditingScenario(null)}>← Zurück</button>
          </div>
        </div>

        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Phase</label>
              <select value={editingScenario.phase} onChange={e => setEditingScenario(p => ({ ...p, phase: e.target.value }))}>
                <option value="product_owner">Product Owner</option>
                <option value="scrum_master">Scrum Master</option>
                <option value="developer">Developer</option>
                <option value="kanban">Kanban</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Typ</label>
              <select value={editingScenario.type} onChange={e => setEditingScenario(p => ({ ...p, type: e.target.value }))}>
                <option value="quiz">Quiz (richtig / falsch)</option>
                <option value="scenario">Szenario (Entscheidung)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Schwierigkeit</label>
              <select value={editingScenario.difficulty} onChange={e => setEditingScenario(p => ({ ...p, difficulty: e.target.value }))}>
                <option value="easy">Einfach</option>
                <option value="medium">Mittel</option>
                <option value="hard">Schwer</option>
              </select>
            </div>
            <div className="admin-form-group admin-toggle-group">
              <label>Aktiv</label>
              <input type="checkbox" checked={editingScenario.isActive} onChange={e => setEditingScenario(p => ({ ...p, isActive: e.target.checked }))} />
            </div>
          </div>

          <div className="admin-form-group full-width">
            <label>Titel</label>
            <input type="text" value={editingScenario.title} onChange={e => setEditingScenario(p => ({ ...p, title: e.target.value }))} placeholder="Kurzer, prägnanter Titel" />
          </div>

          <div className="admin-form-group full-width">
            <label>Beschreibung / Situation</label>
            <textarea rows={5} value={editingScenario.description} onChange={e => setEditingScenario(p => ({ ...p, description: e.target.value }))} placeholder="Szenario-Beschreibung, Kontext der Frage..." />
          </div>

          <div className="admin-options-section">
            <div className="admin-options-header">
              <h3>Antwortoptionen</h3>
              <button className="admin-add-option-btn" onClick={addOption}>+ Option hinzufügen</button>
            </div>

            {editingScenario.options.map((opt, i) => (
              <div key={i} className={`admin-option-card ${opt.isCorrect ? 'correct' : ''}`}>
                <div className="admin-option-header">
                  <span className="admin-option-num">Option {i + 1}</span>
                  <label className="admin-correct-label">
                    <input type="checkbox" checked={opt.isCorrect} onChange={e => updateOption(i, 'isCorrect', e.target.checked)} />
                    Richtige Antwort
                  </label>
                  <div className="admin-score-inputs">
                    <label>Score
                      <input type="number" value={opt.scoreChange} onChange={e => updateOption(i, 'scoreChange', e.target.value)} />
                    </label>
                    <label>Motivation
                      <input type="number" value={opt.motivationChange} onChange={e => updateOption(i, 'motivationChange', e.target.value)} />
                    </label>
                  </div>
                  {editingScenario.options.length > 2 && (
                    <button className="admin-remove-option" onClick={() => removeOption(i)}>✕</button>
                  )}
                </div>
                <input type="text" className="admin-option-text" value={opt.text} onChange={e => updateOption(i, 'text', e.target.value)} placeholder={`Antworttext Option ${i + 1}...`} />
                <textarea rows={2} value={opt.feedback} onChange={e => updateOption(i, 'feedback', e.target.value)} placeholder="Feedback nach Auswahl dieser Option..." />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderKanbanBoard = () => {
    const columns = [
      { id: 'todo',        label: 'To Do',        icon: '📋', limit: null },
      { id: 'in_progress', label: 'In Progress',  icon: '⚙️',  limit: KANBAN_WIP_LIMIT },
      { id: 'done',        label: 'Done',          icon: '✅', limit: null },
    ]
    const inProgressCount = boardCards.filter(c => c.column === 'in_progress').length
    const doneCount       = boardCards.filter(c => c.column === 'done').length

    const priorityColor = { hoch: 'priority-high', mittel: 'priority-medium', niedrig: 'priority-low' }

    return (
      <div className="kanban-screen">
        <div className="kanban-header">
          <div>
            <h2>📊 Kanban Board — VeloTech Smart Lock</h2>
            <p className="kanban-subtitle">
              Bewege Karten von <strong>To Do → In Progress → Done</strong>.
              WIP-Limit für "In Progress": <strong>{KANBAN_WIP_LIMIT}</strong>.
            </p>
          </div>
          <div className="kanban-score">
            <span>Score: {userProgress.totalScore}</span>
            <span className="kanban-done-badge">{doneCount} / {boardCards.length} Done</span>
          </div>
        </div>

        {wipWarning && (
          <div className="wip-warning">
            ⚠️ {wipWarning}
          </div>
        )}

        <div className="kanban-board">
          {columns.map(col => {
            const cards = boardCards.filter(c => c.column === col.id)
            const isOverLimit = col.limit && inProgressCount > col.limit
            const isAtLimit   = col.limit && inProgressCount === col.limit

            return (
              <div key={col.id} className="kanban-column">
                <div className={`kanban-column-header ${isOverLimit ? 'over-limit' : isAtLimit ? 'at-limit' : ''}`}>
                  <span>{col.icon} {col.label}</span>
                  {col.limit && (
                    <span className={`wip-badge ${isOverLimit ? 'over' : isAtLimit ? 'at' : 'ok'}`}>
                      {inProgressCount}/{col.limit}
                    </span>
                  )}
                </div>

                <div className="kanban-cards">
                  {cards.map(card => (
                    <div key={card.id} className={`kanban-card ${card.blocked ? 'blocked' : ''}`}>
                      <div className="kanban-card-top">
                        <span className={`kanban-priority ${priorityColor[card.priority]}`}>
                          {card.priority}
                        </span>
                        <span className="kanban-sp">{card.points} SP</span>
                      </div>
                      <h4 className="kanban-card-title">{card.title}</h4>
                      <p className="kanban-card-desc">{card.description}</p>
                      <div className="kanban-card-actions">
                        {card.column === 'todo' && (
                          <button
                            className="kanban-move-btn"
                            onClick={() => handleMoveCard(card.id, 'in_progress')}
                          >
                            Starten →
                          </button>
                        )}
                        {card.column === 'in_progress' && (
                          <button
                            className="kanban-move-btn done"
                            onClick={() => handleMoveCard(card.id, 'done')}
                          >
                            Fertigstellen ✓
                          </button>
                        )}
                        {card.column === 'done' && (
                          <span className="kanban-done-label">✅ Abgeschlossen</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div className="kanban-empty">Keine Karten</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="kanban-legend">
          <div className="legend-item"><span className="wip-badge ok">2/3</span> WIP im Limit</div>
          <div className="legend-item"><span className="wip-badge at">3/3</span> Limit erreicht</div>
          <div className="legend-item"><span className="wip-badge over">4/3</span> Limit überschritten</div>
          <div className="legend-item"><span className="kanban-blocked-dot" /> Blockierte Story</div>
        </div>

        <button
          className="continue-button"
          style={{ marginTop: '2rem' }}
          onClick={() => setCurrentView('game_complete')}
        >
          Planspiel abschließen 🏆
        </button>
      </div>
    )
  }

  const renderGameComplete = () => (
    <div className="game-complete">
      <div className="game-complete-icon">🏆</div>
      <h2>Planspiel abgeschlossen!</h2>
      <p>
        Du hast alle drei Scrum-Rollen des Smart Lock Teams bei VeloTech GmbH durchgespielt
        und Kanban als ergänzendes Werkzeug kennengelernt.
      </p>
      <div className="final-stats">
        <div className="stat"><span className="stat-value">{userProgress.totalScore}</span><span className="stat-label">Gesamtscore</span></div>
        <div className="stat"><span className="stat-value">{userProgress.completedScenarios.length}</span><span className="stat-label">Fragen beantwortet</span></div>
        <div className="stat"><span className="stat-value">{userProgress.currentMotivation}%</span><span className="stat-label">Motivation</span></div>
      </div>
      <div className="game-complete-roles">
        <p>Du hast folgende Rollen und Konzepte erlebt:</p>
        <div className="completed-roles">
          <span>🎯 Product Owner</span>
          <span>🚀 Scrum Master</span>
          <span>💻 Developer</span>
          <span>📊 Kanban</span>
        </div>
      </div>
      <button className="continue-button" onClick={() => { setCurrentPhaseIndex(0); setCurrentView('dashboard') }}>
        Nochmal spielen
      </button>
    </div>
  )

  return (
    <div className="app">
      {currentView === 'login' && renderAuth()}
      {currentView !== 'login' && (
        <>
          <div className="header">
            <div className="header-content">
              <div className="logo-section">
                <div className="th-koeln-logo">
                  <img src={logoImage} alt="TH Köln" style={{ height: '52px', width: 'auto', display: 'block' }} />
                </div>
                <div className="title-section">
                  <h1>APM Learning Platform</h1>
                  <p>Agiles Projektmanagement · Scrum & Kanban · VeloTech</p>
                </div>
              </div>
              <div className="header-actions">
                <button className="theme-toggle" onClick={toggleTheme}>
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
                <button className="lib-nav-btn" onClick={async () => { await loadDocuments(); setLibCategoryFilter('Alle'); setCurrentView('library') }}>
                  📚 Bibliothek
                </button>
                {isAdmin && (
                  <button className="admin-nav-btn" onClick={async () => {
                    await Promise.all([loadAdminScenarios(), loadAdminDocuments()])
                    setEditingScenario(null)
                    setEditingDocument(null)
                    setAdminTab('scenarios')
                    setCurrentView('admin_dashboard')
                  }}>
                    🔧 Admin
                  </button>
                )}
                <button className="logout-button" onClick={handleLogout}>
                  Abmelden
                </button>
              </div>
            </div>
          </div>
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'intro' && renderIntro()}
          {currentView === 'scenario' && renderScenario()}
          {currentView === 'feedback' && renderFeedback()}
          {currentView === 'phase_complete' && renderPhaseComplete()}
          {currentView === 'kanban_board' && renderKanbanBoard()}
          {currentView === 'admin_dashboard' && (
            editingScenario ? renderAdminEditor() :
            editingDocument ? renderAdminDocEditor() :
            renderAdminDashboard()
          )}
          {currentView === 'game_complete' && renderGameComplete()}
          {currentView === 'library' && renderLibrary()}
        </>
      )}
    </div>
  )
}

export default App