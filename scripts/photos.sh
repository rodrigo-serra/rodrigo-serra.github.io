#!/usr/bin/env bash
# Builds web-sized copies of the original photos.
#   images/         original photos, as dropped in (not published, see .gitignore)
#   public/photos/  renamed, resized, metadata-stripped copies used by the site
# Usage: bash scripts/photos.sh     (needs ImageMagick)
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=images
OUT=public/photos

# make <original> <name> <max size> <suffix> [crop WxH+X+Y]
make() {
  mkdir -p "$OUT/$(dirname "$2")"
  local crop=()
  [ -n "${5:-}" ] && crop=(-crop "$5" +repage)
  convert "$SRC/$1" -auto-orient "${crop[@]}" -resize "${3}x${3}>" -strip -quality 80 "$OUT/$2$4.jpg"
  echo "  $2$4"
}
add()      { make "$1" "$2" 640 .thumb "${3:-}"; }   # card pictures: <name>.thumb.jpg
portrait() { make "$1" "$2" 900 ""; }                # the fallback hero photo: <name>.jpg

# hub
portrait "me/4.jpg"     hub/portrait
# work
add "durable/1.png"       work/durable-solar-1
add "robots/bob_2.png"    work/bob-interview 1460x821+456+0   # cropped to 16:9 around the robot
add "fnr/2026/3.jpg"                                    work/portugal-open-2026-team
add "fnr/2026/2.jpg"                           work/portugal-open-2026-2
add "eurobin/brussels/1.jpg"            work/eurobin-brussels-2026-1
add "eurobin/brussels/2.jpg"            work/eurobin-brussels-2026-2
# personal
add "me/running/8.jpg"                                  personal/running-race  1400x930+60+140   # cropped: no watermark
add "me/hadpan/1.jpg"                            personal/handpan
add "me/ecuador/2.jpg"                           personal/ecuador-2
