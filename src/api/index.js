import express from 'express';
import { sendTelegramMessage } from './send-telegram.js';
import cors from 'cors';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API-эндпоинт для отправки сообщений в Telegram
app.post('/api/send-telegram', async (req, res) => {
  try {
    console.log('Получен запрос на отправку в Telegram:', req.body);
    const result = await sendTelegramMessage(req.body);
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    
    let errorMessage = error.message;
    let errorDetails = {};
    
    try {
      // Пытаемся распарсить сообщение об ошибке как JSON
      const errorData = JSON.parse(error.message);
      errorMessage = errorData.message || errorMessage;
      errorDetails = errorData.details || {};
    } catch (e) {
      // Если не удалось распарсить, используем исходное сообщение
      console.log('Не удалось распарсить сообщение об ошибке:', e);
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: errorDetails
    });
  }
});

// Запускаем сервер на порту 3001
const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API сервер запущен на порту ${PORT}`);
});