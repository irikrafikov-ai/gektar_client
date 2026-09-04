import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { sendLead } from '@/services/crm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Пожалуйста, заполните обязательные поля');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Отправляем заявку в CRM
      const result = await sendLead({
        name: formData.name,
        phone: formData.phone,
        message: formData.purpose || '',
        budget: formData.budget || '',
      });

      if (result.success) {
        toast.success('Заявка отправлена! Мы перезвоним вам в течение 15 минут');
        setFormData({ name: '', phone: '', purpose: '', budget: '' });
        onClose();
      } else {
        toast.error(result.message || 'Ошибка отправки. Позвоните нам: +7 (499) 325-48-58');
      }
    } catch {
      toast.error('Ошибка отправки. Позвоните нам: +7 (499) 325-48-58');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-[#16201a]">
            Оставьте заявку на подбор
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Ваше имя <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">
              Телефон <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="+7 (999) 999-99-99"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-gray-700">
              Для чего нужен участок?
            </Label>
            <Input
              id="purpose"
              placeholder="Например: глэмпинг, ферма..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-gray-700">
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
            className="w-full bg-[#1c5238] hover:bg-[#16432e] text-white py-3 rounded-full font-semibold transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Перезвоним за 15 минут в рабочее время
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
