import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, FileText, Image, LayoutGrid, Calculator,
  Camera, Navigation, Phone, MessageCircle, Send, Grid3x3, Box,
} from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';

const objects = [
  {
    id: 'rozhdestveno',
    name: 'Щекинские берега',
    subtitle: 'Рождествено',
    location: 'Тульская область, с. Костромарово',
    heroImage: '/images/lot-tula-main.png',
    yandexMapUrl: 'https://yandex.ru/maps/?ll=37.6248%2C53.9242&z=15&pt=37.6248%2C53.9242%2Cpm2rdl',
    presentationUrl: 'https://disk.yandex.ru/d/FQEv9F3Wm_paaA',
    genplanUrl: 'https://disk.yandex.ru/d/OOfk0Cwuf3NJSQ',
    rendersUrl: 'https://disk.yandex.ru/d/pKCa2_frC8agoQ',
    photosUrl: 'https://disk.yandex.ru/d/0LutE9MajGAX6g',
    chessboardUrl: 'https://disk.yandex.ru/d/A-4OIyQsq--AnQ',
    tour3dUrl: 'https://client.gektar.expert/tours/kostomarovo/',
  },
  {
    id: 'kraenka',
    name: 'Краенка',
    subtitle: 'Краенка',
    location: 'Тульская область',
    heroImage: '/images/lot-tula-main.png',
    yandexMapUrl: 'https://yandex.ru/maps/?ll=37.6248%2C53.9242&z=15&pt=37.6248%2C53.9242%2Cpm2rdl',
    presentationUrl: 'https://disk.yandex.ru/d/DIQg3deqJJsUOA',
    genplanUrl: 'https://disk.yandex.ru/d/KRvLT7Ryf5c8jQ',
    rendersUrl: 'https://disk.yandex.ru/d/of-ecNX40vRX5A',
    photosUrl: 'https://disk.yandex.ru/d/TI6hojL7kZXVYA',
    chessboardUrl: 'https://disk.yandex.ru/d/8tKwpyMXrIfsEw',
    tour3dUrl: 'https://client.gektar.expert/tours/kostomarovo/',
  },
];

export function TulaPage() {
  const [activeObject, setActiveObject] = useState(objects[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const beigeButtons = [
    { icon: FileText, label: 'ПРЕЗЕНТАЦИЯ', href: activeObject.presentationUrl },
    { icon: Box, label: '3D ТУР', href: activeObject.tour3dUrl },
    { icon: Grid3x3, label: 'ШАХМАТКА', href: activeObject.chessboardUrl },
    { icon: Image, label: 'РЕНДЕРЫ', href: activeObject.rendersUrl },
    { icon: LayoutGrid, label: 'ГЕНПЛАН', href: activeObject.genplanUrl },
    { icon: Calculator, label: 'КАЛЬКУЛЯТОР РАССРОЧКИ', href: '/calculator', internal: true },
    { icon: Camera, label: 'ФОТОГРАФИИ', href: activeObject.photosUrl },
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#16201a]">
      {/* Photo hero */}
      <div className="relative h-[52svh] min-h-[360px] overflow-hidden">
        <img
          src={activeObject.heroImage}
          alt={activeObject.subtitle}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1711]/85 to-transparent" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between p-5 pt-6">
          <a
            href="https://client.gektar.expert/"
            className={`flex items-center gap-2 glass text-[#16201a] px-4 py-3 rounded-full shadow-[0_4px_24px_rgba(20,40,28,0.08)] transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">На главную</span>
          </a>
        </div>

        {/* Logo + Title over photo */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8">
          <div className="max-w-lg mx-auto text-center">
            <div
              className={`flex justify-center mb-5 transition-all duration-1000 delay-200 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white shadow-[0_8px_30px_rgba(20,40,28,0.25)] hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/logo-main.png"
                  alt="ГектарЪ"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <h1 className="hero-shadow font-display text-3xl md:text-5xl font-bold text-white mb-2">
                ТУЛА
              </h1>
              <div className="hero-shadow flex items-center justify-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{activeObject.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light content area */}
      <div className="px-5 pt-8 pb-10">
        <div className="max-w-lg mx-auto">
          {/* Object Selector Tabs */}
          <div className="flex gap-2 mb-6 justify-center">
            {objects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setActiveObject(obj)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  activeObject.id === obj.id
                    ? 'bg-[#1c5238] text-white shadow-[0_4px_24px_rgba(20,40,28,0.08)]'
                    : 'bg-white text-[#16201a]/60 border border-[#1c5238]/10 hover:bg-[#f4f1ea] hover:text-[#16201a]'
                }`}
              >
                {obj.name}
              </button>
            ))}
          </div>

          {/* Active object subtitle */}
          <div className="text-center mb-6">
            <span className="text-[#16201a]/50 text-sm">{activeObject.subtitle}</span>
          </div>

          {/* Beige buttons → clean light pills */}
          <div className="space-y-2.5 mb-4">
            {beigeButtons.map((button, index) => {
              const Icon = button.icon;
              const isInternal = button.internal;
              const baseClass = `group w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f4f1ea] text-[#16201a] border border-[#1c5238]/10 py-3.5 rounded-full text-sm font-semibold transition-all duration-500 shadow-[0_2px_10px_rgba(20,40,28,0.06)] hover:-translate-y-0.5 active:translate-y-0`;
              const animClass = isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';
              const style = { transitionDelay: `${400 + index * 70}ms` };

              if (isInternal) {
                return (
                  <Link
                    key={button.label}
                    to={button.href}
                    className={`${baseClass} ${animClass}`}
                    style={style}
                  >
                    <Icon className="w-5 h-5 text-[#1c5238] group-hover:scale-110 transition-transform duration-300" />
                    {button.label}
                  </Link>
                );
              }
              return (
                <a
                  key={button.label}
                  href={button.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${baseClass} ${animClass}`}
                  style={style}
                >
                  <Icon className="w-5 h-5 text-[#1c5238] group-hover:scale-110 transition-transform duration-300" />
                  {button.label}
                </a>
              );
            })}
          </div>

          {/* Green buttons → deep-green pills */}
          <div
            className={`space-y-2.5 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${400 + beigeButtons.length * 70 + 100}ms` }}
          >
            {/* КАК ДОЕХАТЬ */}
            <a
              href={activeObject.yandexMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center gap-3 bg-[#1c5238] hover:bg-[#16432e] text-white py-3.5 rounded-full text-sm font-semibold transition-all duration-500 shadow-[0_4px_24px_rgba(20,40,28,0.08)] hover:-translate-y-0.5"
            >
              <Navigation className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              КАК ДОЕХАТЬ
            </a>

            {/* ЗВОНОК + НАПИСАТЬ В MAX */}
            <div className="flex gap-2.5">
              <a
                href="tel:+74993254858"
                className="group flex-1 flex items-center justify-center gap-2 bg-[#1c5238] hover:bg-[#16432e] text-white py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-500 shadow-[0_4px_24px_rgba(20,40,28,0.08)] hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                ЗВОНОК
              </a>
              <a
                href="https://max.ru/u/f9LHodD0cOKGmwKtxVHtowELQauNtni0QxVzToNr9E1Khu1saPkEz-4g8DU"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-1 flex items-center justify-center gap-2 bg-[#2fae5b] hover:bg-[#27964d] text-white py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-500 shadow-[0_4px_24px_rgba(20,40,28,0.08)] hover:-translate-y-0.5 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="sm:hidden">В MAX</span>
                <span className="hidden sm:inline">НАПИСАТЬ В MAX</span>
              </a>
            </div>

            {/* КАНАЛ В ТГ */}
            <a
              href="https://t.me/gektarexpert_agents"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f4f1ea] text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-500 shadow-[0_2px_10px_rgba(20,40,28,0.06)]"
            >
              <Send className="w-4 h-4 text-[#1c5238] group-hover:translate-x-0.5 transition-transform" />
              КАНАЛ В ТГ
            </a>
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
