# Отладка отправки сообщений в Telegram

## Выявленные проблемы

1. **Ошибка в отображении**: Сообщение `[object Object]` указывает на то, что объект ошибки преобразуется в строку напрямую
2. **Возможные проблемы с API**: Отсутствие полной обработки ошибок от Telegram API
3. **Проблемы с переменными окружения**: Возможно, токены не загружаются или содержат лишние пробелы

## Диагностические команды

### 1. Проверка токена бота

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getMe"
```

Замените `<TELEGRAM_BOT_TOKEN>` на ваш токен. Успешный ответ должен выглядеть так:
```json
{
  "ok": true,
  "result": {
    "id": 123456789,
    "is_bot": true,
    "first_name": "YourBotName",
    "username": "your_bot_username",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}
```

### 2. Проверка получения обновлений ботом

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates" | jq .
```

### 3. Тестовая отправка сообщения

```bash
curl -s -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendMessage" \
  -d chat_id=<TELEGRAM_CHAT_ID> \
  -d text="Тестовое сообщение" \
  -d parse_mode=HTML
```

### 4. Проверка логов на Vercel

```bash
vercel logs <project-name> --since 1h
```

Или через Dashboard: Vercel → Ваш проект → Deployments → Последний деплой → Functions → Выберите функцию → Logs

## Исправленные версии кода

### 1. Диагностический API-обработчик (Pages Router)

Создайте временный файл `pages/api/telegram-debug.js`:

```javascript
// Диагностический API-обработчик для отладки отправки в Telegram
export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Метод не разрешен' });
  }

  try {
    // Логируем входящие данные
    console.log('Входящие данные:', JSON.stringify(req.body));
    
    // Проверяем переменные окружения
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    
    console.log('Переменные окружения загружены:', {
      tokenExists: !!token,
      tokenLength: token?.length,
      chatIdExists: !!chatId,
      chatIdValue: chatId
    });
    
    if (!token || !chatId) {
      return res.status(500).json({
        success: false,
        error: 'Отсутствуют переменные окружения',
        details: {
          tokenExists: !!token,
          chatIdExists: !!chatId
        }
      });
    }
    
    // Формируем тестовое сообщение
    const message = `
<b>Тестовое сообщение</b>

<b>Время:</b> ${new Date().toISOString()}
<b>Данные формы:</b> ${JSON.stringify(req.body)}
    `;
    
    // Формируем данные для отправки
    const telegramData = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    };
    
    // Логируем данные для отправки
    console.log('Данные для отправки в Telegram:', JSON.stringify(telegramData));
    
    // Отправляем запрос в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(telegramData)
      }
    );
    
    // Получаем ответ в виде текста
    const responseText = await telegramResponse.text();
    console.log('Ответ от Telegram (текст):', responseText);
    
    // Пробуем распарсить JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Ответ от Telegram (JSON):', JSON.stringify(responseData));
    } catch (e) {
      console.error('Ошибка парсинга JSON ответа:', e);
      responseData = { ok: false, error: 'Невозможно распарсить ответ' };
    }
    
    // Возвращаем полную информацию для отладки
    return res.status(telegramResponse.ok ? 200 : 500).json({
      success: telegramResponse.ok,
      telegramOk: responseData?.ok,
      statusCode: telegramResponse.status,
      responseData,
      responseText,
      requestData: {
        url: `https://api.telegram.org/bot***TOKEN***/sendMessage`,
        body: telegramData
      }
    });
    
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return res.status(500).json({
      success: false,
      error: `Внутренняя ошибка сервера: ${error.message || 'Неизвестная ошибка'}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
```

### 2. Тестовая форма для отладки

Создайте временный файл `pages/telegram-test.js`:

```jsx
import { useState } from 'react';

export default function TelegramTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/telegram-debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Тестовый пользователь',
          phone: '+7 (999) 123-45-67',
          service: 'Тестовая услуга'
        }),
      });
      
      const text = await response.text();
      console.log('Ответ сервера (текст):', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Невозможно распарсить ответ: ${text}`);
      }
      
      setResult(data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Ошибка сервера: ${response.status}`);
      }
      
      alert('Сообщение успешно отправлено!');
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Тестирование отправки в Telegram</h1>
      
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Отправка...' : 'Отправить тестовое сообщение'}
      </button>
      
      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336',
          borderRadius: '4px'
        }}>
          <h3>Ошибка:</h3>
          <pre>{error}</pre>
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Результат запроса:</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

## Чек-лист для отладки

1. **Проверка переменных окружения**:
   - Убедитесь, что в `.env.local` правильно указаны `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`
   - Проверьте, что в Vercel добавлены те же переменные (Project → Settings → Environment Variables)
   - После изменения переменных в Vercel выполните Redeploy (Deployments → Latest → ⋮ → Redeploy)

2. **Проверка токена и чат ID**:
   - Выполните команду `curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getMe"`
   - Если ответ содержит `"ok": false`, токен недействителен
   - Для групповых чатов ID должен быть отрицательным числом

3. **Тестирование через отладочную страницу**:
   - Откройте `/telegram-test` в вашем приложении
   - Нажмите кнопку "Отправить тестовое сообщение"
   - Проанализируйте полученный ответ

4. **Проверка логов**:
   - Просмотрите логи функции в Vercel Dashboard
   - Ищите ошибки, связанные с переменными окружения или ответами от Telegram API

## Альтернативные решения

### 1. Использование axios вместо fetch

```javascript
const axios = require('axios');

// В обработчике API
const telegramResponse = await axios.post(
  `https://api.telegram.org/bot${token}/sendMessage`,
  telegramData
);

// Ответ уже будет в виде JSON
const responseData = telegramResponse.data;
```

### 2. Использование сервиса-посредника

Если есть проблемы с прямыми запросами к Telegram API, можно использовать сервис-посредник, например:
- Integromat/Make
- Zapier
- Собственный прокси-сервер

### 3. Временное логирование в файл/базу данных

Добавьте временное логирование всех запросов и ответов в базу данных или файл для более детального анализа.

## Что делать, если бот не имеет прав в группе

1. Добавьте бота в группу как администратора
2. Отключите Privacy Mode бота через @BotFather:
   - Напишите `/mybots` в чат с @BotFather
   - Выберите вашего бота
   - Выберите "Bot Settings" → "Group Privacy" → "Turn off"