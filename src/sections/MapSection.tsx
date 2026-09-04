import { Phone } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function MapSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: mapRef, isVisible: mapVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: regionsRef, isVisible: regionsVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className={`text-center mb-12 transition-all duration-700 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-4">География</p>
          <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold text-[#16201a] mb-4">
            Где находятся наши участки
          </h2>
          <p className="text-[#16201a]/60 max-w-2xl mx-auto">
            Земли в Московской области, Туле, Твери и Крыму.
            Выберите регион и посмотрите доступные участки.
          </p>
        </div>

        {/* Yandex Map */}
        <div className={`relative rounded-[28px] overflow-hidden border border-[#1c5238]/10 aspect-[21/9] shadow-[0_4px_24px_rgba(20,40,28,0.08)] transition-all duration-1000 ${
          mapVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} ref={mapRef}>
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=37.6176%2C55.7558&z=5&l=map&pt=37.6176%2C55.7558%2Cpm2rdl1~37.6173%2C54.1945%2Cpm2rdl2~35.9191%2C56.8587%2Cpm2rdl3~34.1000%2C45.0000%2Cpm2rdl4"
            width="100%"
            height="100%"
            frameBorder="0"
            className="absolute inset-0"
            title="Карта участков"
            allowFullScreen
          />
        </div>

        {/* Regions info */}
        <div ref={regionsRef} className={`mt-8 flex flex-wrap justify-center gap-4 transition-all duration-700 ${
          regionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          {[
            { name: 'Московская обл.', count: '4 участка' },
            { name: 'Тула', count: '4 участка' },
            { name: 'Тверь', count: '4 участка' },
            { name: 'Крым', count: '6 участков' },
          ].map((region, index) => (
            <div
              key={region.name}
              className={`glass-soft rounded-2xl px-5 py-3 transition-all duration-500 ${
                regionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="font-semibold text-[#16201a]">{region.name}</div>
              <div className="text-[#2fae5b] text-sm font-medium">{region.count}</div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className={`mt-8 text-center transition-all duration-700 ${
          regionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ transitionDelay: '400ms' }}>
          <p className="text-[#16201a]/60 mb-4">
            Не можете определиться с локацией? Позвоните — поможем выбрать!
          </p>
          <a
            href="tel:+74993254858"
            className="inline-flex items-center gap-2 bg-[#1c5238] hover:bg-[#16432e] text-white px-6 py-3.5 rounded-full text-[16px] font-semibold transition-colors"
          >
            <Phone className="w-5 h-5" />
            +7 (499) 325-48-58
          </a>
        </div>
      </div>
    </section>
  );
}
