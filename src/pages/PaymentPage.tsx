import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Check, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { Footer } from '@/sections/Footer';
import { ContactModal } from '@/components/ui-custom/ContactModal';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { COMPANY_SHORT_LINE } from '@/data/company';
import { fetchDistricts, isLotAvailable, lotStatusLabel, type District } from '@/services/lots';
import {
  INSTALLMENT_MAX_AMOUNT,
  INSTALLMENT_MIN_AMOUNT,
  createPayment,
  formatRub,
  rememberPaymentId,
} from '@/services/payments';

const PHONE = '+7 (995) 169-12-30';
const PHONE_HREF = 'tel:+79951691230';

export function PaymentPage() {
  const [searchParams] = useSearchParams();

  // Каталог участков — единственный источник цен. Произвольную сумму
  // ввести нельзя: заявка на кредит всегда привязана к конкретному участку.
  const [districts, setDistricts] = useState<District[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [districtId, setDistrictId] = useState(searchParams.get('district') ?? '');
  const [lotId, setLotId] = useState(searchParams.get('lot') ?? '');

  const [form, setForm] = useState({ name: '', phone: '', email: '', comment: '' });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchDistricts().then((loaded) => {
      if (!cancelled) {
        setDistricts(loaded);
        setCatalogLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Показываем только посёлки, где есть хотя бы один участок
  const availableDistricts = useMemo(() => districts.filter((d) => d.lots.length > 0), [districts]);
  const catalogEmpty = catalogLoaded && availableDistricts.length === 0;

  const selectedDistrict = useMemo(
    () => availableDistricts.find((d) => d.id === districtId) ?? null,
    [availableDistricts, districtId],
  );
  const selectedLot = useMemo(
    () => selectedDistrict?.lots.find((l) => l.id === lotId) ?? null,
    [selectedDistrict, lotId],
  );

  // В рассрочку уходит полная стоимость выбранного участка.
  // Сервер всё равно пересчитывает цену сам по id участка.
  const amount = selectedLot?.price ?? 0;

  // Банк не оформит рассрочку вне своих лимитов — предупреждаем заранее,
  // а не после того, как клиент заполнит форму и уйдёт к банку
  const overLimit = selectedLot !== null && amount > INSTALLMENT_MAX_AMOUNT;
  const underLimit = selectedLot !== null && amount < INSTALLMENT_MIN_AMOUNT;
  const canSubmit = selectedLot !== null && !overLimit && !underLimit;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedLot) {
      toast.error('Выберите посёлок и участок');
      return;
    }
    if (form.name.trim().length < 2) {
      toast.error('Укажите имя');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 11) {
      toast.error('Укажите телефон полностью');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error('Укажите e-mail — на него придёт кассовый чек');
      return;
    }
    if (!agreed) {
      toast.error('Нужно согласие с условиями рассрочки');
      return;
    }
    if (!canSubmit) {
      toast.error('Стоимость участка вне лимитов рассрочки — позвоните нам');
      return;
    }

    setIsSubmitting(true);
    try {
      const payment = await createPayment({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        districtId,
        lotId,
        comment: form.comment.trim(),
      });

      // Запоминаем id — после возврата с ЮKassa покажем результат
      rememberPaymentId(payment.paymentId);
      window.location.href = payment.confirmationUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось перейти к оформлению');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#16201a] flex flex-col">
      <div className="relative flex-1 flex flex-col items-center px-5 sm:px-6 pb-14 pt-8 sm:pt-14">
        {/* Логотип */}
        <div
          className={`w-20 h-20 rounded-full overflow-hidden bg-white shadow-[0_8px_30px_rgba(20,40,28,0.15)] mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <img src="/images/logo-main.png" alt="ГектарЪ" className="w-full h-full object-cover" />
        </div>

        <div
          className={`text-center mb-9 transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#2fae5b] mb-3">Онлайн-оформление</p>
          <h1 className="tight text-3xl md:text-4xl font-bold mb-2">Оформление рассрочки</h1>
          <p className="text-[#16201a]/55 text-[15px] max-w-md">
            Выберите участок и оформите рассрочку онлайн. Решение банка — в тот же день
          </p>
        </div>

        <div
          className={`w-full max-w-lg transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="glass rounded-[36px] p-7 sm:p-9 shadow-[0_12px_50px_rgba(20,40,28,0.10)]"
          >
            {/* Рассрочку оформляет банк через ЮKassa */}
            <div className="flex items-center justify-between gap-4 bg-[#f4f1ea] rounded-2xl px-5 py-4 mb-7">
              <div>
                <div className="text-sm font-semibold text-[#16201a]">Рассрочка на участок</div>
                <div className="text-[12px] text-[#16201a]/45 mt-0.5">
                  Оформляется онлайн через ЮKassa, без визита в банк
                </div>
              </div>
            </div>

            {/* Каталог не загрузился — заявку принять не можем, зовём звонить */}
            {catalogEmpty ? (
              <div className="flex items-start gap-3 bg-[#c0392b]/8 border border-[#c0392b]/20 rounded-2xl p-5 mb-7">
                <AlertCircle className="w-5 h-5 text-[#c0392b] flex-shrink-0 mt-0.5" />
                <div className="text-[14px] leading-relaxed text-[#16201a]/70">
                  Список участков сейчас недоступен. Позвоните нам, оформим рассрочку вместе:{' '}
                  <a href={PHONE_HREF} className="text-[#1c5238] font-semibold whitespace-nowrap">
                    {PHONE}
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-7">
                <div>
                  <label htmlFor="pay-district" className="block text-[#16201a]/55 font-medium text-[14px] mb-2">
                    Посёлок <span className="text-[#2fae5b]">*</span>
                  </label>
                  <select
                    id="pay-district"
                    value={districtId}
                    onChange={(event) => {
                      setDistrictId(event.target.value);
                      setLotId('');
                    }}
                    disabled={!catalogLoaded}
                    className="w-full bg-white rounded-2xl border border-[#1c5238]/10 px-4 py-3 text-[15px] text-[#16201a] outline-none focus:border-[#2fae5b] focus:ring-2 focus:ring-[#2fae5b]/15 transition-all appearance-none cursor-pointer disabled:opacity-60"
                  >
                    <option value="">{catalogLoaded ? 'Выберите посёлок' : 'Загружаем участки…'}</option>
                    {availableDistricts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                        {district.region ? ` — ${district.region}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDistrict && (
                  <div>
                    <label htmlFor="pay-lot" className="block text-[#16201a]/55 font-medium text-[14px] mb-2">
                      Участок <span className="text-[#2fae5b]">*</span>
                    </label>
                    <select
                      id="pay-lot"
                      value={lotId}
                      onChange={(event) => setLotId(event.target.value)}
                      className="w-full bg-white rounded-2xl border border-[#1c5238]/10 px-4 py-3 text-[15px] text-[#16201a] outline-none focus:border-[#2fae5b] focus:ring-2 focus:ring-[#2fae5b]/15 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Выберите участок</option>
                      {selectedDistrict.lots.map((lot) => (
                        <option key={lot.id} value={lot.id} disabled={!isLotAvailable(lot)}>
                          №{lot.number}
                          {lot.areaLabel ? `, ${lot.areaLabel}` : ''} — {formatRub(lot.price)}
                          {isLotAvailable(lot) ? '' : ` (${lotStatusLabel(lot.status)})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Сумма рассрочки — появляется только после выбора участка */}
            {selectedLot && (
              <div className="bg-[#0f1d15] rounded-3xl p-6 mb-7 text-white">
                <div className="text-white/55 text-[13px] uppercase tracking-[0.14em] mb-2">Сумма рассрочки</div>
                <div className="font-display text-4xl font-bold mb-2">{formatRub(amount)}</div>
                <div className="flex items-center gap-2 text-[#3ec469] text-sm">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Полная стоимость участка. Срок и график предложит банк при оформлении</span>
                </div>
              </div>
            )}

            {/* Банк не оформит рассрочку вне своих лимитов */}
            {selectedLot && !canSubmit && (
              <div className="flex items-start gap-3 bg-[#c0392b]/8 border border-[#c0392b]/20 rounded-2xl p-5 mb-7">
                <AlertCircle className="w-5 h-5 text-[#c0392b] flex-shrink-0 mt-0.5" />
                <div className="text-[14px] leading-relaxed text-[#16201a]/70">
                  {overLimit ? (
                    <>
                      Онлайн рассрочка оформляется на сумму до {formatRub(INSTALLMENT_MAX_AMOUNT)}. Этот участок
                      дороже — позвоните нам, подберём условия:{' '}
                      <a href={PHONE_HREF} className="text-[#1c5238] font-semibold whitespace-nowrap">
                        {PHONE}
                      </a>
                    </>
                  ) : (
                    <>Минимальная сумма рассрочки — {formatRub(INSTALLMENT_MIN_AMOUNT)}.</>
                  )}
                </div>
              </div>
            )}

            {/* Контакты */}
            <div className="space-y-4">
              <Field
                id="pay-name"
                label="Ваше имя"
                required
                placeholder="Иван Иванов"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
              />
              <Field
                id="pay-phone"
                label="Телефон"
                required
                type="tel"
                placeholder="+7 (999) 999-99-99"
                value={form.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
              />
              <Field
                id="pay-email"
                label="E-mail"
                required
                type="email"
                placeholder="ivan@example.ru"
                hint="На него ЮKassa пришлёт кассовый чек"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />
            </div>

            {/* Согласие */}
            <label className="flex items-start gap-3 mt-6 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 w-4 h-4 accent-[#2fae5b] flex-shrink-0"
              />
              <span className="text-[13px] leading-relaxed text-[#16201a]/55 group-hover:text-[#16201a]/70 transition-colors">
                Согласен с условиями рассрочки, договором оферты и обработкой персональных данных
              </span>
            </label>

            {/* Кнопка оформления */}
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-[#2fae5b] hover:bg-[#27964d] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-full text-[15px] font-semibold transition-all duration-500 shadow-[0_4px_24px_rgba(20,40,28,0.10)] hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Переходим к оформлению…
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Оформить рассрочку
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-[#16201a]/45">
              <ShieldCheck className="w-4 h-4 text-[#2fae5b] flex-shrink-0" />
              <span>Оформление через ЮKassa. Данные вводятся на стороне банка</span>
            </div>

            {/* Кто продавец — должно быть видно до оформления */}
            <p className="text-center text-[12px] text-[#16201a]/40 mt-4 leading-relaxed">
              Продавец: {COMPANY_SHORT_LINE}
              <br />
              <Link to="/requisites" className="text-[#1c5238] underline underline-offset-2">
                Полные реквизиты
              </Link>
            </p>
          </form>

          <Link
            to="/"
            className="mt-5 w-full flex items-center justify-center gap-3 bg-white hover:bg-white/70 text-[#16201a] border border-[#1c5238]/10 py-3 rounded-full text-sm font-semibold transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 text-[#1c5238]" />
            Вернуться на главную
          </Link>
        </div>
      </div>

      <Footer onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Toaster />
    </div>
  );
}

/** Поле формы в стиле остального сайта. */
function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[#16201a]/55 font-medium text-[14px] mb-2">
        {label} {required && <span className="text-[#2fae5b]">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-white rounded-2xl border border-[#1c5238]/10 px-4 py-3 text-[15px] text-[#16201a] placeholder:text-[#16201a]/30 outline-none focus:border-[#2fae5b] focus:ring-2 focus:ring-[#2fae5b]/15 transition-all"
      />
      {hint && <p className="text-[12px] text-[#16201a]/40 mt-1.5">{hint}</p>}
    </div>
  );
}
