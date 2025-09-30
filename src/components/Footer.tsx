import { MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">Контакты</h3>
              <div className="space-y-3">
                <a 
                  href="tel:+79189221110"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +7 (918) 922-11-10
                </a>
                <a 
                  href="https://vk.com/helen_borodina_pmu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.64 14.44h-1.76c-.64 0-.84-.51-1.99-1.66-.99-.95-1.43-1.08-1.68-1.08-.35 0-.45.1-.45.58v1.52c0 .41-.13.66-1.22.66-1.81 0-3.82-.95-5.24-2.73-2.14-2.59-2.73-4.52-2.73-4.92 0-.25.1-.49.58-.49h1.76c.43 0 .6.2.76.66.84 2.45 2.24 4.6 2.82 4.6.22 0 .31-.1.31-.66v-2.56c-.06-1.22-.71-1.32-.71-1.75 0-.2.17-.41.43-.41h2.77c.36 0 .49.19.49.6v3.46c0 .36.16.49.27.49.22 0 .4-.13.82-.54 1.29-1.46 2.22-3.71 2.22-3.71.12-.26.32-.49.75-.49h1.76c.53 0 .64.27.53.64-.19.95-2.39 4.11-2.39 4.11-.18.31-.25.45 0 .79.18.25.78.76 1.18 1.22.73.83 1.29 1.52 1.44 2 .15.49-.08.74-.57.74z"/>
                  </svg>
                  ВКонтакте
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">Адрес</h3>
              <a 
                href="https://yandex.ru/maps/?text=Краснодар, Московская 152"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Краснодар,<br />ул. Московская, 152<br />ТЦ Стрелка</span>
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">Режим работы</h3>
              <p className="text-muted-foreground">
                Запись по предварительной договоренности
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 Елена Бородина. Перманентный макияж в Краснодаре</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
