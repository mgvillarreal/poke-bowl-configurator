import { motion } from 'motion/react'

const STEPS = [
  { n: '01', jp: 'えらぶ', title: 'Elige tu base', text: 'Arroz de sushi, integral, quinoa o un mix de hojas frescas.', bg: 'bg-mango' },
  { n: '02', jp: 'まぜる', title: 'Súmale color', text: 'Proteína del día, frutas, verduras, salsas y toppings crujientes.', bg: 'bg-matcha' },
  { n: '03', jp: 'たべる', title: 'Recoge en 15 min', text: 'Lo preparamos al momento y te avisamos cuando esté listo.', bg: 'bg-sakura' },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-t-2 border-nori bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-bold tracking-widest text-coral uppercase">Así de fácil</p>
        <h2 className="font-display text-4xl sm:text-5xl">Cómo funciona</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.n}
              className={`relative overflow-hidden rounded-[2rem] border-2 border-nori p-6 shadow-sticker-lg ${step.bg}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <span aria-hidden className="absolute top-4 right-5 font-display text-sm text-nori/40">
                {step.jp}
              </span>
              <p className="font-display text-6xl">{step.n}</p>
              <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
              <p className="mt-2 font-medium text-nori/80">{step.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
