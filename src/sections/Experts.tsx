import { TrendingUp, FileText, CalculatorIcon, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

interface ExpertsProps {
  onContactClick: () => void;
}

const experts = [
  {
    id: 1,
    name: 'Алексей Морозов',
    role: 'Эксперт по бизнес-участкам',
    photo: '/images/expert-1.png',
    service: 'Подобрать участок под бизнес',
    description: 'Рассчитаю ROI, подберу оптимальный размер и локацию',
    responseTime: '5 минут',
    icon: TrendingUp,
    buttonText: 'Получить бизнес-план',
  },
  {
    id: 2,
    name: 'Елена Васильева',
    role: 'Юрист по земельным вопросам',
    photo: '/images/expert-2.png',
    service: 'Консультация по документам',
    description: 'Проверю документы, объясню нюансы оформления',
    responseTime: '10 минут',
    icon: FileText,
    buttonText: 'Получить консультацию',
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    role: 'Финансовый консультант',
    photo: '/images/expert-3.png',
    service: 'Рассчитать рассрочку',
    description: 'Подберу оптимальный график платежей без переплат',
    responseTime: '3 минуты',
    icon: CalculatorIcon,
    buttonText: 'Получить расчёт',
  },
  {
    id: 4,
    name: 'Анна Соколова',
    role: 'Специалист по подбору',
    photo: '/images/expert-4.png',
    service: 'Подобрать участок под дом',
    description: 'Найду лучший вариант под ваш проект и бюджет',
    responseTime: '15 минут',
    icon: Home,
    buttonText: 'Подобрать варианты',
  },
];

export function Experts({ onContactClick }: ExpertsProps) {
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: cardsRef, isVisible: cardsVisible } = useStaggerAnimation(experts.length, 150);

  return (
    <section className="bg-[#f4f1ea] py-20 lg:py-28 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div
          ref={badgeRef}
          className={`flex justify-center mb-5 transition-all duration-700 ${
            badgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b]">
            <span className="w-2 h-2 bg-[#3ec469] rounded-full animate-pulse" />
            Персональная консультация
          </div>
        </div>

        <div ref={titleRef} className={`transition-all duration-700 delay-100 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[#16201a] mb-4">
            Выберите эксперта
          </h2>
          <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12 text-[17px]">
            Каждый специалист поможет с конкретным вопросом. Ответ в течение 15 минут.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {experts.map((expert, index) => {
            const Icon = expert.icon;
            return (
              <div
                key={expert.id}
                className={`bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(20,40,28,0.08)] hover:shadow-[0_12px_40px_rgba(20,40,28,0.12)] transition-all flex flex-col h-full ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDuration: '600ms', transitionDelay: `${index * 150}ms` }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={expert.photo}
                    alt={expert.name}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-[#16201a]">{expert.name}</h4>
                    <p className="text-[#16201a]/55 text-sm">{expert.role}</p>
                  </div>
                </div>

                {/* Service - flex-grow to push button down */}
                <div className="flex-grow mb-4">
                  <div className="flex items-center gap-2 text-[#16201a] font-medium mb-2">
                    <Icon className="w-4 h-4 text-[#1c5238]" />
                    {expert.service}
                  </div>
                  <p className="text-[#16201a]/60 text-sm">{expert.description}</p>
                </div>

                {/* Response time */}
                <div className="flex items-center gap-2 text-[#2fae5b] text-sm font-medium mb-4">
                  <Clock className="w-4 h-4" />
                  Отвечу за {expert.responseTime}
                </div>

                {/* Button - always at bottom */}
                <Button
                  onClick={onContactClick}
                  className="w-full bg-[#1c5238] hover:bg-[#16432e] text-white rounded-full py-3 text-[16px] font-semibold mt-auto"
                >
                  {expert.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
