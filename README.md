# tigr

## About

Git cli wrapper in Wails/SvelteKit. The name `tigr` is git backwards with my first initial.

## Features
- [ ] Commit
- [ ] Push
- [ ] Pull Request
- [ ] Rebase
- [x] Checkout
- [x] Fetch
- [x] Pull
- [x] Suspend (git commit -am 'wip')
- [x] Resume (git reset HEAD~)

## Setup

Required:
- Go 1.23+
- Node v20.16+

Follow direction here to setup Wails:
https://wails.io/docs/next/gettingstarted/installation

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

For default builds:
https://wails.io/docs/next/gettingstarted/building

For custom builds:
https://wails.io/docs/next/guides/manual-builds

By the nature of Go language, the builds results in single executable. 
