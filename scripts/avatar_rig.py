"""Rig the static Tripo model of Rodrigo and pose it sitting (on a low seat by default).

Run inside Blender:
  blender -b --factory-startup -P scripts/avatar_rig.py -- images/me/rodrigo.glb public/models/rodrigo.glb [stool|floor] [preview_dir]

The Tripo export is a standing mesh, 1 unit tall, with no skeleton. This script
builds a simple humanoid armature fitted to it, binds the mesh with automatic
weights, sets the sitting pose, shrinks the texture and exports a skinned GLB
whose bones start in that pose. The page then only adds small motions on top
(typing, head turns) by rotating bones named below.
"""
import math
import sys

import bpy
from mathutils import Matrix, Quaternion, Vector

args = sys.argv[sys.argv.index('--') + 1:]
SRC, OUT = args[:2]
POSE_NAME = args[2] if len(args) > 2 else 'stool'
PREVIEW = args[3] if len(args) > 3 else None
TEX = 1024

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC, merge_vertices=True)
scene = bpy.context.scene
mesh = next(o for o in scene.objects if o.type == 'MESH')
mesh.name = 'rodrigo'
# Bake the import transform so mesh and armature share world space (Z up, facing -Y).
bpy.ops.object.select_all(action='DESELECT')
mesh.select_set(True)
bpy.context.view_layer.objects.active = mesh
mesh.parent = None
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in [o for o in scene.objects if o.type == 'EMPTY']:
    bpy.data.objects.remove(o)
bpy.ops.object.shade_smooth()

# ---------------------------------------------------------------- armature
# Joint positions measured on the mesh (x: character's left is +, y: front is -, z: up).
J = {
    'hips': (0, 0.015, 0.47), 'spine': (0, 0.015, 0.54), 'chest': (0, 0.015, 0.64), 'neck': (0, 0.012, 0.80),
    'head': (0, 0.0, 0.86), 'head_end': (0, 0.0, 0.99),
    'shoulder': (0.025, 0.015, 0.775), 'upper_arm': (0.108, 0.018, 0.765), 'forearm': (0.14, 0.022, 0.565),
    'hand': (0.142, 0.0, 0.425), 'hand_end': (0.14, -0.012, 0.35),
    'thigh': (0.062, 0.02, 0.47), 'shin': (0.07, 0.015, 0.25), 'foot': (0.076, 0.035, 0.065), 'foot_end': (0.082, -0.075, 0.015),
}
arm_data = bpy.data.armatures.new('rig')
rig = bpy.data.objects.new('rig', arm_data)
scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='EDIT')


def bone(name, head, tail, parent=None, connect=False):
    b = arm_data.edit_bones.new(name)
    b.head, b.tail = Vector(head), Vector(tail)
    if parent:
        b.parent = arm_data.edit_bones[parent]
        b.use_connect = connect
    return b


def side(p, s):
    return (p[0] * s, p[1], p[2])


bone('hips', J['hips'], J['spine'])
bone('spine', J['spine'], J['chest'], 'hips', True)
bone('chest', J['chest'], J['neck'], 'spine', True)
bone('neck', J['neck'], J['head'], 'chest', True)
bone('head', J['head'], J['head_end'], 'neck', True)
for sfx, s in (('L', 1), ('R', -1)):
    bone(f'shoulder_{sfx}', side(J['shoulder'], s), side(J['upper_arm'], s), 'chest')
    bone(f'upper_arm_{sfx}', side(J['upper_arm'], s), side(J['forearm'], s), f'shoulder_{sfx}', True)
    bone(f'forearm_{sfx}', side(J['forearm'], s), side(J['hand'], s), f'upper_arm_{sfx}', True)
    bone(f'hand_{sfx}', side(J['hand'], s), side(J['hand_end'], s), f'forearm_{sfx}', True)
    bone(f'thigh_{sfx}', side(J['thigh'], s), side(J['shin'], s), 'hips')
    bone(f'shin_{sfx}', side(J['shin'], s), side(J['foot'], s), f'thigh_{sfx}', True)
    bone(f'foot_{sfx}', side(J['foot'], s), side(J['foot_end'], s), f'shin_{sfx}', True)
bpy.ops.object.mode_set(mode='OBJECT')

# Bind. Bone-heat weighting often fails on generated meshes (open seams, loose pieces),
# so it runs on a watertight voxel copy and the weights are transferred to the real mesh.
def select_only(*obs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in obs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = obs[-1]


proxy = None
for voxel in (0.008, 0.010, 0.012, 0.016):          # finer first; bone heat is fussy about the mesh
    proxy = mesh.copy()
    proxy.data = mesh.data.copy()
    proxy.name = 'proxy'
    scene.collection.objects.link(proxy)
    select_only(proxy)
    rem = proxy.modifiers.new('remesh', 'REMESH')
    rem.mode = 'VOXEL'
    rem.voxel_size = voxel
    bpy.ops.object.modifier_apply(modifier='remesh')
    select_only(proxy, rig)
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    ok = sum(1 for v in proxy.data.vertices if v.groups)
    print('proxy voxel', voxel, 'vertices', len(proxy.data.vertices), 'bound', ok)
    if ok >= len(proxy.data.vertices) * 0.95:
        break
    bpy.data.objects.remove(proxy)
    proxy = None
if proxy is None:
    raise SystemExit('automatic weighting failed on every proxy mesh')

for b in arm_data.bones:
    mesh.vertex_groups.new(name=b.name)
select_only(mesh)
dt = mesh.modifiers.new('weights', 'DATA_TRANSFER')
dt.object = proxy
dt.use_vert_data = True
dt.data_types_verts = {'VGROUP_WEIGHTS'}
dt.vert_mapping = 'POLYINTERP_NEAREST'
dt.layers_vgroup_select_src = 'ALL'
dt.layers_vgroup_select_dst = 'NAME'
bpy.ops.object.modifier_apply(modifier='weights')
bpy.ops.object.vertex_group_limit_total(group_select_mode='ALL', limit=4)
bpy.ops.object.vertex_group_normalize_all(group_select_mode='ALL', lock_active=False)
bpy.data.objects.remove(proxy)
select_only(mesh, rig)
bpy.ops.object.parent_set(type='ARMATURE')
# A few vertices can end up with no weights; give each the weights of the nearest bound vertex.
from mathutils import kdtree
has = lambda v: any(g.weight > 0 for g in v.groups)
bound = [v for v in mesh.data.vertices if has(v)]
loose = [v for v in mesh.data.vertices if not has(v)]
kd = kdtree.KDTree(len(bound))
for i, v in enumerate(bound):
    kd.insert(v.co, i)
kd.balance()
for v in loose:
    for g in bound[kd.find(v.co)[1]].groups:
        mesh.vertex_groups[g.group].add([v.index], g.weight, 'REPLACE')
print('vertices', len(mesh.data.vertices), 'weights copied from nearest for', len(loose))

# ---------------------------------------------------------------- pose
pb = rig.pose.bones
for b in pb:
    b.rotation_mode = 'QUATERNION'


def aim(name, direction, twist=0.0):
    """Rotate a pose bone (shortest arc) so it points along a world direction, then twist about its length."""
    bpy.context.view_layer.update()
    b = pb[name]
    m = rig.matrix_world @ b.matrix
    cur = (m.to_3x3() @ Vector((0, 1, 0))).normalized()
    q = cur.rotation_difference(Vector(direction).normalized())
    rot = q.to_matrix().to_4x4()
    pos = m.translation.copy()
    new = Matrix.Translation(pos) @ rot @ Matrix.Translation(-pos) @ m
    if twist:
        axis = (new.to_3x3() @ Vector((0, 1, 0))).normalized()
        new = Matrix.Translation(pos) @ Quaternion(axis, twist).to_matrix().to_4x4() @ Matrix.Translation(-pos) @ new
    b.matrix = rig.matrix_world.inverted() @ new
    bpy.context.view_layer.update()


TW = float(args[4]) if len(args) > 4 else 1.4      # palm-down twist in radians (try the other sign if palms face up)

# Each pose: how far the hips drop, then a world direction (x, y, z) for every bone that moves.
POSES = {
    # Cross-legged on the floor.
    'floor': (0.375, {
        'spine': (0, -0.10, 1), 'chest': (0, -0.18, 1), 'neck': (0, -0.12, 1), 'head': (0, -0.10, 1),
        'thigh_L': (0.80, -0.62, 0.10), 'shin_L': (-0.88, -0.40, -0.16), 'foot_L': (-0.75, -0.45, -0.45),
        'thigh_R': (-0.80, -0.62, 0.10), 'shin_R': (0.86, -0.12, -0.14), 'foot_R': (0.75, -0.25, -0.5),
        'upper_arm_L': (0.22, -0.42, -1), 'forearm_L': (-0.42, -1, 0.05), 'hand_L': (-0.3, -1, -0.1),
        'upper_arm_R': (-0.22, -0.42, -1), 'forearm_R': (0.42, -1, 0.05), 'hand_R': (0.3, -1, -0.1),
    }),
    # On a low seat: thighs level, shins down, feet flat, laptop on the knees.
    'stool': (0.222, {
        'spine': (0, -0.06, 1), 'chest': (0, -0.16, 1), 'neck': (0, -0.10, 1), 'head': (0, -0.12, 1),
        'thigh_L': (0.20, -1, 0.02), 'shin_L': (0.02, -0.10, -1), 'foot_L': (0.10, -0.91, -0.41),
        'thigh_R': (-0.20, -1, 0.02), 'shin_R': (-0.02, -0.10, -1), 'foot_R': (-0.10, -0.91, -0.41),
        # Elbows by the ribs, forearms in and slightly up, hands angled down onto the keyboard.
        # The 4th number twists the bone about its own length: it turns the palms down (pronation).
        'upper_arm_L': (0.22, 0.10, -1), 'forearm_L': (-0.62, -1, 0.10, TW * 0.5), 'hand_L': (-0.05, -1, -0.26, TW * 0.5),
        'upper_arm_R': (-0.22, 0.10, -1), 'forearm_R': (0.62, -1, 0.10, -TW * 0.5), 'hand_R': (0.05, -1, -0.26, -TW * 0.5),
    }),
}
SIT_DROP, POSE = POSES[POSE_NAME]

order = ['spine', 'chest', 'neck', 'head', 'thigh_L', 'shin_L', 'foot_L', 'thigh_R', 'shin_R', 'foot_R',
         'upper_arm_L', 'forearm_L', 'hand_L', 'upper_arm_R', 'forearm_R', 'hand_R']
pb['hips'].location = pb['hips'].bone.matrix_local.to_3x3().inverted() @ Vector((0, 0, -SIT_DROP))
for n in order:
    aim(n, POSE[n][:3], POSE[n][3] if len(POSE[n]) > 3 else 0.0)
bpy.context.view_layer.update()
zs = [(mesh.evaluated_get(bpy.context.evaluated_depsgraph_get()).matrix_world @ v.co).z
      for v in mesh.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices]
print('posed z range', round(min(zs), 3), round(max(zs), 3))
dg = bpy.context.evaluated_depsgraph_get()
seat = [(mesh.evaluated_get(dg).matrix_world @ v.co) for v in mesh.evaluated_get(dg).data.vertices]
print('underside behind the hips (seat height)', round(min(p.z for p in seat if p.y > 0.0), 3))
for n in ('hand_L', 'hand_R', 'head', 'hips', 'thigh_L'):
    print(n, 'head', [round(c, 3) for c in (rig.matrix_world @ pb[n].head)], 'tail', [round(c, 3) for c in (rig.matrix_world @ pb[n].tail)])

# ---------------------------------------------------------------- previews
if PREVIEW:
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.display.shading.light = 'STUDIO'
    scene.display.shading.color_type = 'TEXTURE'
    scene.render.resolution_x, scene.render.resolution_y = 900, 900
    scene.world = bpy.data.worlds.new('w')
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
    scene.collection.objects.link(cam)
    scene.camera = cam
    cam.data.type = 'ORTHO'
    cam.data.ortho_scale = 1.0
    rig.hide_render = True
    for name, ang, elev in (('front', 0, 12), ('q', 40, 12), ('side', 90, 5), ('back', 180, 12), ('top', 0, 80)):
        a, e = math.radians(ang), math.radians(elev)
        cam.location = Vector((math.sin(a) * math.cos(e) * 3, -math.cos(a) * math.cos(e) * 3 - 0.1, 0.38 + math.sin(e) * 3))
        cam.rotation_euler = (math.pi / 2 - e, 0, a)
        scene.render.filepath = f'{PREVIEW}/{POSE_NAME}_{name}.png'
        bpy.ops.render.render(write_still=True)
    scene.collection.objects.unlink(cam)

# ---------------------------------------------------------------- export
for img in bpy.data.images:
    if img.size[0] > TEX:
        img.scale(TEX, TEX)
bpy.ops.object.select_all(action='DESELECT')
mesh.select_set(True)
rig.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_yup=True,
                          export_image_format='JPEG', export_jpeg_quality=85, export_animations=False,
                          export_rest_position_armature=False, export_skins=True,
                          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
                          export_draco_position_quantization=14, export_draco_normal_quantization=10, export_draco_texcoord_quantization=12)
