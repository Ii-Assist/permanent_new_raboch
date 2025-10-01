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
    console.log("URL:", `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN.substring(0, 5)}***/sendMessage`);
    console.log("Chat ID:", TELEGRAM_CHAT_ID);
    
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML"
        }),
      }
    );

    const responseData = await tgResponse.json().catch(() => null);
    
    if (!tgResponse.ok) {
      console.error("Ошибка Telegram API:", tgResponse.status, responseData);
      throw new Error(`Ошибка Telegram API: ${tgResponse.status} ${JSON.stringify(responseData)}`);
    }

    console.log("Сообщение успешно отправлено");
    return { ok: true };
  } catch (error) {
    console.error("Детали ошибки:", error.message);
    throw error;
  }
}