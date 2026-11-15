import type { CategoryId, SizeId, Tag } from '../data/menu'
import type { DietFilter } from '../lib/diet'
import type { NoticeMessage } from '../store/bowlStore'

export type Locale = 'es' | 'en'
export type DeliveryMode = 'pickup' | 'delivery'

export interface Messages {
  /** Locale para Intl (moneda, horas) */
  intl: string
  htmlLang: string
  meta: { title: string }
  header: { home: string; nav: string; house: string; build: string; how: string; order: string; language: string }
  topBar: string
  hero: {
    badge: string
    line1: string
    line2: string
    accent: string
    lead: string
    ctaBuild: string
    ctaHouse: string
  }
  builder: {
    eyebrow: string
    title: string
    surprise: string
    clear: string
    yourBowl: (size: string) => string
    emptyName: string
    emptyHint: string
    veggie: string
    chooseOne: string
    upTo: (n: number) => string
    chosen: (n: number) => string
    next: (label: string) => string
    sizeGroup: string
    steps: string
  }
  categories: Record<CategoryId, { label: string; title: string; noun: [string, string] }>
  sizes: Record<SizeId, { label: string; description: string }>
  tags: Record<Tag, string>
  card: { included: string }
  summary: { total: string; protein: string; add: string }
  notice: (message: NoticeMessage) => string
  how: { eyebrow: string; title: string; steps: { title: string; text: string }[] }
  footer: { tagline: string; disclaimer: string; madeWith: string }
  checkout: {
    close: string
    steps: [string, string, string]
    reviewTitle: string
    detailsTitle: string
    doneTitle: string
    bowlLine: (size: string) => string
    quantity: string
    decrease: (bowl: string) => string
    increase: (bowl: string) => string
    notes: string
    notesPlaceholder: string
    name: string
    phone: string
    phoneHint: string
    required: string
    today: string
    mode: string
    modes: Record<DeliveryMode, { label: string; detail: (fee: string) => string }>
    address: string
    addressPlaceholder: string
    when: string
    asap: string
    schedule: string
    time: string
    payment: string
    cash: string
    card: string
    subtotal: string
    deliveryFee: string
    free: string
    total: string
    continue: string
    back: string
    confirm: (total: string) => string
    processing: string
    errors: { name: string; phone: string; address: string }
    orderNumber: string
    eta: (mode: DeliveryMode, slot: string | null) => string
    demoNote: string
    another: string
    done: string
  }
  houseBowls: {
    eyebrow: string
    title: string
    lead: string
    customize: string
    add: string
    descriptions: Record<string, string>
  }
  diet: {
    legend: string
    filters: Record<DietFilter, string>
    labels: { vegan: string; glutenFree: string; seafood: string; gluten: string; notVegan: string }
    reasons: Record<DietFilter, string>
    conflicts: (n: number) => string
    removeConflicts: string
  }
  cart: {
    button: (n: number) => string
    buttonLabel: (n: number) => string
    forWhom: string
    forWhomPlaceholder: string
    defaultName: (n: number) => string
    nameLabel: (bowl: string) => string
    remove: (bowl: string) => string
    addAnother: string
    empty: string
    emptyCta: string
    itemsCount: (n: number) => string
  }
  ingredients: Record<string, string>
}

const es: Messages = {
  intl: 'es-MX',
  htmlLang: 'es',
  meta: { title: 'Nami Poke Bar · Arma tu bowl' },
  header: {
    home: 'Poke Bar, inicio',
    nav: 'Principal',
    house: 'Bowls de la casa',
    build: 'Arma tu bowl',
    how: 'Cómo funciona',
    order: 'Ordenar',
    language: 'Idioma',
  },
  topBar: 'Recoge en 15 min · Envío a domicilio',
  hero: {
    badge: 'Poke bar · ポケ',
    line1: 'Arma',
    line2: 'tu',
    accent: 'ola.',
    lead: 'Poke bowls frescos, a tu manera. Elige base, proteína y toppings, y míralo armarse en tiempo real.',
    ctaBuild: 'Armar mi bowl',
    ctaHouse: 'o elige un bowl de la casa',
  },
  builder: {
    eyebrow: 'Paso a paso',
    title: 'Arma tu bowl',
    surprise: 'Sorpréndeme',
    clear: 'Vaciar bowl',
    yourBowl: (size) => `Tu bowl · ${size}`,
    emptyName: 'Tu bowl está vacío',
    emptyHint: 'Empieza eligiendo tu base',
    veggie: 'Veggie',
    chooseOne: 'Elige 1',
    upTo: (n) => `Hasta ${n}`,
    chosen: (n) => `${n} elegido${n === 1 ? '' : 's'}`,
    next: (label) => `Siguiente: ${label}`,
    sizeGroup: 'Tamaño del bowl',
    steps: 'Pasos para armar tu bowl',
  },
  categories: {
    base: { label: 'Base', title: 'Elige tu base', noun: ['base', 'bases'] },
    protein: { label: 'Proteína', title: 'Elige tu proteína', noun: ['proteína', 'proteínas'] },
    extra: { label: 'Complementos', title: 'Suma color', noun: ['complemento', 'complementos'] },
    sauce: { label: 'Salsa', title: 'Ponle salsa', noun: ['salsa', 'salsas'] },
    topping: { label: 'Toppings', title: 'El toque final', noun: ['topping', 'toppings'] },
  },
  sizes: {
    regular: { label: 'Regular', description: '1 proteína · 4 complementos' },
    grande: { label: 'Grande', description: '2 proteínas · 6 complementos' },
  },
  tags: { popular: 'Popular', spicy: 'Picante', new: 'Nuevo' },
  card: { included: 'Incluido' },
  summary: { total: 'Total', protein: 'g proteína', add: 'Agregar al pedido' },
  notice: (m) => {
    switch (m.type) {
      case 'limit': {
        const noun = es.categories[m.category].noun[m.limit === 1 ? 0 : 1]
        return m.upsell
          ? `El Regular lleva hasta ${m.limit} ${noun}. ¡Cámbiate a Grande para más!`
          : `Máximo ${m.limit} ${noun}. Quita uno para cambiarlo.`
      }
      case 'resized':
        return `Ajustamos tu bowl al tamaño ${es.sizes[m.size].label}.`
      case 'surprise':
        return '¡Bowl sorpresa! Ajústalo a tu gusto.'
      case 'needBase':
        return 'Primero elige una base para tu bowl.'
      case 'needProtein':
        return 'Elige al menos una proteína para tu bowl (¡el tofu cuenta!).'
      case 'loaded':
        return `Cargamos ${m.name}. ¡Ajústalo a tu gusto!`
      case 'notSuitable':
        return `${es.ingredients[m.ingredientId]}: ${m.filters.map((f) => es.diet.reasons[f].toLowerCase()).join(', ')}.`
      case 'conflictsRemoved':
        return m.count === 1
          ? 'Quitamos 1 ingrediente que no cumplía tus preferencias.'
          : `Quitamos ${m.count} ingredientes que no cumplían tus preferencias.`
    }
  },
  how: {
    eyebrow: 'Así de fácil',
    title: 'Cómo funciona',
    steps: [
      { title: 'Elige tu base', text: 'Arroz de sushi, integral, quinoa o un mix de hojas frescas.' },
      { title: 'Súmale color', text: 'Proteína del día, frutas, verduras, salsas y toppings crujientes.' },
      { title: 'Recoge en 15 min', text: 'Lo preparamos al momento y te avisamos cuando esté listo.' },
    ],
  },
  footer: {
    tagline: 'Poke bowls frescos, armados a tu manera.',
    disclaimer:
      'Nami Poke Bar es una marca ficticia creada como proyecto conceptual de portafolio. Menú, precios y pedidos son de demostración.',
    madeWith: 'Hecho con cariño.',
  },
  checkout: {
    close: 'Cerrar',
    steps: ['Tu pedido', 'Tus datos', 'Confirmación'],
    reviewTitle: 'Tu pedido',
    detailsTitle: '¿A nombre de quién?',
    doneTitle: '¡Pedido confirmado!',
    bowlLine: (size) => `Bowl ${size}`,
    quantity: 'Cantidad',
    decrease: (bowl) => `Quitar uno: ${bowl}`,
    increase: (bowl) => `Agregar uno: ${bowl}`,
    notes: 'Notas para la cocina (opcional)',
    notesPlaceholder: 'Ej. sin cebolla, salsa aparte…',
    name: 'Nombre',
    phone: 'Teléfono',
    phoneHint: '10 dígitos',
    required: 'Obligatorio',
    today: 'Hoy',
    mode: '¿Cómo lo quieres?',
    modes: {
      pickup: { label: 'Recoger en tienda', detail: () => 'Nami · gratis' },
      delivery: { label: 'A domicilio', detail: (fee) => `+${fee} · ~35 min` },
    },
    address: 'Dirección de entrega',
    addressPlaceholder: 'Calle, número y colonia',
    when: '¿Cuándo?',
    asap: 'Lo antes posible',
    schedule: 'Programar',
    time: 'Hora',
    payment: 'Pago al recibir',
    cash: 'Efectivo',
    card: 'Tarjeta en terminal',
    subtotal: 'Subtotal',
    deliveryFee: 'Envío',
    free: 'Gratis',
    total: 'Total',
    continue: 'Continuar',
    back: 'Volver',
    confirm: (total) => `Confirmar pedido · ${total}`,
    processing: 'Enviando tu pedido a la cocina…',
    errors: {
      name: 'Escribe tu nombre.',
      phone: 'Escribe un teléfono de 10 dígitos.',
      address: 'Escribe la dirección de entrega.',
    },
    orderNumber: 'Número de pedido',
    eta: (mode, slot) => {
      const when = slot ? `a las ${slot}` : mode === 'pickup' ? 'en unos 15 min' : 'en unos 35 min'
      return mode === 'pickup' ? `Tu pedido estará listo para recoger ${when} en Nami.` : `Tu pedido llegará ${when}.`
    },
    demoNote: 'Es una demo: no se hizo ningún cargo ni pedido real.',
    another: 'Armar otro bowl',
    done: 'Listo',
  },
  houseBowls: {
    eyebrow: 'Listos para ti',
    title: 'Bowls de la casa',
    lead: 'Nuestras combinaciones favoritas. Pídelos así o personalízalos a tu gusto.',
    customize: 'Personalizar',
    add: 'Agregar al pedido',
    descriptions: {
      'hawaiian-classic': 'Salmón, palta y mango con ponzu. El clásico de la isla.',
      'spicy-tuna': 'Atún shoyu con spicy mayo, masago y cebolla crujiente.',
      'green-vegan': 'Hojas verdes, tofu crujiente y aderezo de sésamo. 100% vegetal.',
      'teriyaki-crunch': 'Pollo teriyaki y camarón sobre arroz integral. Tamaño Grande.',
    },
  },
  diet: {
    legend: 'Preferencias',
    filters: { vegan: 'Vegano', glutenFree: 'Sin gluten', noSeafood: 'Sin pescados ni mariscos' },
    labels: { vegan: 'Vegano', glutenFree: 'Sin gluten', seafood: 'Del mar', gluten: 'Contiene gluten', notVegan: 'No vegano' },
    reasons: { vegan: 'No es vegano', glutenFree: 'Contiene gluten', noSeafood: 'Pescado o mariscos' },
    conflicts: (n) =>
      n === 1
        ? '1 ingrediente de tu bowl no cumple tus preferencias.'
        : `${n} ingredientes de tu bowl no cumplen tus preferencias.`,
    removeConflicts: 'Quitarlos',
  },
  cart: {
    button: (n) => `Pedido · ${n}`,
    buttonLabel: (n) => `Ver tu pedido: ${n} bowl${n === 1 ? '' : 's'}`,
    forWhom: '¿Para quién es? (opcional)',
    forWhomPlaceholder: 'Ej. Gaby',
    defaultName: (n) => `Bowl ${n}`,
    nameLabel: (bowl) => `¿Para quién es ${bowl}?`,
    remove: (bowl) => `Quitar ${bowl} del pedido`,
    addAnother: 'Armar otro bowl',
    empty: 'Tu pedido está vacío.',
    emptyCta: 'Armar un bowl',
    itemsCount: (n) => `${n} bowl${n === 1 ? '' : 's'}`,
  },
  ingredients: {
    'rice-white': 'Arroz de sushi',
    'rice-brown': 'Arroz integral',
    quinoa: 'Quinoa tricolor',
    greens: 'Mix de hojas',
    tuna: 'Atún shoyu',
    salmon: 'Salmón',
    shrimp: 'Camarón',
    'chicken-teriyaki': 'Pollo teriyaki',
    tofu: 'Tofu crujiente',
    avocado: 'Palta',
    cucumber: 'Pepino',
    edamame: 'Vainas de soja',
    mango: 'Mango',
    corn: 'Maíz',
    'red-onion': 'Cebolla encurtida',
    carrot: 'Zanahoria',
    wakame: 'Wakame',
    ponzu: 'Ponzu',
    'spicy-mayo': 'Spicy mayo',
    teriyaki: 'Teriyaki',
    sesame: 'Aderezo de sésamo',
    'sesame-seeds': 'Sésamo',
    scallions: 'Cebollín',
    nori: 'Nori',
    'crispy-onion': 'Cebolla crujiente',
    masago: 'Masago',
  },
}

const en: Messages = {
  intl: 'en-US',
  htmlLang: 'en',
  meta: { title: 'Nami Poke Bar · Build your bowl' },
  header: {
    home: 'Poke Bar, home',
    nav: 'Main',
    house: 'House bowls',
    build: 'Build your bowl',
    how: 'How it works',
    order: 'Order',
    language: 'Language',
  },
  topBar: 'Ready for pickup in 15 min · Delivery available',
  hero: {
    badge: 'Poke bar · ポケ',
    line1: 'Ride',
    line2: 'your',
    accent: 'wave.',
    lead: 'Fresh poke bowls, your way. Pick a base, protein and toppings, and watch your bowl come together in real time.',
    ctaBuild: 'Build my bowl',
    ctaHouse: 'or pick a house bowl',
  },
  builder: {
    eyebrow: 'Step by step',
    title: 'Build your bowl',
    surprise: 'Surprise me',
    clear: 'Clear bowl',
    yourBowl: (size) => `Your bowl · ${size}`,
    emptyName: 'Your bowl is empty',
    emptyHint: 'Start by picking your base',
    veggie: 'Veggie',
    chooseOne: 'Pick 1',
    upTo: (n) => `Up to ${n}`,
    chosen: (n) => `${n} selected`,
    next: (label) => `Next: ${label}`,
    sizeGroup: 'Bowl size',
    steps: 'Steps to build your bowl',
  },
  categories: {
    base: { label: 'Base', title: 'Choose your base', noun: ['base', 'bases'] },
    protein: { label: 'Protein', title: 'Choose your protein', noun: ['protein', 'proteins'] },
    extra: { label: 'Mix-ins', title: 'Add some color', noun: ['mix-in', 'mix-ins'] },
    sauce: { label: 'Sauce', title: 'Sauce it up', noun: ['sauce', 'sauces'] },
    topping: { label: 'Toppings', title: 'The finishing touch', noun: ['topping', 'toppings'] },
  },
  sizes: {
    regular: { label: 'Regular', description: '1 protein · 4 mix-ins' },
    grande: { label: 'Large', description: '2 proteins · 6 mix-ins' },
  },
  tags: { popular: 'Popular', spicy: 'Spicy', new: 'New' },
  card: { included: 'Included' },
  summary: { total: 'Total', protein: 'g protein', add: 'Add to order' },
  notice: (m) => {
    switch (m.type) {
      case 'limit': {
        const noun = en.categories[m.category].noun[m.limit === 1 ? 0 : 1]
        return m.upsell
          ? `A Regular bowl takes up to ${m.limit} ${noun}. Go Large for more!`
          : `Up to ${m.limit} ${noun}. Remove one to swap.`
      }
      case 'resized':
        return `We trimmed your bowl to fit the ${en.sizes[m.size].label} size.`
      case 'surprise':
        return 'Surprise bowl! Tweak it to your taste.'
      case 'needBase':
        return 'Pick a base for your bowl first.'
      case 'needProtein':
        return 'Pick at least one protein for your bowl (tofu counts!).'
      case 'loaded':
        return `${m.name} is in the builder. Make it your own!`
      case 'notSuitable':
        return `${en.ingredients[m.ingredientId]}: ${m.filters.map((f) => en.diet.reasons[f].toLowerCase()).join(', ')}.`
      case 'conflictsRemoved':
        return m.count === 1
          ? 'We removed 1 ingredient that didn’t match your preferences.'
          : `We removed ${m.count} ingredients that didn’t match your preferences.`
    }
  },
  how: {
    eyebrow: 'Easy as 1-2-3',
    title: 'How it works',
    steps: [
      { title: 'Pick your base', text: 'Sushi rice, brown rice, quinoa or fresh mixed greens.' },
      { title: 'Add some color', text: 'Your choice of protein, fruit, veggies, sauces and crunchy toppings.' },
      { title: 'Pick up in 15 min', text: 'We make it fresh and let you know when it’s ready.' },
    ],
  },
  footer: {
    tagline: 'Fresh poke bowls, made your way.',
    disclaimer:
      'Nami Poke Bar is a fictional brand created as a portfolio concept project. Menu, prices and orders are for demo purposes only.',
    madeWith: 'Made with care.',
  },
  checkout: {
    close: 'Close',
    steps: ['Your order', 'Your details', 'Confirmation'],
    reviewTitle: 'Your order',
    detailsTitle: 'Who’s ordering?',
    doneTitle: 'Order confirmed!',
    bowlLine: (size) => `${size} bowl`,
    quantity: 'Quantity',
    decrease: (bowl) => `Decrease quantity of ${bowl}`,
    increase: (bowl) => `Increase quantity of ${bowl}`,
    notes: 'Notes for the kitchen (optional)',
    notesPlaceholder: 'E.g. no onion, sauce on the side…',
    name: 'Name',
    phone: 'Phone',
    phoneHint: '10 digits',
    required: 'Required',
    today: 'Today',
    mode: 'Pickup or delivery?',
    modes: {
      pickup: { label: 'In-store pickup', detail: () => 'At Nami · Free' },
      delivery: { label: 'Delivery', detail: (fee) => `+${fee} · ~35 min` },
    },
    address: 'Delivery address',
    addressPlaceholder: 'Street address, apt, neighborhood',
    when: 'When?',
    asap: 'ASAP',
    schedule: 'Schedule for later',
    time: 'Time',
    payment: 'Pay in person',
    cash: 'Cash',
    card: 'Card',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery',
    free: 'Free',
    total: 'Total',
    continue: 'Continue',
    back: 'Back',
    confirm: (total) => `Place order · ${total}`,
    processing: 'Sending your order to the kitchen…',
    errors: {
      name: 'Please enter your name.',
      phone: 'Please enter a 10-digit phone number.',
      address: 'Please enter the delivery address.',
    },
    orderNumber: 'Order number',
    eta: (mode, slot) => {
      const when = slot ? `at ${slot}` : mode === 'pickup' ? 'in about 15 min' : 'in about 35 min'
      return mode === 'pickup' ? `Your order will be ready for pickup at Nami ${when}.` : `Your order will arrive ${when}.`
    },
    demoNote: 'This is a demo: no charge was made and no real order was placed.',
    another: 'Build another bowl',
    done: 'Done',
  },
  houseBowls: {
    eyebrow: 'Ready for you',
    title: 'House bowls',
    lead: 'Our favorite combos. Order them as is, or make them your own.',
    customize: 'Customize',
    add: 'Add to order',
    descriptions: {
      'hawaiian-classic': 'Salmon, avocado and mango with ponzu. The island classic.',
      'spicy-tuna': 'Shoyu tuna with spicy mayo, masago and crispy onions.',
      'green-vegan': 'Mixed greens, crispy tofu and sesame dressing. 100% plant-based.',
      'teriyaki-crunch': 'Teriyaki chicken and shrimp over brown rice. Large size.',
    },
  },
  diet: {
    legend: 'Dietary preferences',
    filters: { vegan: 'Vegan', glutenFree: 'Gluten-free', noSeafood: 'No fish or seafood' },
    labels: { vegan: 'Vegan', glutenFree: 'Gluten-free', seafood: 'Seafood', gluten: 'Contains gluten', notVegan: 'Not vegan' },
    reasons: { vegan: 'Not vegan', glutenFree: 'Contains gluten', noSeafood: 'Contains seafood' },
    conflicts: (n) =>
      n === 1 ? '1 ingredient in your bowl doesn’t match your preferences.' : `${n} ingredients in your bowl don’t match your preferences.`,
    removeConflicts: 'Remove them',
  },
  cart: {
    button: (n) => `Order · ${n}`,
    buttonLabel: (n) => `View your order: ${n} bowl${n === 1 ? '' : 's'}`,
    forWhom: 'Who’s it for? (optional)',
    forWhomPlaceholder: 'E.g. Gaby',
    defaultName: (n) => `Bowl ${n}`,
    nameLabel: (bowl) => `Who’s ${bowl} for?`,
    remove: (bowl) => `Remove ${bowl} from order`,
    addAnother: 'Build another bowl',
    empty: 'Your order is empty.',
    emptyCta: 'Build a bowl',
    itemsCount: (n) => `${n} bowl${n === 1 ? '' : 's'}`,
  },
  ingredients: {
    'rice-white': 'Sushi rice',
    'rice-brown': 'Brown rice',
    quinoa: 'Tri-color quinoa',
    greens: 'Mixed greens',
    tuna: 'Shoyu tuna',
    salmon: 'Salmon',
    shrimp: 'Shrimp',
    'chicken-teriyaki': 'Teriyaki chicken',
    tofu: 'Crispy tofu',
    avocado: 'Avocado',
    cucumber: 'Cucumber',
    edamame: 'Edamame',
    mango: 'Mango',
    corn: 'Corn',
    'red-onion': 'Pickled red onion',
    carrot: 'Carrot',
    wakame: 'Seaweed salad',
    ponzu: 'Ponzu',
    'spicy-mayo': 'Spicy mayo',
    teriyaki: 'Teriyaki sauce',
    sesame: 'Sesame dressing',
    'sesame-seeds': 'Sesame seeds',
    scallions: 'Scallions',
    nori: 'Nori',
    'crispy-onion': 'Crispy onions',
    masago: 'Masago',
  },
}

export const MESSAGES: Record<Locale, Messages> = { es, en }
