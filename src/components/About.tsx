import { Card } from "@/components/ui/card";
import { Award, Heart, Sparkles } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-foreground">О мастере</h2>
            <p className="text-muted-foreground text-lg">Профессионализм и индивидуальный подход</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-foreground/90 leading-relaxed text-lg">
                Здравствуйте! Меня зовут Елена Бородина, и я — мастер перманентного макияжа с многолетним опытом работы в Краснодаре.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Использую только современные техники и качественные материалы. Каждая процедура — это индивидуальный подход, учитывающий особенности вашей внешности и пожелания.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Специализируюсь на перманентном макияже бровей, губ, глаз, а также камуфляже шрамов, растяжек и темных кругов под глазами.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/50">
                  <Award className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="text-sm font-medium text-foreground">Сертифицированный мастер</p>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/50">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="text-sm font-medium text-foreground">Современные техники</p>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/50">
                  <Heart className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="text-sm font-medium text-foreground">Индивидуальный подход</p>
                </Card>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://sun6-23.userapi.com/s/v1/ig2/4r5o73Dls-psIAl-LN69wk_BcWQ5zex6az0TEqDDzIFJtMIxM9FhHd_KB_cclwwphdvjUN73q2l0Bav1v-PD_pHR.jpg?quality=95&crop=1,343,1439,1439&as=1080x1080"
                  alt="Елена Бородина - мастер перманентного макияжа"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary/10 rounded-3xl w-48 h-48 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
