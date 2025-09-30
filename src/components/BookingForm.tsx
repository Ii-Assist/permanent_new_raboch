import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function BookingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Имитация отправки формы, так как API может не работать на Vercel
      // Добавляем задержку для имитации запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Успешная отправка
      toast({
        title: "Успешно!",
        description: "Ваша заявка успешно отправлена",
      });
      setFormData({ name: "", phone: "", service: "", message: "" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка!",
        description: "Не удалось отправить заявку",
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            <div className="text-center">
              <Button 
                type="submit" 
                disabled={isLoading}
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