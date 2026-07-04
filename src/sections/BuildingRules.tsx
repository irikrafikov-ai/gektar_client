import { Check, X, Home, Bath, Car, Warehouse, Building2, Factory, ShoppingCart, Users } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const allowedBuildings = [
  { icon: Home, title: 'Жилой дом', description: 'До 3 этажей, площадь не ограничена' },
  { icon: Bath, title: 'Баня/сауна', description: 'Любые размеры' },
  { icon: Car, title: 'Гараж', description: 'До 2 машиномест' },
  { icon: Warehouse, title: 'Сарай/навес', description: 'Хозяйственные постройки' },
];

const forbiddenBuildings = [
  { icon: Building2, title: 'Многоэтажка', description: 'Более 3 этажей запрещено' },
  { icon: Factory, title: 'Промышленность', description: 'Заводы, фабрики — нельзя' },
  { icon: ShoppingCart, title: 'Торговый центр', description: 'Коммерческая недвижимость — нельзя' },
  { icon: Users, title: 'Многосемейный дом', description: 'Только индивидуальное жилищное строительство' },
];

export function BuildingRules() {
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: allowedRef, isVisible: allowedVisible } = useStaggerAnimation(allowedBuildings.length, 100);
  const { ref: forbiddenRef, isVisible: forbiddenVisible } = useStaggerAnimation(forbiddenBuildings.length, 100);

  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-white relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        {/* Badge */}
        <div
          ref={badgeRef}
          className={`flex justify-center mb-6 transition-all duration-700 ${
            badgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-[#2fae5b]/15 text-[#1c5238] px-4 py-2 rounded-full text-[13px] font-semibold tracking-[0.18em] uppercase">
            <Home className="w-4 h-4" />
            Строительство
          </div>
        </div>

        <div ref={titleRef} className={`transition-all duration-700 delay-100 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="tight text-3xl sm:text-4xl font-bold text-center text-[#16201a] mb-4">
            Что можно строить на сельхозземле?
          </h2>
          <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12">
            Полный гид по ИЖС на землях сельхозназначения. Всё законно, всё просто.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Allowed */}
          <div ref={allowedRef} className="bg-[#f4f1ea] rounded-3xl p-6 shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2fae5b] rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#16201a]">Можно строить</h3>
                <p className="text-[#16201a]/60 text-sm">Без ограничений</p>
              </div>
            </div>

            <div className="space-y-4">
              {allowedBuildings.map((building, index) => {
                const Icon = building.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 bg-white rounded-2xl transition-all duration-500 ${
                      allowedVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#2fae5b]/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#1c5238]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#16201a]">{building.title}</h4>
                      <p className="text-[#16201a]/60 text-sm">{building.description}</p>
                    </div>
                    <Check className="w-5 h-5 text-[#2fae5b]" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Forbidden */}
          <div ref={forbiddenRef} className="bg-[#f4f1ea] rounded-3xl p-6 shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#b4443a] rounded-xl flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#16201a]">Нельзя строить</h3>
                <p className="text-[#16201a]/60 text-sm">Запрещено законом</p>
              </div>
            </div>

            <div className="space-y-4">
              {forbiddenBuildings.map((building, index) => {
                const Icon = building.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 bg-white rounded-2xl transition-all duration-500 ${
                      forbiddenVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#b4443a]/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#b4443a]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#16201a]">{building.title}</h4>
                      <p className="text-[#16201a]/60 text-sm">{building.description}</p>
                    </div>
                    <X className="w-5 h-5 text-[#b4443a]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
