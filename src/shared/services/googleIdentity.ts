// Reemplaza a `firebase/auth`. Usa Google Identity Services (GIS) para
// obtener un idToken de Google, que luego se envía al backend propio
// (`POST /api/auth/google`) para validar e iniciar sesión.
//
// Requiere el script de GIS cargado en index.html:
//   <script src="https://accounts.google.com/gsi/client" async defer></script>
//
// GIS no tiene un equivalente exacto a `signInWithPopup`: la forma
// confiable de abrir el selector de cuenta desde un clic explícito es
// renderizar el botón nativo de Google (invisible) y simular un click
// sobre él. El One Tap (`prompt()`) es más frágil para este caso porque
// varios navegadores lo bloquean fuera de una interacción directa.

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
let hiddenContainer: HTMLDivElement | null = null;

function waitForGoogleScript(timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error("No se pudo cargar Google Identity Services"));
      }
    }, 50);
  });
}

/**
 * Abre el selector de cuenta de Google y resuelve con el idToken (JWT
 * firmado por Google) que el backend valida en `/auth/google`.
 * Debe llamarse dentro del handler de un click del usuario.
 */
export async function requestGoogleIdToken(): Promise<string> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Falta configurar VITE_GOOGLE_CLIENT_ID");
  }

  await waitForGoogleScript();

  return new Promise<string>((resolve, reject) => {
    window.google!.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response?.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("Google no devolvió credenciales"));
        }
      },
    });

    if (!hiddenContainer) {
      hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "fixed";
      hiddenContainer.style.top = "-9999px";
      hiddenContainer.style.left = "-9999px";
      document.body.appendChild(hiddenContainer);
    }
    hiddenContainer.innerHTML = "";
    window.google!.accounts.id.renderButton(hiddenContainer, { type: "standard" });

    const nativeButton = hiddenContainer.querySelector<HTMLElement>('div[role="button"]');
    if (!nativeButton) {
      reject(new Error("No se pudo inicializar el botón de Google"));
      return;
    }
    nativeButton.click();
  });
}
