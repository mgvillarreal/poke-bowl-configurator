import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MESSAGES, type Locale } from './messages'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

/** Idioma activo. Se recuerda en el navegador para la próxima visita. */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'es',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'nami-locale',
      // Si el navegador bloquea el almacenamiento, simplemente no se recuerda
      storage: createJSONStorage(() => {
        try {
          return localStorage
        } catch {
          return sessionStorage
        }
      }),
    },
  ),
)

/** Textos del idioma activo */
export const useT = () => MESSAGES[useLocaleStore((s) => s.locale)]
