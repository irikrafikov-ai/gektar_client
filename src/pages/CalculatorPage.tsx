import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Phone } from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';

export function CalculatorPage() {
  const [plotPrice, setPlotPrice] = useState(2000000);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const downPaymentPercent = 30;
  const installmentMonths = 12;

  const downPaymentAmount = Math.round(plotPrice * (downPaymentPercent / 100));
  const loanAmount = plotPrice - downPaymentAmount;
  const monthlyPayment = Math.round(loanAmount / installmentMonths);

  const sliderMin = 100000;
  const sliderMax = 10000000;
  const fillPct = ((plotPrice - sliderMin) / (sliderMax - sliderMin)) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#16201a]">
      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pb-12 pt-8 sm:pt-16">
        {/* Logo */}
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white shadow-[0_8px_30px_rgba(20,40,28,0.15)] mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <img
            src="/images/logo-main.png"
            alt="ГектарЪ"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <div className={`text-center mb-10 transition-all duration-1000 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-3">Калькулятор</p>
          <h1 className="tight text-3xl md:text-4xl font-bold mb-2">
            Калькулятор рассрочки
          </h1>
          <p className="text-[#16201a]/55 text-[15px]">
            Рассчитайте свой ежемесячный платеж
          </p>
        </div>

        {/* Calculator Card */}
        <div className={`w-full max-w-md transition-all duration-1000 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="glass rounded-[36px] p-8 lg:p-14 shadow-[0_12px_50px_rgba(20,40,28,0.10)]">

            {/* Plot Price Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[#16201a]/55 font-medium text-sm">Стоимость участка</label>
                <span className="font-display text-[#16201a] font-bold text-xl">
                  {plotPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                step={50000}
                value={plotPrice}
                onChange={(e) => setPlotPrice(Number(e.target.value))}
                className="gk-range w-full"
                style={{ background: `linear-gradient(to right, #2fae5b ${fillPct}%, #dfe5e0 ${fillPct}%)` }}
              />
              <div className="flex justify-between text-xs text-[#16201a]/40 mt-3">
                <span>100 000 ₽</span>
                <span>10 000 000 ₽</span>
              </div>
            </div>

            {/* Info Rows */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3.5 bg-white rounded-2xl">
                <span className="text-[#16201a]/55 text-sm">Первый взнос ({downPaymentPercent}%)</span>
                <span className="text-[#1c5238] font-bold">{downPaymentAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-center p-3.5 bg-white rounded-2xl">
                <span className="text-[#16201a]/55 text-sm">Срок рассрочки</span>
                <span className="text-[#1c5238] font-bold">{installmentMonths} месяцев</span>
              </div>
              <div className="flex justify-between items-center p-3.5 bg-white rounded-2xl">
                <span className="text-[#16201a]/55 text-sm">Сумма к выплате</span>
                <span className="text-[#1c5238] font-bold">{loanAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            {/* Monthly Payment Display */}
            <div className="bg-[#f4f1ea] rounded-3xl p-6 text-center mb-6">
              <div className="text-[#16201a]/50 text-[13px] mb-2 uppercase tracking-[0.14em]">Ежемесячный платеж</div>
              <div className="font-display text-4xl md:text-5xl font-bold text-[#1c5238] mb-2">
                {monthlyPayment.toLocaleString('ru-RU')} <span className="text-2xl">₽</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#2fae5b]">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Рассрочка 0% без переплат</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                'Первый взнос 30%',
                'Срок 12 месяцев',
                '0% переплат',
                'Оформление сразу'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-[#16201a]/60 text-xs">
                  <div className="w-4 h-4 rounded-full bg-[#2fae5b]/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#1c5238]" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                to="/pay"
                className="group w-full flex items-center justify-center gap-3 bg-[#2fae5b] hover:bg-[#27964d] text-white py-4 rounded-full text-sm font-semibold transition-all duration-500 shadow-[0_4px_24px_rgba(20,40,28,0.08)] hover:-translate-y-0.5"
              >
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Оформить рассрочку онлайн
              </Link>
              <a
                href="tel:+74993254858"
                className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f4f1ea] text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_2px_10px_rgba(20,40,28,0.06)]"
              >
                <Phone className="w-5 h-5 text-[#1c5238] group-hover:scale-110 transition-transform" />
                Получить консультацию
              </a>
              <a
                href="/"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f4f1ea] text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_2px_10px_rgba(20,40,28,0.06)]"
              >
                <ArrowLeft className="w-4 h-4 text-[#1c5238]" />
                Вернуться на главную
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onContactClick={() => setIsContactOpen(true)} />

      {/* Contact Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
