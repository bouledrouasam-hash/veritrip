# VeriTrip — installable web app

This folder is the complete VeriTrip app. Put it on any HTTPS static host and open it on your phone.
Everything (including the OCR engine and the English + French text models) is inside this folder,
so after the first visit VeriTrip works with no internet. Only live exchange rates and the optional
AI reading need a connection.

## Put it on GitHub Pages (free)
1. Sign in to github.com → **New repository** → name it `veritrip` → Public → Create.
2. On the new repo page click **uploading an existing file**, drag **the contents of this folder**
   (index.html, sw.js, manifest.webmanifest, .nojekyll, icons/, splash/, vendor/) into the page → **Commit changes**.
   (Tip: on a Mac press Cmd+Shift+. in Finder to see the hidden `.nojekyll` file. It is optional but recommended.)
3. Repo **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. After about a minute the app is live at `https://<your-username>.github.io/veritrip/`.

## Install on the phone
* **iPhone / iPad:** open the link in **Safari** → Share button → **Add to Home Screen**.
* **Android:** open the link in **Chrome** → menu ⋮ → **Install app** (or use Settings → App → Install in VeriTrip).
Open the app once while online and wait for "Ready to work offline".

## Moving your data
Data lives in the browser of each device/address. From the old file version: Settings → **Back up all data**,
send the `.json` file to your phone, then in the new app tap **Import backup** (Welcome card) or Settings → Restore.
On iPhone, do the import **inside the Home Screen app** (not in a Safari tab): iOS keeps Home Screen apps'
data separate from Safari. Back up from time to time (Settings → Back up all data); deleting the Home Screen icon deletes its data.

## Updating
Upload the new files over the old ones (same repo; GitHub Pages can take a few minutes to refresh). Next time the app is opened online it shows
**"Update available"** — tap Update. Your data is kept.

Note: a public GitHub repo means the app's code is public (your trips and receipts are NOT — they stay on your phone).
