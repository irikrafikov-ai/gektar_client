import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, FileText, Image, LayoutGrid, Calculator, Camera, Navigation, Phone, MessageCircle, Send, Grid3x3, Box } from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';

interface RegionPageProps {
  title: string;
  subtitle?: string;
  location: string;
  heroImage: string;
  yandexMapUrl: string;
  presentationUrl: string;
  genplanUrl: string;
  rendersUrl: string;
  photosUrl: string;
  chessboardUrl: string;
  telegramUrl?: string;
  tour3dUrl?: string;
}

export function RegionPage({
  title,
  subtitle,
  location,
  heroImage,
  yandexMapUrl,
  presentationUrl,
  genplanUrl,
  rendersUrl,
  photosUrl,
  chessboardUrl,
  telegramUrl = "https://t.me/gektarexpert_agents",
  tour3dUrl,
}: RegionPageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const beigeButtons = [
    { icon: FileText, label: 'ПРЕЗЕНТАЦИЯ', href: presentationUrl },
    ...(tour3dUrl ? [{ icon: Box, label: '3D ТУР', href: tour3dUrl }] : []),
    { icon: Grid3x3, label: 'ШАХМАТКА', href: chessboardUrl },
    { icon: Image, label: 'РЕНДЕРЫ', href: rendersUrl },
    { icon: LayoutGrid, label: 'ГЕНПЛАН', href: genplanUrl },
    { icon: Calculator, label: 'КАЛЬКУЛЯТОР РАССРОЧКИ', href: '/calculator', internal: true },
    { icon: Camera, label: 'ФОТОГРАФИИ', href: photosUrl },
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#16201a]">
      {/* Photo hero */}
      <div className="relative h-[52svh] min-h-[360px] overflow-hidden">
        <img
          src={heroImage}
          alt={subtitle || title}
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
                {subtitle || title}
              </h1>
              <div className="hero-shadow flex items-center justify-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light content area */}
      <div className="px-5 pt-8 pb-10">
        <div className="max-w-lg mx-auto">
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
              href={yandexMapUrl}
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
                href="tel:+79951691230"
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
              href={telegramUrl}
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
