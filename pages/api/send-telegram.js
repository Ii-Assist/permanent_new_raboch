/**
 * API-обработчик для отправки сообщений в Telegram
 * 
 * Этот файл обрабатывает POST-запросы с данными формы и отправляет их в Telegram
 * через Bot API. Он проверяет наличие необходимых переменных окружения, валидирует
 * входящие данные и обрабатывает ошибки.
 * 
 * Переменные окружения:
 * - TELEGRAM_BOT_TOKEN: Токен бота Telegram (получается у @BotFather)
 * - TELEGRAM_CHAT_ID: ID чата или канала для отправки сообщений
 */

export default async function handler(req, res) {
  // Включаем расширенное логирование для диагностики
  console.log('Получен запрос на /api/send-telegram:', {
    method: req.method,
    headers: req.headers,
    hasBody: !!req.body,
    envVars: {
      hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasTelegramChatId: !!process.env.TELEGRAM_CHAT_ID
    }
  });

  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Метод не разрешен. Используйте POST-запрос.' 
    });
  }

  // Проверяем наличие переменных окружения
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_BOT_TOKEN.trim()) {
    console.error('Ошибка: Отсутствует или пустая переменная окружения TELEGRAM_BOT_TOKEN');
    return res.status(500).json({ 
      success: false, 
      error: 'Ошибка конфигурации сервера: отсутствует токен бота. Пожалуйста, свяжитесь с администратором.' 
    });
  }

  if (!process.env.TELEGRAM_CHAT_ID || !process.env.TELEGRAM_CHAT_ID.trim()) {
    console.error('Ошибка: Отсутствует или пустая переменная окружения TELEGRAM_CHAT_ID');
    return res.status(500).json({ 
      success: false, 
      error: 'Ошибка конфигурации сервера: отсутствует ID чата. Пожалуйста, свяжитесь с администратором.' 
    });
  }

  try {
    // Проверяем наличие тела запроса
    if (!req.body) {
      return res.status(400).json({ 
        success: false, 
        error: 'Отсутствуют данные в запросе' 
      });
    }

    console.log('Данные запроса:', req.body);

    const { name, phone, service, message } = req.body;

    // Валидация обязательных полей
    if (!name || !phone || !service) {
      return res.status(400).json({ 
        success: false, 
        error: 'Пожалуйста, заполните все обязательные поля (имя, телефон, услуга)' 
      });
    }

    // Формируем текст сообщения с HTML-форматированием
    const messageText = `
<b>Новая заявка с сайта!</b>

<b>Имя:</b> ${name}
<b>Телефон:</b> ${phone}
<b>Услуга:</b> ${service}
${message ? `<b>Сообщение:</b> ${message}` : ''}

<i>Отправлено через форму на сайте</i>
`.trim();

    // Подготовка данных для отправки в Telegram
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramBody = {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: messageText,
      parse_mode: 'HTML'
    };

    console.log('Отправка запроса в Telegram:', {
      url: telegramUrl.replace(process.env.TELEGRAM_BOT_TOKEN, 'HIDDEN_TOKEN'),
      body: telegramBody
    });

    // Логируем данные для отладки
    console.log('Отправка данных в Telegram:', {
      token: process.env.TELEGRAM_BOT_TOKEN ? 'Токен установлен' : 'Токен отсутствует',
      chatId: process.env.TELEGRAM_CHAT_ID,
      messageLength: messageText.length
    });

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(telegramBody)
    });

    // Проверяем статус ответа
    if (!telegramResponse.ok) {
      const statusText = telegramResponse.statusText || 'Нет текста статуса';
      console.error(`Ошибка HTTP при отправке в Telegram: ${telegramResponse.status} ${statusText}`);
      
      try {
        // Пытаемся получить тело ответа для дополнительной информации
        const errorBody = await telegramResponse.text();
        console.error('Тело ответа с ошибкой:', errorBody);
        
        return res.status(500).json({
          success: false,
          error: `Ошибка при отправке в Telegram: HTTP ${telegramResponse.status} ${statusText}`,
          details: errorBody
        });
      } catch (textError) {
        return res.status(500).json({
          success: false,
          error: `Ошибка при отправке в Telegram: HTTP ${telegramResponse.status} ${statusText}`,
          details: 'Не удалось получить детали ошибки'
        });
      }
    }

    // Получаем ответ от Telegram API
    let telegramData;
    try {
      telegramData = await telegramResponse.json();
      console.log('Ответ от Telegram API:', telegramData);
    } catch (jsonError) {
      console.error('Ошибка при парсинге JSON ответа от Telegram:', jsonError);
      return res.status(500).json({
        success: false,
        error: 'Получен некорректный ответ от Telegram API',
        details: jsonError.message
      });
    }

    // Проверяем успешность отправки
    if (!telegramData.ok) {
      console.error('Ошибка Telegram API:', telegramData);
      return res.status(500).json({ 
        success: false, 
        error: `Ошибка при отправке в Telegram: ${telegramData.description || 'Неизвестная ошибка'}`,
        telegram_error: telegramData
      });
    }

    // Возвращаем успешный ответ
    return res.status(200).json({ 
      success: true, 
      message: 'Сообщение успешно отправлено в Telegram' 
    });

  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return res.status(500).json({ 
      success: false, 
      error: `Внутренняя ошибка сервера: ${error.message || 'Неизвестная ошибка'}` 
    });
  }
}
