import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const faqs = [
  {
    id: 1,
    question: 'Можно ли строить дом на сельхозземле?',
    answer: 'Да, можно! На землях сельхозназначения разрешено индивидуальное жилищное строительство (ИЖС). Вы можете построить дом до 3 этажей, баню, гараж, хозпостройки. Главное ограничение — нельзя строить многоэтажки и коммерческую недвижимость.',
  },
  {
    id: 2,
    question: 'Как оформляется рассрочка?',
    answer: 'Рассрочка оформляется напрямую с собственником, без банка. Подписывается договор купли-продажи с условием рассрочки платежа. Вы вносите первый взнос от 30%, остальная сумма делится на равные платежи от 6 до 18 месяцев. Никаких процентов и скрытых комиссий.',
  },
  {
    id: 3,
    question: 'Какие документы нужны для покупки?',
    answer: 'Для покупки нужен только паспорт. Мы предоставляем все документы на участок: выписка из ЕГРН, кадастровый паспорт, схема участка. Юрист проверяет документы бесплатно перед сделкой.',
  },
  {
    id: 4,
    question: 'Можно ли посмотреть участок перед покупкой?',
    answer: 'Конечно! Мы организуем онлайн-показ через видеосвязь или личный выезд на участок. Менеджер покажет территорию, ответит на вопросы, расскажет о соседях и инфраструктуре.',
  },
  {
    id: 5,
    question: 'Что делать, если участок не понравился?',
    answer: 'Если после осмотра участок вас не устроил — мы вернём первый взнос в течение 3 рабочих дней. Никаких штрафов и неустоек. Мы заинтересованы, чтобы вы нашли идеальный вариант.',
  },
  {
    id: 6,
    question: 'Есть ли коммуникации на участках?',
    answer: 'На разных участках разная инфраструктура. Некоторые участки подключены к электричеству, на других есть возможность подключения. Вода — скважина или колодец. Подробности по каждому участку уточняйте у менеджера.',
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: faqsRef, isVisible: faqsVisible } = useStaggerAnimation(faqs.length, 80);

  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea]">
      <div className="max-w-3xl mx-auto">
        <div ref={titleRef} className={`transition-all duration-700 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] text-center mb-4">Вопросы</p>
          <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[#16201a] mb-14">
            Частые вопросы
          </h2>
        </div>

        <div ref={faqsRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl border border-[#1c5238]/10 overflow-hidden transition-all ${
                faqsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDuration: '500ms', transitionDelay: `${index * 80}ms` }}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#f4f1ea]/60 transition-colors"
              >
                <span className="font-semibold text-[#16201a] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#2fae5b] flex-shrink-0 transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openId === faq.id && (
                <div className="px-5 pb-5">
                  <p className="text-[#16201a]/60 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
