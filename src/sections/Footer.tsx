import { Logo } from '../components/ui/Logo'

export function Footer() {
  return (
    <footer className="bg-nori pt-12 pb-24 text-rice">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo light />
          <p className="mt-3 max-w-sm text-sm text-rice/70">Poke bowls frescos, armados a tu manera.</p>
        </div>
        <p className="max-w-sm text-xs text-rice/60 sm:text-right">
          Nami Poke Bar es una marca ficticia creada como proyecto conceptual de portafolio. Menú, precios y pedidos son de
          demostración.
        </p>
      </div>
    </footer>
  )
}
