// Service Worker — 自己破棄（kill switch）
// 過去に登録されたSWとキャッシュが原因でPWAが空白／表示崩れになる問題を恒久的に解消する。
// このSWは、有効化時に「全キャッシュ削除＋自身の登録解除」を行い、以後は存在しなくなる。

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      // 全キャッシュ削除
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      // 自身の登録を解除（以後このSWは消える）
      await self.registration.unregister();
      // 制御中のクライアントを再読み込みして、SW無しの最新状態にする
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => c.navigate(c.url));
    })()
  );
});

// fetch は介在しない（ネットワークそのまま）
self.addEventListener('fetch', () => {});
