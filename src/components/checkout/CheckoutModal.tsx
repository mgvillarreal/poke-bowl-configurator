import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CATEGORIES, DELIVERY_FEE, SIZE_BY_ID } from '../../data/menu'
import type { DeliveryMode } from '../../i18n/messages'
import { useT } from '../../i18n/useLocale'
import { bowlName, bowlTotals, ingredientName, premiumIngredients } from '../../lib/bowl'
import { formatMoney } from '../../lib/format'
import { useBowlStore } from '../../store/bowlStore'
import { Bowl } from '../bowl/Bowl'

type Step = 'review' | 'details' | 'processing' | 'done'
type Field = 'name' | 'phone' | 'address'

interface OrderForm {
  notes: string
  name: string
  phone: string
  mode: DeliveryMode
  when: 'asap' | 'schedule'
  slot: string
  address: string
  payment: 'card' | 'cash'
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Próximos horarios cada 30 min, empezando al menos 30 min después de ahora */
function nextSlots(intl: string, count = 6): string[] {
  const start = new Date()
  start.setMinutes(start.getMinutes() + 30)
  start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30, 0, 0)
  return Array.from({ length: count }, (_, i) =>
    new Date(start.getTime() + i * 30 * 60_000).toLocaleTimeString(intl, { hour: 'numeric', minute: '2-digit' }),
  )
}

export function CheckoutModal() {
  const open = useBowlStore((s) => s.checkoutOpen)
  return <AnimatePresence>{open && <CheckoutDialog key="checkout" />}</AnimatePresence>
}

function CheckoutDialog() {
  const t = useT()
  const c = t.checkout
  const size = useBowlStore((s) => s.size)
  const selection = useBowlStore((s) => s.selection)
  const close = useBowlStore((s) => s.closeCheckout)
  const clear = useBowlStore((s) => s.clear)

  const config = { size, selection }
  const totals = bowlTotals(config)
  const slots = useMemo(() => nextSlots(t.intl), [t.intl])

  const [step, setStep] = useState<Step>('review')
  const [quantity, setQuantity] = useState(1)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [orderNumber] = useState(() => `NAMI-${Math.floor(1000 + Math.random() * 9000)}`)
  const [form, setForm] = useState<OrderForm>({
    notes: '',
    name: '',
    phone: '',
    mode: 'pickup',
    when: 'asap',
    slot: '',
    address: '',
    payment: 'card',
  })

  const fee = form.mode === 'delivery' ? DELIVERY_FEE : 0
  const subtotal = totals.price * quantity
  const total = subtotal + fee
  const money = (value: number) => formatMoney(value, t.intl)
  const update = <K extends keyof OrderForm>(key: K, value: OrderForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    // Al corregir un campo, su error desaparece
    if (key in errors) {
      setErrors((current) => {
        const next = { ...current }
        delete next[key as Field]
        return next
      })
    }
  }

  // Accesibilidad del modal: bloquea el scroll de fondo, enfoca el modal y al cerrar devuelve el foco
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])

  // Al cambiar de paso, el foco vuelve al inicio del modal
  useEffect(() => {
    dialogRef.current?.focus()
    dialogRef.current?.scrollTo({ top: 0 })
  }, [step])

  // Simula el envío a la cocina
  useEffect(() => {
    if (step !== 'processing') return
    const timer = setTimeout(() => setStep('done'), 1600)
    return () => clearTimeout(timer)
  }, [step])

  const canClose = step !== 'processing'
  const requestClose = () => canClose && close()

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      requestClose()
    }
    if (e.key !== 'Tab' || !dialogRef.current) return
    // Trampa de foco: Tab no sale del modal
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const current = document.activeElement
    if (e.shiftKey && (current === first || current === dialogRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && current === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const validate = () => {
    const next: Partial<Record<Field, string>> = {}
    if (!form.name.trim()) next.name = c.errors.name
    if (form.phone.replace(/\D/g, '').length !== 10) next.phone = c.errors.phone
    if (form.mode === 'delivery' && !form.address.trim()) next.address = c.errors.address
    setErrors(next)
    const firstInvalid = Object.keys(next)[0]
    if (firstInvalid) document.getElementById(`field-${firstInvalid}`)?.focus()
    return !firstInvalid
  }

  const confirm = () => {
    if (validate()) setStep('processing')
  }

  const buildAnother = () => {
    close()
    clear()
    document.getElementById('armar')?.scrollIntoView({ behavior: 'smooth' })
  }

  const stepIndex = step === 'review' ? 0 : step === 'details' ? 1 : 2
  const slot = form.when === 'schedule' ? form.slot || slots[0] : null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-nori/60 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] border-2 border-nori bg-rice shadow-sticker-lg outline-none sm:rounded-[2rem]"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Encabezado: pasos + cerrar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-2 border-nori/10 bg-rice/95 px-6 py-4 backdrop-blur">
          <ol className="flex items-center gap-2 text-xs font-bold">
            {c.steps.map((label, i) => (
              <li key={label} className="flex items-center gap-2" aria-current={i === stepIndex ? 'step' : undefined}>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-nori transition-colors ${
                    i < stepIndex ? 'bg-matcha' : i === stepIndex ? 'bg-coral text-white' : 'bg-white text-nori/50'
                  }`}
                >
                  {i < stepIndex ? '✓' : i + 1}
                </span>
                <span className={`hidden sm:inline ${i === stepIndex ? '' : 'text-nori/50'}`}>{label}</span>
                {i < c.steps.length - 1 && <span aria-hidden className="h-0.5 w-4 bg-nori/20" />}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={requestClose}
            disabled={!canClose}
            aria-label={c.close}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-nori bg-white transition-transform hover:rotate-90 disabled:opacity-40 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            className="p-6"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {step === 'review' && (
              <>
                <h2 id={titleId} className="font-display text-2xl">
                  {c.reviewTitle}
                </h2>

                <div className="mt-5 flex gap-4 rounded-3xl border-2 border-nori bg-white p-4">
                  <div className="w-28 shrink-0 sm:w-32">
                    <Bowl config={config} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-widest text-coral uppercase">{c.bowlLine(t.sizes[size].label)}</p>
                    <p className="font-display text-lg leading-tight">{bowlName(config, t)}</p>
                    <dl className="mt-2 space-y-0.5 text-xs text-nori/75">
                      {CATEGORIES.filter((cat) => selection[cat.id].length > 0).map((cat) => (
                        <div key={cat.id}>
                          <dt className="inline font-bold">{t.categories[cat.id].label}: </dt>
                          <dd className="inline">{selection[cat.id].map((id) => ingredientName(t, id)).join(', ')}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="font-bold">{c.quantity}</span>
                  <div className="flex items-center gap-3 rounded-full border-2 border-nori bg-white p-1">
                    <StepperButton label={c.decrease} disabled={quantity <= 1} onClick={() => setQuantity((q) => q - 1)}>
                      −
                    </StepperButton>
                    <span className="w-6 text-center font-display text-lg tabular-nums" aria-live="polite">
                      {quantity}
                    </span>
                    <StepperButton label={c.increase} disabled={quantity >= 10} onClick={() => setQuantity((q) => q + 1)}>
                      +
                    </StepperButton>
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="font-bold">{c.notes}</span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder={c.notesPlaceholder}
                    rows={2}
                    className={`${INPUT} mt-1 resize-none`}
                  />
                </label>

                <Breakdown>
                  <Line label={`${c.bowlLine(t.sizes[size].label)}${quantity > 1 ? ` × ${quantity}` : ''}`} value={money(SIZE_BY_ID[size].price * quantity)} />
                  {premiumIngredients(config).map((i) => (
                    <Line key={i.id} label={`+ ${ingredientName(t, i.id)}`} value={money(i.price * quantity)} muted />
                  ))}
                  <Line label={c.subtotal} value={money(subtotal)} strong />
                </Breakdown>

                <PrimaryButton onClick={() => setStep('details')}>{c.continue}</PrimaryButton>
              </>
            )}

            {step === 'details' && (
              <>
                <h2 id={titleId} className="font-display text-2xl">
                  {c.detailsTitle}
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="field-name"
                    required
                    requiredLabel={c.required}
                    label={c.name}
                    value={form.name}
                    onChange={(v) => update('name', v)}
                    error={errors.name}
                    autoComplete="name"
                  />
                  <TextField
                    id="field-phone"
                    required
                    requiredLabel={c.required}
                    label={c.phone}
                    hint={c.phoneHint}
                    value={form.phone}
                    onChange={(v) => update('phone', v.replace(/[^\d\s-]/g, ''))}
                    error={errors.phone}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <fieldset className="mt-5">
                  <legend className="font-bold">{c.mode}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {(['pickup', 'delivery'] as const).map((mode) => (
                      <ChoiceCard
                        key={mode}
                        name="mode"
                        checked={form.mode === mode}
                        onChange={() => update('mode', mode)}
                        label={c.modes[mode].label}
                        detail={c.modes[mode].detail(money(DELIVERY_FEE))}
                      />
                    ))}
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {form.mode === 'delivery' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <TextField
                          id="field-address"
                          required
                          requiredLabel={c.required}
                          label={c.address}
                          placeholder={c.addressPlaceholder}
                          value={form.address}
                          onChange={(v) => update('address', v)}
                          error={errors.address}
                          autoComplete="street-address"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <fieldset className="mt-5">
                  <legend className="font-bold">{c.when}</legend>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <ChoiceCard name="when" checked={form.when === 'asap'} onChange={() => update('when', 'asap')} label={c.asap} compact />
                    <ChoiceCard name="when" checked={form.when === 'schedule'} onChange={() => update('when', 'schedule')} label={c.schedule} compact />
                    <AnimatePresence initial={false}>
                      {form.when === 'schedule' && (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                        >
                          <select
                            aria-label={c.time}
                            value={form.slot || slots[0]}
                            onChange={(e) => update('slot', e.target.value)}
                            className={`${INPUT} w-auto`}
                          >
                            {slots.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <span className="-rotate-3 rounded-full border-2 border-nori bg-mango px-2.5 py-0.5 text-xs font-bold">
                            {c.today}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="font-bold">{c.payment}</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ChoiceCard name="payment" checked={form.payment === 'card'} onChange={() => update('payment', 'card')} label={`💳 ${c.card}`} compact />
                    <ChoiceCard name="payment" checked={form.payment === 'cash'} onChange={() => update('payment', 'cash')} label={`💵 ${c.cash}`} compact />
                  </div>
                </fieldset>

                <Breakdown>
                  <Line label={c.subtotal} value={money(subtotal)} />
                  <Line label={c.deliveryFee} value={fee ? money(fee) : c.free} muted />
                  <Line label={c.total} value={money(total)} strong />
                </Breakdown>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <button type="button" onClick={() => setStep('review')} className="font-bold text-nori/70 hover:text-nori">
                    {c.back}
                  </button>
                  <PrimaryButton onClick={confirm} inline>
                    {c.confirm(money(total))}
                  </PrimaryButton>
                </div>
              </>
            )}

            {step === 'processing' && (
              <div className="flex flex-col items-center py-14 text-center" role="status">
                <motion.div
                  className="h-14 w-14 rounded-full border-4 border-coral/25 border-t-coral"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                />
                <h2 id={titleId} className="mt-6 font-display text-xl">
                  {c.processing}
                </h2>
              </div>
            )}

            {step === 'done' && (
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-nori bg-matcha shadow-sticker"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                >
                  <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      fill="none"
                      stroke="#1f2a5a"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.25, duration: 0.45 }}
                    />
                  </svg>
                </motion.div>

                <h2 id={titleId} className="mt-5 font-display text-3xl">
                  {c.doneTitle}
                </h2>
                <p className="mt-2 text-nori/80">{c.eta(form.mode, slot)}</p>

                <div className="mt-5 w-full rounded-3xl border-2 border-dashed border-nori/40 bg-white p-4">
                  <p className="text-xs font-bold tracking-widest text-nori/60 uppercase">{c.orderNumber}</p>
                  <p className="font-display text-2xl tracking-wider text-coral">{orderNumber}</p>
                  <p className="mt-1 text-sm">
                    {quantity} × {bowlName(config, t)} · <strong>{money(total)}</strong>
                  </p>
                </div>

                <p className="mt-4 rounded-full bg-mango/40 px-3 py-1 text-xs font-bold">{c.demoNote}</p>

                <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 rounded-2xl border-2 border-nori bg-white px-5 py-3 font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coral"
                  >
                    {c.done}
                  </button>
                  <PrimaryButton onClick={buildAnother} inline>
                    {c.another}
                  </PrimaryButton>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Piezas pequeñas del formulario ---------- */

const INPUT =
  'w-full rounded-xl border-2 border-nori/20 bg-white px-3 py-2 text-nori placeholder:text-nori/40 focus:border-coral focus:outline-none aria-[invalid=true]:border-coral-dark'

function TextField(props: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  required?: boolean
  /** Texto para lectores de pantalla en lugar del asterisco */
  requiredLabel?: string
  placeholder?: string
  autoComplete?: string
  inputMode?: 'tel' | 'text'
}) {
  const { id, label, value, onChange, error, hint, required, requiredLabel, placeholder, autoComplete, inputMode } = props
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 font-bold">
        <span>
          {label}
          {required && (
            <>
              <span aria-hidden className="ml-0.5 text-coral">
                *
              </span>
              <span className="sr-only"> ({requiredLabel})</span>
            </>
          )}
        </span>
        {hint && <span className="text-xs font-medium text-nori/50">{hint}</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${INPUT} mt-1`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-bold text-coral-dark">
          {error}
        </p>
      )}
    </div>
  )
}

function ChoiceCard(props: {
  name: string
  checked: boolean
  onChange: () => void
  label: string
  detail?: string
  compact?: boolean
}) {
  const { name, checked, onChange, label, detail, compact } = props
  return (
    <label
      className={`flex cursor-pointer flex-col rounded-2xl border-2 transition-colors has-checked:border-nori has-checked:bg-sakura has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-coral ${
        compact ? 'px-3 py-2' : 'px-4 py-3'
      } border-nori/15 bg-white hover:border-nori/40`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="font-bold">{label}</span>
      {detail && <span className="text-xs text-nori/60">{detail}</span>}
    </label>
  )
}

function StepperButton(props: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-sakura font-display text-lg transition-colors hover:bg-coral hover:text-white disabled:opacity-30 disabled:hover:bg-sakura disabled:hover:text-nori focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coral"
    >
      {props.children}
    </button>
  )
}

function Breakdown({ children }: { children: ReactNode }) {
  return <dl className="mt-6 space-y-1.5 border-t-2 border-dashed border-nori/20 pt-4">{children}</dl>
}

function Line({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${muted ? 'text-sm text-nori/60' : ''} ${strong ? 'font-display text-lg' : ''}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

function PrimaryButton({ onClick, children, inline }: { onClick: () => void; children: ReactNode; inline?: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ y: 1, scale: 0.98 }}
      className={`rounded-2xl border-2 border-nori bg-coral px-5 py-3 font-display text-white shadow-sticker transition-colors hover:bg-coral-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mango ${
        inline ? 'flex-1 sm:flex-none' : 'mt-6 w-full'
      }`}
    >
      {children}
    </motion.button>
  )
}
