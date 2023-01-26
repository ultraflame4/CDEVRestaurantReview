import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from "path";

dotenv.config()

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [react()],

    build: {
        manifest: true,
        cssCodeSplit: true,

    },
    server: {
        port: process.env.VITE_DEV_PORT,
        proxy: {
            "/api": {
                target: `http://localhost:${process.env.VITE_EXPRESS_PORT}`,
                changeOrigin: true,
                secure: false,
                followRedirects: true,

                ws: true,
                rewrite: (path) => path.replace(/^\/app/, ''),
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "reactClient")
        }
    },
    base: "/app"
})
