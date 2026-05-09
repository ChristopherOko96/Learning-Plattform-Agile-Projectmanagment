const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      isThKoelnEmail(value) {
        if (!value.endsWith('@smail.th-koeln.de')) {
          throw new Error('Only TH Köln email addresses (@smail.th-koeln.de) are allowed');
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  currentMotivation: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    validate: {
      min: 0,
      max: 100
    }
  },
  completedRoles: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  currentRole: {
    type: DataTypes.STRING,
    allowNull: true
  },
  completedScenarios: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Scenario model
const Scenario = sequelize.define('Scenario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phase: {
    type: DataTypes.ENUM('product_owner', 'scrum_master', 'developer', 'kanban'),
    allowNull: false
  },
  type: {
    // quiz = richtig/falsch, scenario = Entscheidungsfrage mit Score, text = KI-bewertete Freitextaufgabe
    type: DataTypes.ENUM('quiz', 'scenario', 'text'),
    defaultValue: 'quiz'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// UserAnswer model for tracking responses
const UserAnswer = sequelize.define('UserAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  scenarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Scenario,
      key: 'id'
    }
  },
  selectedOptionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scoreChange: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  motivationChange: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answeredAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Document model – Wissensbibliothek
const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Allgemein'
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Define associations
User.hasMany(UserAnswer, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserAnswer.belongsTo(User, { foreignKey: 'userId' });

Scenario.hasMany(UserAnswer, { foreignKey: 'scenarioId', onDelete: 'CASCADE' });
UserAnswer.belongsTo(Scenario, { foreignKey: 'scenarioId' });

module.exports = { User, Scenario, UserAnswer, Document };