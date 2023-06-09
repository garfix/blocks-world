# Blocks world

An [NLI-GO](https://github.com/garfix/nli-go) application of the blocks world, a replication of [Terry Winograd's SHRDLU](https://en.wikipedia.org/wiki/SHRDLU) (1970).

This is not an implementation of the original LISP code. It's rebuilt from the ground up in the Go programming language.

The web-interface was built with [Quasar](https://quasar.dev/) and [Three.js](https://threejs.org/)

## Online demo

Interact with the blocks world online at https://patrickvanbergen.com/blocks-world/

You'll find that it doesn't work perfectly. It still makes many silly mistakes. Consider it as part of the charm of the application, as this form of AI is quite brittle, and making it robust is still a big challenge. Research in the area of rule based AI has almost stopped completely about 20 years ago. I think this is unfortunate because it still has potential, and it's a great way to learn about semantics.

## Preview

https://github.com/garfix/blocks-world/assets/5256409/7a4cdf08-583c-4d3a-8c3c-d477589d1982

## Features

* An animated 3D blocks world
* Enter a sentence by keyboard
* Enter a sentence by voice and receive an answer by speech (Chrome only)
* Click on any of your previous input sentences to edit it
* Use up/down keys to go though your history
* "Start demo" button that plays the 44-interaction dialog
* Pause / continue the dialog
* A list of hints to help you think of a sentence
* Also works on a mobile phone
* Installable as application

## Installation

Install `yarn` version 1

Install the dependencies

    yarn

Start the app in development mode (hot-code reloading, error reporting, etc.)

    yarn quasar dev

Build the app for production

    yarn quasar build

## Path

In `quasar.config.js` `publicPath` is set to `/blocks` as this is where the site is currently deployed. You may need to change it. There are also references in `public/manifest.json`.

## Websockets

On the server we have Apache 2.4. To enable websockets, enable these modules:

    sudo a2enmod proxy
    sudo a2enmod proxy_http
    sudo a2enmod proxy_wstunnel

and add this simple line to the virtual host (on port 443):

    ProxyPass /ws_chat ws://127.0.0.1:3333/

It proxies the request /ws_chat to port 3333

from: https://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html

