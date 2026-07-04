import { Star } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const reviews = [
  {
    id: 1,
    text: 'Купил 2 га под глэмпинг. Оформили за 4 дня, рассрочка без процентов на 12 месяцев. Уже второй сезон!',
    author: 'Андрей В.',
    role: 'Владелец глэмпинга',
    initials: 'АВ',
    rating: 5,
  },
  {
    id: 2,
    text: 'Рассрочка на 12 месяцев, менеджер Тимур помог с документами. Участок у дороги с газом.',
    author: 'Марина К.',
    role: 'Семейная ферма',
    initials: 'МК',
    rating: 5,
  },
  {
    id: 3,
    text: 'Взял 5 га. Через год цена выросла на 40%. Документы чистые, сделка прозрачная.',
    author: 'Олег П.',
    role: 'Инвестор',
    initials: 'ОП',
    rating: 5,
  },
];

export function Reviews() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: cardsRef, isVisible: cardsVisible } = useStaggerAnimation(reviews.length, 200);

  return (
    <section id="reviews" className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea]">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className={`transition-all duration-700 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] text-center mb-4">Отзывы</p>
          <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[#16201a] mb-4">
            Что говорят наши клиенты
          </h2>
          <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-14">
            Реальные истории людей, которые купили землю у нас
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(20,40,28,0.08)] transition-all ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDuration: '600ms', transitionDelay: `${index * 200}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#3ec469] text-[#3ec469]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[#16201a]/80 mb-6 leading-relaxed">"{review.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2fae5b]/15 rounded-full flex items-center justify-center text-[#1c5238] font-bold">
                  {review.initials}
                </div>
                <div>
                  <div className="font-semibold text-[#16201a]">{review.author}</div>
                  <div className="text-[#16201a]/50 text-sm">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
