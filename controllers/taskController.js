/**
 * Controllers для обработки бизнес-логики задач
 */

const tasksData = require('../data/tasks');

/**
 * Получить все задачи
 * Поддерживает фильтрацию по статусу через query-параметры
 */
exports.getAllTasks = (req, res) => {
  const { status } = req.query;

  if (status) {
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: todo, in-progress, done'
      });
    }
    const tasks = tasksData.getTasksByStatus(status);
    return res.json({
      count: tasks.length,
      tasks
    });
  }

  const tasks = tasksData.getAllTasks();
  res.json({
    count: tasks.length,
    tasks
  });
};

/**
 * Получить задачу по ID (использует req.params)
 */
exports.getTaskById = (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Task ID must be a number'
    });
  }

  const task = tasksData.getTaskById(id);

  if (!task) {
    return res.status(404).json({
      error: `Task with ID ${id} not found`
    });
  }

  res.json(task);
};

/**
 * Создать новую задачу (обработка body)
 */
exports.createTask = (req, res) => {
  const { title, description, status, priority } = req.body;

  // Валидация обязательных полей
  if (!title || title.trim() === '') {
    return res.status(400).json({
      error: 'Title is required and cannot be empty'
    });
  }

  // Валидация статуса
  const validStatuses = ['todo', 'in-progress', 'done'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status. Must be one of: todo, in-progress, done'
    });
  }

  // Валидация приоритета
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority. Must be one of: low, medium, high'
    });
  }

  const newTask = tasksData.createTask({
    title: title.trim(),
    description: description ? description.trim() : '',
    status,
    priority
  });

  res.status(201).json({
    message: 'Task created successfully',
    task: newTask
  });
};

/**
 * Обновить задачу (PUT - использует req.params и req.body)
 */
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Task ID must be a number'
    });
  }

  const existingTask = tasksData.getTaskById(id);
  if (!existingTask) {
    return res.status(404).json({
      error: `Task with ID ${id} not found`
    });
  }

  // Валидация статуса
  const validStatuses = ['todo', 'in-progress', 'done'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status. Must be one of: todo, in-progress, done'
    });
  }

  // Валидация приоритета
  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority. Must be one of: low, medium, high'
    });
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;

  const updatedTask = tasksData.updateTask(id, updateData);

  res.json({
    message: 'Task updated successfully',
    task: updatedTask
  });
};

/**
 * Удалить задачу (DELETE - использует req.params)
 */
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Task ID must be a number'
    });
  }

  const deletedTask = tasksData.deleteTask(id);

  if (!deletedTask) {
    return res.status(404).json({
      error: `Task with ID ${id} not found`
    });
  }

  res.json({
    message: 'Task deleted successfully',
    task: deletedTask
  });
};

/**
 * Получить статистику доски
 */
exports.getBoardStats = (req, res) => {
  const stats = tasksData.getBoardStats();
  res.json(stats);
};
