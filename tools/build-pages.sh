#!/usr/bin/env bash
# Builds the website that GitHub Pages serves from the gh-pages branch:
#   /            = the live app (branch main)
#   /dev/        = the test app (branch dev), named "Toerteller TEST", with its own data
# Usage (from the repo root, with main and dev fetched):  tools/build-pages.sh   then push gh-pages.
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
OUT=$(mktemp -d)
git -C "$ROOT" archive origin/main | tar -x -C "$OUT"
mkdir -p "$OUT/dev"
git -C "$ROOT" archive origin/dev | tar -x -C "$OUT/dev"
rm -rf "$OUT/dev/tools" "$OUT/dev/.github" "$OUT/tools" "$OUT/.github"
# test copy: own channel, name and colour
cat > "$OUT/dev/js/channel.js" <<'JS'
// Test copy, built by tools/build-pages.sh. Keeps its own data, separate from the live app.
self.TT_CHANNEL = { dev: true, prefix: 'toerteller-dev.' };
JS
sed -i 's/"name": "Toerteller"/"name": "Toerteller TEST"/; s/"short_name": "Toerteller"/"short_name": "Toerteller T"/' "$OUT/dev/manifest.webmanifest"
sed -i 's/<title>Toerteller<\/title>/<title>Toerteller TEST<\/title>/; s/content="Toerteller">/content="Toerteller TEST">/' "$OUT/dev/index.html"
touch "$OUT/.nojekyll"
# commit to gh-pages (orphan history of build results)
WT=$(mktemp -d)
if git -C "$ROOT" show-ref -q refs/remotes/origin/gh-pages; then
  git -C "$ROOT" worktree add -q -B gh-pages "$WT" origin/gh-pages
else
  git -C "$ROOT" worktree add -q --detach "$WT"; git -C "$WT" checkout -q --orphan gh-pages
fi
find "$WT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a "$OUT/." "$WT/"
git -C "$WT" add -A
git -C "$WT" commit -qm "Pages: main $(git -C "$ROOT" rev-parse --short origin/main), dev $(git -C "$ROOT" rev-parse --short origin/dev)" || echo "nothing changed"
echo "Built in worktree $WT (branch gh-pages). Push with: git -C \"$WT\" push origin gh-pages"
