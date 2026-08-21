import { useEffect, useState } from "react";
import { Button } from "../components/common/Button";
import { GOOGLE_CLIENT_ID, type AuthUser } from "../services/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              width?: number | string;
              text?: string;
              shape?: "rectangular" | "pill";
              logo_alignment?: "left" | "center";
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

function decodeGoogleUser(credential: string) {
  const payload = credential.split(".")[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const decoded = window.atob(padded);
  const json = JSON.parse(decoded) as {
    name?: string;
    email?: string;
    picture?: string;
  };

  return {
    name: json.name ?? "Usuario",
    email: json.email ?? "usuario@gmail.com",
    picture: json.picture,
  };
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Falta la variable VITE_GOOGLE_CLIENT_ID. Agregala en tu archivo .env.local para habilitar Google Sign-In.");
      return;
    }

    let script = document.querySelector<HTMLScriptElement>("script[data-google-auth='true']");

    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleAuth = "true";
      document.body.appendChild(script);
    }

    const initializeGoogle = () => {
      const google = window.google;
      const button = document.getElementById("google-signin-button");

      if (!google?.accounts?.id || !button) {
        return;
      }

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          const userData = decodeGoogleUser(response.credential);
          onLogin({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            provider: "google",
          });
        },
      });

      google.accounts.id.renderButton(button, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "signin_with",
        shape: "pill",
        logo_alignment: "left",
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    script.onload = initializeGoogle;
  }, [onLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f4f1ea,_#ebf0f4_35%,_#dfe7ef_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-line bg-paper p-8 shadow-card sm:p-10">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-xl font-bold text-paper">
            F
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Finanzas</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate">personales</p>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">Inicia sesión</h1>
          <p className="mt-2 text-sm text-slate">
            Usa tu cuenta de Google para acceder a tus movimientos y resúmenes.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        <div className="flex justify-center">
          <div id="google-signin-button" className="min-h-[44px]" />
        </div>

        <div className="mt-6 border-t border-line pt-5 text-center text-xs text-slate">
          Tu sesión se guarda localmente en este navegador.
        </div>

        {!GOOGLE_CLIENT_ID ? (
          <div className="mt-5">
            <Button variant="secondary" fullWidth disabled>
              Google no configurado
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
