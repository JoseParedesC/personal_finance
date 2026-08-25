import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { loginWithGoogle, loading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleGoogleLogin() {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
    } catch {
      // El mensaje de error ya se muestra desde AuthContext.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f4f1ea,_#ebf0f4_35%,_#dfe7ef_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-line bg-paper p-8 shadow-card sm:p-10">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-xl font-bold text-paper">
            F
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Mis Finanzas</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate">personales</p>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">Inicia sesión</h1>
          <p className="mt-2 text-sm text-slate">
            Administra tus ingresos, gastos y resúmenes con tu cuenta de Google.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        <Button
          type="button"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={loading || isSubmitting}
          className="bg-ink text-paper hover:bg-ink/90"
        >
          {isSubmitting ? "Conectando..." : "Continuar con Google"}
        </Button>

        <div className="mt-6 border-t border-line pt-5 text-center text-xs text-slate">
          Tus datos se guardan por usuario en tu cuenta.
        </div>
      </div>
    </div>
  );
}
