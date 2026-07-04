import { Phone, Search, FileSignature, Home, ArrowRight } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    id: 1,
    icon: Phone,
    title: 'Оставьте заявку',
    description: 'Менеджер перезвонит за 15 минут, уточнит ваши цели и бюджет',
  },
  {
    id: 2,
    icon: Search,
    title: 'Выберите участок',
    description: 'Покажем подходящие варианты, организуем онлайн или офлайн просмотр',
  },
  {
    id: 3,
    icon: FileSignature,
    title: 'Подпишите договор',
    description: 'Оформляем рассрочку, вносите первый взнос от 30%',
  },
  {
    id: 4,
    icon: Home,
    title: 'Станьте владельцем',
    description: 'Регистрируем право собственности в Росреестре',
  },
];

export function HowToBuy() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: stepsRef, isVisible: stepsVisible } = useStaggerAnimation(steps.length, 150);

  return (
    <section id="how-to-buy" className="py-20 lg:py-28 px-5 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className={`transition-all duration-700 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] text-center mb-4">Порядок покупки</p>
          <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[#16201a] mb-4">
            Как купить землю в рассрочку
          </h2>
          <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-14">
            Простой путь от заявки до собственности за 3-5 дней
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className={`relative transition-all duration-600 ${
                stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="bg-[#f4f1ea] rounded-3xl p-6 h-full shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
                  {/* Step number decoration */}
                  <div className="font-display text-5xl font-bold text-[#1c5238] mb-4">
                    {String(step.id).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-[#2fae5b]/15 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[#1c5238]" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-[#16201a] text-lg mb-2">{step.title}</h3>
                  <p className="text-[#16201a]/60 text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-[#2fae5b] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
