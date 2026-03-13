import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('quiz.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    subject TEXT,
    topic TEXT,
    score INTEGER,
    total_questions INTEGER,
    difficulty TEXT,
    time_taken INTEGER,
    date DATETIME DEFAULT CURRENT_VALUE
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    question_data TEXT,
    date DATETIME DEFAULT CURRENT_VALUE
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/results', (req, res) => {
    const { username, subject, topic, score, total_questions, difficulty, time_taken } = req.body;
    const stmt = db.prepare('INSERT INTO quiz_results (username, subject, topic, score, total_questions, difficulty, time_taken, date) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))');
    stmt.run(username, subject, topic, score, total_questions, difficulty, time_taken);
    res.json({ success: true });
  });

  app.get('/api/leaderboard', (req, res) => {
    const rows = db.prepare('SELECT username, subject, score, total_questions, date FROM quiz_results ORDER BY score DESC LIMIT 10').all();
    res.json(rows);
  });

  app.get('/api/analytics/:username', (req, res) => {
    const { username } = req.params;
    const history = db.prepare('SELECT * FROM quiz_results WHERE username = ? ORDER BY date DESC').all(username);
    const stats = db.prepare(`
      SELECT 
        subject, 
        AVG(CAST(score AS FLOAT) / total_questions) as avg_accuracy,
        COUNT(*) as total_quizzes
      FROM quiz_results 
      WHERE username = ? 
      GROUP BY subject
    `).all(username);
    res.json({ history, stats });
  });

  app.post('/api/bookmarks', (req, res) => {
    const { username, question_data } = req.body;
    const stmt = db.prepare('INSERT INTO bookmarks (username, question_data) VALUES (?, ?)');
    stmt.run(username, JSON.stringify(question_data));
    res.json({ success: true });
  });

  app.get('/api/bookmarks/:username', (req, res) => {
    const { username } = req.params;
    const rows = db.prepare('SELECT * FROM bookmarks WHERE username = ?').all(username);
    res.json(rows.map(r => ({ ...r, question_data: JSON.parse(r.question_data) })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
