import { Logo } from '../components/ui/Logo'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-nori bg-rice/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-8 font-bold sm:flex">
          <a href="#armar" className="hover:text-coral">
            Arma tu bowl
          </a>
          <a href="#como-funciona" className="hover:text-coral">
            Cómo funciona
          </a>
        </nav>
        <a
          href="#armar"
          className="rounded-xl border-2 border-nori bg-coral px-4 py-2 text-sm font-bold text-white shadow-sticker transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mango"
        >
          Ordenar
        </a>
      </div>
    </header>
  )
}
