import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onContactClick: () => void;
}

export function Hero({ onContactClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      if (!containerRef.current || isMobile) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const progress = Math.max(0, Math.min(1, -rect.top / (windowHeight * 0.5)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  const textY = isMobile ? 0 : -scrollProgress * 150;
  const textOpacity = isMobile ? 1 : 1 - scrollProgress * 0.8;
  const scale = isMobile ? 1 : 1 - scrollProgress * 0.05;

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky Image Container - desktop only */}
      <div className="hidden md:block sticky top-0 h-screen w-full overflow-hidden z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `scale(${1 + scrollProgress * 0.1})`,
            transition: 'transform 0.1s linear',
          }}
        >
          <img
            src="/images/hero-main-bg.png"
            alt="Земельный участок"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1711]/90 via-[#0c1711]/50 to-transparent" />

        {/* Text Content - desktop */}
        <div 
          className="absolute inset-0 flex items-center z-10"
          style={{
            transform: `translateY(${textY}px) scale(${scale})`,
            opacity: textOpacity,
            transition: 'transform 0.1s linear, opacity 0.1s linear',
          }}
        >
          <div className="max-w-5xl px-6 lg:px-12 w-full text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 glass-soft rounded-full px-4 py-2 mb-8">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#2fae5b] flex items-center justify-center text-[10px] text-white font-bold">А</div>
                <div className="w-6 h-6 rounded-full bg-[#1c5238] flex items-center justify-center text-[10px] text-white font-bold">М</div>
              </div>
              <span className="text-white text-[13px] font-semibold">Алексей из Москвы забронировал участок</span>
              <span className="w-2 h-2 bg-[#3ec469] rounded-full" />
            </div>

            {/* Main Heading */}
            <h1 className="font-display hero-shadow text-4xl sm:text-6xl lg:text-[76px] font-bold text-white tracking-tight leading-[1.05] mb-3">
              Земельный участок
            </h1>
            <h2 className="font-display hero-shadow text-4xl sm:text-6xl lg:text-[76px] font-bold tracking-tight leading-[1.05] mb-8 text-white">
              под любой проект
            </h2>

            {/* Subtitle */}
            <p className="hero-shadow text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed mb-10">
              От собственника без посредников. Оформление за 3 дня с полным пакетом документов.
            </p>

            {/* Glass Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl">
              {[
                { value: 'от 100 тыс ₽', label: 'за участок' },
                { value: 'от 1000 ₽', label: 'аренда земли', highlight: true },
                { value: '12 мес', label: 'рассрочка 0%' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="glass rounded-3xl p-5 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className={`font-display text-2xl font-bold mb-1 ${stat.highlight ? 'text-[#1c5238]' : 'text-[#16201a]'}`}>
                    {stat.value}
                  </div>
                  <div className="text-[#16201a]/60 text-[13px]">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onContactClick}
                className="bg-[#2fae5b] hover:bg-[#27964d] text-white rounded-full pl-6 pr-2 py-3.5 h-auto text-[16px] font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Подобрать участок
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
              </Button>
              <Button
                variant="outline"
                onClick={() => document.querySelector('#calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="glass text-[#16201a] rounded-full px-6 py-3.5 h-auto text-[16px] font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-white/80"
              >
                <Calculator className="w-4 h-4" />
                Рассчитать платеж
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - desktop only */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
          style={{
            opacity: 1 - scrollProgress * 2,
            transition: 'opacity 0.3s ease',
          }}
        >
          <span className="text-white/60 text-[10px] uppercase tracking-[0.3em] hero-shadow">Листайте вниз</span>
          <div className="w-6 h-10 border border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Spacer for desktop scrolling */}
      <div className="hidden md:block h-[50vh]" />

      {/* ===== MOBILE HERO - no sticky animation ===== */}
      <div className="md:hidden relative min-h-[calc(100dvh-56px)] flex flex-col justify-center overflow-hidden bg-[#0c1711]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-main-bg.png"
            alt="Земельный участок"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1711]/90 via-[#0c1711]/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-5 py-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-soft rounded-full px-3 py-1.5 mb-6">
            <div className="flex -space-x-1.5">
              <div className="w-4 h-4 rounded-full bg-[#2fae5b] flex items-center justify-center text-[7px] text-white font-bold">А</div>
              <div className="w-4 h-4 rounded-full bg-[#1c5238] flex items-center justify-center text-[7px] text-white font-bold">М</div>
            </div>
            <span className="text-white text-[10px] font-semibold">Забронировал участок</span>
            <span className="w-1 h-1 bg-[#3ec469] rounded-full" />
          </div>

          {/* Main Heading */}
          <h1 className="font-display hero-shadow text-4xl font-bold text-white tracking-tight leading-[1.05] mb-1">
            Земельный участок
          </h1>
          <h2 className="font-display hero-shadow text-4xl font-bold tracking-tight leading-[1.05] mb-5 text-white">
            под любой проект
          </h2>

          {/* Subtitle */}
          <p className="hero-shadow text-sm text-white/90 max-w-xs mx-auto mb-6">
            От собственника без посредников. Оформление за 3 дня.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 mb-6 max-w-xs mx-auto">
            {[
              { value: 'от 100 тыс', label: 'за участок' },
              { value: 'от 1000 ₽', label: 'аренда', highlight: true },
              { value: '12 мес', label: 'рассрочка' },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-3"
              >
                <div className={`font-display text-sm font-bold mb-0.5 ${stat.highlight ? 'text-[#1c5238]' : 'text-[#16201a]'}`}>
                  {stat.value}
                </div>
                <div className="text-[#16201a]/60 text-[9px]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button
              onClick={onContactClick}
              className="w-full bg-[#2fae5b] hover:bg-[#27964d] text-white rounded-full px-6 py-4 h-auto text-[16px] font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Подобрать участок
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => document.querySelector('#calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full glass text-[#16201a] rounded-full px-6 py-4 h-auto text-[16px] font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-white/80"
            >
              <Calculator className="w-4 h-4" />
              Рассчитать платеж
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
