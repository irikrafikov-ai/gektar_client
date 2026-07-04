import { FileCheck, Scale, RotateCcw, Shield, Check, User, Lock } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const guarantees = [
  {
    id: 1,
    title: 'Выписка ЕГРН до сделки',
    description: 'Предоставляем полную выписку из ЕГРН с кадастровым номером до подписания договора. Проверяйте сами!',
    icon: FileCheck,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Юрист проверит бесплатно',
    description: 'Наш юрист проверит все документы, объяснит нюансы, сопроводит до регистрации права собственности.',
    icon: Scale,
    color: 'bg-purple-500',
  },
  {
    id: 3,
    title: 'Возврат первого взноса',
    description: 'Если участок не понравится при осмотре — вернём первый взнос в течение 3 рабочих дней.',
    icon: RotateCcw,
    color: 'bg-[#7dd87d]',
  },
  {
    id: 4,
    title: 'Сопровождение до регистрации',
    description: 'Помогаем на всех этапах: от выбора до получения выписки из Росреестра.',
    icon: Shield,
    color: 'bg-amber-500',
  },
];

const bottomFeatures = [
  { icon: Check, text: 'Оформление за 3-5 дней' },
  { icon: User, text: '12 лет на рынке' },
  { icon: Lock, text: 'Безопасная сделка с юристом' },
];

export function Guarantees() {
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: gridRef, isVisible: gridVisible } = useStaggerAnimation(guarantees.length, 150);
  const { ref: bottomRef, isVisible: bottomVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="bg-white py-20 lg:py-28 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div
          ref={badgeRef}
          className={`flex justify-center mb-5 transition-all duration-700 ${
            badgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b]">
            <Shield className="w-4 h-4" />
            Наши гарантии
          </div>
        </div>

        <div ref={titleRef} className={`transition-all duration-700 delay-100 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[#16201a] mb-4">
            Покупайте с уверенностью
          </h2>
          <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12 text-[17px]">
            Мы заботимся о вашем спокойствии на каждом этапе сделки
          </p>
        </div>

        {/* Guarantees grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 gap-6 mb-12">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={guarantee.id}
                className={`flex gap-5 p-6 bg-[#f4f1ea] rounded-3xl shadow-[0_4px_24px_rgba(20,40,28,0.06)] hover:shadow-[0_12px_40px_rgba(20,40,28,0.10)] transition-all ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDuration: '600ms', transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-11 h-11 bg-[#2fae5b]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#1c5238]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#16201a] text-lg mb-2">
                    {guarantee.title}
                  </h4>
                  <p className="text-[#16201a]/60">{guarantee.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom features bar */}
        <div
          ref={bottomRef}
          className={`bg-[#0f1d15] rounded-3xl p-8 transition-all duration-700 ${
            bottomVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-wrap justify-center gap-8">
            {bottomFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-[#2fae5b]/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#3ec469]" />
                  </div>
                  <span className="font-semibold">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
