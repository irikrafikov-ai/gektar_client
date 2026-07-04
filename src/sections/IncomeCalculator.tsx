import { useState } from 'react';
import { CalculatorIcon, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const businessTypes = [
  {
    id: 'apiary',
    name: 'Пасека',
    description: 'Пасека — стабильный доход с минимальными вложениями',
    icon: '🐝',
    investment: 750000,
    income: 750000,
    payback: 12,
    roi: 100,
  },
  {
    id: 'greenhouse',
    name: 'Теплица',
    description: 'Круглогодичный урожай клубники',
    icon: '🌱',
    investment: 1200000,
    income: 1800000,
    payback: 8,
    roi: 150,
  },
  {
    id: 'glamping',
    name: 'Глэмпинг',
    description: 'Сезонный бизнес с высокой маржинальностью',
    icon: '⛺',
    investment: 2500000,
    income: 3500000,
    payback: 10,
    roi: 140,
  },
  {
    id: 'farm',
    name: 'Ферма',
    description: 'Разведение КРС или коз',
    icon: '🐄',
    investment: 3000000,
    income: 2400000,
    payback: 15,
    roi: 80,
  },
  {
    id: 'agro',
    name: 'Агроусадьба',
    description: 'Проживание, баня, экскурсии',
    icon: '🏡',
    investment: 2000000,
    income: 2800000,
    payback: 9,
    roi: 140,
  },
];

export function IncomeCalculator() {
  const [selectedBusiness, setSelectedBusiness] = useState(businessTypes[0]);
  const [area, setArea] = useState(1);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const investment = selectedBusiness.investment * area;
  const annualIncome = selectedBusiness.income * area;
  const payback = selectedBusiness.payback;
  const roi = selectedBusiness.roi;

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 px-5 sm:px-6 bg-white relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        {/* Badge */}
        <div className={`flex justify-center mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 glass-soft text-[#2fae5b] px-4 py-2 rounded-full text-[13px] font-semibold tracking-[0.18em] uppercase">
            <CalculatorIcon className="w-4 h-4" />
            Калькулятор доходности
          </div>
        </div>

        <h2 className={`tight text-3xl sm:text-4xl font-bold text-center text-[#16201a] mb-4 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Сколько можно заработать на земле?
        </h2>
        <p className={`text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Рассчитайте потенциальный доход для разных бизнес-сценариев
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Business types */}
          <div className="space-y-3">
            {businessTypes.map((business) => (
              <button
                key={business.id}
                onClick={() => setSelectedBusiness(business)}
                className={`w-full flex items-start gap-4 p-4 rounded-3xl text-left transition-all ${
                  selectedBusiness.id === business.id
                    ? 'bg-[#1c5238] text-white shadow-[0_12px_50px_rgba(20,40,28,0.10)]'
                    : 'bg-[#f4f1ea] text-[#16201a] hover:bg-[#ece8df]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    selectedBusiness.id === business.id
                      ? 'bg-white/15'
                      : 'bg-[#2fae5b]/15'
                  }`}
                >
                  {business.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{business.name}</h4>
                  <p
                    className={`text-sm ${
                      selectedBusiness.id === business.id
                        ? 'text-white/70'
                        : 'text-[#16201a]/60'
                    }`}
                  >
                    {business.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right side - Calculator */}
          <div className="glass rounded-[36px] p-8 lg:p-14 shadow-[0_12px_50px_rgba(20,40,28,0.10)]">
            {/* Area slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[#16201a]/60 font-medium">Площадь участка</label>
                <span className="font-display text-[#1c5238] font-bold text-xl">{area} га</span>
              </div>
              <Slider
                value={[area]}
                onValueChange={(value) => setArea(value[0])}
                min={0.5}
                max={10}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-[#16201a]/40 mt-2">
                <span>0.5 га</span>
                <span>10 га</span>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
              <div className="bg-white rounded-2xl p-3 sm:p-4 text-center shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
                <div className="text-[#16201a]/50 text-xs sm:text-sm mb-1">Вложения</div>
                <div className="font-display text-lg sm:text-xl font-bold text-[#16201a]">
                  {investment.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className="bg-[#1c5238] rounded-2xl p-3 sm:p-4 text-center shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
                <div className="text-white/70 text-xs sm:text-sm mb-1">Доход в год</div>
                <div className="font-display text-lg sm:text-xl font-bold text-white">
                  {annualIncome.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className="bg-white rounded-2xl p-3 sm:p-4 text-center shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
                <div className="text-[#16201a]/50 text-xs sm:text-sm mb-1">Окупаемость</div>
                <div className="font-display text-lg sm:text-xl font-bold text-[#16201a]">{payback} мес</div>
              </div>
            </div>

            {/* ROI */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#16201a]/60">Рентабельность (ROI)</span>
                <span className="font-semibold text-[#1c5238]">{roi}% годовых</span>
              </div>
              <div className="h-3 bg-[#dfe5e0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2fae5b] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(roi, 100)}%` }}
                />
              </div>
            </div>

            {/* CTA */}
            <button className="w-full bg-[#1c5238] hover:bg-[#16432e] text-white py-3.5 rounded-full text-[16px] font-semibold transition-colors">
              Подробный расчёт
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-[#2fae5b]/10 rounded-2xl">
              <div className="flex items-center gap-2 text-[#1c5238]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Инвестиция в землю: стоимость участка от 100 000 ₽ с рассрочкой 0% — от 8 333 ₽/мес
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
