# Blocks world

An [NLI-GO](https://github.com/garfix/nli-go) client for the blocks world, a replication of Terry Winograd's SHRDLU (1970).

Built with [Quasar](https://quasar.dev/) and [Three.js](https://threejs.org/)

<video src="https://github.com/garfix/blocks-world/raw/main/static/blocks.webm" type="video/webm" width="600"></video>

## Installation

Install `yarn` version 1

Install the dependencies

    yarn

Start the app in development mode (hot-code reloading, error reporting, etc.)

    yarn quasar dev

Build the app for production

    yarn quasar build

## Deployment

## Path

The server is currently deployed on https://patrickvanbergen.com/blocks

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

## Icon

at(`block:small-red`, 100, 100, 0)
at(`pyramid:green`, 100, 100, 100)
at(`block:blue`, 150, 250, 0)
size(`block:blue`, 100, 100, 200)
