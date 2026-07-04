import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    id: 1,
    title: 'Пустое поле',
    image: '/images/step1-field.png',
  },
  {
    id: 2,
    title: 'Подготовка',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
  {
    id: 3,
    title: 'Строительство',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
  },
  {
    id: 4,
    title: 'Благоустройство',
    image: '/images/step4-construction.jpg',
  },
  {
    id: 5,
    title: 'Готовый поселок',
    image: '/images/step5-village.png',
  },
];

export function VillageProgress() {
  const [activeStep, setActiveStep] = useState(0);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  // Auto-play slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea] relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <h2 className={`tight text-3xl sm:text-4xl font-bold text-center text-[#16201a] mb-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          От поля к готовому поселку
        </h2>
        <p className={`text-center text-[#16201a]/55 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Посмотрите, как мы превращаем пустое поле в комфортный коттеджный поселок с полной инфраструктурой
        </p>

        {/* Main image display */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
          <div className="aspect-video relative">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === activeStep ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            ))}

            {/* Step indicator */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <span className="bg-[#2fae5b] text-white px-3.5 py-1.5 rounded-full text-sm font-semibold">
                Шаг {activeStep + 1} из {steps.length}
              </span>
              <span className="text-white font-medium hero-shadow">{steps[activeStep].title}</span>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`relative rounded-xl overflow-hidden transition-all ${
                index === activeStep
                  ? 'ring-2 ring-[#2fae5b] ring-offset-2 ring-offset-[#f4f1ea]'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <div className="aspect-video">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium text-center">
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeStep ? 'w-8 bg-[#2fae5b]' : 'w-2 bg-[#16201a]/15'
              }`}
            />
          ))}
        </div>

        {/* Reset button */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-[#1c5238] text-white px-6 py-3.5 rounded-full hover:bg-[#16432e] transition-colors text-[16px] font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Смотреть сначала
          </button>
        </div>
      </div>
    </section>
  );
}
