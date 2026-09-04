import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';
import { COMPANY } from '@/data/company';

export function RequisitesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // буфер обмена недоступен — не страшно, значение видно на экране
    }
  };

  const sections: { title: string; rows: { label: string; value: string; copyable?: boolean }[] }[] = [
    {
      title: 'Продавец',
      rows: [
        { label: 'Полное наименование', value: COMPANY.fullName },
        { label: 'Сокращённое наименование', value: COMPANY.shortName },
        { label: 'ИНН', value: COMPANY.inn, copyable: true },
        { label: 'ОГРНИП', value: COMPANY.ogrnip, copyable: true },
        { label: 'Адрес', value: COMPANY.address },
      ],
    },
    {
      title: 'Банковские реквизиты',
      rows: [
        { label: 'Расчётный счёт', value: COMPANY.bank.account, copyable: true },
        { label: 'Банк', value: COMPANY.bank.name },
        { label: 'БИК', value: COMPANY.bank.bic, copyable: true },
        { label: 'Корр. счёт', value: COMPANY.bank.corrAccount, copyable: true },
        { label: 'ИНН банка', value: COMPANY.bank.inn, copyable: true },
        { label: 'КПП банка', value: COMPANY.bank.kpp, copyable: true },
      ],
    },
    {
      title: 'Контакты',
      rows: [
        { label: 'Телефон', value: COMPANY.phone },
        { label: 'E-mail для клиентов', value: COMPANY.email },
        { label: 'E-mail для документов', value: COMPANY.legalEmail },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#16201a] flex flex-col">
      <div className="flex-1 px-5 sm:px-6 pt-8 sm:pt-14 pb-14">
        <div className="max-w-2xl mx-auto">
          <div
            className={`text-center mb-9 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-[0_8px_30px_rgba(20,40,28,0.15)] mx-auto mb-6">
              <img src="/images/logo-main.png" alt="ГектарЪ" className="w-full h-full object-cover" />
            </div>
            <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-3">Юридическая информация</p>
            <h1 className="tight text-3xl md:text-4xl font-bold">Реквизиты</h1>
          </div>

          <div
            className={`space-y-5 transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {sections.map((section) => (
              <div key={section.title} className="glass rounded-[32px] p-7 sm:p-9 shadow-[0_12px_50px_rgba(20,40,28,0.08)]">
                <h2 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-5">
                  {section.title}
                </h2>
                <dl className="space-y-4">
                  {section.rows.map((row) => (
                    <div key={row.label} className="sm:flex sm:items-baseline sm:gap-5">
                      <dt className="text-[#16201a]/50 text-[14px] sm:w-52 sm:flex-shrink-0 mb-1 sm:mb-0">
                        {row.label}
                      </dt>
                      <dd className="flex items-start gap-2 text-[15px] leading-relaxed flex-1 min-w-0">
                        <span className={row.copyable ? 'mono break-all' : 'break-words'}>{row.value}</span>
                        {row.copyable && (
                          <button
                            type="button"
                            onClick={() => copy(row.label, row.value)}
                            className="flex-shrink-0 p-1 rounded-lg text-[#16201a]/35 hover:text-[#1c5238] hover:bg-[#2fae5b]/10 transition-colors"
                            title={`Скопировать ${row.label}`}
                            aria-label={`Скопировать ${row.label}`}
                          >
                            {copied === row.label ? (
                              <Check className="w-4 h-4 text-[#2fae5b]" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

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

      <Footer onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
