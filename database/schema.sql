-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  progress JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game scenarios table
CREATE TABLE scenarios (
  id SERIAL PRIMARY KEY,
  scrum_role VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  options JSONB,
  correct_answer INTEGER,
  explanation TEXT,
  difficulty VARCHAR(50) DEFAULT 'medium'
);

-- User game sessions
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  scenario_id INTEGER REFERENCES scenarios(id),
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);