// Yurguen: varias entradas HTML (inicio, empresa, contacto) para páginas separadas en el build.
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Yurguen: base siempre '/' porque el sitio usa dominio propio (fygferreteros.com) y se sirve desde la raíz.
export default defineConfig(() => ({
  root: '.',
  publicDir: 'public',
  base: '/',
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
});