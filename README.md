# Golden Boot

Find and join local football games near you. No team needed, just show up and play.

Live at [goldenbootfc.co.uk](https://goldenbootfc.co.uk/).

## What's in the app

- **Games:** browse upcoming games, join, leave, and join a waitlist when a game is full
- **Host a game:** pick a pitch, date, format and pitch cost. The cost is split between players, plus a £1 platform fee
- **Pitches:** a directory of London venues
- **Group chat** for each game, plus notifications
- **Wallet:** refunds land here when a player leaves more than 24 hours before kick-off
- **Smart Picks:** your next open game, your game stats and a simple team picker

## How it's built

Golden Boot is a static web app (PWA). It has no build step and no server.

| File | What it does |
| --- | --- |
| `index.html` | The whole app: React 18 and Babel from a CDN, plus Firebase Auth and Firestore, Stripe.js and Google Analytics |
| `sw.js` | Service worker. Pages load from the network first and fall back to the cache when offline |
| `manifest.json` | Install details for the PWA (name, icons, theme colour) |
| `icon-192.png`, `icon-512.png` | App icons |

Data lives in Firestore in these collections: `games` (with a `messages` subcollection for chat), `notifications` and `wallets`.

## Deploying

The site is hosted on Vercel. Pushing to `main` deploys it.

After changing `sw.js`, bump `CACHE_NAME` so installed copies pick up the change.
