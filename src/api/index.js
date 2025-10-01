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
    const result = await sendTelegramMessage(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error.message);
    res.status(500).json({ 
      error: 'Ошибка при отправке', 
      details: error.message 
    });
  }
});

// Запускаем сервер на порту 3001
const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API сервер запущен на порту ${PORT}`);
});