/**
 * Маршруты для работы с задачами
 * Демонстрация: GET, POST, PUT, DELETE маршруты
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * GET /api/tasks - Получить все задачи
 * Query-параметры: ?status=todo|in-progress|done
 */
router.get('/tasks', taskController.getAllTasks);

/**
 * GET /api/tasks/stats - Получить статистику доски
 * Должен быть до маршрута с :id для правильной работы
 */
router.get('/tasks/stats', taskController.getBoardStats);

/**
 * GET /api/tasks/:id - Получить задачу по ID
 * Параметр пути: :id (число)
 */
router.get('/tasks/:id', taskController.getTaskById);

/**
 * POST /api/tasks - Создать новую задачу
 * Body: { title, description?, status?, priority? }
 */
router.post('/tasks', taskController.createTask);

/**
 * PUT /api/tasks/:id - Обновить задачу
 * Параметр пути: :id (число)
 * Body: { title?, description?, status?, priority? }
 */
router.put('/tasks/:id', taskController.updateTask);

/**
 * DELETE /api/tasks/:id - Удалить задачу
 * Параметр пути: :id (число)
 */
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
