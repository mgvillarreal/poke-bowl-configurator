import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Builder } from './components/builder/Builder'
import { CheckoutModal } from './components/checkout/CheckoutModal'
import { Toast } from './components/ui/Toast'
import { useT } from './i18n/useLocale'
import { Footer } from './sections/Footer'
import { Header, TopBar } from './sections/Header'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'

export default function App() {
  const t = useT()

  // Idioma del documento y título de la pestaña siguen al idioma elegido
  useEffect(() => {
    document.documentElement.lang = t.htmlLang
    document.title = t.meta.title
  }, [t])

  return (
    // reducedMotion="user": si el sistema pide menos movimiento, Motion lo respeta
    <MotionConfig reducedMotion="user">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Builder />
        <HowItWorks />
      </main>
      <Footer />
      <CheckoutModal />
      <Toast />
    </MotionConfig>
  )
}
