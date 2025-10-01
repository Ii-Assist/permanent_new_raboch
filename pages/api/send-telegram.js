export default async function handler(req, res) {
  // Включаем CORS для всех источников
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Обработка OPTIONS запроса (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Проверка наличия переменных окружения
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Отсутствуют переменные окружения: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
      return res.status(500).json({ 
        error: "Ошибка конфигурации сервера: отсутствуют необходимые переменные окружения"
      });
    }

    // Проверяем, что req.body существует
    if (!req.body) {
      return res.status(400).json({ error: "Отсутствуют данные запроса" });
    }

    const { name, phone, service, message } = req.body;

    // Проверка обязательных полей
    if (!name || !phone || !service) {
      return res.status(400).json({ 
        error: "Не заполнены обязательные поля"
      });
    }

    const text = `
🔔 Новая заявка!
👤 Имя: ${name}
📱 Телефон: ${phone}
💅 Услуга: ${service}
💬 Комментарий: ${message || "Не указан"}
`.trim();

    console.log("Отправка сообщения в Telegram...");
    
    try {
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
        
        return res.status(500).json({ error: errorMessage });
      }
      
      // Парсим JSON только для успешных ответов
      const responseData = await tgResponse.json();
      
      console.log("Сообщение успешно отправлено:", responseData);
      return res.status(200).json({ ok: true });
    } catch (tgError) {
      console.error("Ошибка при запросе к Telegram API:", tgError);
      return res.status(500).json({ 
        error: "Ошибка при отправке сообщения в Telegram"
      });
    }
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return res.status(500).json({ 
      error: "Произошла ошибка при обработке запроса"
    });
  }
}
