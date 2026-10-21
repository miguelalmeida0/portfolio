"""Build original inflated capitals from smooth 3D strokes, not extruded font faces.
Run: PYTHONPATH=.cache/inflated-tools python3 scripts/build-inflated-type.py
No model service, font download, generated imagery or paid credits.
"""
from pathlib import Path
import json
import numpy as np
from scipy.ndimage import gaussian_filter, map_coordinates
from skimage.measure import marching_cubes

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'static/models'

def arc(cx, cy, rx, ry, start, end, count=32):
    angles = np.linspace(start, end, count)
    return np.column_stack([cx+rx*np.cos(angles), cy+ry*np.sin(angles)]).tolist()

def stroke(points, radius=.105): return (points, radius)

# Authored centre lines: condensed, open counters, gently tapered terminals.
GLYPHS = {
 'F': (.64, [stroke([[.12,.12],[.135,.5],[.12,.87]]), stroke([[.12,.87],[.52,.885]],.112), stroke([[.14,.51],[.46,.525]],.095)]),
 'R': (.70, [stroke([[.12,.12],[.125,.5],[.12,.87]]), stroke([[.13,.87],[.34,.875]]+arc(.34,.69,.205,.185,np.pi/2,-np.pi/2,20)+[[.13,.505]],.095), stroke([[.30,.49],[.42,.31],[.57,.12]],.107)]),
 'O': (.69, [stroke(arc(.335,.5,.215,.375,0,2*np.pi,48),.103)]),
 'N': (.70, [stroke([[.12,.12],[.12,.87]],.104), stroke([[.13,.86],[.33,.5],[.56,.13]],.098), stroke([[.57,.13],[.57,.87]],.104)]),
 'T': (.66, [stroke([[.11,.88],[.32,.895],[.55,.875]],.111), stroke([[.33,.85],[.315,.50],[.32,.12]],.108)]),
 'E': (.64, [stroke([[.12,.12],[.12,.87]],.104), stroke([[.13,.87],[.52,.885]],.108), stroke([[.13,.5],[.45,.51]],.092), stroke([[.13,.12],[.53,.13]],.108)]),
 'D': (.70, [stroke([[.12,.12],[.12,.87]],.106), stroke([[.14,.87],[.30,.87]]+arc(.30,.5,.265,.37,np.pi/2,-np.pi/2,28)+[[.14,.13]],.103)]),
 'G': (.70, [stroke(arc(.34,.5,.215,.375,np.pi*.20,np.pi*1.84,38),.103), stroke([[.54,.30],[.55,.45],[.37,.45]],.092)]),
 'I': (.30, [stroke([[.145,.12],[.15,.50],[.14,.88]],.113)])
}

def smooth_min(a,b,k=.065):
    h=np.clip(.5+.5*(b-a)/k,0,1)
    return b*(1-h)+a*h-k*h*(1-h)

def field(points, strokes):
    # Extra front/back fullness: every stroke has a curved face, including its centre.
    p=points.copy(); p[...,2]/=1.27
    result=np.full(points.shape[:-1],10.,dtype=np.float32)
    for coords,radius in strokes:
        value=np.full(points.shape[:-1],10.,dtype=np.float32)
        for i in range(len(coords)-1):
            a=np.array([*coords[i],0]);b=np.array([*coords[i+1],0]);d=b-a
            if np.dot(d,d)<1e-12: continue
            t=np.clip(np.sum((p-a)*d,axis=-1)/np.dot(d,d),0,1)
            # A quiet swell, not a constant-width pipe.
            phase=(i+t)/max(1,len(coords)-1)
            r=radius*(.97+.055*np.sin(np.pi*phase))
            distance=np.linalg.norm(p-a-t[...,None]*d,axis=-1)-r
            value=np.minimum(value,distance)
        result=smooth_min(result,value)
    return result

chunks=[]; manifest={'name':'Miguel inflated capitals','version':1,'glyphs':{}}
offset=0
for char,(advance,strokes) in GLYPHS.items():
    # Condense the skeleton before inflation, preserving full, rounded stroke widths.
    strokes=[([[x*.78,y] for x,y in coords],radius) for coords,radius in strokes]
    step=.016
    origin=np.array([-.08,-.045,-.23])
    axes=[np.arange(origin[0],advance+.09,step),np.arange(origin[1],1.075,step),np.arange(origin[2],.235,step)]
    coords=np.stack(np.meshgrid(*axes,indexing='ij'),-1)
    sdf=gaussian_filter(field(coords,strokes),.65)
    vertices,faces,_,_=marching_cubes(sdf,0,spacing=(step,step,step),gradient_direction='ascent',allow_degenerate=False)
    vertices+=origin
    lookup=((vertices-origin)/step).T
    gradients=np.gradient(sdf,step)
    normals=np.stack([map_coordinates(g,lookup,order=1,mode='nearest') for g in gradients],-1)
    normals/=np.maximum(np.linalg.norm(normals,axis=1,keepdims=True),1e-10)
    # Consistent outward winding, independently checked against the field gradient.
    geometric=np.cross(vertices[faces[:,1]]-vertices[faces[:,0]],vertices[faces[:,2]]-vertices[faces[:,0]])
    flip=np.sum(geometric*normals[faces].mean(1),axis=1)<0
    faces[flip]=faces[flip][:,[0,2,1]]
    occlusion=np.zeros(len(vertices))
    for distance,weight in [(.035,.45),(.075,.35),(.14,.2)]:
        samples=vertices+normals*distance
        sd=map_coordinates(sdf,((samples-origin)/step).T,order=1,mode='nearest')
        occlusion+=np.maximum(0,distance-sd)/distance*weight
    ao=np.clip(1-occlusion*.48,.6,1)
    colors=np.repeat(ao[:,None],3,axis=1)
    entry={'advance':float(vertices[:,0].max()-vertices[:,0].min()),'vertices':len(vertices),'triangles':len(faces)}
    for name,array,dtype in [('position',vertices,'<f4'),('normal',np.rint(normals*32767),'<i2'),('color',np.rint(colors*255),'u1'),('index',faces,'<u2')]:
        packed=np.asarray(array,dtype=dtype).tobytes()
        entry[name]={'offset':offset,'length':int(np.asarray(array).size)}
        padding=bytes((-len(packed))%4)
        chunks.append(packed+padding);offset+=len(packed)+len(padding)
    manifest['glyphs'][char]=entry
    print(char,len(vertices),'vertices',len(faces),'triangles')
OUT.mkdir(exist_ok=True)
(OUT/'inflated-type.bin').write_bytes(b''.join(chunks))
(OUT/'inflated-type.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n')
print('Total bytes:',offset)
