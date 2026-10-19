#!/bin/sh
# Run this on the server inside public_html (or from parent: bash fix-permissions.sh public_html)
# Fixes 403 by making files readable by the web server.

DIR="${1:-.}"
echo "Setting permissions in $DIR..."
find "$DIR" -type d -exec chmod 755 {} \;
find "$DIR" -type f -exec chmod 644 {} \;
echo "Done. Directories=755, files=644."
# Optional: remove the zip from web root so it isn’t downloadable
# rm -f "$DIR"/holysmocksartclub-deploy-*.zip
