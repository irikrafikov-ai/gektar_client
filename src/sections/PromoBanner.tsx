import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 26,
    seconds: 47,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#0f1d15] py-14 lg:py-16 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 glass-dark rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-[#3ec469]" />
            </div>
            <div>
              <h3 className="font-display tight text-2xl sm:text-3xl text-white">
                Консультация по грантам!
              </h3>
              <p className="text-white/60 mt-1">
                Бесплатная консультация по получению грантов на развитие бизнеса
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#c9a978]">До конца акции</span>
            <div className="flex gap-3">
              <div className="glass-dark rounded-2xl px-4 py-3 text-center min-w-[64px]">
                <div className="font-display text-2xl text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-white/50 text-xs mt-0.5">час</div>
              </div>
              <div className="glass-dark rounded-2xl px-4 py-3 text-center min-w-[64px]">
                <div className="font-display text-2xl text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-white/50 text-xs mt-0.5">мин</div>
              </div>
              <div className="glass-dark rounded-2xl px-4 py-3 text-center min-w-[64px]">
                <div className="font-display text-2xl text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-white/50 text-xs mt-0.5">сек</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
