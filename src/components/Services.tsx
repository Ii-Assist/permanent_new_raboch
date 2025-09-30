import { Card } from "@/components/ui/card";

interface Service {
  title: string;
  price: string;
  description: string;
}

const services: Service[] = [
  {
    title: "Микроблейдинг бровей",
    price: "10 000 ₽",
    description: "Волосковая техника для естественного результата"
  },
  {
    title: "Перманент губ",
    price: "10 000 ₽",
    description: "Акварельная техника для нежного эффекта"
  },
  {
    title: "Камуфляж темных кругов",
    price: "7 000 ₽",
    description: "Коррекция темных кругов вокруг глаз"
  },
  {
    title: "Камуфляж шрамов",
    price: "от 5 000 ₽",
    description: "Визуальное уменьшение видимости шрамов"
  },
  {
    title: "Камуфляж растяжек",
    price: "от 5 000 ₽",
    description: "Выравнивание тона кожи в области растяжек"
  },
  {
    title: "Камуфляж сосудов",
    price: "от 5 000 ₽",
    description: "Маскировка сосудистых сеточек"
  }
];

export const Services = () => {
  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-foreground">Услуги и цены</h2>
            <p className="text-muted-foreground text-lg">Современные техники перманентного макияжа</p>
          </div>
          
          <div className="mb-12">
            <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-xl">
              </div>
            <h3 className="text-center text-xl font-medium mt-4"></h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 border-border/50 bg-card hover:scale-105"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <p className="text-3xl font-light text-primary">{service.price}</p>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-12 text-sm">
            Стоимость может варьироваться в зависимости от сложности работы. 
            Точную цену уточняйте при консультации.
          </p>
        </div>
      </div>
    </section>
  );
};
