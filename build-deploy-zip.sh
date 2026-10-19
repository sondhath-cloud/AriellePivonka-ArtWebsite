#!/usr/bin/env bash
# Builds ONE zip for holysmocksartclub.com that unzips straight into public_html:
#
#   public_html/                  <- Holy Smocks (domain root)
#   public_html/ariellepivonka/   <- Arielle Pivonka art site
#
# Source files are never modified. Both sites are copied into a staging folder,
# Holy Smocks' old "ariellepivonka.com/holysmocks/" URLs are rewritten for the
# domain root, then the staging folder is zipped.
#
# Usage: bash build-deploy-zip.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
HS="$ROOT/holy-smocks"
NEW_ORIGIN="https://holysmocksartclub.com"
OLD_ORIGIN="https://ariellepivonka.com/holysmocks"
AP_SUBDIR="ariellepivonka"

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="$ROOT/zip"
ZIP_NAME="holysmocksartclub-deploy-${STAMP}.zip"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$OUT_DIR"

# --- 1. Holy Smocks -> staging root (reuses its own file list in zip-dist.sh)
echo "Building Holy Smocks…"
HS_ZIP="$("$HS/scripts/zip-dist.sh" | sed -n 's/^Created //p')"
unzip -q "$HS_ZIP" -d "$STAGE"
rm -f "$HS_ZIP"
# domain-root/ held files for the old layout (Holy Smocks under ariellepivonka.com)
rm -rf "$STAGE/domain-root"

# Absolute URLs everywhere (canonicals, og:image, JSON-LD, sitemap, config defaults)
grep -rlI --null "$OLD_ORIGIN" "$STAGE" | xargs -0 sed -i '' "s#${OLD_ORIGIN}#${NEW_ORIGIN}#g"

# Root-relative paths that assumed the /holysmocks/ subfolder
sed -i '' 's#/holysmocks/#/#g' "$STAGE/.htaccess" "$STAGE/robots.txt" "$STAGE/holy-smocks/.htaccess" "$STAGE/cms-config.example.php"
sed -i '' "s#'/holysmocks/'#'/'#; s#'/holysmocks' \.#'' .#" "$STAGE/holy-smocks/index.php"

if grep -rIn "holysmocks/" "$STAGE" | grep -v -e "facebook.com/groups/holysmocks" -e "example.com/holysmocks"; then
  echo "WARNING: leftover /holysmocks/ references above — check before uploading." >&2
fi

# --- 2. Arielle Pivonka -> staging/ariellepivonka/
echo "Adding Arielle Pivonka site under /$AP_SUBDIR/…"
AP="$STAGE/$AP_SUBDIR"
mkdir -p "$AP"
cd "$ROOT"
rsync -a --exclude ".DS_Store" \
  .htaccess \
  index.html \
  commission.html \
  sky.html \
  commission.php \
  contact.php \
  brevo-mail.php \
  styles.css \
  script.js \
  smoke-hero.js \
  site.webmanifest \
  favicon.ico \
  favicon-16x16.png \
  favicon-32x32.png \
  apple-touch-icon.png \
  arielle-2025.png \
  arielle-2025.webp \
  hero-image.png \
  hero-image.webp \
  assets \
  carousel \
  "$AP/"
sed -i '' "s#RewriteBase /\$#RewriteBase /$AP_SUBDIR/#" "$AP/.htaccess"

# Permissions helper at the top level (run on the server inside public_html)
cp fix-permissions.sh "$STAGE/"

# --- 3. Zip it
(cd "$STAGE" && zip -qr "$OUT_DIR/$ZIP_NAME" . -x "*.DS_Store")

echo ""
echo "Created $OUT_DIR/$ZIP_NAME"
echo "Upload to /home/deepjmda/holysmocksartclub.com/ and extract there (overwrites code only;"
echo "data/*.sqlite, public/uploads/ files and *-config.local.php on the server are not in the zip)."
echo "  Holy Smocks:     $NEW_ORIGIN/"
echo "  Arielle Pivonka: $NEW_ORIGIN/$AP_SUBDIR/"
