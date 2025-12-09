/**
 * Frontend JavaScript для Mini Kanban Board
 * Взаимодействие с Express API
 */

// Константы
const API_URL = '/api';
let currentFilter = 'all';

// ================================
// Инициализация
// ================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Приложение загружено');
  
  // Загружаем все задачи при загрузке страницы
  loadAllTasks();
  
  // Обработчики формы
  document.getElementById('createTaskForm').addEventListener('submit', handleCreateTask);
  
  // Обработчики фильтров
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', handleFilter);
  });

  // Обновляем статистику каждые 5 секунд
  setInterval(updateStats, 5000);
});

// ================================
// Загрузка и отображение задач
// ================================

/**
 * Загрузить все задачи с сервера
 */
async function loadAllTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Ошибка загрузки задач');
    
    const data = await response.json();
    displayTasks(data.tasks);
    updateStats();
  } catch (error) {
    console.error('❌ Ошибка при загрузке задач:', error);
    showMessage('Ошибка при загрузке задач', 'error');
  }
}

/**
 * Загрузить задачи с фильтром
 */
async function loadTasksByStatus(status) {
  try {
    const response = await fetch(`${API_URL}/tasks?status=${status}`);
    if (!response.ok) throw new Error('Ошибка загрузки задач');
    
    const data = await response.json();
    displayTasks(data.tasks);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    showMessage('Ошибка при загрузке задач', 'error');
  }
}

/**
 * Отобразить задачи на доске
 */
function displayTasks(tasks) {
  // Очищаем колонки
  document.getElementById('todoList').innerHTML = '';
  document.getElementById('inProgressList').innerHTML = '';
  document.getElementById('doneList').innerHTML = '';

  if (!tasks || tasks.length === 0) {
    const emptyMsg = '<div class="empty-message">📭 Нет задач</div>';
    document.getElementById('todoList').innerHTML = emptyMsg;
    return;
  }

  // Распределяем задачи по колонкам
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    
    if (task.status === 'todo') {
      document.getElementById('todoList').appendChild(taskElement);
    } else if (task.status === 'in-progress') {
      document.getElementById('inProgressList').appendChild(taskElement);
    } else if (task.status === 'done') {
      document.getElementById('doneList').appendChild(taskElement);
    }
  });

  // Проверяем пустые колонки
  ['todoList', 'inProgressList', 'doneList'].forEach(columnId => {
    const column = document.getElementById(columnId);
    if (column.children.length === 0) {
      column.innerHTML = '<div class="empty-message">📭 Нет задач</div>';
    }
  });
}

/**
 * Создать элемент карточки задачи
 */
function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = `task-card priority-${task.priority}`;
  div.dataset.taskId = task.id;

  const createdDate = new Date(task.createdAt).toLocaleDateString('ru-RU');

  div.innerHTML = `
    <div class="task-header">
      <div class="task-title">${escapeHtml(task.title)}</div>
      <span class="task-priority ${task.priority}">${getPriorityText(task.priority)}</span>
    </div>
    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
    <div class="task-meta">
      <span>ID: ${task.id}</span>
      <span>${createdDate}</span>
    </div>
    <div class="task-actions">
      <select class="task-status-select" onchange="handleStatusChange(event, ${task.id})">
        <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>К выполнению</option>
        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>В процессе</option>
        <option value="done" ${task.status === 'done' ? 'selected' : ''}>Завершено</option>
      </select>
      <button class="btn btn-danger" onclick="handleDeleteTask(${task.id})">🗑️ Удалить</button>
    </div>
  `;

  return div;
}

// ================================
// Обработка событий
// ================================

/**
 * Обработка создания новой задачи
 */
async function handleCreateTask(e) {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const status = document.getElementById('taskStatus').value;
  const priority = document.getElementById('taskPriority').value;

  if (!title.trim()) {
    showMessage('Введите название задачи', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        status,
        priority
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка создания задачи');
    }

    const data = await response.json();
    console.log('✅ Задача создана:', data.task);
    
    // Очищаем форму
    document.getElementById('createTaskForm').reset();
    
    // Перезагружаем задачи
    loadAllTasks();
    
    showMessage(`✨ Задача "${title}" создана успешно!`, 'success');
  } catch (error) {
    console.error('❌ Ошибка:', error);
    showMessage(error.message || 'Ошибка при создании задачи', 'error');
  }
}

/**
 * Обработка изменения статуса задачи
 */
async function handleStatusChange(e, taskId) {
  const newStatus = e.target.value;

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Ошибка обновления статуса');
    }

    const data = await response.json();
    console.log('✅ Статус обновлен:', data.task);
    
    loadAllTasks();
    showMessage('✅ Статус обновлен', 'success');
  } catch (error) {
    console.error('❌ Ошибка:', error);
    showMessage('Ошибка при обновлении статуса', 'error');
    loadAllTasks(); // Откатываем изменение
  }
}

/**
 * Обработка удаления задачи
 */
async function handleDeleteTask(taskId) {
  if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Ошибка удаления задачи');
    }

    const data = await response.json();
    console.log('✅ Задача удалена:', data.task);
    
    loadAllTasks();
    showMessage('🗑️ Задача удалена', 'success');
  } catch (error) {
    console.error('❌ Ошибка:', error);
    showMessage('Ошибка при удалении задачи', 'error');
  }
}

/**
 * Обработка фильтрации
 */
function handleFilter(e) {
  const filter = e.target.dataset.filter;
  currentFilter = filter;

  // Обновляем активную кнопку
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');

  // Загружаем задачи
  if (filter === 'all') {
    loadAllTasks();
  } else {
    loadTasksByStatus(filter);
  }
}

// ================================
// Статистика
// ================================

/**
 * Обновить статистику доски
 */
async function updateStats() {
  try {
    const response = await fetch(`${API_URL}/tasks/stats`);
    if (!response.ok) throw new Error('Ошибка загрузки статистики');
    
    const stats = await response.json();
    
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('todoCount').textContent = stats.todo;
    document.getElementById('inProgressCount').textContent = stats['in-progress'];
    document.getElementById('doneCount').textContent = stats.done;
  } catch (error) {
    console.error('❌ Ошибка при загрузке статистики:', error);
  }
}

// ================================
// Утилиты
// ================================

/**
 * Показать сообщение пользователю
 */
function showMessage(message, type = 'info') {
  const container = document.getElementById('messageContainer');
  const messageEl = document.createElement('div');
  messageEl.className = `message ${type}`;
  messageEl.textContent = message;

  container.appendChild(messageEl);

  // Удаляем сообщение через 4 секунды
  setTimeout(() => {
    messageEl.classList.add('removing');
    setTimeout(() => {
      messageEl.remove();
    }, 300);
  }, 4000);
}

/**
 * Экранировать HTML символы
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Получить текст приоритета
 */
function getPriorityText(priority) {
  const priorities = {
    'low': '🟢 Низкий',
    'medium': '🟡 Средний',
    'high': '🔴 Высокий'
  };
  return priorities[priority] || priority;
}
