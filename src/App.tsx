import { MotionConfig } from 'motion/react'
import { Builder } from './components/builder/Builder'
import { Toast } from './components/ui/Toast'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'

export default function App() {
  return (
    // reducedMotion="user": si el sistema pide menos movimiento, Motion lo respeta
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero />
        <Builder />
        <HowItWorks />
      </main>
      <Footer />
      <Toast />
    </MotionConfig>
  )
}
