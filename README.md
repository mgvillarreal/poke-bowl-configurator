# Nami Poke Bar · Arma tu bowl

Landing page con un **armador visual de poke bowls en tiempo real**: eliges base, proteína, complementos, salsa y toppings, y el bowl se arma frente a ti con animaciones.

> Nami Poke Bar es una **marca ficticia** creada como proyecto conceptual de portafolio. Menú, precios y pedidos son de demostración.

## Qué incluye

- Bowl visto desde arriba, compuesto por capas que se animan al entrar y salir.
- Reglas por tamaño (Regular / Grande) con avisos cuando se alcanza un límite.
- Precio, calorías y proteína que se calculan solos y se animan al cambiar.
- Botón "Sorpréndeme" que arma un bowl al azar.
- Responsive, navegable con teclado y respeta `prefers-reduced-motion`.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Zustand

## Arquitectura

```
src/
  data/menu.ts          ← fuente única: tamaños, categorías e ingredientes
  lib/bowl.ts           ← cálculos derivados (precio, nutrición, nombre)
  store/bowlStore.ts    ← estado y reglas de selección
  components/
    bowl/Bowl.tsx       ← el bowl animado (una función de la configuración)
    art/                ← foto real del ingrediente o un placeholder dibujado
    builder/            ← tamaño, pasos, tarjetas y resumen
  sections/             ← header, hero, cómo funciona y footer
```

La interfaz es una función del estado: precio, nutrición y dibujo se derivan de la selección y nunca se guardan por separado.

## Imágenes

Las fotos de los ingredientes van en `public/images/` (guía y prompts en [`docs/prompts-imagenes.md`](docs/prompts-imagenes.md)). Mientras una foto no exista, se dibuja un placeholder de su color y forma, así que la app funciona con o sin fotos.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```
