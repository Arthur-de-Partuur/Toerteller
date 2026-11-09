# Test checklist

Things that can only be checked on a real phone. Test on the **test copy** first
(<https://arthur-de-partuur.github.io/Toerteller/dev/>, orange *TEST* label, its own data), then on the live app after
publishing. Mark ✅ (works), ❌ (problem, describe it) or – (not tested yet).

| # | What to check | Android | iPhone |
|---|---|---|---|
| 1 | Install on the Home Screen (iPhone: Share → Add to Home Screen; Android: ⋮ → Install app); icon looks right | – | – |
| 2 | App opens full screen and works with flight mode on | – | – |
| 3 | **Keep screen on**: screen stays on for more than the normal auto-lock time in the counter | ✅ (2026-11-09) | ✅ (2026-11-09, live app) |
| 4 | Big counter: a quick double tap counts only once | – | – |
| 5 | Timer pauses when switching to another app or locking the phone, and the time isn't counted | – | – |
| 6 | **Still knitting?** signal after the set time: flashing | – | – |
| 7 | … sound (iPhone: mute switch off) | – | – |
| 8 | … vibration (Android only; iPhone can't) | – | n/a |
| 9 | … auto-pause after the second period; minutes after the signal not counted | – | – |
| 10 | **Save backup**: share sheet opens; file can be saved (Files / iCloud Drive / Drive) | – | – |
| 11 | **Restore backup** from that file, also on another phone | – | – |
| 12 | **Automatic update**: after a new version, the app updates itself at a quiet moment and says *Updated to version …* | – | – |
| 13 | Projects made in 0.1.0 are still there after updating to 0.2.0 (as one part, *Hoofddeel*) | – | – |
| 14 | New project with parts; Socks with *Twice (left and right)*; custom part | – | – |
| 15 | Dark mode follows the phone setting (Automatic) | – | – |
| 16 | Install tip shows in the browser and disappears once installed | – | – |
| 17 | Dutch/English follows the phone language (Automatic) | – | – |
| 18 | Swipe left on a project/part shows **Delete**; normal scrolling still works | – | – |
| 19 | Long-press on a project/part opens the menu (no text selection popup) | – | – |
| 20 | *Undo* after deleting brings it back | – | – |
| 22 | *✓ Part finished* before the goal shows the warning with the joke; after the goal it just asks which part is next | – | – |
| 21 | Reaching the number of rows shows *Is … finished?*; choosing the next part opens it; *Add rows* asks for a number | – | – |
| 23 | Settings → Language: pick Dansk, Deutsch, Norsk, Svenska; texts and new project parts change; *Automatic* follows the phone language | – | – |
| 25 | Settings → *Keep track of time* off: asks first; then no timer, times or statistics in the counter and lists, no reminder; rows still count; switching on brings it back | – | – |
| 26 | Not installed: home screen tip → *Show me how* lists the right steps for this phone; on iPhone the arrow points at ⋯ (iOS 26) or Share; following them installs the app | – | – |
| 27 | Install page (`…/dev/install.html` on a computer): scanning the QR code opens Toerteller with the steps on screen; the Home Screen icon opens the normal app | – | – |
| 24 | Project → *Change order*: drag a part by ☰ up and down (also past the screen edge in a long list); the page itself can still scroll; order is kept after *Done* | – | – |
