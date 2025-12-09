/**
 * Модуль для управления данными задач (in-memory storage)
 * В реальном приложении это была бы база данных
 */

let tasks = [
  {
    id: 1,
    title: 'Проанализировать требования',
    description: 'Изучить требования проекта и создать план',
    status: 'todo',
    priority: 'high',
    createdAt: new Date('2025-01-01')
  },
  {
    id: 2,
    title: 'Установить зависимости',
    description: 'npm install express и другие пакеты',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2025-01-02')
  },
  {
    id: 3,
    title: 'Создать базовый сервер',
    description: 'Инициализировать Express приложение',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2025-01-02')
  },
  {
    id: 4,
    title: 'Разработать API маршруты',
    description: 'Создать GET, POST, PUT, DELETE маршруты',
    status: 'done',
    priority: 'medium',
    createdAt: new Date('2025-01-03')
  }
];

let nextId = 5;

/**
 * Получить все задачи
 */
function getAllTasks() {
  return [...tasks];
}

/**
 * Получить задачу по ID
 */
function getTaskById(id) {
  return tasks.find(task => task.id === parseInt(id));
}

/**
 * Получить задачи по статусу
 */
function getTasksByStatus(status) {
  return tasks.filter(task => task.status === status);
}

/**
 * Создать новую задачу
 */
function createTask(taskData) {
  const newTask = {
    id: nextId++,
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    createdAt: new Date()
  };
  tasks.push(newTask);
  return newTask;
}

/**
 * Обновить задачу
 */
function updateTask(id, updatedData) {
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) return null;

  if (updatedData.title !== undefined) task.title = updatedData.title;
  if (updatedData.description !== undefined) task.description = updatedData.description;
  if (updatedData.status !== undefined) task.status = updatedData.status;
  if (updatedData.priority !== undefined) task.priority = updatedData.priority;

  return task;
}

/**
 * Удалить задачу
 */
function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) return false;

  const deletedTask = tasks[index];
  tasks.splice(index, 1);
  return deletedTask;
}

/**
 * Получить статистику доски
 */
function getBoardStats() {
  return {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };
}

module.exports = {
  getAllTasks,
  getTaskById,
  getTasksByStatus,
  createTask,
  updateTask,
  deleteTask,
  getBoardStats
};
