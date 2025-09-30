import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const BookingForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Валидация данных
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Здесь будет интеграция с Telegram Bot API
      // Пока показываем уведомление об успехе
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Заявка отправлена!",
        description: "Я свяжусь с вами в ближайшее время"
      });

      setFormData({
        name: "",
        phone: "",
        service: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-foreground">Записаться</h2>
            <p className="text-muted-foreground text-lg">Оставьте заявку, и я свяжусь с вами</p>
          </div>

          <Card className="p-8 border-border/50 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ваше имя *</Label>
                <Input
                  id="name"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Интересующая процедура</Label>
                <Input
                  id="service"
                  placeholder="Например: Микроблейдинг бровей"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Комментарий</Label>
                <Textarea
                  id="message"
                  placeholder="Дополнительная информация или вопросы"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border-border min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить заявку"
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
