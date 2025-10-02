import { useState } from 'react';

export default function TelegramTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Отправка тестового сообщения...');
      
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: 'Тестовый пользователь',
          phone: '+7 (999) 123-45-67',
          service: 'Тестовая услуга'
        }),
      });
      
      console.log('Получен ответ:', response.status, response.statusText);
      console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
      
      // Получаем текст ответа для отладки
      const responseText = await response.text();
      console.log('Текст ответа:', responseText);
      
      // Парсим JSON из текста
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Данные ответа:', data);
      } catch (e) {
        console.error('Ошибка парсинга JSON:', e);
        throw new Error(`Невозможно распарсить ответ: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`);
      }
      
      setResult(data);
      
      if (!response.ok || data.success === false) {
        let errorMessage = data.error || `Ошибка сервера: ${response.status}`;
        if (data.details && typeof data.details === 'object') {
          errorMessage += ` (${JSON.stringify(data.details)})`;
        } else if (data.details) {
          errorMessage += ` (${data.details})`;
        }
        throw new Error(errorMessage);
      }
      
      alert('Сообщение успешно отправлено!');
    } catch (err: any) {
      console.error('Ошибка:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Тестирование отправки в Telegram</h1>
      
      <div className="bg-secondary/20 p-4 rounded-lg mb-6">
        <p className="font-medium mb-2">Текущие настройки:</p>
        <ul className="list-disc pl-5">
          <li>TELEGRAM_BOT_TOKEN: ✅ Установлен в .env.local</li>
          <li>TELEGRAM_CHAT_ID: ✅ Установлен в .env.local</li>
        </ul>
      </div>
      
      <button 
        onClick={handleTest} 
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {loading ? 'Отправка...' : 'Отправить тестовое сообщение'}
      </button>
      
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md">
          <h3 className="font-bold text-red-800 mb-2">Ошибка:</h3>
          <pre className="whitespace-pre-wrap text-red-700">{error}</pre>
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Результат запроса:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}