import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const bonuses = [
  { value: 'Бесплатно', label: 'Консультация по гос поддержке', description: 'Гранты и субсидии' },
  { value: '50 000 ₽', label: 'Юр. сопровождение', description: 'Бесплатно' },
  { value: '30 000 ₽', label: 'Межевание', description: 'При покупке от 3 га' },
  { value: '0 ₽', label: 'Кадастровый учёт', description: 'Всегда бесплатно' },
];

export function PromoForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: '',
    budget: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Пожалуйста, заполните обязательные поля');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Заявка отправлена! Мы перезвоним вам в течение 15 минут');
    setIsSubmitting(false);
    setFormData({ name: '', phone: '', purpose: '', budget: '' });
  };

  return (
    <section className="py-20 lg:py-28 px-5 sm:px-6 bg-[#f4f1ea]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Promo info */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] bg-[#2fae5b]/10 mb-6">
              <MessageCircle className="w-4 h-4" />
              Акции и бонусы
            </div>

            <h2 className="font-display tight text-3xl sm:text-4xl text-[#16201a] mb-4">
              Консультация по гос поддержке бесплатно
            </h2>
            <p className="text-[#16201a]/60 mb-8">
              Поможем получить гранты и субсидии на развитие бизнеса на земле.
              Бесплатная консультация с экспертом!
            </p>

            {/* Bonuses grid */}
            <div className="grid grid-cols-2 gap-4">
              {bonuses.map((bonus, index) => (
                <div key={index} className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
                  <div className="font-display text-2xl text-[#1c5238] mb-1">{bonus.value}</div>
                  <div className="text-[#16201a] font-medium">{bonus.label}</div>
                  <div className="text-[#16201a]/50 text-sm">{bonus.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Form */}
          <div className="glass rounded-[36px] p-8 shadow-[0_4px_24px_rgba(20,40,28,0.08)]">
            <h3 className="font-display tight text-2xl text-[#16201a] mb-6">
              Получите консультацию
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="promo-name" className="text-[#16201a]/70">
                  Ваше имя <span className="text-[#c0392b]">*</span>
                </Label>
                <Input
                  id="promo-name"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-phone" className="text-[#16201a]/70">
                  Телефон <span className="text-[#c0392b]">*</span>
                </Label>
                <Input
                  id="promo-phone"
                  placeholder="+7 (999) 999-99-99"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-purpose" className="text-[#16201a]/70">
                  Для чего нужен участок?
                </Label>
                <Input
                  id="promo-purpose"
                  placeholder="Например: глэмпинг, ферма..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-budget" className="text-[#16201a]/70">
                  Бюджет
                </Label>
                <Select 
                  value={formData.budget} 
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите бюджет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500000-1000000">500 000 - 1 000 000 ₽</SelectItem>
                    <SelectItem value="1000000-2000000">1 000 000 - 2 000 000 ₽</SelectItem>
                    <SelectItem value="2000000-5000000">2 000 000 - 5 000 000 ₽</SelectItem>
                    <SelectItem value="5000000+">Более 5 000 000 ₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1c5238] hover:bg-[#16432e] text-white py-6 rounded-full text-[16px] font-semibold transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </Button>

              <p className="text-center text-sm text-[#16201a]/50">
                Перезвоним за 15 минут в рабочее время
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
