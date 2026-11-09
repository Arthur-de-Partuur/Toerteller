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
9. [Testing a new version](#testing-a-new-version)
10. [Publishing a new version](#publishing-a-new-version)
11. [Files in this repository](#files-in-this-repository)

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

A **project** is the thing you make (e.g. *Trui voor Jan*). It consists of **parts** (back, front, left sleeve …).
Every part has its own counter, goal, pattern repeat, timer, statistics and notes.

### Starting a project

1. On the home screen tap **+ New project** and enter a name.
2. Choose **what you are knitting**. Each type lists its usual parts:

   | Type | Parts (ticked by default; others can be ticked) |
   |---|---|
   | Sweater | Back, Front, Left sleeve, Right sleeve, Neckband (+ Yoke, Collar, Hood, Pockets) |
   | Cardigan | Back, Left front, Right front, Left sleeve, Right sleeve, Button band (+ Collar, Yoke, Hood, Pockets) |
   | Socks | Cuff, Leg, Heel flap, Heel turn, Gusset, Foot, Toe |
   | Hat | Brim, Body, Crown |
   | Mittens / gloves | Cuff, Hand, Thumb (+ Fingers) |
   | Scarf | Scarf (+ Border) |
   | Shawl | Body, Border |
   | Blanket | Squares / panels, Border |
   | Other | nothing: add your own |

3. Untick what you don't need. If you know it, fill in the **number of rows** in the box next to a part (optional;
   you can also do it later). Type your own part in the box below the list and tap **Add** (remove it again with ✕).
4. Socks and mittens: **Twice (left and right)** creates every part for both sides (*Boord · links* … *Boord · rechts*).
5. Tap **Start project**. If no part is ticked, the project gets one part (*Hoofddeel*).

### Working with parts

* Tap a project on the home screen to see its parts, with how many are finished and the total rows and time.
* Tap a part to open its counter. No goal yet? Tap **＋ Set number of rows** under the counter.
* **Swipe left** on a project or part to show a red **Delete** button. Or **long-press** it, or tap **⋯**, for a menu:
  Open, Rename / Edit (rows, repeat …), Mark as finished, Make a copy, Delete. After deleting, tap **Undo** in the
  message at the bottom within a few seconds to get it back.
* **+ Add part**: tap a suggestion for this type of project, or type your own name. Optional: goal and repeat.
* **Edit** a part (pencil in the counter): name, **number of rows (goal)**, **pattern repeat**, **current row**,
  and **This part is finished** (shown with ✓ and a green counter). Here you can also **Make a copy** (same goal,
  repeat and notes, counter at 0; handy for the second sleeve) and **Delete part**.
* **Change order**: move parts with ↑ ↓, then tap **Done reordering**.
* **Edit** the project (pencil on the parts screen): rename it or **Delete project**.
* The goal: shows "of 120", a progress bar and the time left. The pattern repeat: e.g. `8` shows
  *Repeat 3 · row 5 of 8*; the bar turns green on the last row of a repeat. When a part reaches its goal, the app asks
  **Is "…" finished?**
  * *Yes, finished. Continue with:* tap the part you knit next (the next one in the list is highlighted), or go back
    to the project. The part is marked finished and its timer stops. After the last part: *That was the last part!*
  * *No, not finished yet:* **Add rows to the goal…** (type how many), **Just keep counting** (no new goal), or
    **Tapped by accident** (undo).
* Projects made with version 0.1.0 become a project with one part, *Hoofddeel*, with all counts and times.
## Counting rows

* Tap the **big counter** after finishing a row. It adds 1.
* A second tap within 0.7 seconds is ignored, so a double tap doesn't count twice.
* **− Undo** takes one row off (e.g. after an accidental tap). The row clock continues with the time of that row,
  as if you never tapped. The total knitting time doesn't change; the undone row is removed from the average.
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

Toerteller updates itself. The phone checks for a new version when you open the app (a tiny file), and Toerteller
checks again at most once a day while it stays open. A new version is installed in the background, and the app restarts itself at a quiet moment: never while the
row timer is running in the counter screen (it waits until you pause or go back to the project list). Afterwards it
shows *Updated to version …*. Your projects are kept.

Settings → **Updates**:
* **Update automatically**: switch off if you'd rather decide yourself; you then get *New version ready. Tap to
  refresh.*
* **Check for a new version now**, and the version you have.

## Giving someone access

The app is on a public link, so technically anyone with the link can open it. The licence (see `LICENSE`) says that
only people with the owner's written permission may use it. To give someone access, send them the link and your
permission (e.g. by message).

## Testing a new version

Unpublished work lives on the `dev` branch and is online as a separate **test copy**:
<https://arthur-de-partuur.github.io/Toerteller/dev/>

* It shows an orange **TEST** label and installs as **Toerteller TEST**, next to the real app.
* It keeps **its own projects**, so testing never touches the real data (backups can be restored in either).
* The things to check on a real phone are in [TESTING.md](TESTING.md).

## Publishing a new version

For the maintainer. The website is built from two branches into the `gh-pages` branch, which GitHub Pages serves
(Settings → Pages → *Deploy from a branch* → `gh-pages` / root):

* `main` → the live app at `/Toerteller/`
* `dev` → the test copy at `/Toerteller/dev/`

Steps:

1. Work on `dev`; collect changes in `CHANGELOG.md` under **Unreleased**; the version in `js/version.js` is
   `X.Y.Z-dev` with date `unreleased`.
2. After pushing `dev`: run `tools/build-pages.sh` (it builds and pushes `gh-pages`) so the test copy is updated.
3. To publish: set the number and date in `js/version.js` (this also makes every installed copy update itself),
   rename **Unreleased** in the changelog, update the README and this guide, merge `dev` into `main`, push, and run
   `tools/build-pages.sh`.
4. Optionally create a GitHub Release with tag `vX.Y.Z-alpha`.

## Files in this repository

| File | What it is |
|---|---|
| `index.html` | The app's page. |
| `css/style.css` | Look and feel (colours, layout). |
| `js/app.js` | Screens, counter, timer, settings, backup. |
| `js/store.js` | Storing projects on the phone; backup format. |
| `js/i18n.js` | All texts in Dutch and English. |
| `js/templates.js` | Project types and their usual parts (Dutch and English). |
| `js/version.js` | Version number and date. |
| `js/channel.js` | Live app or test copy (rewritten by `tools/build-pages.sh` for `/dev/`). |
| `tools/build-pages.sh` | Builds the website (live + test copy) into the `gh-pages` branch. |
| `docs/TESTING.md` | What to check on a real phone. |
| `sw.js`, `manifest.webmanifest` | Offline working and Home Screen installation. |
| `icons/` | App icon. |
