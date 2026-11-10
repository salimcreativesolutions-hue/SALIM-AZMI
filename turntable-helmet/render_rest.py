
import bpy, math
sc=bpy.context.scene; em=bpy.data.objects["Turn"]
out="/Users/salim/Desktop/SALIM AZMI WEBSITE/turntable-helmet/frames"
for i in range(8,72):
    em.rotation_euler=(0,0,math.radians(5*i))
    sc.render.filepath=f"{out}/f{i:03d}.png"
    bpy.ops.render.render(write_still=True)
open("/Users/salim/Desktop/SALIM AZMI WEBSITE/turntable-helmet/DONE.txt","w").write("ok")
