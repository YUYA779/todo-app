// Service Worker — 自己修復型（キャッシュしない）
// 目的: 過去のキャッシュが原因でPWAが空白になる問題を解消する。
// 旧キャッシュを全削除し、以降は常にネットワークから取得する（オフラインキャッシュ無し）。

self.addEventListener('install', () => {
  // 新SWを即座に有効化
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      // 過去の全キャッシュを削除（自己修復）
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// fetch ハンドラはネットワークへそのまま通す（キャッシュ介在なし）。
// ※ respondWith でラップしないことで、ブラウザ標準のネットワーク処理に委ねる。
self.addEventListener('fetch', () => {
  // no-op: 既定のネットワーク取得に任せる
});
