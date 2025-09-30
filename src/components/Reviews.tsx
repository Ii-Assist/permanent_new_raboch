import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
  author: string;
  text: string;
  date: string;
}

const reviews: Review[] = [
  {
    author: "Olga Zorkina",
    text: "Очень красиво! Результат превзошел все ожидания. Елена - настоящий профессионал своего дела.",
    date: "15 июля 2024"
  },
  {
    author: "Анна",
    text: "Делала у Елены микроблейдинг бровей. Все объяснила, показала, работа выполнена качественно. Очень довольна результатом!",
    date: "11 августа 2024"
  },
  {
    author: "Марина",
    text: "Камуфляж темных кругов - это просто волшебство! Наконец-то могу не пользоваться консилером каждый день.",
    date: "3 сентября 2024"
  }
];

export const Reviews = () => {
  return (
    <section id="reviews" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-foreground">Отзывы клиентов</h2>
            <p className="text-muted-foreground text-lg">Что говорят о моей работе</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card 
                key={index}
                className="p-8 space-y-4 hover:shadow-xl transition-shadow border-border/50 bg-card"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed">{review.text}</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-medium text-foreground">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="https://vk.com/helen_borodina_pmu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline"
            >
              Смотреть все отзывы в группе ВКонтакте
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
