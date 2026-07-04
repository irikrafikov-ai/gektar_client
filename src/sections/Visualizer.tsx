import { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function Visualizer() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea] relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <h2 className={`tight text-3xl sm:text-4xl font-bold text-center text-[#16201a] mb-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Визуализируйте свой проект
        </h2>
        <p className={`text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Перетащите ползунок, чтобы увидеть потенциал участка для сельхоз бизнеса
        </p>

        <div
          ref={containerRef}
          className={`relative rounded-[28px] overflow-hidden cursor-ew-resize select-none shadow-[0_12px_50px_rgba(20,40,28,0.10)] transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Container */}
          <div className="aspect-[16/9] relative">
            {/* After image (full width) - Lavender farm business */}
            <div className="absolute inset-0">
              <img
                src="/images/lavender-field.jpg"
                alt="Лавандовая ферма - масштабный бизнес"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 glass-soft text-[#16201a] px-4 py-2 rounded-full font-semibold">
                Через год — лавандовая ферма на 10 га
              </div>
            </div>

            {/* Before image (clipped) - Empty field */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
                alt="Пустое поле"
                className="w-full h-full object-cover"
                style={{ width: `${100 / (sliderPosition / 100)}%` }}
              />
              <div className="absolute top-4 left-4 glass-dark text-white px-4 py-2 rounded-full font-medium">
                Сейчас — пустое поле
              </div>
            </div>

            {/* Slider line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(20,40,28,0.25)]"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Slider handle */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <MoveHorizontal className="w-6 h-6 text-[#1c5238]" />
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-dark text-white px-4 py-2 rounded-full text-sm">
            Перетащите для сравнения
          </div>
        </div>
      </div>
    </section>
  );
}
