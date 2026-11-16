"""Convert an expanded URDF (visual meshes only) into a GLB for the website.

Run inside Blender:
  blender -b --factory-startup -P scripts/urdf_to_glb.py -- robot.urdf share_dir out.glb [decimate_ratio]

share_dir is a folder where share_dir/<package>/... resolves package:// paths.
Every joint becomes a node named after the joint, holding its URDF origin; the
child link hangs under it. Movable joints carry their axis and limits as glTF
extras, so the page can rotate them: node.quaternion = origin * axisAngle(axis, q).
The model stays Z-up (URDF convention); the page rotates the root by -90deg on X.
"""
import math
import os
import sys
import xml.etree.ElementTree as ET

import bpy
from mathutils import Euler, Matrix, Vector

args = sys.argv[sys.argv.index('--') + 1:]
URDF, SHARE, OUT = args[:3]
RATIO = float(args[3]) if len(args) > 3 else 1.0

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
root = ET.parse(URDF).getroot()


def origin_matrix(el):
    o = el.find('origin') if el is not None else None
    xyz = [float(v) for v in (o.get('xyz', '0 0 0') if o is not None else '0 0 0').split()]
    rpy = [float(v) for v in (o.get('rpy', '0 0 0') if o is not None else '0 0 0').split()]
    return Matrix.Translation(Vector(xyz)) @ Euler(rpy, 'XYZ').to_matrix().to_4x4()


def empty(name, parent=None, matrix=None):
    ob = bpy.data.objects.new(name, None)
    scene.collection.objects.link(ob)
    if parent:
        ob.parent = parent
    if matrix is not None:
        ob.matrix_parent_inverse = Matrix.Identity(4)
        ob.matrix_basis = matrix
    return ob


# Named materials from the URDF, then one material per distinct colour.
named = {}
for m in root.findall('material'):
    c = m.find('color')
    if c is not None:
        named[m.get('name')] = tuple(float(v) for v in c.get('rgba').split())
mats = {}


def material(rgba):
    rgba = tuple(round(v, 2) for v in rgba)
    if rgba not in mats:
        mat = bpy.data.materials.new('mat_%02x%02x%02x' % tuple(int(v * 255) for v in rgba[:3]))
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes['Principled BSDF']
        bsdf.inputs['Base Color'].default_value = rgba
        bsdf.inputs['Roughness'].default_value = 0.45
        mats[rgba] = mat
    return mats[rgba]


def visual_rgba(v):
    m = v.find('material')
    if m is None:
        return (0.85, 0.85, 0.85, 1)
    c = m.find('color')
    if c is not None:
        return tuple(float(x) for x in c.get('rgba').split())
    return named.get(m.get('name'), (0.85, 0.85, 0.85, 1))


def resolve(fn):
    if fn.startswith('package://'):
        return os.path.join(SHARE, fn[len('package://'):])
    if fn.startswith('file://'):
        return fn[len('file://'):]
    return fn


links = {}
for l in root.findall('link'):
    ob = empty(l.get('name'))
    links[l.get('name')] = ob
    for i, v in enumerate(l.findall('visual')):
        g = v.find('geometry')[0]
        if g.tag == 'mesh':
            path = resolve(g.get('filename'))
            if not os.path.exists(path) and os.path.exists(path.replace('d435i', 'd435')):
                print('substituting', os.path.basename(path), '->', 'd435 variant')
                path = path.replace('d435i', 'd435')
            if not os.path.exists(path):
                print('MISSING mesh, skipped:', path)
                continue
            bpy.ops.wm.stl_import(filepath=path)
            ob_m = bpy.context.selected_objects[0]
            s = [float(x) for x in g.get('scale', '1 1 1').split()]
            ob_m.data.transform(Matrix.Diagonal((*s, 1)))
            if s[0] * s[1] * s[2] < 0:      # mirrored mesh: restore outward-facing normals
                ob_m.data.flip_normals()
        elif g.tag == 'box':
            sx, sy, sz = (float(x) for x in g.get('size').split())
            bpy.ops.mesh.primitive_cube_add(size=1)
            ob_m = bpy.context.object
            ob_m.data.transform(Matrix.Diagonal((sx, sy, sz, 1)))
        elif g.tag == 'cylinder':
            bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=float(g.get('radius')), depth=float(g.get('length')))
            ob_m = bpy.context.object
        elif g.tag == 'sphere':
            bpy.ops.mesh.primitive_uv_sphere_add(radius=float(g.get('radius')))
            ob_m = bpy.context.object
        else:
            continue
        ob_m.name = f"{l.get('name')}_visual_{i}"
        if RATIO < 1 and len(ob_m.data.polygons) > 2000:
            mod = ob_m.modifiers.new('dec', 'DECIMATE')
            mod.ratio = RATIO
            bpy.context.view_layer.objects.active = ob_m
            bpy.ops.object.modifier_apply(modifier='dec')
        ob_m.data.materials.clear()
        ob_m.data.materials.append(material(visual_rgba(v)))
        for p in ob_m.data.polygons:
            p.use_smooth = False
        ob_m.parent = ob
        ob_m.matrix_parent_inverse = Matrix.Identity(4)
        ob_m.matrix_basis = origin_matrix(v)

children = set()
for j in root.findall('joint'):
    parent, child = j.find('parent').get('link'), j.find('child').get('link')
    children.add(child)
    jo = empty(j.get('name'), links[parent], origin_matrix(j))
    jtype = j.get('type')
    if jtype in ('revolute', 'continuous', 'prismatic'):
        jo['urdf_type'] = jtype
        jo['axis'] = [float(v) for v in (j.find('axis').get('xyz') if j.find('axis') is not None else '1 0 0').split()]
        lim = j.find('limit')
        if lim is not None and lim.get('lower') is not None:
            jo['lower'], jo['upper'] = float(lim.get('lower')), float(lim.get('upper'))
    c = links[child]
    c.parent = jo
    c.matrix_parent_inverse = Matrix.Identity(4)
    c.matrix_basis = Matrix.Identity(4)

roots = [n for n in links if n not in children]
robot = empty(root.get('name', 'robot'))
for n in roots:
    links[n].parent = robot

tris = sum(len(o.data.polygons) for o in scene.objects if o.type == 'MESH')
print(f'roots={roots} meshes={sum(o.type == "MESH" for o in scene.objects)} faces={tris} materials={len(mats)}')

bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=False, export_extras=True,
                          export_apply=True, export_normals=True, export_texcoords=False,
                          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
                          export_draco_position_quantization=14, export_draco_normal_quantization=8)
