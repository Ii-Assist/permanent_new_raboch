import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { id: "about", label: "О мастере" },
    { id: "services", label: "Услуги" },
    { id: "gallery", label: "Работы" },
    { id: "reviews", label: "Отзывы" },
    { id: "booking", label: "Контакты" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-sm py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl font-light text-foreground hover:text-primary transition-colors"
          >
            Елена Бородина
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Button 
              onClick={() => scrollToSection("booking")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Записаться
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-foreground/80 hover:text-primary transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <Button 
              onClick={() => scrollToSection("booking")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full"
            >
              Записаться
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};
