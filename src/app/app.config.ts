import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter, withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions
} from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    // Оставляем: склейка событий уменьшает лишние прогонки CD
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Роутер + полезные опции
    provideRouter(
      routes,

      // 1) Плавные переходы между страницами (использует View Transitions API; где нет — тихо no-op)
      withViewTransitions(),

      // 2) Возврат позиции скролла и прокрутка к якорям
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),

      // 3) Привязка параметров маршрута к @Input() компонентов
      //    Можно написать: @Input() id!: string; и получить из /project/:id
      withComponentInputBinding(),
    ),

    // 4) Если планируешь Angular-анимации (или UI-библиотеку, что их требует) — оставь.
    //    Для Tailwind/daisyUI не обязательно.
    // provideAnimations(),
  ],
};
