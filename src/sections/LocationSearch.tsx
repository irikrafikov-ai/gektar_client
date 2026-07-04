import { Waves, Trees, Navigation, Mountain, Home, MapPin } from 'lucide-react';

const locations = [
  {
    id: 1,
    name: 'У воды',
    description: 'Реки, озёра, пруды',
    count: '12 участков',
    icon: Waves,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    name: 'В лесу',
    description: 'Хвойные и лиственные',
    count: '18 участков',
    icon: Trees,
    color: 'bg-[#7dd87d]',
    gradient: 'from-#7dd87d to-green-600',
  },
  {
    id: 3,
    name: 'Рядом с Москвой',
    description: 'До 100 км от МКАД',
    count: '8 участков',
    icon: Navigation,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 4,
    name: 'На холмах',
    description: 'С панорамным видом',
    count: '6 участков',
    icon: Mountain,
    color: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    id: 5,
    name: 'В деревне',
    description: 'Коммуникации рядом',
    count: '15 участков',
    icon: Home,
    color: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
  },
  {
    id: 6,
    name: 'Все участки',
    description: 'Показать всё',
    count: '59 участков',
    icon: MapPin,
    color: 'bg-gray-700',
    gradient: 'from-gray-700 to-gray-800',
  },
];

export function LocationSearch() {
  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display tight text-3xl sm:text-4xl text-center text-[#16201a] mb-4">
          Быстрый поиск по локации
        </h2>
        <p className="text-center text-[#16201a]/60 max-w-2xl mx-auto mb-12">
          Выберите тип местности, которая вам подходит
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {locations.map((location) => {
            const Icon = location.icon;
            return (
              <button
                key={location.id}
                className="group relative overflow-hidden rounded-3xl p-6 text-center bg-white border border-[#1c5238]/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_24px_rgba(20,40,28,0.08)]"
              >
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 mx-auto mb-4 bg-[#2fae5b]/10 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-[#2fae5b]/20">
                    <Icon className="w-6 h-6 text-[#1c5238]" />
                  </div>
                  <h3 className="text-[#16201a] font-semibold mb-1">{location.name}</h3>
                  <p className="text-[#16201a]/50 text-xs mb-3">{location.description}</p>
                  <span className="inline-block bg-[#2fae5b]/10 text-[#1c5238] text-xs px-3 py-1 rounded-full font-medium">
                    {location.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
