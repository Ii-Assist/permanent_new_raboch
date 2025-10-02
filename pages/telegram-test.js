import { useState } from 'react';

export default function TelegramTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/send-telegram', {
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
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Текущие настройки:</strong></p>
        <ul>
          <li>TELEGRAM_BOT_TOKEN: {process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN ? '✅ Установлен' : '❌ Не установлен'}</li>
          <li>TELEGRAM_CHAT_ID: {process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || 'Недоступен на клиенте'}</li>
        </ul>
      </div>
      
      <button 
        onClick={handleTest} 
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