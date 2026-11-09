# Changelog

Every change to Toerteller is recorded here. New changes are collected under **Unreleased** until a version is
published (see [How-To → Publishing a new version](docs/HOW-TO.md#publishing-a-new-version)).

## Unreleased

* Two new project types for garments knitted in one piece on a circular needle: **Sweater in the round** (neckband,
  yoke, body, bottom rib, sleeves) and **Cardigan in one piece** (same, plus button band). The phases are ready-made
  parts in knitting order. Choose **From the top down** or **From the bottom up** (e.g. an Icelandic sweater: body
  and sleeves first, then the yoke) and the parts follow that order.
* **Easier installing.** The tip on the home screen now has a **Show me how** button with the exact steps for your phone,
  with the real button icons: iPhone with iOS 26 (⋯ → Share → Add to Home Screen), older iPhones, Android, and a
  *copy link* for people who opened the link inside WhatsApp or another app (that only works in Safari). On iPhone a
  bouncing arrow points at the button to tap. Also in Settings → Help.
* **Install page** `install.html` with a QR code: show it on a computer and scan it with the phone, or send the link.
  The QR code opens Toerteller with the steps already on screen.
* **Time tracking can be switched off** (Settings → *Keep track of time*), for knitters who find the clock
  stressful. You are asked to confirm; then the row timer, times, statistics and the *Still knitting?* reminder
  disappear and you just count rows. Times measured before are kept, and switching it on again brings everything back.
* **Change order** by dragging: in *Change order* mode every part has a ☰ handle to drag it up or down (replaces the
  ↑ ↓ buttons). Outside that mode the order can't change by accident.
* Fix: opening *Edit* on a part could put the cursor in *Current row* (with the keyboard open) instead of starting at
  the top.
* Settings → Language: the first choice now reads *Follow system (phone)*: the app uses the phone's language; below it you can pick a language
  yourself.

## 0.2.0-alpha (2026-11-09)

* The counter's time and statistics blocks sit under a header *Time and statistics* that you can fold away; the app
  remembers your choice.
* **Danish, German, Norwegian and Swedish.** All texts, project types, part names and the "finish early" jokes are now
  available in Dansk, Deutsch, Norsk and Svenska as well. *Automatic* follows the phone's language (other languages
  get English); Settings → Language now offers all seven choices, in alphabetical order. Knitting terms follow DROPS Design patterns; the
  translations still need a check by native speakers.
* **Projects with parts.** A project (e.g. *Trui voor Jan*) now consists of parts (back, front, left sleeve …), each
  with its own counter, goal, pattern repeat, timer, statistics and notes.
  * When starting a project, choose what you knit: Sweater, Cardigan, Socks, Hat, Mittens/gloves, Scarf, Shawl,
    Blanket or Other. The usual parts are listed and ticked; untick what you don't need and add your own parts.
  * Socks and mittens: *Twice (left and right)* creates every part for both sides.
  * Later: add a part (with suggestions for the project type or a custom name), copy a part (e.g. for the second
    sleeve), change the order, mark a part as finished, or delete it.
  * The project shows how many parts are finished and the total rows and time; the counter shows the whole project
    too. A message appears when a part reaches its goal.
  * Existing projects and old backups are converted automatically into a project with one part (*Hoofddeel*), with
    their count, times and notes.
* **Still knitting?** If the timer runs and you don't touch the screen for a while (default 5 min), the app flashes,
  plays a short sound and vibrates (Android) once. Without a response it pauses the timer by itself after another
  few minutes (default 5) and doesn't count the minutes after the signal. All of this can be set in Settings.
* Android: install tip on the home screen (with Chrome's own *Install* button when offered) and Android steps in the
  How-To and README.
* **Automatic updates.** The app checks for a new version when you open it and at most once a day while it stays open,
  installs it in the background and restarts itself at a quiet moment (never while the row timer runs). Settings →
  Updates: switch automatic updating off (you then get a *tap to refresh* message), see the version and **Check for a
  new version now**. After an update the app says *Updated to version …*.
* **Goal reached?** When a part reaches its number of rows, the app asks whether the part is finished. *Yes*: choose
  which part to continue with (the next one is highlighted) or go back to the project; the part is marked finished
  and its timer stops. *No*: add rows to the goal, just keep counting, or undo an accidental tap.
* **✓ Part finished?** button under the counter, to finish a part yourself and pick the next one. If rows are still
  missing it warns you, with a wink per project type ("your sweater will be a little short… crop tops are back in
  fashion!"). On a finished part the button reads **↺ Not finished after all**.
* **Deleting made easy:** swipe a project or part to the left for a red *Delete* button, or long-press it (or tap ⋯)
  for a menu: Open, Rename/Edit, Mark as finished, Make a copy, Delete. After deleting, *Undo* is available for a
  few seconds.
* **Number of rows when starting a project:** each part in the list has a *rows* box (optional).
* Parts without a goal show *no goal*, and the counter shows **＋ Set number of rows**.
* The version shows its build (e.g. *0.2.0-dev (6b7971a)*), and every new build counts as an update, so the test
  copy updates too. *Check for a new version now* waits until the new version is installed before restarting.
* **Undo** now lets the row carry on: the row clock gets back the time of the undone row (it no longer restarts at
  0:00). The total knitting time never changes on undo.
* "1 toer / 1 row" instead of "1 toeren / 1 rows".
* Footer shows *development build, not yet published* until a version is published.
* Test copy of unpublished versions at `/Toerteller/dev/` (orange TEST label, own data), and a phone test
  checklist (`docs/TESTING.md`).

## 0.1.0-alpha (2026-11-09)

First version.

* Several knitting projects, each with its own row counter (big tap area, protection against accidental double taps).
* Undo (− button) and manually setting the current row.
* Goal (number of rows) with progress bar; pattern-repeat counter ("Repeat 3 · row 5 of 8").
* Timer per row: starts automatically, pauses when you leave the project or the app, and can be paused by hand.
* Statistics: total knitting time, average and last row time, today's rows and time, estimated time left.
* Notes per project.
* Keep the screen on while a project is open.
* Dutch and English (automatic or chosen); colour scheme Automatic / Light / Dark.
* Installable on the iPhone Home Screen; works offline.
* Backup: save all projects as a JSON file and restore it; reminder after 14 days without a backup.
