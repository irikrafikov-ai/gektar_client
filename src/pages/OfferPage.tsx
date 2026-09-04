import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';
import { OFFER } from '@/data/offer';

export function OfferPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#16201a] flex flex-col">
      <div className="flex-1 px-5 sm:px-6 pt-8 sm:pt-14 pb-14">
        <div className="max-w-3xl mx-auto">
          {/* Шапка */}
          <div
            className={`text-center mb-9 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-[0_8px_30px_rgba(20,40,28,0.15)] mx-auto mb-6">
              <img src="/images/logo-main.png" alt="ГектарЪ" className="w-full h-full object-cover" />
            </div>
            <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-3">
              {OFFER.kind.replace(/[()]/g, '')}
            </p>
            <h1 className="tight text-3xl md:text-4xl font-bold mb-3">{OFFER.title}</h1>
            <p className="text-[#16201a]/55 text-[15px] max-w-xl mx-auto leading-relaxed">{OFFER.subtitle}</p>
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Преамбула */}
            <div className="glass rounded-[32px] p-7 sm:p-10 mb-5 shadow-[0_12px_50px_rgba(20,40,28,0.08)]">
              {OFFER.preamble.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-[15px] leading-[1.75] text-[#16201a]/75 ${
                    index < OFFER.preamble.length - 1 ? 'mb-4' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Разделы */}
            <div className="space-y-5">
              {OFFER.sections.map((section) => (
                <section
                  key={section.number}
                  className="glass rounded-[32px] p-7 sm:p-10 shadow-[0_12px_50px_rgba(20,40,28,0.08)]"
                >
                  <h2 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-5">
                    {section.number}. {section.title}
                  </h2>

                  {/* Реквизиты — списком, остальное — абзацами */}
                  {section.number === '6' ? (
                    <div className="space-y-1.5">
                      {section.items.map((item, index) => (
                        <p
                          key={index}
                          className={`text-[15px] leading-relaxed ${
                            index === 0 ? 'font-semibold text-[#16201a]' : 'text-[#16201a]/75'
                          }`}
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {section.items.map((item, index) => (
                        <p key={index} className="text-[15px] leading-[1.75] text-[#16201a]/75">
                          {item}
                        </p>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <p className="text-center text-[13px] text-[#16201a]/40 mt-6">{OFFER.revision}</p>

            <Link
              to="/"
              className="mt-6 w-full flex items-center justify-center gap-3 bg-white hover:bg-white/70 text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 text-[#1c5238]" />
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>

      <Footer onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
