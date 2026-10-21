// Сервис-воркер игры. Генерируется build.py из store/sw.template.js — правьте шаблон.
// Сборка 202610211709. Новая сборка = новое имя кэша, старый удаляется.
var CACHE = 'konversia-202610211709';
var CORE = ["./", "index.html", "manifest.webmanifest", "img/art/board-map.webp", "img/art/board-port.webp", "img/art/chip-marker.webp", "img/art/cone-blue.webp", "img/art/cone-brown.webp", "img/art/cone-gold.webp", "img/art/cone-green.webp", "img/art/cone-mint.webp", "img/art/cone-pink.webp", "img/art/cone-purple.webp", "img/art/cone-red.webp", "img/art/cone-teal.webp", "img/art/cont-africa.webp", "img/art/cont-america.webp", "img/art/cont-asia.webp", "img/art/cont-australia.webp", "img/art/cont-europe.webp", "img/art/cover-box.webp", "img/art/cover-box2.webp", "img/art/cover-ua.webp", "img/art/cover-ua2.webp", "img/art/g-computer.webp", "img/art/g-credit.webp", "img/art/g-extractor.webp", "img/art/g-fleet.webp", "img/art/g-goods.webp", "img/art/g-lot.webp", "img/art/g-machine.webp", "img/art/g-plant.webp", "img/art/g-raw.webp", "img/art/g-rub.webp", "img/art/g-truck.webp", "img/art/g-usd.webp", "img/art/i-buy.webp", "img/art/i-close.webp", "img/art/i-deal.webp", "img/art/i-endturn.webp", "img/art/i-exchange.webp", "img/art/i-extract.webp", "img/art/i-help.webp", "img/art/i-load.webp", "img/art/i-loan.webp", "img/art/i-lock.webp", "img/art/i-log.webp", "img/art/i-net.webp", "img/art/i-pass.webp", "img/art/i-produce.webp", "img/art/i-rules.webp", "img/art/i-sell.webp", "img/art/i-settings.webp", "img/art/i-sound.webp", "img/art/i-travel.webp", "img/art/i-unload.webp", "img/art/p3d-computer-a.webp", "img/art/p3d-computer-b.webp", "img/art/p3d-extractor-a.webp", "img/art/p3d-extractor-b.webp", "img/art/p3d-machine-i-a.webp", "img/art/p3d-machine-i-b.webp", "img/art/p3d-machine-s-a.webp", "img/art/p3d-machine-s-b.webp", "img/art/p3d-plant-a.webp", "img/art/p3d-plant-b.webp", "img/art/p3d-truck-a.webp", "img/art/p3d-truck-b.webp", "img/art/tex-board.webp", "img/art/tex-card.webp", "img/art/tex-paper.webp", "img/art/tex-tray.webp", "img/art/tray-box.webp", "img/art/tray-cells.webp", "img/art/tray-corner.webp", "img/art/tray-deck.webp", "img/art/tray-wells.webp", "img/v/chip-goods1.svg", "img/v/chip-goods10.svg", "img/v/chip-goods5.svg", "img/v/chip-raw1.svg", "img/v/chip-raw10.svg", "img/v/chip-raw5.svg", "img/v/credit.svg", "img/v/piece-plant.svg", "img/v/rub-1.svg", "img/v/rub-10.svg", "img/v/rub-100.svg", "img/v/rub-20.svg", "img/v/rub-5.svg", "img/v/rub-50.svg", "img/v/usd-1.svg", "img/v/usd-10.svg", "img/v/usd-20.svg", "img/v/usd-5.svg", "img/ev/ev-army.webp", "img/ev/ev-bonus.webp", "img/ev/ev-crash.webp", "img/ev/ev-engine.webp", "img/ev/ev-lift1.webp", "img/ev/ev-lift10.webp", "img/ev/ev-lift15.webp", "img/ev/ev-lift5.webp", "img/ev/ev-nasa.webp", "img/ev/ev-repair5.webp", "img/ev/ev-strike.webp", "img/ev/ev-typhoon.webp", "img/icons/icon-150.png", "img/icons/icon-180.png", "img/icons/icon-192.png", "img/icons/icon-32.png", "img/icons/icon-44.png", "img/icons/icon-512.png", "img/icons/maskable-512.png", "img/icons/splash-620x300.png", "img/icons/wide-310x150.png", "img/snd/join.mp3", "img/snd/msg.mp3", "img/snd/table.mp3"];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); })
    .then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('konversia-') === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // PeerJS, cdn — мимо
  // Страница — сперва из сети (чтобы не застревать на старой сборке), без сети — из кэша.
  if (r.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(r.url).pathname)) {
    e.respondWith(fetch(r).then(function (res) {
      var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); return res;
    }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('index.html'); }); }));
    return;
  }
  // Картинки и звуки — из кэша, недостающее (портреты, столы) докладывается по мере игры.
  e.respondWith(caches.match(r).then(function (m) {
    return m || fetch(r).then(function (res) {
      if (res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); }
      return res;
    });
  }));
});
