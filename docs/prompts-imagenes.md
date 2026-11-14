# Prompts de imágenes — Nami Poke Bar

## Cómo generarlas

- **Herramienta recomendada:** ChatGPT (generación de imágenes). Puede entregar el **fondo transparente** si lo pides.
  Si tu herramienta no lo hace, genera sobre fondo blanco y quita el fondo en tu Mac:
  abre la imagen en **Vista Previa → Herramientas → Eliminar fondo**, o en Finder: clic derecho → Acciones rápidas → Eliminar fondo.
- **Formato:** PNG, cuadrado 1:1, idealmente de 1024 × 1024 o más.
- **Consistencia:** pega SIEMPRE el *bloque de estilo* al final de cada prompt. Eso hace que todas salgan con la misma luz y el mismo ángulo,
  y es lo que hará que el bowl armado parezca una sola foto.
- **Nombres:** guarda cada archivo con el nombre indicado en `public/images/` (con las mismas subcarpetas). El código los va a buscar así.
- Si una imagen sale con plato, mesa o sombra fuerte, regenérala: necesitamos solo el ingrediente.

---

## Bloque de estilo (pégalo al final de cada prompt de ingrediente)

```
Shot from directly overhead at exactly 90 degrees (top-down flat lay). Professional high-end food photography, soft diffused daylight coming from the upper left, very subtle natural shading, no hard shadows, no drop shadow. Vibrant, fresh, appetizing natural colors, crisp detail, glossy where appropriate. Isolated on a fully transparent background, PNG. No bowl, no plate, no table, no props, no text, no hands. Centered in the frame. Square 1:1.
```

---

## 1. El bowl vacío — `bowl/bowl.png`

```
An empty wide, shallow round ceramic poke bowl, perfectly circular, seen from directly above. Matte speckled cream glaze inside, thin deep indigo rim, the inner surface clean and empty. The bowl fills about 92% of the frame.
```
*(Sin el bloque de estilo, salvo esta línea:)* `Top-down 90 degrees, soft diffused daylight from the upper left, transparent background PNG, no table, no shadow, square 1:1.`

---

## 2. Bases — `bases/` (capa circular completa)

La base se dibuja como un círculo que llena el bowl, así que pide un **disco plano y perfectamente redondo**.

Plantilla:
```
A perfectly round, flat, even layer of [INGREDIENTE], shaped as a clean full circle with a neat round edge, like the bed of a poke bowl, filling about 90% of the frame.
```

| Archivo | [INGREDIENTE] |
|---|---|
| `bases/rice-white.png` | freshly cooked glossy white Japanese sushi rice, individual grains visible |
| `bases/rice-brown.png` | freshly cooked brown rice, warm tan color, individual grains visible |
| `bases/quinoa.png` | fluffy cooked tri-color quinoa (white, red and black grains) |
| `bases/greens.png` | fresh mixed baby greens: spinach, arugula and baby lettuce leaves, crisp and bright |

---

## 3. Proteínas — `proteins/` (montoncito compacto)

Plantilla:
```
A compact, neat, slightly oval pile of [INGREDIENTE], arranged tightly together the way it would sit in a section of a poke bowl, the pile fills about 80% of the frame. Shot from directly overhead at exactly 90 degrees (top-down flat lay). Professional high-end food photography, soft diffused daylight coming from the upper left, very subtle natural shading, no hard shadows, no drop shadow. Vibrant, fresh, appetizing natural colors, crisp detail, glossy where appropriate. Isolated on a fully transparent background, PNG. No bowl, no plate, no table, no props, no text, no hands. Centered in the frame. Square 1:1.
```

| Archivo | [INGREDIENTE] |
|---|---|
| `proteins/tuna.png` | about 10 cubes of fresh raw ahi tuna marinated in shoyu, deep ruby red, glossy, sprinkled with a few sesame seeds |
| `proteins/salmon.png` | about 10 cubes of fresh raw salmon, bright coral orange with white fat lines, glossy |
| `proteins/shrimp.png` | about 8 cooked peeled shrimp, pink and white, curled, tails removed |
| `proteins/chicken-teriyaki.png` | bite-sized pieces of grilled chicken thigh glazed with teriyaki sauce, caramelized and glossy |
| `proteins/tofu.png` | about 10 cubes of golden crispy pan-fried tofu, lightly glazed |

---

## 4. Complementos — `extras/` (montoncito compacto)

Usa la **misma plantilla** que las proteínas.

| Archivo | [INGREDIENTE] |
|---|---|
| `extras/avocado.png` | thin fanned slices of ripe avocado, bright green fading to yellow, slightly glossy |
| `extras/cucumber.png` | thin half-moon slices of fresh cucumber, crisp and bright green |
| `extras/edamame.png` | shelled bright green edamame beans |
| `extras/mango.png` | cubes of ripe golden mango, juicy and glossy |
| `extras/corn.png` | sweet yellow corn kernels, slightly charred |
| `extras/red-onion.png` | thinly sliced pickled red onion, vibrant magenta pink |
| `extras/carrot.png` | fine julienned orange carrot strips |
| `extras/wakame.png` | seaweed salad (wakame), vivid green, glossy with sesame seeds |

---

## 5. Salsas — `sauces/` (hilos de salsa)

Estas van **encima** de todo el bowl, así que deben ser solo los hilos de salsa, sin nada debajo.

Plantilla:
```
Elegant thin drizzle lines of [SALSA] in a loose zigzag pattern covering a round area, only the sauce itself, nothing underneath it. The drizzle area fills about 85% of the frame. Shot from directly overhead at exactly 90 degrees (top-down flat lay). Professional high-end food photography, soft diffused daylight coming from the upper left, very subtle natural shading, no hard shadows, no drop shadow. Vibrant, fresh, appetizing natural colors, crisp detail, glossy where appropriate. Isolated on a fully transparent background, PNG. No bowl, no plate, no table, no props, no text, no hands. Centered in the frame. Square 1:1.
```

| Archivo | [SALSA] |
|---|---|
| `sauces/ponzu.png` | glossy translucent amber ponzu sauce |
| `sauces/spicy-mayo.png` | creamy orange-pink spicy sriracha mayo |
| `sauces/teriyaki.png` | thick glossy dark brown teriyaki glaze |
| `sauces/sesame.png` | creamy light beige sesame dressing |

---

## 6. Toppings — `toppings/` (espolvoreado)

Plantilla:
```
A light, natural scatter of [TOPPING] spread loosely over a round area, as if sprinkled over a poke bowl, only the topping itself. The scatter area fills about 85% of the frame. Shot from directly overhead at exactly 90 degrees (top-down flat lay). Professional high-end food photography, soft diffused daylight coming from the upper left, very subtle natural shading, no hard shadows, no drop shadow. Vibrant, fresh, appetizing natural colors, crisp detail, glossy where appropriate. Isolated on a fully transparent background, PNG. No bowl, no plate, no table, no props, no text, no hands. Centered in the frame. Square 1:1.
```

| Archivo | [TOPPING] |
|---|---|
| `toppings/sesame-seeds.png` | white and black sesame seeds |
| `toppings/scallions.png` | finely sliced fresh green scallion rings |
| `toppings/nori.png` | thin crisp strips of dark green nori seaweed |
| `toppings/crispy-onion.png` | golden crispy fried onion flakes |
| `toppings/masago.png` | small clusters of bright orange masago fish roe |

---

## 7. Fotos de ambiente — `scene/` (estas SÍ llevan fondo; NO uses el bloque de estilo)

Bloque de estilo para escenas:
```
Editorial food photography for a vibrant modern Asian poke restaurant brand. Bright, colorful, joyful mood, soft natural daylight, shallow depth of field, rich saturated colors with coral, mango yellow, matcha green and deep indigo accents. No text, no logos.
```

| Archivo | Prompt | Formato |
|---|---|---|
| `scene/hero.jpg` | A beautifully composed colorful poke bowl with salmon, tuna, avocado, mango, edamame and sesame seeds in a speckled cream ceramic bowl with an indigo rim, seen from above at a slight angle, on a bright coral surface with chopsticks and a small dish of soy sauce, generous empty space on the left side for text. | Horizontal 16:9 |
| `scene/flatlay.jpg` | Overhead flat lay of fresh poke ingredients in small bowls and on a wooden board: cubes of raw tuna and salmon, avocado, mango, cucumber, edamame, pickled red onion, nori, sesame seeds, on a deep indigo surface. | Horizontal 16:9 |
| `scene/lifestyle.jpg` | Two friends laughing and eating poke bowls with chopsticks at a bright modern counter with colorful tiles and paper lanterns, natural window light, candid moment, faces partially out of frame. | Vertical 4:5 |

---

## Checklist (30 imágenes)

- [X] bowl (1)
- [X] bases (4)
- [X] proteínas (5)
- [X] complementos (8)
- [X] salsas (4)
- [X] toppings (5)
- [2] escenas (3)

**Para empezar rápido:** con el bowl, 1 base, 2 proteínas, 3 complementos y 1 salsa ya puedo armar y animar el configurador mientras generas el resto.
