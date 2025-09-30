import { useState } from "react";
import { X } from "lucide-react";

const galleryImages = [
  {
    url: "/images/I3EOVycCnk_vuX0z-IAhw9sp-yBHiPIMo7PyMsz09-iVU33xFsqSd89w4CcxakhFO5D8xz3jR-tW_88rNwsGenlE.jpg",
    alt: "Перманентный макияж бровей"
  },
  {
    url: "/images/iJe-nweoyeduWUIq2rKjDe-_1tsFR2MBgWAp8Nj7J3jzCDDJHKzVUry3maLl3lm32pn_5qTnHexgDXZUHWzfr2Lt.jpg",
    alt: "Перманентный макияж глаз - до и после"
  },
  {
    url: "/images/I3EOVycCnk_vuX0z-IAhw9sp-yBHiPIMo7PyMsz09-iVU33xFsqSd89w4CcxakhFO5D8xz3jR-tW_88rNwsGenlE.jpg",
    alt: "Перманентный макияж губ - до и после"
  },
  {
    url: "/images/3WzrG8gty2_Mz2XftnAYPul1IF_TYCCsIy7vS98Jsxkn6uA2KJ8nEWXj1NHJz4YSK-B9YiC20NOc3Lhx-b6J_2l1.jpg",
    alt: "Перманентный макияж бровей - до и после"
  },
  {
    url: "/images/nei1EqRY69LwvHuj9eOyoVBBgtHSxi5g83Eu_z0D0QtUBLf36-R-XvQ7utqgm3sdP_r0sKKu6xvZMMTmxnq35Xzz.jpg",
    alt: "Микроблейдинг бровей - до и после"
  },
  {
    url: "/images/rPFJ06euwR7nmCio81t4gNwB8MDTSONVIz3uS-OB5HJ_ghbbQD6ovxIyNjvkI_L2e7ourSw3a-DPeVfGRehwgDzi.jpg",
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
