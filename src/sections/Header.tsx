import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onContactClick: () => void;
}

const navItems = [
  { label: 'Главная', href: '/' },
  { label: 'Участки', href: '/#lots' },
  { label: 'Рассрочка', href: '/#calculator' },
  { label: 'Как купить', href: '/#how-to-buy' },
];

const regions = [
  { label: 'Тула', href: '/tula' },
  { label: 'Тверь', href: '/tver' },
  { label: 'Крым', href: '/crimea' },
  { label: 'Московская обл.', href: '/moscow' },
];

export function Header({ onContactClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto glass rounded-full shadow-[0_8px_30px_rgba(20,40,28,0.12)]">
        <div className="px-4 sm:px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/images/logo-main.png"
              alt="ГектарЪ"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-[14px] font-medium text-[#16201a]/70 transition-colors hover:text-[#16201a]"
              >
                {item.label}
              </button>
            ))}

            {/* Regions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRegionsOpen(!regionsOpen)}
                className="flex items-center gap-1 text-[14px] font-medium text-[#16201a]/70 transition-colors hover:text-[#16201a]"
              >
                Регионы
                <ChevronDown className={`w-4 h-4 transition-transform ${regionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {regionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 glass rounded-2xl shadow-[0_8px_30px_rgba(20,40,28,0.12)] py-2">
                  {regions.map((region) => (
                    <Link
                      key={region.href}
                      to={region.href}
                      onClick={() => {
                        setRegionsOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-[14px] text-[#16201a]/70 hover:text-[#16201a] transition-colors"
                    >
                      {region.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+79951691230"
              className="hidden sm:flex items-center gap-2 text-[14px] font-semibold text-[#16201a] hover:text-[#1c5238] transition-colors"
            >
              <Phone className="w-4 h-4" />
              +7 (995) 169-12-30
            </a>

            <a
              href="https://max.ru/u/f9LHodD0cOKGmwKtxVHtowELQauNtni0QxVzToNr9E1Khu1saPkEz-4g8DU"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-[#2fae5b] hover:bg-[#27964d] text-white px-5 py-2 rounded-full text-[14px] font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Написать Max
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1c5238]/5"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#16201a]" />
              ) : (
                <Menu className="w-5 h-5 text-[#16201a]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-4 border-t border-[#1c5238]/10">
            <nav className="flex flex-col gap-1 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left py-2.5 px-4 rounded-xl text-[16px] font-medium text-[#16201a]/70 hover:bg-[#1c5238]/5 hover:text-[#16201a] transition-colors"
                >
                  {item.label}
                </button>
              ))}

              <div className="px-4 py-2 text-[#16201a]/45 text-[13px] font-semibold tracking-[0.14em] uppercase">Регионы</div>
              {regions.map((region) => (
                <Link
                  key={region.href}
                  to={region.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left py-2.5 px-8 rounded-xl text-[16px] font-medium text-[#16201a]/70 hover:bg-[#1c5238]/5 hover:text-[#16201a] transition-colors"
                >
                  {region.label}
                </Link>
              ))}

              <a
                href="tel:+79951691230"
                className="flex items-center gap-2 py-2.5 px-4 text-[16px] font-semibold text-[#16201a]"
              >
                <Phone className="w-4 h-4" />
                +7 (995) 169-12-30
              </a>
              <button
                onClick={onContactClick}
                className="flex items-center justify-center gap-2 mt-2 bg-[#1c5238] hover:bg-[#16432e] text-white py-3 rounded-full text-[15px] font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                Заказать звонок
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
