import { useState } from 'react';
import { CalculatorIcon, Check } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function Calculator() {
  const [plotPrice, setPlotPrice] = useState(2000000);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const downPaymentPercent = 30;
  const installmentMonths = 12;

  const priceMin = 100000;
  const priceMax = 10000000;
  const fillPct = ((plotPrice - priceMin) / (priceMax - priceMin)) * 100;

  const downPaymentAmount = Math.round(plotPrice * (downPaymentPercent / 100));
  const loanAmount = plotPrice - downPaymentAmount;
  const monthlyPayment = Math.round(loanAmount / installmentMonths);

  return (
    <section ref={sectionRef} id="calculator" className="bg-white hectare-grid py-20 lg:py-28 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className={`flex justify-center mb-5 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b]">
            <CalculatorIcon className="w-4 h-4" />
            Калькулятор рассрочки
          </div>
        </div>

        <h2 className={`tight text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[#16201a] mb-4 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Рассчитайте платёж
          <br />
          за 1 минуту
        </h2>

        <p className={`text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12 text-[17px] transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Без банка, без процентов, без справок. Простая схема: первый взнос 30% и равные платежи на 12 месяцев.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#2fae5b]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-[#1c5238]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#16201a]">Первый взнос 30%</h4>
                <p className="text-[#16201a]/60">Фиксированный задаток при оформлении</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#2fae5b]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-[#1c5238]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#16201a]">Срок рассрочки 12 месяцев</h4>
                <p className="text-[#16201a]/60">Равные платежи без переплат</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#2fae5b]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-[#1c5238]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#16201a]">Никаких переплат — реальные 0%</h4>
                <p className="text-[#16201a]/60">Никаких скрытых комиссий и процентов</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#2fae5b]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-[#1c5238]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#16201a]">Участок оформляется сразу</h4>
                <p className="text-[#16201a]/60">Регистрация права собственности в Росреестре</p>
              </div>
            </div>
          </div>

          {/* Right side - Calculator */}
          <div className="glass rounded-[36px] p-8 lg:p-14 shadow-[0_12px_50px_rgba(20,40,28,0.10)]">
            {/* Plot Price Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[#16201a]/55 font-medium text-[15px]">Стоимость участка</label>
                <span className="font-display text-[#1c5238] font-bold text-xl">
                  {plotPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <input
                type="range"
                value={plotPrice}
                onChange={(e) => setPlotPrice(Number(e.target.value))}
                min={100000}
                max={10000000}
                step={50000}
                className="gk-range w-full"
                style={{ background: `linear-gradient(to right, #2fae5b ${fillPct}%, #dfe5e0 ${fillPct}%)` }}
              />
              <div className="flex justify-between text-[13px] text-[#16201a]/40 mt-3">
                <span>100 000 ₽</span>
                <span>10 000 000 ₽</span>
              </div>
            </div>

            {/* Down Payment Info */}
            <div className="mb-6 p-5 bg-[#f4f1ea] rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#16201a]/60">Первый взнос (30%)</span>
                <span className="font-display text-[#1c5238] font-bold">
                  {downPaymentAmount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#16201a]/60">Срок рассрочки</span>
                <span className="font-display text-[#1c5238] font-bold">12 месяцев</span>
              </div>
            </div>

            {/* Monthly Payment Display */}
            <div className="bg-[#0f1d15] rounded-2xl p-6 text-white">
              <div className="text-white/55 mb-2">Ежемесячный платеж</div>
              <div className="font-display text-4xl font-bold text-white mb-2">
                {monthlyPayment.toLocaleString('ru-RU')} ₽
              </div>
              <div className="flex items-center gap-2 text-[#3ec469]">
                <Check className="w-4 h-4" />
                <span className="text-sm">Рассрочка 0% без переплат</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
