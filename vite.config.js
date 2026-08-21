import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Railway sirve la aplicación desde la raíz del dominio que asigna
// (o desde un dominio propio si se configura uno), así que no hace
// falta una subruta como en GitHub Pages.
export default defineConfig({
    plugins: [react()],
    base: "/",
});
