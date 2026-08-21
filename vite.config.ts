import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El nombre del repositorio se toma de una variable de entorno para
// facilitar el despliegue en GitHub Pages sin tener que tocar este
// archivo cada vez que el proyecto cambie de repositorio.
// En GitHub Actions se exporta automáticamente como el nombre del repo.
const repoName = process.env.VITE_BASE_PATH || "finanzas-personales";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? `/${repoName}/` : "/",
}));
