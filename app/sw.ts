import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkFirst, StaleWhileRevalidate, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // 1. App Shell (Stale-While-Revalidate)
    {
      matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css|css|js)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "amankarsa-app-shell",
      }),
    },
    // 2. The Pulse & API (Network-First with Graceful Fallback)
    {
      matcher: /^https?.*/,
      handler: new NetworkFirst({
        networkTimeoutSeconds: 5,
        cacheName: "amankarsa-dynamic",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
