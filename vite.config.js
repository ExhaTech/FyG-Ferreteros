// Yurguen: varias entradas HTML (inicio, empresa, contacto) para páginas separadas en el build.
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Yurguen: en producción base = repo GitHub Pages (https://marco-cz.github.io/Ferreteria/); en dev queda '/' .
export default defineConfig(({ mode }) => ({
  root: '.',
  publicDir: 'public',
  base: mode === 'production' ? '/Ferreteria/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        empresa: resolve(__dirname, 'empresa.html'),
        contacto: resolve(__dirname, 'contacto.html'),
      },
    },
  },
}));
