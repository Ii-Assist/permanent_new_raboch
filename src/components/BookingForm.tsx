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

  // Функция для форматирования номера телефона в российском формате
  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const phoneNumber = value.replace(/\D/g, '');
    
    // Форматируем номер в российском формате
    if (phoneNumber.length === 0) {
      return '';
    } else if (phoneNumber.length === 1) {
      // Если введена только одна цифра и это 7, то не добавляем префикс +7
      if (phoneNumber === '7') {
        return '+7 (';
      } else {
        return `+7 (${phoneNumber}`;
      }
    } else if (phoneNumber.length <= 4) {
      return `+7 (${phoneNumber.slice(0, 3)}`;
    } else if (phoneNumber.length <= 7) {
      return `+7 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length <= 10) {
      return `+7 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else {
      return `+7 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Если пользователь удаляет символы и поле становится пустым, сбрасываем значение
    if (e.target.value === '') {
      setFormData({ ...formData, phone: '' });
      return;
    }
    
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
    
    setIsLoading(true);

    try {
      // Используем стандартный API-роут Vercel
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Ошибка ответа API:', data);
        throw new Error(data.error || "Ошибка при отправке");
      }
      
      toast({
        title: "Успешно!",
        description: "Ваша заявка успешно отправлена",
      });
      setFormData({ name: "", phone: "", service: "", message: "" });
      setPrivacyAccepted(false);
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      toast({
        title: "Ошибка!",
        description: err instanceof Error ? err.message : "Не удалось отправить заявку",
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