/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-e1739974'], (function (workbox) { 'use strict';

  workbox.setCacheNameDetails({
    prefix: "songbank-v4"
  });
  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "apple-touch-icon.png",
    "revision": "5cec01e22f2f3130be598ac0f2ce32e9"
  }, {
    "url": "assets/index-0864c9ea.js",
    "revision": null
  }, {
    "url": "assets/index-9fdd1eb7.css",
    "revision": null
  }, {
    "url": "assets/songBankLogo-8e2d8715.png",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-97482f5d.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-5ffdab76.js",
    "revision": null
  }, {
    "url": "favicon-16x16.png",
    "revision": "169e5ce28830f4f312bbe320d5bb8a3c"
  }, {
    "url": "favicon-32x32.png",
    "revision": "fbe5d5f09abc806e3c94268bc35dd220"
  }, {
    "url": "favicon.ico",
    "revision": "fbe5d5f09abc806e3c94268bc35dd220"
  }, {
    "url": "index.html",
    "revision": "173d7989d661fe89e75dfb4211a14095"
  }, {
    "url": "masked-icon.svg",
    "revision": "2690373924f3fb2941aeefe6833f2fc5"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d32da621ceca83591fe66816d6071197"
  }, {
    "url": "pwa-512x512.png",
    "revision": "90f7d6ea420350a2a8b9cda732bc1ec1"
  }, {
    "url": "vite.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "/",
    "revision": "1753830894611"
  }, {
    "url": "favicon.ico",
    "revision": "fbe5d5f09abc806e3c94268bc35dd220"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5cec01e22f2f3130be598ac0f2ce32e9"
  }, {
    "url": "masked-icon.svg",
    "revision": "2690373924f3fb2941aeefe6833f2fc5"
  }, {
    "url": "pwa-192x192.png",
    "revision": "d32da621ceca83591fe66816d6071197"
  }, {
    "url": "pwa-512x512.png",
    "revision": "90f7d6ea420350a2a8b9cda732bc1ec1"
  }, {
    "url": "manifest.webmanifest",
    "revision": "21fee4fd4fca6475c8e83a0100defe41"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html")));
  workbox.registerRoute(/^https:\/\/sheet-music-library-ad225c202768\.herokuapp\.com\/api\/.*/i, new workbox.NetworkFirst({
    "cacheName": "api-cache-v2",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 86400
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/, new workbox.CacheFirst({
    "cacheName": "image-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/my-song-library-media\.s3\.amazonaws\.com\/.*\.(png|jpg|jpeg|svg|gif|webp)$/, new workbox.CacheFirst({
    "cacheName": "s3-image-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 200,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  self.__WB_DISABLE_DEV_LOGS = true;

}));
