import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

let pwaPlugin = null;
try {
  const { VitePWA } = await import("vite-plugin-pwa");
  pwaPlugin = VitePWA({
    registerType: "autoUpdate",
    includeAssets: ["favicon.png", "robots.txt", "apple-touch-icon.png"],
    manifest: {
      name: "Chauhaan Computers",
      short_name: "Chauhaan",
      description: "Shop laptops, PCs, peripherals and IT services.",
      theme_color: "#0ea5e9",
      background_color: "#ffffff",
      display: "standalone",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "logo-icon.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "logo-icon.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any"
        }
      ]
    }
  });
} catch (error) {
  console.warn("vite-plugin-pwa not found, skipping PWA setup.", error);
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  let pwaPlugin = null;
  try {
    const { VitePWA } = await import("vite-plugin-pwa");
    pwaPlugin = VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Chauhaan Computers",
        short_name: "Chauhaan",
        description: "Shop laptops, PCs, peripherals and IT services.",
        theme_color: "#0ea5e9",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "logo-icon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "logo-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    });
  } catch (error) {
    console.warn("vite-plugin-pwa not found, skipping PWA setup.", error);
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      pwaPlugin,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
