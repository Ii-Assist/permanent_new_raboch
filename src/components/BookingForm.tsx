import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export function BookingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Функция для форматирования номера телефона
  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const phoneNumber = value.replace(/\D/g, "");
    
    // Форматируем номер телефона в зависимости от длины
    if (phoneNumber.length <= 1) {
      return phoneNumber === "7" ? "+7" : phoneNumber === "8" ? "+7" : "+7" + phoneNumber;
    } else if (phoneNumber.length <= 4) {
      return "+7 (" + phoneNumber.substring(1, 4);
    } else if (phoneNumber.length <= 7) {
      return "+7 (" + phoneNumber.substring(1, 4) + ") " + phoneNumber.substring(4, 7);
    } else if (phoneNumber.length <= 9) {
      return "+7 (" + phoneNumber.substring(1, 4) + ") " + phoneNumber.substring(4, 7) + "-" + phoneNumber.substring(7, 9);
    } else {
      return "+7 (" + phoneNumber.substring(1, 4) + ") " + phoneNumber.substring(4, 7) + "-" + phoneNumber.substring(7, 9) + "-" + phoneNumber.substring(9, 11);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedPhone });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyAccepted) {
      toast({
        title: "Ошибка!",
        description: "Необходимо согласиться с политикой конфиденциальности",
        variant: "destructive",
      });
      return;
    }
    
    // Проверка заполнения обязательных полей
    if (!formData.name || !formData.phone || !formData.service) {
      toast({
        title: "Ошибка!",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('Отправка данных формы:', formData);
      
      // Используем прямой URL для API Telegram
      const telegramUrl = "https://api.telegram.org/bot8422402031:AAEa0HwWbQJbBrRhz-zEvlXseEkvGulz7aA/sendMessage";
      console.log('Отправка запроса напрямую в Telegram:', telegramUrl);
      
      // Формируем сообщение для Telegram
      const messageText = `
<b>Новая заявка с сайта!</b>

<b>Имя:</b> ${formData.name}
<b>Телефон:</b> ${formData.phone}
<b>Услуга:</b> ${formData.service}
${formData.message ? `<b>Сообщение:</b> ${formData.message}` : ''}

<i>Отправлено через форму на сайте</i>
`.trim();

      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          chat_id: "936781211",
          text: messageText,
          parse_mode: "HTML"
        }),
        cache: "no-store"
      });

      console.log('Получен ответ:', response.status, response.statusText);
      console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
      
      // Проверяем ответ от Telegram API
      let responseData;
      try {
        responseData = await response.json();
        console.log('Данные ответа:', responseData);
      } catch (jsonError) {
        console.error('Ошибка при парсинге JSON:', jsonError);
        // Даже если не удалось распарсить JSON, но сообщение отправлено, считаем успешным
        if (response.ok) {
          responseData = { ok: true };
        } else {
          throw new Error('Не удалось обработать ответ сервера');
        }
      }
      
      // Если ответ от Telegram API успешный (ok: true)
      if (response.ok && (responseData.ok || responseData.success)) {
        // Успешная отправка
        toast({
          title: "Успех!",
          description: responseData.message || "Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.",
          variant: "default",
        });
        
        // Сбрасываем форму
        setFormData({
          name: "",
          phone: "",
          service: "",
          message: "",
        });
        setPrivacyAccepted(false);
      } else {
        // Ошибка от сервера
        let errorMessage = responseData?.error || 'Произошла ошибка при отправке заявки';
        
        // Добавляем детали ошибки, если они есть
        if (responseData?.details) {
          if (typeof responseData.details === 'object') {
            errorMessage += ` (${JSON.stringify(responseData.details)})`;
          } else {
            errorMessage += ` (${responseData.details})`;
          }
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      
      // Улучшенная обработка ошибок
      let errorMessage = 'Произошла ошибка при отправке заявки';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Для случаев, когда ошибка - это объект, но не instanceof Error
        errorMessage = JSON.stringify(error);
      }
      
      toast({
        title: "Ошибка при отправке",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-foreground">Запись на процедуру</h2>
            <p className="text-muted-foreground text-lg">Оставьте заявку, и я свяжусь с вами</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-card shadow-lg rounded-xl p-8 border border-border/50">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Input
                  type="text"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Ваш телефон"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
            </div>
            <div>
              <Input
                type="text"
                placeholder="Интересующая услуга"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Ваше сообщение"
                className="min-h-[120px]"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="privacy" 
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                required
              />
              <label
                htmlFor="privacy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Я согласен на обработку персональных данных в соответствии с{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Политикой конфиденциальности
                </a>
              </label>
            </div>
            
            <div className="text-center">
              <Button 
                type="submit" 
                disabled={isLoading || !privacyAccepted}
                size="lg"
                className="w-full md:w-auto px-8"
              >
                {isLoading ? "Отправка..." : "Отправить заявку"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}