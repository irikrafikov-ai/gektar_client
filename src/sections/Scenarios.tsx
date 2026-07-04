import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScenariosProps {
  onContactClick: () => void;
}

const scenarios = [
  {
    id: 1,
    title: 'Глэмпинг',
    subtitle: 'Готовый бизнес',
    count: '12 участков',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&q=80',
  },
  {
    id: 2,
    title: 'Пасека',
    subtitle: 'Медовое производство',
    count: '8 участков',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
  },
  {
    id: 3,
    title: 'Теплица',
    subtitle: 'Круглогодичный урожай',
    count: '15 участков',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80',
  },
  {
    id: 4,
    title: 'Рыбалка',
    subtitle: 'База отдыха у воды',
    count: '6 участков',
    image: '/images/lot-astrahan.jpg',
  },
  {
    id: 5,
    title: 'Конюшня',
    subtitle: 'Конный клуб',
    count: '4 участка',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80',
  },
  {
    id: 6,
    title: 'Агроусадьба',
    subtitle: 'Семейный бизнес',
    count: '9 участков',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
  },
  {
    id: 7,
    title: 'Инвестиции',
    subtitle: 'Рост стоимости',
    count: '23 участка',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  },
  {
    id: 8,
    title: 'Ферма',
    subtitle: 'Эко-продукты',
    count: '11 участков',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80',
  },
];

export function Scenarios({ onContactClick }: ScenariosProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="scenarios" className="py-20 lg:py-28 px-5 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display tight text-3xl sm:text-4xl text-center text-[#16201a] mb-4">
          Выберите, для чего вам земля
        </h2>
        <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12">
          Мы подберём участок под ваш проект и рассчитаем экономику
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-300 hover:scale-[1.02] shadow-[0_4px_24px_rgba(20,40,28,0.08)]"
              onMouseEnter={() => setHoveredId(scenario.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1d15]/85 via-[#0f1d15]/35 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display tight text-xl text-white mb-1">{scenario.title}</h3>
                <p className="text-white/70 text-sm mb-3">{scenario.subtitle}</p>
                <span className="inline-block glass-soft text-white text-xs px-3 py-1 rounded-full">
                  {scenario.count}
                </span>
              </div>

              {/* Hover button */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-[#0f1d15]/55 transition-opacity duration-300 ${
                  hoveredId === scenario.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Button
                  onClick={onContactClick}
                  className="bg-[#2fae5b] hover:bg-[#27964d] text-white px-6 py-3 rounded-full text-[16px] font-semibold flex items-center gap-2 transform transition-transform duration-300 hover:scale-105"
                >
                  Оставить заявку
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
