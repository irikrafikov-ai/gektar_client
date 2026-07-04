import { Shield, FileCheck, Clock, Percent, MapPin, Gift } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const features = [
  {
    id: 1,
    icon: Shield,
    title: 'Собственник',
    description: 'Все участки в нашей собственности. Никаких посредников и переплат. Прямой договор купли-продажи.',
  },
  {
    id: 2,
    icon: FileCheck,
    title: 'Юридическая чистота',
    description: 'Полный пакет документов: выписка ЕГРН, кадастровый паспорт, схема участка. Гарантируем прозрачность.',
  },
  {
    id: 3,
    icon: Clock,
    title: 'Быстрое оформление',
    description: 'Сделка у нотариуса за 3-5 рабочих дней. Онлайн-показ до выезда. Регистрация в Росреестре.',
  },
  {
    id: 4,
    icon: Percent,
    title: 'Рассрочка 0%',
    description: 'Без банка и процентов. Первый взнос от 30%, остальное — равными платежами до 12 месяцев.',
  },
  {
    id: 5,
    icon: MapPin,
    title: 'Проверенные участки',
    description: 'Лично выезжали на каждый участок. Знаем о каждом: дороги, вода, электричество, соседи.',
  },
  {
    id: 6,
    icon: Gift,
    title: 'Подарки и бонусы',
    description: 'Скважина в подарок при покупке. Юридическое сопровождение. Помощь с подрядчиками.',
  },
];

export function WhyUs() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: cardsRef, isVisible: cardsVisible } = useStaggerAnimation(features.length, 100);

  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className={`transition-all duration-700 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] text-center mb-4">Почему мы</p>
          <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[#16201a] mb-14">
            Почему покупают у нас
          </h2>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className={`bg-[#f4f1ea] rounded-3xl p-6 shadow-[0_4px_24px_rgba(20,40,28,0.08)] transition-all ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDuration: '600ms', transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-[#2fae5b]/15 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#1c5238]" />
                </div>
                <h3 className="font-bold text-[#16201a] text-lg mb-2">{feature.title}</h3>
                <p className="text-[#16201a]/60 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
