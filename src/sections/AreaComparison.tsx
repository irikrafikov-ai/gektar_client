import { Check, TreePine } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const smallPlot = {
  title: '20 соток (0.2 га)',
  subtitle: 'Стандартный дачный участок',
  price: 'от 450 000 ₽',
  monthly: 'от 37 500 ₽/мес',
  features: [
    'Дом 100-150 м²',
    'Маленький огород',
    'Парковка 1-2 авто',
    'Колодец/скважина',
  ],
};

const largePlot = {
  title: '1 гектар',
  subtitle: 'Пространство для мечты',
  price: 'от 100 000 ₽',
  monthly: 'от 8 333 ₽/мес',
  badge: 'Выгоднее в 2 раза',
  features: [
    'Дом 150-200 м²',
    'Большой огород + сад',
    'Парковка 5+ авто',
    'Пруд или скважина',
    'Баня и хозпостройки',
    'Зона отдыха и BBQ',
    'Детская площадка',
    'Спортивная зона',
  ],
};

export function AreaComparison() {
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea] relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        {/* Badge */}
        <div
          ref={badgeRef}
          className={`flex justify-center mb-6 transition-all duration-700 ${
            badgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-[#2fae5b]/15 text-[#1c5238] px-4 py-2 rounded-full text-[13px] font-semibold tracking-[0.18em] uppercase">
            <TreePine className="w-4 h-4" />
            Сравнение площадей
          </div>
        </div>

        <div ref={titleRef} className={`transition-all duration-700 delay-100 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="tight text-3xl sm:text-4xl font-bold text-center text-[#16201a] mb-4">
            Почему 1 гектар — это выгодно?
          </h2>
          <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12">
            Сравните, что можно разместить на разных площадях
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Small plot */}
          <div className={`bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(20,40,28,0.08)] transition-all duration-700 ${
            cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`} style={{ transitionDelay: '200ms' }}>
            <h3 className="text-2xl font-bold text-[#16201a] mb-1">{smallPlot.title}</h3>
            <p className="text-[#16201a]/60 mb-4">{smallPlot.subtitle}</p>
            <div className="font-display text-3xl font-bold text-[#1c5238] mb-1">{smallPlot.price}</div>
            <div className="text-[#2fae5b] font-semibold mb-6">{smallPlot.monthly}</div>

            <div className="space-y-3">
              {smallPlot.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#2fae5b]/15 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#1c5238]" />
                  </div>
                  <span className="text-[#16201a]/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Large plot */}
          <div className={`bg-[#0f1d15] rounded-3xl p-8 text-white relative shadow-[0_4px_24px_rgba(20,40,28,0.12)] transition-all duration-700 ${
            cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`} style={{ transitionDelay: '400ms' }}>
            {/* Badge */}
            <div className="absolute top-5 right-5 bg-[#2fae5b] text-white text-sm font-semibold px-3 py-1 rounded-full">
              {largePlot.badge}
            </div>

            <h3 className="text-2xl font-bold mb-1">{largePlot.title}</h3>
            <p className="text-white/70 mb-4">{largePlot.subtitle}</p>
            <div className="font-display text-3xl font-bold text-[#3ec469] mb-1">{largePlot.price}</div>
            <div className="text-white/70 mb-6">{largePlot.monthly}</div>

            <div className="space-y-3">
              {largePlot.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#3ec469]/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#3ec469]" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
