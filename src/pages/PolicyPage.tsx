import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';
import { POLICY, type PolicyItem } from '@/data/policy';

/** Соседние пункты списка идут одним <ul>, абзацы — отдельными <p>. */
function renderItems(items: readonly PolicyItem[]) {
  const blocks: { kind: 'p' | 'ul'; texts: string[] }[] = [];

  for (const item of items) {
    const last = blocks[blocks.length - 1];
    if (item.kind === 'li' && last?.kind === 'ul') {
      last.texts.push(item.text);
    } else {
      blocks.push({ kind: item.kind === 'li' ? 'ul' : 'p', texts: [item.text] });
    }
  }

  return blocks.map((block, index) =>
    block.kind === 'ul' ? (
      <ul key={index} className="space-y-2 pl-1">
        {block.texts.map((text, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-[1.7] text-[#16201a]/75">
            <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#2fae5b] flex-shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p key={index} className="text-[15px] leading-[1.75] text-[#16201a]/75">
        {block.texts[0]}
      </p>
    ),
  );
}

export function PolicyPage() {
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
          <div
            className={`text-center mb-9 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-[0_8px_30px_rgba(20,40,28,0.15)] mx-auto mb-6">
              <img src="/images/logo-main.png" alt="ГектарЪ" className="w-full h-full object-cover" />
            </div>
            <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-3">
              Персональные данные
            </p>
            <h1 className="tight text-2xl md:text-3xl font-bold mb-3 leading-tight">{POLICY.title}</h1>
            <p className="text-[#16201a]/50 text-[14px]">{POLICY.published}</p>
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Преамбула */}
            <div className="glass rounded-[32px] p-7 sm:p-10 mb-5 shadow-[0_12px_50px_rgba(20,40,28,0.08)] space-y-4">
              {POLICY.preamble.map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-[1.75] text-[#16201a]/75">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Разделы */}
            <div className="space-y-5">
              {POLICY.sections.map((section) => (
                <section
                  key={section.number}
                  className="glass rounded-[32px] p-7 sm:p-10 shadow-[0_12px_50px_rgba(20,40,28,0.08)]"
                >
                  <h2 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-5">
                    {section.number}. {section.title}
                  </h2>
                  <div className="space-y-4">{renderItems(section.items)}</div>
                </section>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/offer"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/70 text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-300"
              >
                Договор оферты
              </Link>
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/70 text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-[#1c5238]" />
                Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
