import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const lots = [
  {
    id: 1,
    name: 'Тульская область',
    href: '/tula',
    image: '/images/lot-tula-main.png',
    distance: '200 км от Москвы',
    purpose: 'ИЖС',
    area: '4 Гектара',
  },
  {
    id: 2,
    name: 'Тверская область',
    href: '/tver',
    image: '/images/lot-tver-main.png',
    distance: '235 км от Москвы',
    purpose: 'Сельхоз',
    area: '170 Гектар',
  },
  {
    id: 3,
    name: 'Крым',
    href: '/crimea',
    image: '/images/lot-crimea-main.png',
    distance: '1 км до моря',
    purpose: 'Сельхоз/ИЖС',
    area: '2 Гектара',
  },
  {
    id: 4,
    name: 'Московская область',
    href: '/moscow',
    image: '/images/lot-moscow-main.png',
    distance: '165 км от МКАД',
    purpose: 'Сельхоз',
    area: '4,29 Гектара',
  },
];

export function Lots() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={sectionRef} id="lots" className="py-20 lg:py-28 px-5 sm:px-6 bg-white relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`tight text-4xl md:text-5xl font-bold text-[#16201a] mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Наши земельные участки
          </h2>
          <p className={`text-[#16201a]/60 text-lg transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Выберите идеальное место для вашего проекта
          </p>
        </div>

        {/* Lots Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {lots.map((lot, index) => (
            <div
              key={lot.id}
              className={`bg-[#f4f1ea] rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(20,40,28,0.08)] transition-all duration-700 hover:shadow-[0_12px_50px_rgba(20,40,28,0.10)] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9]">
                <img
                  src={lot.image}
                  alt={lot.name}
                  className="w-full h-full object-cover"
                />
                {/* Location badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 glass-soft text-[#16201a] px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4 text-[#1c5238]" />
                  <span className="text-sm font-medium">{lot.name}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Info blocks */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-[#16201a]/45 text-xs mb-1">Расстояние</div>
                    <div className="text-[#16201a] text-sm font-semibold">{lot.distance}</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-[#16201a]/45 text-xs mb-1">Назначение</div>
                    <div className="text-[#16201a] text-sm font-semibold">{lot.purpose}</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="text-[#16201a]/45 text-xs mb-1">Площадь</div>
                    <div className="text-[#1c5238] text-sm font-semibold">{lot.area}</div>
                  </div>
                </div>

                {/* Button */}
                <Link
                  to={lot.href}
                  className="flex items-center justify-center gap-2 w-full bg-[#1c5238] hover:bg-[#16432e] text-white py-4 rounded-full text-[16px] font-semibold transition-colors"
                >
                  Подробнее
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
