import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: 'public', // Ensure public directory is served
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        title: path.resolve(__dirname, 'public/slides/title.html'),
        vision_mission: path.resolve(__dirname, 'public/slides/vision_mission.html'),
        core_principles: path.resolve(__dirname, 'public/slides/core_principles.html'),
        current_architecture: path.resolve(__dirname, 'public/slides/current_architecture.html'),
        technical_stack: path.resolve(__dirname, 'public/slides/technical_stack.html'),
        data_flow: path.resolve(__dirname, 'public/slides/data_flow.html'),
        security_privacy: path.resolve(__dirname, 'public/slides/security_privacy.html'),
        future_architecture: path.resolve(__dirname, 'public/slides/future_architecture.html'),
        microservices_evolution: path.resolve(__dirname, 'public/slides/microservices_evolution.html'),
        plugin_system: path.resolve(__dirname, 'public/slides/plugin_system.html'),
        ai_evolution: path.resolve(__dirname, 'public/slides/ai_evolution.html'),
        conclusion: path.resolve(__dirname, 'public/slides/conclusion.html'),
      },
    },
  },
})


