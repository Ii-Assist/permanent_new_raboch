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
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Метод не разрешен. Используйте POST-запрос.' 
    });
  }

  // Проверяем наличие переменных окружения
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('Ошибка: Отсутствуют переменные окружения TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    return res.status(500).json({ 
      success: false, 
      error: 'Ошибка конфигурации сервера. Пожалуйста, свяжитесь с администратором.' 
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

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'HTML'
        })
      }
    );

    // Получаем ответ от Telegram API
    const telegramData = await telegramResponse.json();

    // Проверяем успешность отправки
    if (!telegramData.ok) {
      console.error('Ошибка Telegram API:', telegramData);
      return res.status(500).json({ 
        success: false, 
        error: `Ошибка при отправке в Telegram: ${telegramData.description || 'Неизвестная ошибка'}` 
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
      error: 'Произошла ошибка при обработке запроса' 
    });
  }
}
