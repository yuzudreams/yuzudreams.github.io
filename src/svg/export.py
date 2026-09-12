import krita
import xml
from pathlib import Path
import random

kr = krita.Krita.instance()
doc = next(d for d in kr.documents() if d.fileName().endswith("border.kra"))
dir = Path(doc.fileName()).parent
corner = doc.nodeByName("corner")
edge = doc.nodeByName("edge")

corner_dir = dir / "corner"
corner_dir.mkdir(exist_ok=True)

edge_dir = dir / "edge"
edge_dir.mkdir(exist_ok=True)

for i, node in enumerate(corner.childNodes()):
    svg = xml.dom.minidom.parseString(node.toSvg())
    svg_el = svg.documentElement
    g = svg.createElement("g")
    for child in [n for n in svg_el.childNodes]:
        g.appendChild(child)
    g.setAttribute("transform", f"rotate({i * 90} 200 200)")
    svg_el.appendChild(g)

    path = corner_dir / f"{i}.svg"
    path.write_text(svg_el.toxml())
    print(f"Written {path}")

edge_parts = [xml.dom.minidom.parseString(node.toSvg()).documentElement.childNodes for node in edge.childNodes()]

for i in range(4):
    svg = xml.dom.minidom.parseString("<svg xmlns='http://www.w3.org/2000/svg' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'></svg>")
    svg_el = svg.documentElement
    svg_el.setAttribute("viewBox", f"0 0 {400 * len(edge_parts)} 400" if i & 1 == 0 else f"0 0 400 {400 * len(edge_parts)}")
    random.shuffle(edge_parts)
    for j, edge_part in enumerate(edge_parts):
        g = svg.createElement("g")
        for child in edge_part:
            g.appendChild(svg.importNode(child, True))
        translate = f"{j * 400} 0" if i & 1 == 0 else f"0 {j * 400}"
        g.setAttribute("transform", f"translate({translate}) rotate({i * 90} 200 200)")
        svg_el.appendChild(g)

    path = edge_dir / f"{i}.svg"
    path.write_text(svg_el.toxml())
    print(f"Written {path}")
    
small_bubble = doc.nodeByName("small bubble")
big_bubble = doc.nodeByName("big bubble")
(dir / "small-bubble.svg").write_text(small_bubble.toSvg())
(dir / "big-bubble.svg").write_text(big_bubble.toSvg())
print(f"Written small-bubble.svg and big-bubble.svg")