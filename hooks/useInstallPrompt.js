import { useEffect, useState } from 'react';

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

  // Manejador para el evento 'beforeinstallprompt'
  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault(); // Prevenir que el navegador muestre el prompt automáticamente
    setDeferredPrompt(event); // Almacenar el evento para usarlo posteriormente
  };

  // Manejador para el evento 'appinstalled'
  const handleAppInstalled = () => {
    setIsPWAInstalled(true); // Indicar que la aplicación está instalada
    setDeferredPrompt(null); // Limpiar el deferredPrompt ya que ya no se necesita
  };

  // Función para verificar si la PWA está instalada
  const checkIfPWAInstalled = () => {
    setIsPWAInstalled(
      window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone
    );
  };

  // Función para mostrar el prompt de instalación de la PWA
  const promptInstall = async () => {
    try {
      if (deferredPrompt) {
        // Mostrar el prompt de instalación después de un pequeño retraso
        setTimeout(async () => {
          deferredPrompt.prompt(); // Mostrar el prompt de instalación
          const choiceResult = await deferredPrompt.userChoice;
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
            setIsPWAInstalled(true); // Cambiar el estado a instalado
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          setDeferredPrompt(null); // Limpiar el evento diferido
        }, 200);
      }
    } catch (error) {
      console.error(
        'Error al intentar mostrar el prompt de instalación:',
        error
      );
    }
  };

  useEffect(() => {
    // Registrar el evento 'beforeinstallprompt'
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Registrar el evento 'appinstalled'
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar y registrar el Service Worker al cargar la aplicación
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker registrado correctamente'))
        .catch((error) =>
          console.error('Fallo al registrar el Service Worker:', error)
        );
    }

    // Verificar el estado de la PWA después de que la página se haya cargado completamente
    checkIfPWAInstalled();

    // Limpiar event listeners al desmontar el componente
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return {
    isPWAInstalled,
    promptInstall,
  };
}
