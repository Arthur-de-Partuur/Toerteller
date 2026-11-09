# Toerteller: How-To

## Contents

1. [Installing on the iPhone](#installing-on-the-iphone) or [Android](#installing-on-android)
2. [Projects](#projects)
3. [Counting rows](#counting-rows)
4. [The timer and statistics](#the-timer-and-statistics)
5. [Settings](#settings)
6. [Backup and moving to a new phone](#backup-and-moving-to-a-new-phone)
7. [Updates](#updates)
8. [Giving someone access](#giving-someone-access)
9. [Publishing a new version](#publishing-a-new-version)
10. [Files in this repository](#files-in-this-repository)

## Installing on the iPhone

1. Open <https://arthur-de-partuur.github.io/Toerteller/> in **Safari** (other browsers on iPhone can't do step 2 as
   well).
2. Tap the **Share** button (square with an arrow) → **Add to Home Screen** → **Add**.
3. Start Toerteller from the new icon. It opens full screen and works without internet.

Until it is on the Home Screen, the app shows a tip about this (on iPhone and Android). Installing matters: iOS may clear the data of websites
that are not used for a while, but not of apps on the Home Screen.

## Installing on Android

1. Open <https://arthur-de-partuur.github.io/Toerteller/> in **Chrome**.
2. Tap **⋮** (top right) → **Install app** (on some phones: **Add to Home screen**). Chrome sometimes offers an
   *Install* button itself; the app's tip on the home screen then has an **Install** button too.
3. Start Toerteller from the new icon.

## Projects

* **+ New project**: enter a name. Optional:
  * **Number of rows (goal)**: how many rows the pattern has. Shows "of 120", a progress bar and the time left.
  * **Pattern repeat**: e.g. `8` if the pattern repeats every 8 rows. The app then shows *Repeat 3 · row 5 of 8*;
    the bar turns green on the last row of a repeat.
* **Edit** (pencil, top right in a project): change the name, goal and repeat, or set the **current row** by hand
  (e.g. when you start halfway). Here you can also **delete** the project.
* The home screen lists all projects with their row count, progress and knitting time.

## Counting rows

* Tap the **big counter** after finishing a row. It adds 1.
* A second tap within 0.7 seconds is ignored, so a double tap doesn't count twice.
* **− Undo** takes one row off.
* **Notes**: anything you want to remember (needle size, tricky stitches). Saved as you type.

## The timer and statistics

* The timer for **this row** starts automatically at your first tap and restarts at every new row.
* It **pauses** by itself when you go back to the project list, switch to another app or lock the phone. Tap
  **Start** to continue, or just tap the counter when the row is done.
* **Pause** stops it by hand (e.g. for a cup of tea).
* **Still knitting?** If the timer is running and you haven't touched the screen for a while (default 5 minutes),
  the app gives one signal: the counter **flashes**, a short **sound** plays and the phone **vibrates** (vibrating
  works on Android only; iPhone doesn't allow it for web apps, and the sound is silent when the iPhone's mute switch
  is on). Tap anywhere to continue. If you don't respond, the timer **pauses by itself** after another few minutes
  (default 5), and the minutes after the signal are not counted.
  Rows that take longer than 5 minutes? Set a longer time in Settings.
* Statistics under the counter:
  * **Total knitting time**: all timed time for this project.
  * **Average per row** and **Last row**.
  * **Today**: rows and time since midnight.
  * **Still to go**: rows left until the goal, and the estimated time based on your average.
* Rows counted while the timer was paused, or set by hand, are not timed.

## Settings

Gear icon on the home screen.

* **Language**: Automatic (follows the iPhone), Nederlands or English.
* **Colours**: Automatic (follows the iPhone's dark mode), Light or Dark.
* **Keep screen on**: the screen doesn't switch off while a project is open (needs iOS 16.4 or newer).
* **Still knitting?**: *Signal after* (Off, 2–30 min), *Then pause after* (Never, 1–15 min), and which signals:
  Flash, Sound, Vibrate (Vibrate is only shown on phones that support it).

## Backup and moving to a new phone

Projects are stored only on this phone, inside the app.

* **Save backup**: creates `toerteller-backup-YYYY-MM-DD.json`. In the share sheet choose **Save to Files** →
  iCloud Drive (or send it to yourself).
* **Restore backup**: pick a backup file. It **replaces** all current projects (you are asked first).
* After 14 days without a backup, the home screen shows a reminder.
* New phone: install the app, then **Restore backup** with the file from iCloud Drive.

## Updates

When a new version is online, the app shows *New version ready. Tap to refresh.* Your projects are kept. The version
number is in the footer.

## Giving someone access

The app is on a public link, so technically anyone with the link can open it. The licence (see `LICENSE`) says that
only people with the owner's written permission may use it. To give someone access, send them the link and your
permission (e.g. by message).

## Publishing a new version

For the maintainer:

1. Collect changes in `CHANGELOG.md` under **Unreleased**.
2. When publishing: set the new number and date in `js/version.js` (this also refreshes the offline copy on every
   phone), rename **Unreleased** to that version in the changelog, and update this guide and the README.
3. Push to `main`. GitHub Pages publishes it within a minute or two.
4. Optionally create a GitHub Release with tag `vX.Y.Z-alpha`.

## Files in this repository

| File | What it is |
|---|---|
| `index.html` | The app's page. |
| `css/style.css` | Look and feel (colours, layout). |
| `js/app.js` | Screens, counter, timer, settings, backup. |
| `js/store.js` | Storing projects on the phone; backup format. |
| `js/i18n.js` | All texts in Dutch and English. |
| `js/version.js` | Version number and date. |
| `sw.js`, `manifest.webmanifest` | Offline working and Home Screen installation. |
| `icons/` | App icon. |
