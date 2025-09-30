import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export const Hero = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/20 to-secondary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 py-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Елена Бородина
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Мастер перманентного макияжа
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Современные техники перманента бровей, губ и глаз. Камуфляж шрамов, темных кругов и растяжек
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button 
              size="lg" 
              onClick={scrollToBooking}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Записаться на процедуру
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-full"
            >
              <a href="tel:+79189221110" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                +7 (918) 922-11-10
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
