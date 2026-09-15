import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-3">
      {/* Container Principal da Imagem */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-surface border border-outline-variant/30 shadow-sm group">
        
        {/* Track de Imagens (Efeito de Deslize) */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="relative w-full h-full shrink-0">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                  <p className="text-xs sm:text-sm font-medium">{img.caption}</p>
                </div>
              )} */}
            </div>
          ))}
        </div>

        {/* Botão Anterior */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-surface/80 hover:bg-surface text-on-surface backdrop-blur-md border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md cursor-pointer active:scale-95"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Botão Próximo */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-surface/80 hover:bg-surface text-on-surface backdrop-blur-md border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md cursor-pointer active:scale-95"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Indicadores (Pontos/Dots) */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-outline-variant/40 hover:bg-outline-variant'
              }`}
              aria-label={`Ir para a imagem ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}