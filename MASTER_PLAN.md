# 🎬 CINEVERSE / TESTCINEMA — ПОЛНЫЙ МАСТЕР-ПЛАН
### Интеллектуальная онлайн-платформа для просмотра фильмов с персонализацией и аналитикой киноиндустрии Казахстана

> **Версия документа:** 1.0  
> **Дата создания:** 03.05.2026  
> **Ветка:** `Orka` | **Репозиторий:** `RabotnikPolson/main-frontend`  
> **Стек:** React 18 + Vite + React Router 6 + React Query + Axios + Chart.js  
> **Цель:** Дипломный проект — полноценный стриминговый сервис с казахстанской аналитикой, AI-рекомендациями и премиум-дизайном

---

## СОДЕРЖАНИЕ

1. [Анализ текущего репозитория](#1-анализ-текущего-репозитория)
2. [Общая концепция и цели](#2-общая-концепция-и-цели)
3. [Полная архитектура системы](#3-полная-архитектура-системы)
4. [Дизайн-система — Dark Luxury Glassmorphism](#4-дизайн-система--dark-luxury-glassmorphism)
5. [Все страницы — детальное ТЗ](#5-все-страницы--детальное-тз)
6. [Все компоненты — детальное ТЗ](#6-все-компоненты--детальное-тз)
7. [Все хуки и API](#7-все-хуки-и-api)
8. [Фичи и идеи — полный список](#8-фичи-и-идеи--полный-список)
9. [Дизайн-референсы и UI-идеи](#9-дизайн-референсы-и-ui-идеи)
10. [Дорожная карта и задачи с датами](#10-дорожная-карта-и-задачи-с-датами)
11. [Технические задачи и баги](#11-технические-задачи-и-баги)
12. [CI/CD и деплой](#12-cicd-и-деплой)
13. [Бэклог и будущие идеи](#13-бэклог-и-будущие-идеи)

---

## 1. АНАЛИЗ ТЕКУЩЕГО РЕПОЗИТОРИЯ

### 1.1 Что уже есть

**Ветка:** `Orka` (активная)  
**Коммитов:** 29  
**Язык:** JavaScript 79.1% / CSS 20.6%  

**Файловая структура (текущее состояние):**

```
src/
├── App.css / App.jsx         ← корневой компонент
├── index.css / index.jsx / main.jsx
├── setupTests.js
│
├── assets/
│   ├── no-images.png         ← заглушка для постеров
│   └── react.svg
│
├── components/
│   ├── Header.jsx            ✅ реализован
│   ├── HeroCarousel.jsx      ✅ карусель на главной
│   ├── MovieCard.jsx         ✅ карточка фильма
│   ├── MovieGrid.jsx         ✅ сетка фильмов
│   ├── PlayerPlaceholder.jsx ✅ плейсхолдер плеера
│   ├── RatingStars.jsx       ✅ звёздный рейтинг
│   ├── ReviewCard.jsx        ✅ карточка отзыва
│   ├── ReviewFormModal.jsx   ✅ форма написания отзыва
│   ├── ReviewReadModal.jsx   ✅ просмотр отзыва
│   ├── Sidebar.jsx           ✅ боковая панель
│   ├── 1.zip / 2.zip         ← архивы старых компонентов
│   ├── comments/
│   │   ├── CommentItem.jsx   ✅ элемент комментария
│   │   └── CommentsSection.jsx ✅ секция комментариев
│   └── RightRail/
│       └── RecommendationsRail.jsx ✅ рекомендации справа
│
├── entities/movie/
│   └── mapper.js             ✅ маппер данных фильма
│
├── hooks/
│   ├── useAuth.js            ✅ авторизация
│   ├── useComments.js        ✅ комментарии
│   ├── useFavorites.js       ✅ избранное
│   ├── useGenres.js          ✅ жанры
│   ├── useMovie.js           ✅ один фильм
│   ├── useMovies.js          ✅ список фильмов
│   ├── useRecommendations.js ✅ рекомендации
│   ├── useReviews.js         ✅ отзывы
│   ├── useSubscription.js    ✅ подписка
│   ├── useTheme.js           ✅ тема (светлая/тёмная)
│   ├── useUserProfile.js     ✅ профиль пользователя
│   ├── useUserSettings.js    ✅ настройки
│   └── 3.zip / 4.zip         ← архивы
│
├── layouts/
│   └── AppLayout.jsx         ✅ общий лейаут
│
├── pages/
│   ├── Home.jsx              ✅ главная
│   ├── Genres.jsx            ✅ жанры
│   ├── MovieDetails.jsx      ✅ детали фильма
│   ├── MovieWatch.jsx        ✅ просмотр фильма
│   ├── MovieReviews.jsx      ✅ отзывы к фильму
│   ├── Favorites.jsx         ✅ избранное
│   ├── History.jsx           ✅ история просмотров
│   ├── Login.jsx             ✅ вход
│   ├── Register.jsx          ✅ регистрация
│   ├── AddMovie.jsx          ✅ добавление фильма (admin)
│   ├── AdminAnalytics.jsx    ✅ аналитика (admin)
│   ├── ProfilePage.jsx       ✅ профиль
│   ├── SettingsPage.jsx      ✅ настройки
│   ├── SubscriptionPage.jsx  ✅ подписка
│   └── UserActivityPage.jsx  ✅ активность пользователя
│
├── shared/api/
│   ├── http.js               ✅ axios-инстанс с токеном
│   ├── auth.js               ✅ авторизация API
│   ├── comments.js           ✅ комментарии API
│   ├── favorites.js          ✅ избранное API
│   ├── movies.js             ✅ фильмы API
│   ├── ratings.js            ✅ рейтинги API
│   ├── recommendations.js    ✅ рекомендации API
│   ├── reviews.js            ✅ отзывы API
│   └── stream.js             ✅ стриминг API
│
├── styles/
│   ├── global.css / theme.css
│   ├── components/
│   │   ├── comments.css
│   │   ├── Header.css
│   │   ├── HeroCarousel.css
│   │   └── reviewModal.css
│   └── pages/
│       ├── AddMovie.css / AdminAnalytics.css / Auth.css
│       ├── Favorites.css / Genres.css / History.css
│       ├── Home.css / MovieDetails.css / MovieWatch.css
│       ├── Profile.css / Settings.css / Subscription.css
│
└── utils/
    └── localHistory.js       ✅ локальная история

Корень проекта:
├── package.json              ← React 18 + Vite + зависимости
├── vite.config.js
├── Dockerfile                ✅ контейнеризация
├── db.json                   ← json-server (пустой в Orka)
├── settings.txt
├── index.html
└── *.zip                     ← архивы разных версий
```

### 1.2 Что работает

| Модуль | Статус | Примечания |
|---|---|---|
| Аутентификация (JWT) | ✅ Готово | Login, Register, PrivateRoute |
| Каталог фильмов | ✅ Готово | Grid + фильтры |
| Карусель на главной | ✅ Готово | HeroCarousel |
| Детали фильма | ✅ Готово | MovieDetails + вкладки |
| Просмотр фильма | ✅ Готово | PlayerPlaceholder |
| Отзывы и комментарии | ✅ Готово | Modal + список |
| Рейтинг | ✅ Готово | RatingStars |
| Избранное | ✅ Готово | useFavorites + localStorage |
| История просмотров | ✅ Готово | localHistory.js |
| Профиль пользователя | ✅ Готово | ProfilePage |
| Настройки | ✅ Готово | SettingsPage |
| Тёмная/светлая тема | ✅ Готово | useTheme |
| Подписка | ✅ Готово | SubscriptionPage |
| Admin: добавление фильма | ✅ Готово | AddMovie |
| Admin: аналитика | ✅ Готово | Chart.js графики |
| Рекомендации | ✅ Готово | RecommendationsRail |
| Жанры | ✅ Готово | Genres страница |
| Docker | ✅ Готово | Dockerfile |
| CI/CD | ⚠️ Частично | нужен GitHub Actions |

### 1.3 Что отсутствует (gap-анализ)

| Что не хватает | Приоритет |
|---|---|
| Реальный видеоплеер (не плейсхолдер) | 🔴 Высокий |
| Поиск с дебаунсом и подсказками | 🔴 Высокий |
| Refresh-токен / silent refresh | 🔴 Высокий |
| Полный редизайн (Dark Luxury) | 🔴 Высокий |
| i18n (ru / kz / en) | 🟡 Средний |
| Плейлисты / коллекции | 🟡 Средний |
| AI-рекомендации | 🟡 Средний |
| E2E тесты (Playwright) | 🟡 Средний |
| PWA / офлайн-режим | 🟢 Низкий |
| Мобильное приложение | 🟢 Низкий |
| Drag-and-drop плейлисты | 🟢 Низкий |

---

## 2. ОБЩАЯ КОНЦЕПЦИЯ И ЦЕЛИ

### 2.1 Описание проекта

**TestCinema / CineVerse** — интеллектуальная онлайн-платформа для просмотра фильмов. Дипломный проект с фокусом на:
- персонализированные рекомендации через AI
- аналитику рынка киноиндустрии Казахстана
- премиум UX в стиле Dark Luxury Glassmorphism

### 2.2 Целевая аудитория

| Сегмент | Описание |
|---|---|
| Основная | Жители Казахстана 18–35 лет, активные пользователи стриминга |
| Вторичная | Cinephile-аудитория (арт-хаус, фестивальное кино) |
| Admin/Curators | Редакторы контента и аналитики |

### 2.3 Ключевые принципы

- **Персонализация:** каждый пользователь видит свой контент
- **Локализация:** казахстанский контент и аналитика
- **Качество UX:** плавные анимации, отклик < 200ms
- **Доступность:** работа на всех устройствах (PWA)
- **Монетизация:** freemium-модель с подпиской Pro

### 2.4 Монетизация

| Тип | Описание | Цена |
|---|---|---|
| Free | Каталог, ограниченный просмотр с рекламой | 0 ₸ |
| Standard | Без рекламы, HD, 1 устройство | 790 ₸/мес |
| Pro | 4K Dolby Vision, 4 устройства, скачивание | 1490 ₸/мес |
| Student | Скидка 50% при подтверждении статуса | 395 ₸/мес |

---

## 3. ПОЛНАЯ АРХИТЕКТУРА СИСТЕМЫ

### 3.1 Frontend-архитектура

```
CineVerse Frontend (React 18 + Vite)
│
├── Routing Layer (React Router 6)
│   ├── Public Routes: /, /login, /register, /movies/:id
│   ├── Protected Routes: /favorites, /history, /profile, /settings
│   └── Admin Routes: /admin/analytics, /admin/add-movie
│
├── State Management
│   ├── React Query — серверное состояние (фильмы, жанры, юзер)
│   ├── Context API — тема, авторизация, история
│   └── localStorage — токен, избранное, история просмотров
│
├── API Layer (Axios)
│   ├── http.js — базовый инстанс + Bearer interceptor
│   ├── auth.js — /api/auth/*
│   ├── movies.js — /api/movies/*
│   ├── genres.js — /api/genres
│   ├── ratings.js — /api/ratings
│   ├── reviews.js — /api/reviews
│   ├── comments.js — /api/comments
│   ├── favorites.js — /api/favorites
│   ├── recommendations.js — /api/recommendations
│   └── stream.js — /api/stream/*
│
├── UI Layer
│   ├── Design Tokens (CSS Variables)
│   ├── Global Styles (global.css, theme.css)
│   ├── Component Library (Header, MovieCard, etc.)
│   └── Page Components
│
└── Utils
    ├── localHistory.js — история в localStorage
    ├── mapper.js — трансформация данных фильма
    └── analytics helpers
```

### 3.2 Backend API (существующий)

| Эндпоинт | Метод | Описание |
|---|---|---|
| `/api/auth/register` | POST | Регистрация |
| `/api/auth/login` | POST | Вход, возвращает JWT |
| `/api/auth/refresh` | POST | Обновление токена |
| `/api/movies` | GET | Список фильмов + фильтры |
| `/api/movies/:id` | GET | Детали фильма |
| `/api/movies` | POST | Добавление фильма (admin) |
| `/api/genres` | GET | Список жанров |
| `/api/ratings` | GET/POST | Рейтинги |
| `/api/reviews` | GET/POST | Отзывы |
| `/api/comments` | GET/POST | Комментарии |
| `/api/favorites` | GET/POST/DELETE | Избранное |
| `/api/recommendations` | GET | AI-рекомендации |
| `/api/stream/:id` | GET | Стриминг видео |
| `/api/user-settings/me` | GET/PATCH | Настройки юзера |
| `/api/analytics/*` | GET | Данные для графиков |

### 3.3 Переменные окружения

```env
VITE_API_URL=http://localhost:8080         # URL бэкенда
VITE_APP_NAME=CineVerse
VITE_ENABLE_ANALYTICS=true
VITE_TMDB_API_KEY=                         # ДОБАВИТЬ: для постеров
VITE_SENTRY_DSN=                           # ДОБАВИТЬ: мониторинг ошибок
VITE_ANALYTICS_ID=                         # ДОБАВИТЬ: метрики
```

---

## 4. ДИЗАЙН-СИСТЕМА — DARK LUXURY GLASSMORPHISM

### 4.1 Концепция

Стиль платформы — **Dark Luxury Glassmorphism**. Вдохновение: кинотеатр премиум-класса, арт-деко постеры, Apple Liquid Glass. Каждый экран должен ощущаться как вход в тёмный зал с золотыми акцентами.

Три кита:
1. **Темнота** — глубокий почти-чёрный фон (#07070F) с фиолетовым подтоном
2. **Золото** — единственный цветной акцент (#C9A84C) — как латунь в дорогом кинотеатре
3. **Стекло** — `backdrop-filter: blur` панели, тонкие rgba-бордеры, слои глубины

### 4.2 Цветовая палитра

| Токен | HEX | Применение |
|---|---|---|
| `--void` | `#07070F` | Основной фон страниц |
| `--deep` | `#0D0D1C` | Фон карточек, sidebar |
| `--space` | `#131325` | Hover-состояния |
| `--gold` | `#C9A84C` | Акцент, кнопки CTA, рейтинг, активные ссылки |
| `--gold-dim` | `#7A5F28` | Бордеры золотых элементов |
| `--gold-glow` | `rgba(201,168,76,0.15)` | Свечение акцентных зон |
| `--crimson` | `#8B1A2D` | Ошибки, 18+ метки, badge |
| `--ice` | `#D4D8E8` | Заголовки, основной текст на тёмном |
| `--text` | `#9A9EB8` | Основной body-текст |
| `--text-dim` | `#7A7F99` | Метаданные, подписи |
| `--glass` | `rgba(255,255,255,0.04)` | Фон стеклянных панелей |
| `--glass-border` | `rgba(255,255,255,0.08)` | Бордер стеклянных панелей |
| `--glass-hover` | `rgba(255,255,255,0.07)` | Hover стеклянных панелей |

### 4.3 Типографика

| Роль | Шрифт | Вес | Размер | Применение |
|---|---|---|---|---|
| Display | Bebas Neue | 400 | 64–140px | Заголовки страниц, hero |
| Subheading | DM Serif Display Italic | 400 | 18–36px | Подзаголовки, цитаты |
| Body | DM Sans Light | 300 | 14–16px | Основной текст |
| UI Label | DM Sans Medium | 500 | 10–12px | Кнопки, метки, nav |
| Mono | JetBrains Mono | 400 | 12px | Коды, время, техн. данные |

**Правила:**
- НИКОГДА не использовать Inter, Arial, Roboto
- Заголовки всегда через `font-family: 'Bebas Neue'`
- Все label — `letter-spacing: 0.15–0.3em; text-transform: uppercase`
- Линейная высота body: `line-height: 1.7`

### 4.4 Компоненты дизайн-системы

#### Кнопки
```
Btn Primary:   gold background, dark text, border-radius: 3px
Btn Secondary: glass background, ice text, 1px glass-border
Btn Icon:      circle, glass, 48px
Btn Danger:    crimson background (delete, logout)
```

#### Карточки фильма
```
Размер:        180×264px (poster) + 80px info
Hover:         translateY(-6px) scale(1.03) + gold border
Overlay:       play button появляется при hover
Progress bar:  2px gold линия снизу (история просмотра)
```

#### Glassmorphism панели
```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-radius: 8–12px;
```

#### Hero секция
```
Min-height:    100vh
Постер:        правая половина экрана (52% width)
Градиент:      линейный overlay слева, тёмный
Ambient light: radial-gradient золотое свечение
```

### 4.5 Анимации

| Анимация | Длительность | Easing |
|---|---|---|
| Page load (staggered reveal) | 600ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Card hover | 200ms | ease-out |
| Hero parallax | scroll-driven | — |
| Modal open | 350ms | ease-in-out |
| Nav на скролле | 200ms | ease |
| Button press | 150ms | ease |
| Carousel transition | 400ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |

### 4.6 Responsive Breakpoints

```
Mobile:   < 768px
Tablet:   768px – 1024px
Desktop:  1024px – 1440px
Wide:     > 1440px
```

---

## 5. ВСЕ СТРАНИЦЫ — ДЕТАЛЬНОЕ ТЗ

### 5.1 Home (Главная) — `/`

**Файл:** `src/pages/Home.jsx` + `src/styles/pages/Home.css`

**Секции:**

1. **Hero Carousel** — полноэкранный баннер с топ-фильмами
   - Автоматическое переключение каждые 6 секунд
   - Пагинация точками снизу
   - Кнопки: «Смотреть» (gold) + «+ В список» (glass)
   - Постер справа с gradient overlay
   - Метаданные: рейтинг, длительность, жанры, год
   - Badge «Премьера недели» / «Новинка» с пульсирующей точкой

2. **Продолжить просмотр** — горизонтальная карусель
   - Показывается только авторизованным пользователям
   - Прогресс-бар на каждой карточке (% просмотра)
   - Наведение — кнопка play по центру карточки

3. **Новинки месяца** — горизонтальная карусель
   - Фильмы, добавленные за последние 30 дней
   - Кнопки «Все →» ведут на отфильтрованный каталог

4. **Редакционный выбор** — 2-column featured grid
   - Большие карточки (16:9) с описанием
   - Badge «Фильм года» / «✦ Новый выбор»

5. **По жанру** — сетка пиктограмм жанров (6 колонок)
   - Иконка + название жанра
   - Клик → /genres?filter=xxx

6. **Статистика платформы** — 4 метрики в ряд
   - 12K+ фильмов / 4K качество / 50+ жанров / 1M зрителей

7. **Promo блок** — CTA подписки
   - Два тарифа рядом (Standard / Pro)
   - Кнопка «Начать бесплатно»

8. **Footer** — 4-column

**Хуки:** `useMovies`, `useAuth`, `useGenres`  
**API:** `GET /api/movies`, `GET /api/genres`

---

### 5.2 Genres (Жанры) — `/genres`

**Файл:** `src/pages/Genres.jsx` + `src/styles/pages/Genres.css`

**Макет:**
- Сетка жанров: `repeat(auto-fill, minmax(200px, 1fr))`
- Каждая карточка жанра: большая иконка + название + кол-во фильмов
- При выборе жанра → фильтрация сетки фильмов ниже
- Chip-фильтры сверху (активный жанр подсвечен золотом)
- Сортировка: по рейтингу / по году / по алфавиту
- Infinite scroll или пагинация

**Хуки:** `useGenres`, `useMovies`  
**API:** `GET /api/genres`, `GET /api/movies?genre=xxx`

---

### 5.3 MovieDetails (Детали фильма) — `/movies/:id`

**Файл:** `src/pages/MovieDetails.jsx`

**Секции:**

1. **Hero backdrop** — постер на весь экран с gradient overlay
   - Название фильма (Bebas Neue 80–100px)
   - Оригинальное название курсивом
   - Метки: год, длительность, возраст, жанры
   - Кнопки: «Смотреть» / «В список» / «Поделиться» / «…»

2. **Rating block** — правый блок
   - Большая цифра рейтинга (64px)
   - Звёзды
   - Кол-во оценок
   - Рейтинг-бары (5★ → 1★ с процентами)
   - Внешние рейтинги: IMDb / Rotten Tomatoes / Metacritic

3. **Плеер** — 16:9 превью с кнопкой play
   - Прогресс-бар с текущей позицией
   - Время оставшееся / общее

4. **Синопсис** — развёрнутое описание

5. **Создатели** — 3-column grid: режиссёр, сценарист, музыка и т.д.

6. **Актёрский состав** — горизонтальная карусель
   - Аватар (инициалы или фото) + имя + роль

7. **Sidebar:**
   - Детали: страна, год, бюджет, сборы, качество, звук
   - Жанры (кликабельные теги)
   - Рейтинг-бары по оценкам

8. **Отзывы** — ссылка на `/movies/:id/reviews`

9. **Похожие фильмы** — горизонтальный ряд 5 карточек

**Хуки:** `useMovie`, `useReviews`, `useComments`, `useFavorites`, `useRecommendations`  
**API:** `GET /api/movies/:id`, `GET /api/reviews?movieId=`, `GET /api/recommendations?movieId=`

---

### 5.4 MovieWatch (Просмотр) — `/movies/:id/watch`

**Файл:** `src/pages/MovieWatch.jsx`

**Элементы:**

1. **Видеоплеер** (полноэкранный)
   - Кастомные контролы: play/pause, перемотка ±10s, громкость, субтитры, качество, полный экран
   - Progress bar с preview thumbnails при наведении
   - Сохранение позиции просмотра в localStorage каждые 30 секунд
   - Автопереход к следующей серии (для сериалов)

2. **Sidebar справа** (скрывается в fullscreen)
   - RecommendationsRail — похожие фильмы

3. **Под плеером:**
   - Название + метаданные
   - Кнопки: лайк, в список, поделиться
   - CommentsSection

**Хуки:** `useMovie`, `useRecommendations`, `useComments`  
**API:** `GET /api/stream/:id`

---

### 5.5 MovieReviews (Отзывы) — `/movies/:id/reviews`

**Файл:** `src/pages/MovieReviews.jsx`

**Элементы:**
- Список ReviewCard компонентов
- Форма написания отзыва (ReviewFormModal)
- Сортировка: по дате / по рейтингу / по полезности
- Фильтрация: только положительные / отрицательные
- Пагинация

---

### 5.6 Favorites (Избранное) — `/favorites`

**Файл:** `src/pages/Favorites.jsx`

**Элементы:**
- Заголовок с кол-вом фильмов в избранном
- Сетка MovieCard
- Кнопка удаления из избранного на каждой карточке
- Пустое состояние: иллюстрация + CTA «Перейти в каталог»
- Сортировка: по дате добавления / по рейтингу / по алфавиту
- Возможность создания именованных коллекций (будущее)

**Хуки:** `useFavorites`

---

### 5.7 History (История) — `/history`

**Файл:** `src/pages/History.jsx`

**Элементы:**
- Группировка по дате (Сегодня / Вчера / Эта неделя / Ранее)
- Карточки с прогресс-баром просмотра
- Кнопка «Продолжить» / «Смотреть заново»
- Кнопка очистки истории (с confirm-диалогом)
- Локальное хранение через `localHistory.js`

**Хуки:** локальный стейт + `localHistory.js`

---

### 5.8 Profile (Профиль) — `/profile`

**Файл:** `src/pages/ProfilePage.jsx`

**Вкладки:**

1. **Обо мне** — аватар, имя, email, дата регистрации, статус подписки
2. **Активность** — статистика: фильмов просмотрено, часов, любимый жанр, средний рейтинг
3. **Отзывы** — все написанные отзывы
4. **Достижения** — бейджи (первый просмотр, 100 фильмов, и т.д.)

**Хуки:** `useUserProfile`, `useAuth`

---

### 5.9 Settings (Настройки) — `/settings`

**Файл:** `src/pages/SettingsPage.jsx`

**Секции:**

1. **Аккаунт** — смена имени, email, пароля
2. **Внешний вид** — тёмная/светлая тема, язык интерфейса
3. **Уведомления** — email / push
4. **Качество** — автоматически / 4K / 1080p / 720p
5. **Субтитры** — язык субтитров по умолчанию
6. **Конфиденциальность** — история, cookies
7. **Опасная зона** — удаление аккаунта

**Хуки:** `useUserSettings`, `useTheme`

---

### 5.10 Subscription (Подписка) — `/subscription`

**Файл:** `src/pages/SubscriptionPage.jsx`

**Элементы:**
- 3 карточки тарифов (Free / Standard / Pro)
- Сравнительная таблица возможностей
- CTA кнопки
- Текущий статус подписки
- История платежей
- Кнопка отмены подписки

**Хуки:** `useSubscription`

---

### 5.11 AddMovie (Добавление фильма) — `/admin/add-movie`

**Файл:** `src/pages/AddMovie.jsx` *(только для admin)*

**Поля формы:**
- Название (ru) / Оригинальное название
- Год / Длительность / Возрастной рейтинг
- Описание
- Жанры (мультиселект)
- Постер URL / загрузка файла
- Видеофайл / URL стрима
- Страна / Язык
- Режиссёр / Актёры (теги)
- IMDb ID / Metacritic score

---

### 5.12 AdminAnalytics (Аналитика) — `/admin/analytics`

**Файл:** `src/pages/AdminAnalytics.jsx` *(только для admin)*

**Графики:**
1. Распределение фильмов по годам (Bar chart)
2. Топ-5 жанров (Doughnut chart)
3. Активность пользователей по дням (Line chart)
4. Топ-10 фильмов по просмотрам (Horizontal bar)
5. Конверсия в подписку (Funnel chart)
6. Казахстанский контент vs зарубежный (Pie chart)

**Фильтры:**
- По периоду: 7 дней / 30 дней / 3 месяца / год / всё время
- По типу контента: фильм / сериал / аниме

**Хуки:** данные из `GET /api/analytics/*`

---

### 5.13 UserActivityPage — `/activity`

**Файл:** `src/pages/UserActivityPage.jsx`

- График активности за 30 дней (commits-style heatmap)
- Статистика: часов просмотра / фильмов / отзывов
- Любимые жанры (radar chart)
- Любимые режиссёры / актёры

---

### 5.14 Login — `/login`

**Файл:** `src/pages/Login.jsx`

- Glassmorphism форма по центру экрана
- Email + Password
- «Запомнить меня»
- Ссылка на регистрацию
- Кнопка входа + Google OAuth (будущее)
- Анимация: fade-in + slide-up

---

### 5.15 Register — `/register`

**Файл:** `src/pages/Register.jsx`

- Имя / Email / Пароль / Подтверждение пароля
- Прогресс надёжности пароля
- Checkbox: согласие с условиями
- Верификация email (будущее)

---

## 6. ВСЕ КОМПОНЕНТЫ — ДЕТАЛЬНОЕ ТЗ

### 6.1 Header (Навигация)

**Файл:** `src/components/Header.jsx`

```
Состав:
- Logo: "CINE" + "VERSE" (gold)
- Nav links: Фильмы / Сериалы / Аниме / Жанры / Новинки
- Search icon → открывает SearchOverlay
- User menu: аватар → dropdown (профиль / настройки / выход)
- Подписка badge (Pro)

Поведение:
- Sticky at top
- При скролле > 60px: добавляет glassmorphism background
- На мобильном: hamburger menu
- Active link подсвечивается золотом
```

### 6.2 Sidebar

**Файл:** `src/components/Sidebar.jsx`

```
Показывается: только на десктопе (> 1200px), боковая навигация
Содержимое: иконки + подписи разделов
Позиция: fixed left, 240px width
```

### 6.3 HeroCarousel

**Файл:** `src/components/HeroCarousel.jsx`

```
Механика:
- Автоматическая смена каждые 6 секунд
- Ручное управление: стрелки + точки
- Плавный transition (fade или slide)
- Пауза при hover

Каждый слайд:
- Постер фильма (правая половина)
- Gradient overlay
- Badge (Премьера / Новинка)
- Название (Bebas Neue)
- Метаданные (рейтинг, год, жанры)
- Кнопки action
```

### 6.4 MovieCard

**Файл:** `src/components/MovieCard.jsx`

```
Props:
- movie: { id, title, year, genre, rating, posterUrl, progress? }
- showProgress?: boolean
- onFavorite?: function

Состояния:
- Default: постер + info под ним
- Hover: overlay с кнопкой play, translateY(-6px) scale(1.03)
- In-progress: progress bar снизу

Размеры:
- Small: 140×200px (carousel)
- Default: 180×264px
- Large: 220×320px (featured)
```

### 6.5 MovieGrid

**Файл:** `src/components/MovieGrid.jsx`

```
Раскладка: CSS Grid, auto-fill, minmax(180px, 1fr)
Состояния: loading skeleton / empty state / data
Загрузка: skeleton animation (shimmer effect)
Пустое: иллюстрация + текст
```

### 6.6 PlayerPlaceholder → VideoPlayer (редизайн)

**Файл:** `src/components/PlayerPlaceholder.jsx` → переименовать в `VideoPlayer.jsx`

```
Текущее: просто заглушка
Нужно:
- HTML5 <video> тег
- Кастомные контролы (play/pause, seek, volume, fullscreen)
- Preview thumbnails при hover на seek bar
- Субтитры (WebVTT)
- Выбор качества (если HLS стрим)
- Пикча-в-картинке (PiP)
- Keyboard shortcuts (Space, ←/→, F, M)
- Сохранение позиции каждые 30 сек
```

### 6.7 RatingStars

**Файл:** `src/components/RatingStars.jsx`

```
Props: rating (0–10), interactive (boolean), size
Рендер: 5 звёзд, заполнение пропорционально
Интерактив: hover highlight + click для оценки
```

### 6.8 ReviewCard

**Файл:** `src/components/ReviewCard.jsx`

```
Содержимое:
- Аватар + имя автора
- Дата
- Рейтинг (звёзды)
- Заголовок отзыва
- Текст (с expand/collapse при > 3 строк)
- Кнопки: Полезно? / Пожаловаться
```

### 6.9 ReviewFormModal

**Файл:** `src/components/ReviewFormModal.jsx`

```
Поля:
- Заголовок
- Рейтинг (звёзды, кликабельные)
- Текст отзыва (textarea, min 50 символов)

Валидация: минимум слов, антиспам
```

### 6.10 CommentsSection

**Файл:** `src/components/comments/CommentsSection.jsx`

```
Содержимое:
- Поле ввода нового комментария
- Список CommentItem (с вложенностью)
- Сортировка: новые/старые/популярные
- Загрузка ещё (load more)
```

### 6.11 RecommendationsRail

**Файл:** `src/components/RightRail/RecommendationsRail.jsx`

```
Позиция: справа от плеера или под основным контентом
Содержимое: 5–10 MovieCard (маленький размер)
Логика: похожие по жанру + рейтингу + истории просмотра
```

### 6.12 SearchOverlay (НОВЫЙ)

```
Файл: src/components/SearchOverlay.jsx

Открывается при клике на иконку поиска в Header
- Full-screen overlay с glassmorphism
- Input с фокусом
- Дебаунс 300ms перед запросом
- Live results: фильмы + жанры + актёры
- Подсветка совпадений в названии
- Keyboard nav: ↑↓ по результатам, Enter — переход
- История поиска (localStorage)
- Быстрые теги: Популярное / Топ рейтинга
```

---

## 7. ВСЕ ХУКИ И API

### 7.1 useAuth.js

```javascript
// Возвращает:
{
  user: { username, role, email },
  isAuthenticated: boolean,
  isAdmin: boolean,
  login(credentials),
  logout(),
  register(data)
}

// Хранит: localStorage['token', 'role', 'username']
// ЗАДАЧА: добавить refresh-токен логику
```

### 7.2 useMovies.js

```javascript
// Параметры: { genre, year, sort, page, search, type }
// Возвращает: { movies, isLoading, error, totalPages, currentPage }
// Кэш: React Query, staleTime: 5 минут
```

### 7.3 useMovie.js

```javascript
// Параметр: movieId
// Возвращает: { movie, isLoading, error }
// Включает: маппинг через entities/movie/mapper.js
```

### 7.4 useFavorites.js

```javascript
// Возвращает:
{
  favorites: Movie[],
  isFavorite(movieId): boolean,
  addFavorite(movieId),
  removeFavorite(movieId),
  toggleFavorite(movieId)
}

// Синхронизация: localStorage + API (если авторизован)
```

### 7.5 useComments.js

```javascript
// Параметр: movieId
// Возвращает: { comments, addComment(text), isLoading }
// Оптимистичное обновление через React Query
```

### 7.6 useRecommendations.js

```javascript
// Параметр: movieId (или null для главной)
// Логика: на основе жанра + рейтинга + истории просмотра пользователя
// Возвращает: { recommendations: Movie[], isLoading }
```

### 7.7 useSubscription.js

```javascript
// Возвращает:
{
  plan: 'free' | 'standard' | 'pro',
  expiresAt: Date,
  isPro: boolean,
  subscribe(plan),
  cancel()
}
```

### 7.8 useSearch (ДОБАВИТЬ)

```javascript
// Параметр: query (string)
// Дебаунс: 300ms
// Возвращает: { results: { movies, genres, actors }, isLoading }
// API: GET /api/search?q=xxx
```

### 7.9 useTheme.js

```javascript
// Возвращает: { theme: 'dark'|'light', toggleTheme() }
// Хранит: localStorage['theme']
// Применяет: data-theme атрибут на <html>
```

---

## 8. ФИЧИ И ИДЕИ — ПОЛНЫЙ СПИСОК

### 8.1 Реализованные фичи ✅

- [x] Каталог фильмов с карточками
- [x] Hero карусель на главной
- [x] Авторизация (JWT)
- [x] Роли (user / admin)
- [x] Избранное
- [x] История просмотров (localStorage)
- [x] Отзывы и рейтинги
- [x] Комментарии
- [x] Рекомендации (базовые)
- [x] Профиль пользователя
- [x] Настройки (тема, язык)
- [x] Подписка
- [x] Admin: добавление фильма
- [x] Admin: аналитика (Chart.js)
- [x] Жанры
- [x] Docker

### 8.2 В разработке / Нужно доделать 🔄

- [ ] Реальный видеоплеер (замена плейсхолдера)
- [ ] Поиск с дебаунсом и SearchOverlay
- [ ] Редизайн всего в Dark Luxury стиле
- [ ] Refresh-токен
- [ ] Полноценный маппинг данных TMDB

### 8.3 Запланированные фичи 📋

#### UX / Интерфейс
- [ ] Анимация загрузки страниц (skeleton screens везде)
- [ ] Drag-and-drop плейлисты
- [ ] Кастомные коллекции (не просто «Избранное»)
- [ ] Уведомления (новинки / продолжения)
- [ ] Режим «Не беспокоить» во время просмотра
- [ ] Интерактивная карта казахстанских фильмов
- [ ] Таймлайн истории просмотров (heatmap)

#### Плеер
- [ ] HLS стриминг (hls.js)
- [ ] Адаптивное качество (ABR)
- [ ] Субтитры (WebVTT, несколько языков)
- [ ] Пикча-в-картинке (PiP API)
- [ ] Keyboard shortcuts
- [ ] Preview thumbnails при скрабе

#### Социальные функции
- [ ] Совместный просмотр (Watch Party) — WebSocket
- [ ] Реакции на моменты фильма (timestamp-based)
- [ ] Шаринг конкретного момента фильма
- [ ] Рейтинг-бои (выбор лучшего из двух)
- [ ] Следить за пользователями / друзья

#### Персонализация
- [ ] AI-рекомендации (интеграция с AI-сервисом бэкенда)
- [ ] Taste profile: опрос при первом входе (5 жанров)
- [ ] Mood-based: «Хочу посмотреть что-то весёлое»
- [ ] Напоминания: «Ты не досмотрел Дюну»

#### Аналитика (для admin)
- [ ] Real-time дашборд (WebSocket)
- [ ] Казахстанский контент: отдельный раздел
- [ ] Воронка конверсии в подписку
- [ ] A/B тест баннеров
- [ ] Heatmap кликов

#### Техническое
- [ ] PWA (offline режим + установка на мобильный)
- [ ] i18n: русский / казахский / английский
- [ ] Swagger-клиент (автогенерация из OpenAPI)
- [ ] E2E тесты (Playwright)
- [ ] Unit тесты (Vitest)
- [ ] Мониторинг ошибок (Sentry)
- [ ] Web Vitals: LCP < 2.5s, FID < 100ms

### 8.4 Идеи для дипломной работы 🎓

- [ ] Раздел «Казахстанское кино» с историей и аналитикой
- [ ] Диаграмма: как менялся жанровый вкус казахстанцев по годам
- [ ] ML-модель рекомендаций (объяснение в дипломе)
- [ ] Сравнение: что смотрят в Алматы vs Астана (если есть геоданные)

---

## 9. ДИЗАЙН-РЕФЕРЕНСЫ И UI-ИДЕИ

### 9.1 Референсы существующих платформ

| Платформа | Что взять | URL |
|---|---|---|
| **MUBI** | Минималистичный dark UI, editorial подход к карточкам, serif типографика | mubi.com |
| **Letterboxd** | Тёмная тема, сетка постеров, метаданные фильма | letterboxd.com |
| **Criterion Collection** | Editorial раскладка, luxury брендинг, описания | criterion.com |
| **Apple TV+** | Liquid Glass эффекты, плавные анимации постеров | tv.apple.com |
| **Marvel Studios** | Кинематографические hero с parallax | marvel.com |
| **Dribbble / Dark Glass UI** | Glassmorphism паттерны для навигации | dribbble.com |

### 9.2 Специфические UI-идеи

#### Hero секция
- Постер не просто картинка — за ним глубина: несколько слоёв blur + ambient light
- Название фильма «выжигается» на экране как в трейлерах
- Субтитр курсивом намекает на атмосферу фильма

#### Карточки фильмов
- При hover — вместо простого zoom, карточка «открывается»: снизу появляется описание
- Рейтинг отображается золотым числом, не звёздами
- Прогресс просмотра — тонкая золотая линия снизу, не банальный серый бар

#### Страница фильма
- Цвет акцента меняется под палитру постера (Color Thief.js)
- Ambient light на фоне — отражение цветов постера
- Актёры — не просто список, а горизонтальная карусель с карточками

#### Поиск
- SearchOverlay размывает контент под ним
- Результаты появляются с stagger-анимацией
- Совпадение подсвечивается золотом, не жёлтым

#### Аналитика (admin)
- Графики в тёмной теме с золотыми линиями
- Анимированное появление данных при загрузке
- KPI карточки с глассморфизм-эффектом

### 9.3 Типичные ошибки которых нужно избежать

- ❌ Белый фон где-либо
- ❌ Синий цвет как акцент (типично для Bootstrap)
- ❌ Шрифты Inter / Roboto / Arial
- ❌ Карточки без hover-эффекта
- ❌ Градиент purple-on-white (клише AI-дизайна)
- ❌ Иконки Material Icons (слишком Google-стиль)
- ❌ Box shadow вместо glassmorphism

---

## 10. ДОРОЖНАЯ КАРТА И ЗАДАЧИ С ДАТАМИ

### ЭТАП 1 — Редизайн (Май 2026)

| Задача | Дата | Приоритет | Статус |
|---|---|---|---|
| Установить Bebas Neue + DM Sans + DM Serif | 05.05.2026 | 🔴 | ⬜ |
| Создать `theme.css` с CSS-переменными (Dark Luxury) | 05.05.2026 | 🔴 | ⬜ |
| Переработать `Header.jsx` — glassmorphism navbar | 06.05.2026 | 🔴 | ⬜ |
| Переработать `HeroCarousel.jsx` — cinematic style | 07.05.2026 | 🔴 | ⬜ |
| Переработать `MovieCard.jsx` — новый hover, рейтинг | 08.05.2026 | 🔴 | ⬜ |
| Переработать `Home.jsx` — все секции | 09–10.05.2026 | 🔴 | ⬜ |
| Переработать `MovieDetails.jsx` — hero + sidebar | 11–12.05.2026 | 🔴 | ⬜ |
| Переработать Auth страницы (Login/Register) | 13.05.2026 | 🔴 | ⬜ |
| Переработать `ProfilePage.jsx` | 14.05.2026 | 🟡 | ⬜ |
| Переработать `SubscriptionPage.jsx` | 15.05.2026 | 🟡 | ⬜ |
| Переработать `AdminAnalytics.jsx` | 16.05.2026 | 🟡 | ⬜ |
| Адаптив (mobile breakpoints) | 17–18.05.2026 | 🔴 | ⬜ |
| QA редизайна | 19.05.2026 | 🔴 | ⬜ |

### ЭТАП 2 — Новые фичи (Май–Июнь 2026)

| Задача | Дата | Приоритет | Статус |
|---|---|---|---|
| Создать `SearchOverlay.jsx` с дебаунсом | 20.05.2026 | 🔴 | ⬜ |
| Добавить `useSearch.js` хук | 20.05.2026 | 🔴 | ⬜ |
| Добавить API `GET /api/search` | 21.05.2026 | 🔴 | ⬜ |
| Реальный VideoPlayer (HTML5 + custom controls) | 22–25.05.2026 | 🔴 | ⬜ |
| Сохранение позиции просмотра | 25.05.2026 | 🔴 | ⬜ |
| Keyboard shortcuts в плеере | 26.05.2026 | 🟡 | ⬜ |
| Refresh-токен + silent refresh | 27.05.2026 | 🔴 | ⬜ |
| Skeleton screens на всех страницах | 28–29.05.2026 | 🟡 | ⬜ |
| Toast уведомления | 30.05.2026 | 🟡 | ⬜ |

### ЭТАП 3 — Полировка (Июнь 2026)

| Задача | Дата | Приоритет | Статус |
|---|---|---|---|
| i18n ru/kz/en (react-i18next) | 01–05.06.2026 | 🟡 | ⬜ |
| PWA (manifest + service worker) | 06–08.06.2026 | 🟢 | ⬜ |
| E2E тесты (Playwright) — критические пути | 09–12.06.2026 | 🟡 | ⬜ |
| Unit тесты (Vitest) — хуки и утилиты | 13–15.06.2026 | 🟡 | ⬜ |
| Lighthouse audit → Core Web Vitals | 16.06.2026 | 🔴 | ⬜ |
| Sentry интеграция | 17.06.2026 | 🟢 | ⬜ |
| GitHub Actions CI/CD | 18–19.06.2026 | 🔴 | ⬜ |
| Deploy на Vercel (production) | 20.06.2026 | 🔴 | ⬜ |
| Финальное QA | 21–23.06.2026 | 🔴 | ⬜ |

### ЭТАП 4 — Дипломные фичи (Июнь–Июль 2026)

| Задача | Дата | Приоритет | Статус |
|---|---|---|---|
| Раздел «Казахстанское кино» | 25–28.06.2026 | 🔴 | ⬜ |
| Интеграция AI-рекомендаций с бэком | 29.06–02.07.2026 | 🔴 | ⬜ |
| Taste Profile (опрос жанров при регистрации) | 03.07.2026 | 🟡 | ⬜ |
| Аналитика казахстанского рынка (графики) | 04–06.07.2026 | 🔴 | ⬜ |
| Финальный README и документация | 07–08.07.2026 | 🔴 | ⬜ |
| Сдача дипломной работы | 10.07.2026 | 🔴 | ⬜ |

---

## 11. ТЕХНИЧЕСКИЕ ЗАДАЧИ И БАГИ

### 11.1 Критические (исправить немедленно)

| # | Баг / Задача | Файл | Решение |
|---|---|---|---|
| B-001 | `PlayerPlaceholder` — не реальный плеер | `PlayerPlaceholder.jsx` | Переписать на HTML5 + custom controls |
| B-002 | Нет refresh-токена — пользователь вылетает через час | `useAuth.js`, `http.js` | Добавить interceptor на 401 + `POST /api/auth/refresh` |
| B-003 | `db.json` пустой — json-server не работает | `db.json` | Либо удалить, либо наполнить моками |
| B-004 | `Search overlay не подсвечивает` (указано в README) | `SearchOverlay` | Экранировать HTML в `dangerouslySetInnerHTML` |
| B-005 | История берётся только из localStorage — не синхронизируется с сервером | `localHistory.js` | Добавить sync с API при авторизации |

### 11.2 Средние

| # | Задача | Приоритет |
|---|---|---|
| T-001 | Добавить `React.memo` в `MovieGrid` | 🟡 |
| T-002 | `useMemo` для отфильтрованных списков | 🟡 |
| T-003 | Lazy-loading всех страниц через `React.lazy` | 🟡 |
| T-004 | Добавить `ErrorBoundary` компонент | 🟡 |
| T-005 | Убрать `node_modules` из git (уже в .gitignore?) | 🟡 |
| T-006 | Удалить `*.zip` архивы из репозитория | 🟢 |
| T-007 | Настроить ESLint + Prettier | 🟢 |
| T-008 | Добавить `VITE_TMDB_API_KEY` для реальных постеров | 🟡 |

### 11.3 Структура папок — что нужно добавить

```
src/
├── context/               ← добавить если ещё нет
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── HistoryContext.jsx
├── components/
│   ├── SearchOverlay.jsx  ← ДОБАВИТЬ
│   ├── VideoPlayer.jsx    ← ДОБАВИТЬ
│   ├── Toast.jsx          ← ДОБАВИТЬ
│   ├── Skeleton.jsx       ← ДОБАВИТЬ
│   ├── ErrorBoundary.jsx  ← ДОБАВИТЬ
│   └── Modal.jsx          ← универсальный модал
└── hooks/
    ├── useSearch.js       ← ДОБАВИТЬ
    ├── useVideoPlayer.js  ← ДОБАВИТЬ
    └── useToast.js        ← ДОБАВИТЬ
```

---

## 12. CI/CD И ДЕПЛОЙ

### 12.1 GitHub Actions (настроить)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [Orka]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 12.2 Vercel конфигурация

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "env": {
    "VITE_API_URL": "@vite-api-url"
  }
}
```

### 12.3 Docker (уже есть)

```bash
# Сборка
docker build -t cineverse-frontend .

# Запуск
docker run -p 3000:80 \
  -e VITE_API_URL=http://backend:8080 \
  cineverse-frontend
```

### 12.4 Environments

| Env | URL | API |
|---|---|---|
| Development | localhost:5173 | localhost:8080 |
| Staging | staging.cineverse.kz | api-staging.cineverse.kz |
| Production | cineverse.kz | api.cineverse.kz |

---

## 13. БЭКЛОГ И БУДУЩИЕ ИДЕИ

### 13.1 V2.0 — После диплома

- **Watch Party** — синхронный совместный просмотр через WebSocket
- **Timestamp-реакции** — оставлять эмодзи в конкретные моменты фильма
- **Кино-клубы** — группы пользователей с совместным обсуждением
- **Рейтинг-бои** — «Что лучше: Интерстеллар или Дюна?»
- **Мобильное приложение** — React Native
- **Казахстанская библиотека** — отдельный эксклюзивный раздел
- **Swagger API клиент** — автогенерация из OpenAPI
- **Telegram-бот** — уведомления о новинках

### 13.2 Идеи для маркетинга

- Лендинг страница для привлечения пользователей
- Email-рассылка: «Ваш дайджест за неделю»
- Промокоды на подписку
- Реферальная программа

### 13.3 Технический долг

| Долг | Оценка сложности |
|---|---|
| Переписать на TypeScript | Высокая |
| Перейти на Zustand вместо множества хуков | Средняя |
| Micro-frontend архитектура | Очень высокая |
| GraphQL вместо REST | Высокая |

---

## QUICK START

```bash
# Клонировать и запустить
git clone https://github.com/RabotnikPolson/main-frontend
cd main-frontend
git checkout Orka
npm install
npm run dev
# → http://localhost:5173

# Переменные окружения
cp .env.example .env
# Прописать VITE_API_URL=http://localhost:8080

# Сборка
npm run build
npm run preview
```

---

## СТРУКТУРА КОММИТОВ (конвенция)

```
feat:     новая фича
fix:      исправление бага
refactor: рефакторинг
style:    изменения CSS/дизайна
docs:     документация
test:     тесты
chore:    прочее (зависимости, конфиг)

Примеры:
feat: add SearchOverlay with debounce
fix: refresh token interceptor on 401
style: redesign Header with glassmorphism
refactor: replace PlayerPlaceholder with VideoPlayer
```

---

> **Последнее обновление:** 03.05.2026  
> **Автор:** RabotnikPolson / Murat  
> **Статус проекта:** В активной разработке 🚀  
> **Ветка:** `Orka`  
> **Цель:** Дипломная защита — июль 2026
