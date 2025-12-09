/**
 * Главный файл Express приложения - Мини-канбан доска
 * 
 * Требуемые компоненты:
 * ✓ Базовый Express-сервер
 * ✓ Маршруты (GET, POST, PUT, DELETE)
 * ✓ Параметры (req.params и req.query)
 * ✓ Обработка body (express.json() и express.urlencoded())
 * ✓ Собственный middleware (logging.js)
 * ✓ Раздача статических файлов (express.static())
 * ✓ Модульная архитектура (routes + controllers)
 */

const express = require('express');
const path = require('path');
const loggingMiddleware = require('./middleware/logging');
const taskRoutes = require('./routes/tasks');

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// MIDDLEWARE
// ========================

// Встроенные middleware для обработки тела запроса
app.use(express.json()); // Обработка JSON
app.use(express.urlencoded({ extended: true })); // Обработка URL-encoded данных

// Собственный middleware для логирования
app.use(loggingMiddleware);

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// ========================
// МАРШРУТЫ API
// ========================

// API маршруты для задач с префиксом /api
app.use('/api', taskRoutes);

// ========================
// ГЛАВНАЯ СТРАНИЦА
// ========================

// GET / - Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========================
// ОБРАБОТКА ОШИБОК
// ========================

// Маршрут для несуществующих страниц (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `${req.method} ${req.originalUrl} is not defined`,
    availableRoutes: [
      'GET /api/tasks',
      'GET /api/tasks/:id',
      'GET /api/tasks/stats',
      'POST /api/tasks',
      'PUT /api/tasks/:id',
      'DELETE /api/tasks/:id'
    ]
  });
});

// ========================
// ЗАПУСК СЕРВЕРА
// ========================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   🎯 MINI KANBAN BOARD - EXPRESS SERVER 🎯   ║
╚═══════════════════════════════════════════════╝

Server is running at http://localhost:${PORT}

📋 API Endpoints:
  GET    /api/tasks              - Get all tasks
  GET    /api/tasks?status=todo  - Get tasks by status
  GET    /api/tasks/:id          - Get task by ID
  POST   /api/tasks              - Create new task
  PUT    /api/tasks/:id          - Update task
  DELETE /api/tasks/:id          - Delete task
  GET    /api/tasks/stats        - Get board statistics

🌐 Frontend: http://localhost:${PORT}

Press Ctrl+C to stop the server
`);
});

module.exports = app;
