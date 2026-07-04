import { useEffect, useState, useRef } from 'react';
import { Calendar, MapPin, Percent } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const stats = [
  {
    icon: MapPin,
    value: 5,
    suffix: '+',
    label: 'областей',
  },
  {
    icon: Calendar,
    value: 12,
    suffix: ' лет',
    label: 'На рынке',
  },
  {
    icon: MapPin,
    value: 1000,
    suffix: '+',
    label: 'Гектар',
  },
  {
    icon: Percent,
    value: 0,
    suffix: '%',
    label: 'Переплат по рассрочке',
  },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref} className="text-[#1c5238]">
      {count}{suffix}
    </span>
  );
}

export function Stats() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section ref={sectionRef} className="relative bg-white hectare-grid py-20 lg:py-28 px-5 sm:px-6">
      <div className="relative max-w-6xl mx-auto">
        {/* Live stats bar */}
        <div
          className={`flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 pb-8 border-b border-[#16201a]/10 transition-all duration-700 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { value: '47', label: 'Сейчас на сайте' },
            { value: '147', label: 'Забронировано сегодня' },
            { value: '89', label: 'Продано за неделю' },
            { value: '1247', label: 'Всего продано' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-[#16201a]/60"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {index === 0 && <div className="w-2 h-2 bg-[#3ec469] rounded-full animate-pulse" />}
              <span className="font-semibold text-[#1c5238]">{item.value}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-[#f4f1ea] rounded-3xl p-7 text-center transition-all duration-700 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="font-display text-[26px] sm:text-4xl lg:text-5xl font-bold text-[#1c5238]">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[#16201a]/55 mt-2 text-[14px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
