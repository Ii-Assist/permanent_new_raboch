// Файл для обработки запросов на отправку сообщений в Telegram
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

export async function sendTelegramMessage(formData) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Проверка наличия переменных окружения
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Отсутствуют переменные окружения: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
    throw new Error("Ошибка конфигурации сервера: отсутствуют необходимые переменные окружения");
  }

  // Проверяем, что formData существует
  if (!formData) {
    throw new Error("Отсутствуют данные формы");
  }

  const { name, phone, service, message } = formData;

  // Проверка обязательных полей
  if (!name || !phone || !service) {
    throw new Error("Не заполнены обязательные поля");
  }

  const text = `
🔔 Новая заявка!
👤 Имя: ${name}
📱 Телефон: ${phone}
💅 Услуга: ${service}
💬 Комментарий: ${message || "Не указан"}
`.trim();

  try {
    console.log("Отправка сообщения в Telegram...");
    
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML"
        }),
      }
    );

    // Проверяем статус ответа перед парсингом JSON
    if (!tgResponse.ok) {
      const errorText = await tgResponse.text();
      console.error("Ошибка Telegram API:", tgResponse.status, errorText);
      
      let errorMessage = "Ошибка Telegram API";
      try {
        // Пытаемся распарсить ответ как JSON
        if (errorText.trim().startsWith('{')) {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.description || errorMessage;
        }
      } catch (e) {
        console.error("Не удалось распарсить ответ как JSON:", e);
      }
      
      throw new Error(errorMessage);
    }
    
    // Парсим JSON только для успешных ответов
    const responseData = await tgResponse.json();
    
    console.log("Сообщение успешно отправлено:", responseData);
    return { ok: true };
  } catch (error) {
    console.error("Детали ошибки:", error.message);
    throw error;
  }
}