/**
 * Собственный middleware для логирования запросов
 * Требуемый компонент: минимум один собственный middleware
 */

function loggingMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  
  // Логируем входящий запрос
  console.log(`[${timestamp}] ${method} ${url}`);

  // Сохраняем оригинальный res.json для логирования ответа
  const originalJson = res.json;
  
  res.json = function(data) {
    console.log(`[${timestamp}] ✓ ${method} ${url} - Response status: ${res.statusCode}`);
    return originalJson.call(this, data);
  };

  // Переходим к следующему middleware/маршруту
  next();
}

module.exports = loggingMiddleware;
