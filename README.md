# rodrigo-serra.github.io

Personal website of Rodrigo Serra, live at **https://rodrigo-serra.github.io/**.

A single page built with [Vite](https://vite.dev/) and plain JavaScript. The header is a
[three.js](https://threejs.org/) scene: Rodrigo types on a laptop and the program he writes
drives a TIAGo Pro robot.

## Run it locally

You need [Node.js](https://nodejs.org/) 22 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

To check the exact files that get published:

```bash
npm run build
npm run preview
```

## Publish

Every push to `main` builds the site and publishes it to GitHub Pages
(see `.github/workflows/deploy.yml`). It takes about a minute.

Work on a branch to try things without touching the live site. In the repository
settings, Pages > Source must be set to "GitHub Actions".

## Where things are

| Path | What it is |
| --- | --- |
| `index.html` | The page shell: top bar, footer, theme switch |
| `src/home.js` | All the text and sections of the page. Edit this to change content |
| `src/home.css` | Styles, colours (dark and light), animations |
| `src/hero/scene.js` | The 3D header: robot, code window, camera, the script that plays |
| `src/hero/avatar.js` | Rodrigo's 3D model: seat, laptop, typing and head motion |
| `public/photos/` | The pictures the page uses, already resized |
| `public/models/` | The two 3D models, compressed for the web |
| `public/draco/` | Decoder for the compressed models (copied from three.js) |
| `scripts/` | Tools that produce the photos and models (below) |

## Changing content

Text, links, projects, competitions and publications are lists at the top of
`src/home.js`. Save the file and the dev server reloads the page.

## Photos

Original photos live in `images/`, which is **not** in the repository (see `.gitignore`).
`scripts/photos.sh` makes the small copies in `public/photos/`. Needs
[ImageMagick](https://imagemagick.org/).

1. Put the original in `images/`.
2. Add a line to `scripts/photos.sh`: `add "folder/file.jpg" work/some-name`
3. Run `npm run photos`.
4. Use `'work/some-name'` as a `cover` in `src/home.js`.

Only photos listed in `scripts/photos.sh` are published.

## 3D models

Both need [Blender](https://www.blender.org/) (tested with 5.3) on the command line.
You only run these when a model changes; the results are committed in `public/models/`.

**Rodrigo.** Export a character from Tripo as GLB (a standing pose, no skeleton needed),
save it as `images/me/rodrigo.glb`, then:

```bash
blender -b --factory-startup -P scripts/avatar_rig.py -- images/me/rodrigo.glb public/models/rodrigo.glb
```

The script adds a skeleton, poses the model sitting and typing, shrinks the texture and
compresses the file. It prints a "seat height" value: if it changes noticeably, update
`SEAT` in `src/hero/avatar.js`.

**TIAGo Pro.** Built from PAL Robotics' public robot description. Also needs git and Python 3:

```bash
bash scripts/tiago-model.sh
```

It downloads the description packages into `.cache/` (not in the repository), expands the
URDF and converts it to `public/models/tiago-pro.glb` with every joint kept movable.

## Credits

- TIAGo Pro model: [PAL Robotics](https://github.com/pal-robotics/tiago_pro_robot) description packages, Apache 2.0.
- Camera model: [Intel RealSense](https://github.com/IntelRealSense/realsense-ros) description, Apache 2.0.
- [three.js](https://threejs.org/), MIT.
