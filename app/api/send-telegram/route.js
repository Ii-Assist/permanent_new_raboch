/**
 * API-обработчик для отправки сообщений в Telegram (Next.js App Router)
 * 
 * Этот файл обрабатывает POST-запросы с данными формы и отправляет их в Telegram
 * через Bot API. Он проверяет наличие необходимых переменных окружения, валидирует
 * входящие данные и обрабатывает ошибки.
 * 
 * Переменные окружения:
 * - TELEGRAM_BOT_TOKEN: Токен бота Telegram (получается у @BotFather)
 * - TELEGRAM_CHAT_ID: ID чата или канала для отправки сообщений
 */

export async function POST(request) {
  try {
    // Проверяем наличие переменных окружения
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Ошибка: Отсутствуют переменные окружения TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
      return Response.json(
        { 
          success: false, 
          error: 'Ошибка конфигурации сервера. Пожалуйста, свяжитесь с администратором.' 
        },
        { status: 500 }
      );
    }

    // Получаем данные из запроса
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      console.error('Ошибка при парсинге JSON:', error);
      return Response.json(
        { 
          success: false, 
          error: 'Неверный формат данных. Ожидается JSON.' 
        },
        { status: 400 }
      );
    }

    // Проверяем наличие данных
    if (!requestData) {
      return Response.json(
        { 
          success: false, 
          error: 'Отсутствуют данные в запросе' 
        },
        { status: 400 }
      );
    }

    const { name, phone, service, message } = requestData;

    // Валидация обязательных полей
    if (!name || !phone || !service) {
      return Response.json(
        { 
          success: false, 
          error: 'Пожалуйста, заполните все обязательные поля (имя, телефон, услуга)' 
        },
        { status: 400 }
      );
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
      return Response.json(
        { 
          success: false, 
          error: `Ошибка при отправке в Telegram: ${telegramData.description || 'Неизвестная ошибка'}` 
        },
        { status: 500 }
      );
    }

    // Возвращаем успешный ответ
    return Response.json(
      { 
        success: true, 
        message: 'Сообщение успешно отправлено в Telegram' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Произошла ошибка при обработке запроса' 
      },
      { status: 500 }
    );
  }
}