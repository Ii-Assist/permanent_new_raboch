import { useState } from "react";
import { X } from "lucide-react";

const galleryImages = [
  {
    url: "https://sun9-29.userapi.com/s/v1/ig2/LP1Q96xvEQxemeMWenluR-rkRtqGJ0GmkPUvmZsipNvjB0xlS0J1u0tqXktm2G-B1Rn-7Od67HOX_ISlPHqt3A4x.jpg?quality=95&as=1079x1920",
    alt: "Перманентный макияж бровей"
  },
  {
    url: "https://sun9-76.userapi.com/s/v1/ig2/RaEDIhGzCYrWeyVZduTWKYwEF8KUtP3jWxe707hFprVUSJjb9WQXasNR94poxD-yiC2I-WJf8Z7wj4T4Ky1u_UNo.jpg?quality=95&as=1079x1920",
    alt: "Результат перманентного макияжа губ"
  },
  {
    url: "https://sun9-2.userapi.com/s/v1/ig2/QU8oUvNsH1m8mtlsjk4Eyr28uLvXskCTNizlN2lj2TYgQQwwrvv3hfppfezrOX88JsRMlpKAK95DQIfyrlt8g15h.jpg?quality=95&as=1079x1920",
    alt: "Камуфляж темных кругов под глазами"
  },
  {
    url: "https://sun9-50.userapi.com/s/v1/ig2/FwK55HycKwIRZ91h7L84CWwDy_6N339PkNn7d29R_Ef_c3QUi8j94dJsI084nUhcJXTzMyKKPZNah6W7VAtOezEe.jpg?quality=95&as=1079x1920",
    alt: "Перманентный макияж - до и после"
  },
  {
    url: "https://sun6-21.userapi.com/impg/fULaGxhl1H9Z2ELD9JlNNiYa8Z77fWXyIX0Fgg/U_QvC_ac4wY.jpg?size=1080x1920&quality=95",
    alt: "Микроблейдинг бровей"
  },
  {
    url: "https://sun6-20.userapi.com/impg/GyxOcwfCPX91FBK5aq1NP3WOxAqfHbV4qC9GPw/Cb4d99-2Vhc.jpg?size=1080x1920&quality=95",
    alt: "Камуфляж темных кругов"
  }
];

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-light text-foreground">Галерея работ</h2>
            <p className="text-muted-foreground text-lg">Примеры выполненных процедур</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
                onClick={() => setSelectedImage(image.url)}
              >
                <img 
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <img 
                src={selectedImage}
                alt="Увеличенное изображение"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
