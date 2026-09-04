import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { COMPANY_SHORT_LINE } from '@/data/company';

interface FooterProps {
  onContactClick: () => void;
}

// Social icon SVG components
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function VKIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.136.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.788 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .373.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function MaxIcon({ className }: { className?: string }) {
  return (
    <img 
      src="/images/icon-max.png" 
      alt="Max" 
      className={className}
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

const socialLinks = [
  { name: 'YouTube', icon: YouTubeIcon, href: 'https://www.youtube.com/@gektarexpert', color: 'hover:text-red-500' },
  { name: 'VK', icon: VKIcon, href: 'https://vk.com/gektar.expert', color: 'hover:text-blue-400' },
  { name: 'Pinterest', icon: PinterestIcon, href: 'https://www.pinterest.com/gektarexpert/', color: 'hover:text-red-400' },
  { name: 'Telegram', icon: TelegramIcon, href: 'https://t.me/gektarexpert_agents', color: 'hover:text-sky-400' },
  { name: 'Max', icon: MaxIcon, href: 'https://max.ru/join/YnMdb16FNlLs-wTTF6a7sWa39jW2hVquJ_c73ChGi-k', color: 'hover:text-yellow-400' },
];

export function Footer({ onContactClick }: FooterProps) {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: socialRef, isVisible: socialVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: bottomRef, isVisible: bottomVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <footer className="bg-[#0f1d15] text-white py-16 relative overflow-hidden">
      <div ref={contentRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={socialRef} className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Logo and contact — left */}
          <div className={`transition-all duration-700 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="font-display text-3xl font-bold mb-2">
              ГЕКТАР<span className="text-[#3ec469]">Ъ</span>
            </div>
            <p className="text-white/55 mb-6">
              Земля под бизнес, инвестиции и жизнь.
              Продажа земельных участков от собственника.
            </p>

            <div className="space-y-3">
              <a
                href="tel:+79951691230"
                className="flex items-center gap-3 text-white hover:text-[#3ec469] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#3ec469]/80" />
                +7 (995) 169-12-30
              </a>
              <a
                href="mailto:Gektar.RF@yandex.com"
                className="flex items-center gap-3 text-white/55 hover:text-[#3ec469] transition-colors"
              >
                <Mail className="w-5 h-5 text-[#3ec469]/80" />
                Gektar.RF@yandex.com
              </a>
              <div className="flex items-center gap-3 text-white/55">
                <MapPin className="w-5 h-5 text-[#3ec469]/80" />
                Москва и регионы
              </div>
              <div className="flex items-center gap-3 text-white/55">
                <Clock className="w-5 h-5 text-[#3ec469]/80" />
                Пн-Пт: 9:00 - 20:00
              </div>
            </div>
          </div>

          {/* Social links — right */}
          <div className={`transition-all duration-700 ${
            socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h4 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#3ec469] mb-4">Мы в социальных сетях</h4>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3.5 text-white/55 ${social.color} transition-colors`}
                    title={social.name}
                  >
                    <Icon className="w-7 h-7 flex-shrink-0" />
                    <span className="text-sm font-medium">{social.name}</span>
                    {social.name === 'YouTube' && (
                      <span className="text-white/35 text-xs ml-0.5">*</span>
                    )}
                  </a>
                );
              })}
            </div>
            {/* YouTube Disclaimer */}
            <p className="text-white/30 text-xs mt-4 max-w-md leading-relaxed">
              * Компания Meta Platforms Inc. признана экстремистской организацией и запрещена на территории Российской Федерации
            </p>
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className={`bg-[#2fae5b] rounded-[32px] p-8 mb-12 transition-all duration-700 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2 text-white">Остались вопросы?</h3>
              <p className="text-white/80">
                Звоните или оставьте заявку — перезвоним за 15 минут
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Button
                onClick={onContactClick}
                className="bg-white text-[#16201a] hover:bg-white/90 px-6 h-12 rounded-full font-semibold flex items-center justify-center"
              >
                Оставить заявку
              </Button>
              <a
                href="tel:+79951691230"
                className="bg-white/20 hover:bg-white/30 text-white px-6 h-12 rounded-full font-semibold transition-colors flex items-center justify-center"
              >
                Позвонить
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div ref={bottomRef} className={`border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 ${
          bottomVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="text-center md:text-left">
            <p className="text-white/45 text-sm">
              © 2024 ГектарЪ. Все права защищены.
            </p>
            {/* Реквизиты продавца — обязательны при приёме онлайн-платежей */}
            <p className="text-white/35 text-[13px] mt-1.5 leading-relaxed">
              {COMPANY_SHORT_LINE}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/45 text-sm">
            <Link to="/pay" className="hover:text-[#3ec469] transition-colors">Оформить рассрочку</Link>
            <Link to="/requisites" className="hover:text-[#3ec469] transition-colors">Реквизиты</Link>
            <button className="hover:text-[#3ec469] transition-colors">Политика конфиденциальности</button>
            <button className="hover:text-[#3ec469] transition-colors">Пользовательское соглашение</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
