import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Loader2, Phone, XCircle } from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';
import {
  fetchPaymentStatus,
  forgetPaymentId,
  formatRub,
  recallPaymentId,
  type PaymentStatus,
} from '@/services/payments';

/** Сколько раз переспросить статус, пока платёж «в обработке». */
const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 2000;

const NO_PAYMENT_ERROR = 'Не удалось определить платёж. Если деньги списались — позвоните нам.';

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();

  // id платежа определяем один раз при монтировании: он приходит либо в адресе,
  // либо из sessionStorage, куда мы положили его перед уходом на ЮKassa.
  const [paymentId] = useState(() => searchParams.get('id') ?? recallPaymentId());

  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [isChecking, setIsChecking] = useState(() => Boolean(paymentId));
  const [error, setError] = useState<string | null>(() => (paymentId ? null : NO_PAYMENT_ERROR));
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!paymentId) {
      return;
    }

    let cancelled = false;
    let attempt = 0;

    // ЮKassa возвращает клиента раньше, чем подтверждает платёж,
    // поэтому статус «pending» переспрашиваем несколько раз.
    const poll = async () => {
      try {
        const result = await fetchPaymentStatus(paymentId);
        if (cancelled) return;

        setStatus(result);

        if (result.status === 'succeeded' || result.status === 'canceled') {
          setIsChecking(false);
          forgetPaymentId();
          return;
        }

        attempt += 1;
        if (attempt >= MAX_ATTEMPTS) {
          setIsChecking(false);
          return;
        }
        setTimeout(poll, RETRY_DELAY_MS);
      } catch {
        if (cancelled) return;
        setError('Не удалось проверить статус платежа. Позвоните нам — мы посмотрим вручную.');
        setIsChecking(false);
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  const view = resolveView({ status, isChecking, error });

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#16201a] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 py-16">
        <div className="w-full max-w-md glass rounded-[36px] p-8 sm:p-11 text-center shadow-[0_12px_50px_rgba(20,40,28,0.10)]">
          <div className={`w-16 h-16 rounded-full ${view.iconBg} flex items-center justify-center mx-auto mb-6`}>
            {view.icon}
          </div>

          <h1 className="tight text-2xl sm:text-3xl font-bold mb-3">{view.title}</h1>
          <p className="text-[#16201a]/55 text-[15px] leading-relaxed mb-6">{view.text}</p>

          {status && status.status === 'succeeded' && (
            <div className="bg-[#f4f1ea] rounded-2xl p-5 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#16201a]/50 text-sm">Сумма рассрочки</span>
                <span className="font-display text-[#1c5238] font-bold">{formatRub(status.amount)}</span>
              </div>
              {status.description && (
                <p className="text-[13px] text-[#16201a]/50 leading-relaxed">{status.description}</p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <a
              href="tel:+74993254858"
              className="w-full flex items-center justify-center gap-3 bg-[#2fae5b] hover:bg-[#27964d] text-white py-4 rounded-full text-sm font-semibold transition-all duration-500 hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              +7 (499) 325-48-58
            </a>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/70 text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 text-[#1c5238]" />
              На главную
            </Link>
          </div>
        </div>
      </div>

      <Footer onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

/** Собирает содержимое экрана по текущему состоянию проверки. */
function resolveView({
  status,
  isChecking,
  error,
}: {
  status: PaymentStatus | null;
  isChecking: boolean;
  error: string | null;
}) {
  if (error) {
    return {
      icon: <XCircle className="w-8 h-8 text-[#c0392b]" />,
      iconBg: 'bg-[#c0392b]/10',
      title: 'Не смогли проверить платёж',
      text: error,
    };
  }

  if (isChecking) {
    return {
      icon: <Loader2 className="w-8 h-8 text-[#1c5238] animate-spin" />,
      iconBg: 'bg-[#2fae5b]/15',
      title: 'Проверяем заявку',
      text: 'Это занимает несколько секунд. Не закрывайте страницу.',
    };
  }

  if (status?.status === 'succeeded') {
    return {
      icon: <CheckCircle2 className="w-8 h-8 text-[#1c5238]" />,
      iconBg: 'bg-[#2fae5b]/15',
      title: 'Рассрочка оформлена',
      text: 'Банк одобрил заявку. Кассовый чек придёт на указанный e-mail, а менеджер свяжется с вами в течение 15 минут в рабочее время.',
    };
  }

  if (status?.status === 'canceled') {
    return {
      icon: <XCircle className="w-8 h-8 text-[#c0392b]" />,
      iconBg: 'bg-[#c0392b]/10',
      title: 'Рассрочку не оформили',
      text: 'Банк отклонил заявку или оформление не завершилось. Деньги не списаны — позвоните нам, подберём другие условия.',
    };
  }

  // Статус всё ещё pending после всех попыток
  return {
    icon: <Clock className="w-8 h-8 text-[#1c5238]" />,
    iconBg: 'bg-[#2fae5b]/15',
    title: 'Платёж обрабатывается',
    text: 'Банк ещё не подтвердил операцию. Как только деньги дойдут, мы вам позвоним. Повторно платить не нужно.',
  };
}
