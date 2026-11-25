#!/usr/bin/env bash
set -euo pipefail

echo "Checking required static site files..."
for f in index.html styles.css script.js google-apps-script.js; do
  test -s "$f" || { echo "Missing or empty required file: $f" >&2; exit 1; }
done
test -f .nojekyll || { echo "Missing .nojekyll" >&2; exit 1; }

echo "Checking JavaScript syntax..."
node --check script.js
node --check google-apps-script.js

echo "Checking local asset references in index.html..."
python3 - <<'PY'
import os, re, sys

with open("index.html", "r", encoding="utf-8") as fh:
    html = fh.read()

refs = set(re.findall(r'(?:src|href|content)="(assets/[^"]+)"', html))
if not refs:
    print("No asset references found in index.html", file=sys.stderr)
    sys.exit(1)

missing = [p for p in sorted(refs) if not (os.path.isfile(p) and os.path.getsize(p) > 0)]
if missing:
    print("Missing or empty assets:", missing, file=sys.stderr)
    sys.exit(1)

print(f"Verified {len(refs)} asset references: {', '.join(sorted(refs))}")
PY

echo "Checking CSS brace balance..."
python3 - <<'PY'
import sys
with open("styles.css", "r", encoding="utf-8") as fh:
    css = fh.read()
if css.count("{") != css.count("}"):
    print("Unbalanced braces in styles.css", file=sys.stderr)
    sys.exit(1)
print("styles.css brace balance OK")
PY

echo "All static site checks passed."
