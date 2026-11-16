#!/usr/bin/env bash
# Builds public/models/tiago-pro.glb, the TIAGo Pro in the hero: the standard
# configuration, two arms with PAL Pro grippers.
#
# Sources: PAL Robotics' public ROS 2 description packages (Apache 2.0) and
# Intel's realsense2_description (Apache 2.0). Needs git, python3 and Blender.
# Usage: bash scripts/tiago-model.sh
set -euo pipefail
cd "$(dirname "$0")/.."
WORK=.cache/tiago                 # gitignored
mkdir -p "$WORK/src"

clone() { [ -d "$WORK/src/$(basename "$1")" ] || git clone -q --depth 1 "https://github.com/$1.git" "$WORK/src/$(basename "$1")"; }
for r in tiago_pro_robot tiago_pro_head_robot omni_base_robot pal_sea_arm pal_pro_gripper pal_urdf_utils allegro_hand; do
  clone "pal-robotics/$r"
done
if [ ! -d "$WORK/src/realsense-ros" ]; then
  git clone -q --depth 1 --filter=blob:none --sparse https://github.com/IntelRealSense/realsense-ros.git "$WORK/src/realsense-ros"
  git -C "$WORK/src/realsense-ros" sparse-checkout set realsense2_description
fi

# A minimal stand-in for a ROS install: share/<package> links, so xacro's $(find pkg) works.
SHARE="$PWD/$WORK/share"
mkdir -p "$SHARE"
find "$WORK/src" -name package.xml -printf '%h\n' | while read -r d; do ln -sfn "$PWD/$d" "$SHARE/$(basename "$d")"; done
mkdir -p "$WORK/shim/ament_index_python"
: > "$WORK/shim/ament_index_python/__init__.py"
cat > "$WORK/shim/ament_index_python/packages.py" <<EOF
import os
class PackageNotFoundError(KeyError): pass
def get_package_share_directory(name, print_warning=True):
    p = os.path.join('$SHARE', name)
    if not os.path.isdir(p): raise PackageNotFoundError(name)
    return p
EOF

[ -x "$WORK/venv/bin/python" ] || { python3 -m venv "$WORK/venv"; "$WORK/venv/bin/pip" -q install xacro pyyaml; }
"$WORK/venv/bin/python" -I -c "
import sys; sys.path.insert(0, '$WORK/shim'); import xacro
sys.argv = ['xacro', '$SHARE/tiago_pro_description/robots/tiago_pro.urdf.xacro',
            '-o', '$WORK/tiago_pro.urdf']
sys.exit(xacro.main())"

mkdir -p public/models
blender -b --factory-startup -P scripts/urdf_to_glb.py -- "$WORK/tiago_pro.urdf" "$SHARE" public/models/tiago-pro.glb 0.25
ls -la public/models/tiago-pro.glb
