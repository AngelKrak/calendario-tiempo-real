export default function manifest() {
  return {
    background_color: '#f7f7f7',
    description: 'Calendario mensual para los Daily',
    dir: 'ltr',
    display: 'standalone',
    name: 'Calendario para Daily',
    orientation: 'any',
    short_name: 'Calendario Daily',
    start_url: '/?utm_medium=PWA&utm_source=launcher',
    id: 'calendar-daily',
    theme_color: '#f5f5f5',
    lang: 'es',
    prefer_related_applications: false,
    display_override: ['fullscreen', 'standalone', 'window-controls-overlay'],
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/assets/android-icon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
        density: '0.75',
      },
      {
        src: '/assets/android-icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
        density: '1.0',
      },
      {
        src: '/assets/android-icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        density: '1.5',
      },
      {
        src: '/assets/android-icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        density: '2.0',
      },
      {
        src: '/assets/android-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        density: '3.0',
      },
      {
        src: '/assets/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        density: '4.0',
      },
      {
        src: '/assets/android-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    splash_screens: [
      {
        src: '/assets/android-icon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    screenshots: [
      {
        src: '/assets/screenshots/screen1.png',
        sizes: '1897x872',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/assets/screenshots/mobile.png',
        sizes: '387x838',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
  };
}
