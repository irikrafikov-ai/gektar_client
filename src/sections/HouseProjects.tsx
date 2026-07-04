import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

interface HouseProjectsProps {
  onContactClick: () => void;
}

const projects = [
  {
    id: 1,
    name: 'Лавандовая ферма',
    area: '5 га',
    description: 'Выращивание лаванды и производство эко-косметики',
    roi: '150% годовых',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80',
  },
  {
    id: 2,
    name: 'Глэмпинг',
    area: '2 га',
    description: 'Кемпинг с комфортом: домики, баня, зона BBQ',
    roi: '140% годовых',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&q=80',
  },
  {
    id: 3,
    name: 'Сельхоз производство',
    area: '10 га',
    description: 'Зерновые, овощи, фрукты — оптовые поставки',
    roi: '120% годовых',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
  },
];

export function HouseProjects({ onContactClick }: HouseProjectsProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: projectsRef, isVisible: projectsVisible } = useStaggerAnimation(projects.length, 200);

  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea] relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div ref={titleRef} className={`transition-all duration-700 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h2 className="tight text-3xl sm:text-4xl font-bold text-center text-[#16201a] mb-12">
            Популярные проекты бизнеса
          </h2>
        </div>

        <div ref={projectsRef} className="grid md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`bg-white rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(20,40,28,0.08)] transition-all ${
                projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDuration: '600ms', transitionDelay: `${index * 200}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 glass-soft rounded-full px-3.5 py-1.5">
                  <span className="text-[13px] font-semibold text-[#16201a]">Площадь: {project.area}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#16201a] mb-2">{project.name}</h3>
                <div className="space-y-1 text-[#16201a]/60 text-sm mb-4">
                  <div>Площадь: {project.area}</div>
                  <div>{project.description}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[#1c5238] font-bold">{project.roi}</span>
                  <Button
                    onClick={onContactClick}
                    size="sm"
                    className="rounded-full bg-[#1c5238] text-white hover:bg-[#16432e] text-[15px] font-semibold"
                  >
                    Оставить заявку
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
