# FF Delivery

App móvil de delivery de comida hecha con **React Native y Expo**. Permite registrarse, buscar y filtrar el menú por categoría, armar el carrito con extras (toppings, guarniciones) y editar el perfil. Funciona en Android, iOS y web.

**Demo:** _próximamente_

<!-- Agregá capturas del celular, una al lado de la otra:
<p>
  <img src="docs/home.png" width="200" />
  <img src="docs/search.png" width="200" />
  <img src="docs/cart.png" width="200" />
</p>
-->

## Funcionalidades

- Registro e inicio de sesión con Appwrite Auth; rutas protegidas con Expo Router.
- Menú con búsqueda (con debounce) y filtro por categoría, leído de Appwrite Database.
- Carrito con extras: el mismo producto con extras distintos se guarda como una línea aparte, y el total incluye el precio de cada extra.
- Perfil editable (teléfono y dirección).
- Monitoreo de errores en producción con Sentry.

## Stack

| Capa | Tecnologías |
| --- | --- |
| App | React Native 0.81, Expo SDK 54, Expo Router, TypeScript |
| UI | NativeWind (Tailwind CSS para React Native) |
| Estado | Zustand (carrito y sesión) |
| Backend | Appwrite (Auth, Database, Storage) |
| Calidad | ESLint, Jest (jest-expo), Sentry, GitHub Actions |

## Estructura

```
app/
  (auth)/        pantallas de login y registro
  (tabs)/        inicio, búsqueda, carrito y perfil
components/      tarjetas del menú, filtro, buscador, inputs
store/           stores de Zustand: carrito y sesión
lib/             cliente de Appwrite, hook useAppwrite, datos de ejemplo y seed
__tests__/       tests de la lógica del carrito y del manejo de errores
```

## Correrlo localmente

Requisitos: Node 20 o superior, la app Expo Go en el celular (o un emulador) y un proyecto de Appwrite.

```bash
git clone https://github.com/GBBk/ff_delivery_app.git
cd ff_delivery_app
npm install
cp .env.example .env   # completar endpoint y project ID de Appwrite
npx expo start
```

Escaneá el QR con Expo Go, o presioná `a` (Android), `i` (iOS) o `w` (web).

Los IDs de la base y las colecciones están en `lib/appwrite.ts`. Con un proyecto de Appwrite nuevo, creá las colecciones y cargá el menú de ejemplo con la función `seed` de `lib/seed.ts`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npx expo start` | Servidor de desarrollo |
| `npm run lint` | ESLint |
| `npm test` | Tests con Jest |

## Próximas mejoras

- Checkout: guardar pedidos en Appwrite y mostrar el historial en el perfil.
- Pago de prueba con Stripe en modo test.
- Build instalable con EAS Build (APK en Releases).
