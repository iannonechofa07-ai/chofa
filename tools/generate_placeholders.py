#!/usr/bin/env python3
"""
Genera las imágenes placeholder (SVG) de Amaré Studio.

Son ilustraciones cálidas de álbumes (abiertos y cerrados, luz de ventana,
flores secas, taza de café) para usar hasta tener las fotos reales.
Para reemplazarlas: poné tus fotos en assets/img/ y actualizá las rutas en
js/data/products.js (o directamente en el HTML).

Uso (solo en desarrollo, no hace falta para publicar):
    python3 tools/generate_placeholders.py
"""

import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

SERIF = "'Cormorant Garamond', 'Fraunces', Georgia, 'Times New Roman', serif"

CREAM = "#F5EFE6"
LINEN = "#EDE3D6"
ROSE = "#EBA6CB"
BROWN = "#1C1C1C"
GOLD = "#DC8AB9"


# --------------------------------------------------------------------------
# Escenas ("fotos" dentro de los álbumes). Dibujadas en un lienzo 160x120.
# --------------------------------------------------------------------------

def _sky(uid, top, bottom):
    return (f'<defs><linearGradient id="{uid}s" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/>'
            f'</linearGradient></defs><rect width="160" height="120" fill="url(#{uid}s)"/>')


def scene_sunset(uid):
    return (_sky(uid, "#F3C9A8", "#F7E3CF")
            + '<circle cx="104" cy="62" r="16" fill="#FBEBD6" opacity=".95"/>'
            + '<path d="M0 78 Q40 58 80 72 T160 66 V120 H0Z" fill="#D9A28F"/>'
            + '<path d="M0 92 Q50 74 100 88 T160 84 V120 H0Z" fill="#B97D6C"/>'
            + '<path d="M0 104 Q60 92 120 102 T160 100 V120 H0Z" fill="#8A5A4B"/>')


def scene_sea(uid):
    return (_sky(uid, "#E9D8C8", "#F4E7DA")
            + '<circle cx="48" cy="60" r="11" fill="#FFF3E4"/>'
            + '<rect y="66" width="160" height="54" fill="#A9B7B3"/>'
            + '<rect y="66" width="160" height="6" fill="#C5CEC9" opacity=".8"/>'
            + '<path d="M0 98 Q40 92 80 98 T160 96 V120 H0Z" fill="#E8D5BE"/>'
            + '<path d="M112 64 L112 44 L124 62 Z" fill="#F8F1E7"/><path d="M106 64 H128 L124 68 H110Z" fill="#6B5347"/>')


def scene_cabin(uid):
    trees = "".join(
        f'<path d="M{x} {y} l-{w} {h} h{2*w} z" fill="{c}"/>'
        for x, y, w, h, c in [(14, 40, 12, 50, "#6F7A62"), (34, 30, 14, 60, "#56604C"),
                              (132, 34, 13, 56, "#56604C"), (150, 44, 11, 46, "#6F7A62"),
                              (118, 50, 9, 40, "#7F8A70")])
    return (_sky(uid, "#DCD5C8", "#EFE6D8")
            + '<path d="M0 60 L40 30 L70 52 L100 26 L160 58 V120 H0Z" fill="#B8B3A6" opacity=".6"/>'
            + trees
            + '<rect y="90" width="160" height="30" fill="#EFE9DF"/>'
            + '<path d="M58 68 L80 50 L102 68 Z" fill="#5B3B2E"/>'
            + '<rect x="62" y="68" width="36" height="24" fill="#8A5E48"/>'
            + '<rect x="70" y="74" width="8" height="8" fill="#F7C97E"/>'
            + '<rect x="84" y="76" width="8" height="16" fill="#4A3228"/>')


def scene_mountains(uid):
    return (_sky(uid, "#E7DCCF", "#F5EDE3")
            + '<path d="M0 80 L30 46 L52 66 L84 30 L118 70 L140 52 L160 64 V120 H0Z" fill="#B6A89A"/>'
            + '<path d="M84 30 L94 42 L88 44 L80 38Z" fill="#F7F2EA"/>'
            + '<path d="M0 94 L40 70 L76 88 L110 68 L160 90 V120 H0Z" fill="#8E7E70"/>'
            + '<rect y="84" width="160" height="10" fill="#F5EDE3" opacity=".35"/>'
            + '<path d="M0 108 Q80 96 160 108 V120 H0Z" fill="#6E5E52"/>')


def scene_couple(uid):
    return (_sky(uid, "#F2C6B4", "#F8E4D2")
            + '<circle cx="80" cy="74" r="20" fill="#FCE9D6" opacity=".9"/>'
            + '<rect y="80" width="160" height="40" fill="#C99A8A"/>'
            + '<rect y="80" width="160" height="3" fill="#E7C0AE"/>'
            + '<path d="M0 104 Q80 96 160 104 V120 H0Z" fill="#E6CDB5"/>'
            + '<g fill="#4A3228"><circle cx="70" cy="70" r="4.2"/><path d="M64 104 L65.5 76 Q70 73 74.5 76 L76 104Z"/>'
            + '<circle cx="88" cy="68" r="4.4"/><path d="M82 104 L83 75 Q88 72 93 75 L94 104Z"/>'
            + '<path d="M74 84 Q79 88 84 84" stroke="#4A3228" stroke-width="2.2" fill="none"/></g>')


def scene_nursery(uid):
    stars = "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#FFF7EC"/>'
                    for x, y, r in [(30, 26, 1.6), (120, 20, 1.4), (140, 44, 1.2), (20, 60, 1.2), (60, 16, 1.1)])
    return (_sky(uid, "#EFCFCB", "#F7E6E0")
            + stars
            + '<path d="M104 40 a16 16 0 1 0 12 26 a13 13 0 1 1 -12 -26z" fill="#FFF3E2"/>'
            + '<g fill="#FBF4EC"><circle cx="40" cy="92" r="16"/><circle cx="62" cy="86" r="20"/><circle cx="86" cy="94" r="15"/>'
            + '<rect x="30" y="94" width="66" height="26"/></g>'
            + '<g fill="#F4E6DA"><circle cx="118" cy="100" r="12"/><circle cx="136" cy="96" r="15"/><rect x="110" y="100" width="50" height="20"/></g>')


def scene_grad(uid):
    def cap(x, y, a, c):
        return (f'<g transform="translate({x} {y}) rotate({a})"><path d="M-12 0 L0 -6 L12 0 L0 6Z" fill="{c}"/>'
                f'<rect x="-6" y="2" width="12" height="6" rx="1.5" fill="{c}"/>'
                f'<path d="M8 1 V10" stroke="#E08DBC" stroke-width="1.2"/></g>')
    return (_sky(uid, "#DDE3E2", "#F4ECE2")
            + cap(40, 36, -18, "#3E2C25") + cap(92, 22, 14, "#4A3228") + cap(128, 48, -8, "#3E2C25")
            + cap(66, 58, 24, "#5A4034")
            + '<path d="M0 96 Q80 84 160 96 V120 H0Z" fill="#C8B9A6"/>'
            + '<g fill="#6B4E40"><circle cx="50" cy="84" r="3.6"/><path d="M45 110 L46 88 H54 L55 110Z"/>'
            + '<path d="M54 90 L64 76" stroke="#6B4E40" stroke-width="2.4"/>'
            + '<circle cx="110" cy="86" r="3.6"/><path d="M105 112 L106 90 H114 L115 112Z"/>'
            + '<path d="M106 92 L98 78" stroke="#6B4E40" stroke-width="2.4"/></g>')


def scene_flowers(uid):
    rnd = random.Random(uid)
    blooms = []
    for _ in range(26):
        x = rnd.uniform(4, 156)
        y = rnd.uniform(78, 116)
        c = rnd.choice(["#E8C4C0", "#F3DCCB", "#D99F97", "#FBF1E4", "#C9A565"])
        blooms.append(f'<path d="M{x:.1f} {y+14:.1f} Q{x+rnd.uniform(-3,3):.1f} {y+7:.1f} {x:.1f} {y:.1f}" stroke="#7F8A70" stroke-width=".8" fill="none"/>'
                      f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rnd.uniform(1.8,3.4):.1f}" fill="{c}"/>')
    return (_sky(uid, "#F1DCC8", "#F8EEE2")
            + '<circle cx="118" cy="48" r="14" fill="#FDF3E3"/>'
            + '<path d="M0 84 Q80 70 160 82 V120 H0Z" fill="#B7B08E"/>'
            + "".join(blooms))


def scene_family(uid):
    return (_sky(uid, "#F0D9C6", "#F7EBDD")
            + '<circle cx="36" cy="46" r="12" fill="#FCEEDC"/>'
            + '<path d="M0 88 Q80 76 160 90 V120 H0Z" fill="#C6AE8F"/>'
            + '<g fill="#4A3228"><circle cx="64" cy="62" r="4.4"/><path d="M58 98 L59 70 Q64 67 69 70 L70 98Z"/>'
            + '<circle cx="98" cy="60" r="4.6"/><path d="M92 98 L93 69 Q98 66 103 69 L104 98Z"/>'
            + '<circle cx="81" cy="78" r="3.2"/><path d="M77 98 L77.6 83 Q81 81 84.4 83 L85 98Z"/>'
            + '<path d="M69 80 L77 86 M85 86 L93 80" stroke="#4A3228" stroke-width="2"/></g>')


def scene_road(uid):
    return (_sky(uid, "#EFD2BE", "#F7E9DA")
            + '<circle cx="80" cy="58" r="12" fill="#FCEBD4"/>'
            + '<path d="M0 64 L30 56 L60 62 L100 54 L160 64 V120 H0Z" fill="#B99885" opacity=".7"/>'
            + '<rect y="66" width="160" height="54" fill="#CDB59A"/>'
            + '<path d="M70 66 L90 66 L140 120 L20 120Z" fill="#6E5A4F"/>'
            + '<path d="M80 70 V76 M80 82 V92 M80 100 V116" stroke="#F4E7D6" stroke-width="1.6"/>')


SCENES = {
    "sunset": scene_sunset, "sea": scene_sea, "cabin": scene_cabin, "mountains": scene_mountains,
    "couple": scene_couple, "nursery": scene_nursery, "grad": scene_grad, "flowers": scene_flowers,
    "family": scene_family, "road": scene_road,
}


def photo(kind, x, y, w, h, uid, radius=0):
    """Una 'foto' (escena) recortada al rectángulo dado."""
    return (f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="0 0 160 120" '
            f'preserveAspectRatio="xMidYMid slice"><g>{SCENES[kind](uid)}</g>'
            f'<rect width="160" height="120" fill="#fff" opacity=".04"/></svg>')


# --------------------------------------------------------------------------
# Piezas compartidas: textura de lino, luz de ventana, sombras, props.
# --------------------------------------------------------------------------

def defs_common(uid):
    return f'''<defs>
<filter id="{uid}grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/>
  <feColorMatrix type="matrix" values="0 0 0 0 .29  0 0 0 0 .2  0 0 0 0 .16  0 0 0 .07 0"/>
  <feComposite in2="SourceGraphic" operator="in"/>
</filter>
<filter id="{uid}shadow" x="-20%" y="-20%" width="140%" height="150%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="18"/>
  <feOffset dx="10" dy="22"/>
  <feComponentTransfer><feFuncA type="linear" slope=".22"/></feComponentTransfer>
  <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="{uid}soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
<linearGradient id="{uid}spine" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#000" stop-opacity="0"/>
  <stop offset=".44" stop-color="#4A3228" stop-opacity=".05"/>
  <stop offset=".5" stop-color="#4A3228" stop-opacity=".22"/>
  <stop offset=".56" stop-color="#4A3228" stop-opacity=".05"/>
  <stop offset="1" stop-color="#000" stop-opacity="0"/>
</linearGradient>
</defs>'''


NEUTRALS = ["#F3F2F0", "#EDEBE8", "#F6F5F3", "#E9E7E4"]
COVER_MAP = {
    "#B98B84": "#DE93BE", "#E3C2BC": "#F2C9DE", "#D9B2A8": "#F2C9DE", "#D7A8A2": "#F2C9DE",
    "#6E5A4F": "#1E1E1E", "#4A3228": "#1E1E1E", "#3F3A36": "#1E1E1E", "#9C7B6B": "#2A2A2A",
    "#9A7B63": "#BDB9B4", "#8A6B5C": "#2A2A2A", "#8C9A94": "#BDB9B4",
}


def cover_color(c):
    return COVER_MAP.get(c, c)


def background(uid, w, h, color):
    color = NEUTRALS[sum(ord(ch) for ch in color) % len(NEUTRALS)]
    return (f'<rect width="{w}" height="{h}" fill="{color}"/>'
            f'<rect width="{w}" height="{h}" fill="{color}" filter="url(#{uid}grain)"/>')


def window_light(uid, w, h, angle=-28):
    """Rayos de luz suaves en diagonal, como luz natural de ventana."""
    bars = "".join(
        f'<rect x="{w*0.1 + i*w*0.2:.0f}" y="{-h*0.4:.0f}" width="{w*0.11:.0f}" height="{h*1.9:.0f}" fill="#FFFDF8"/>'
        for i in range(4))
    return (f'<g opacity=".26" filter="url(#{uid}soft)" transform="rotate({angle} {w/2} {h/2})">{bars}</g>')


def sprig(x, y, scale=1.0, rot=0, color="#9C9A92", bloom="#EBA6CB"):
    rnd = random.Random(int(x * 7 + y))
    leaves = []
    for i in range(9):
        t = i / 9
        px, py = 0 + t * 12, -t * 220
        side = -1 if i % 2 else 1
        leaves.append(f'<ellipse cx="{px + side*10:.1f}" cy="{py:.1f}" rx="10" ry="4" '
                      f'transform="rotate({side*35} {px + side*10:.1f} {py:.1f})" fill="{color}" opacity=".75"/>')
    flowers = "".join(f'<circle cx="{12 + rnd.uniform(-12, 12):.1f}" cy="{-220 - rnd.uniform(0, 28):.1f}" r="{rnd.uniform(4,7):.1f}" fill="{bloom}"/>'
                      for _ in range(7))
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({scale})">'
            f'<path d="M0 0 Q6 -110 12 -230" stroke="{color}" stroke-width="2.5" fill="none"/>'
            + "".join(leaves) + flowers + '</g>')


def coffee(x, y, r=70):
    return (f'<g transform="translate({x} {y})">'
            f'<circle r="{r*1.45}" fill="#FBF7F1" opacity=".95"/><circle r="{r*1.45}" fill="none" stroke="#E4D6C6" stroke-width="2"/>'
            f'<circle r="{r}" fill="#FFFCF7"/><circle r="{r*0.78}" fill="#6E4A38"/>'
            f'<circle r="{r*0.78}" fill="none" stroke="#8C6450" stroke-width="3"/>'
            f'<ellipse cx="{-r*0.2}" cy="{-r*0.25}" rx="{r*0.3}" ry="{r*0.14}" fill="#C8A58A" opacity=".5"/>'
            f'<rect x="{r*0.92}" y="-12" width="{r*0.5}" height="24" rx="12" fill="#FFFCF7"/></g>')


def pencil(x, y, rot=0, length=320):
    return (f'<g transform="translate({x} {y}) rotate({rot})">'
            f'<rect width="{length}" height="16" rx="3" fill="#D9B98C"/>'
            f'<rect width="{length}" height="5" fill="#E7CDA6"/>'
            f'<path d="M{length} 0 L{length+36} 8 L{length} 16Z" fill="#F1DEC4"/>'
            f'<path d="M{length+26} 5 L{length+36} 8 L{length+26} 11Z" fill="{BROWN}"/>'
            f'<rect x="-24" width="24" height="16" rx="4" fill="#C9A565"/></g>')


# --------------------------------------------------------------------------
# Álbum abierto (vista cenital)
# --------------------------------------------------------------------------

def open_album(uid, cx, cy, pw, ph, layout, cover="#8A6B5C", rot=0, title=None, subtitle=None):
    """Álbum abierto centrado en (cx, cy). pw/ph = tamaño de UNA página."""
    x0, y0 = -pw, -ph / 2
    m = pw * 0.09  # margen interno
    cover = cover_color(cover)
    parts = [f'<g transform="translate({cx} {cy}) rotate({rot})" filter="url(#{uid}shadow)">']
    # tapa (se asoma por los bordes)
    parts.append(f'<rect x="{x0-14}" y="{y0-12}" width="{pw*2+28}" height="{ph+24}" rx="10" fill="{cover}"/>')
    # páginas (efecto de hojas apiladas)
    for i in (3, 2, 1):
        parts.append(f'<rect x="{x0 - i*1.5}" y="{y0 + i}" width="{pw*2 + i*3}" height="{ph}" rx="3" fill="#E6E4E0"/>')
    parts.append(f'<rect x="{x0}" y="{y0}" width="{pw}" height="{ph}" rx="2" fill="#FFFCF6"/>')
    parts.append(f'<rect x="0" y="{y0}" width="{pw}" height="{ph}" rx="2" fill="#FFFDF8"/>')

    kinds = layout["photos"]
    style = layout["style"]
    if style == "classic":
        # Izquierda: foto grande. Derecha: dos fotos + pie de foto.
        parts.append(photo(kinds[0], x0 + m, y0 + m, pw - 2*m, ph - 2*m - pw*0.14, uid + "a"))
        parts.append(f'<rect x="{x0 + m}" y="{y0 + ph - m - pw*0.07}" width="{pw*0.3}" height="2.5" fill="{GOLD}" opacity=".7"/>')
        parts.append(photo(kinds[1], m, y0 + m, pw - 2*m, (ph - 3*m) * 0.52, uid + "b"))
        parts.append(photo(kinds[2], m, y0 + 2*m + (ph - 3*m) * 0.52, (pw - 3*m) * 0.55, (ph - 3*m) * 0.48, uid + "c"))
        tx = m + (pw - 3*m) * 0.55 + m
        ty = y0 + 2*m + (ph - 3*m) * 0.52 + pw * 0.08
        if title:
            parts.append(f'<text x="{tx}" y="{ty}" font-family="{SERIF}" font-style="italic" font-size="{pw*0.075:.0f}" fill="{BROWN}">{title}</text>')
        for k in range(3):
            parts.append(f'<rect x="{tx}" y="{ty + pw*0.05 + k*pw*0.035:.1f}" width="{pw*(0.26 - k*0.05):.1f}" height="3" rx="1.5" fill="#CFCBC6"/>')
    elif style == "full":
        # Foto panorámica que cruza el lomo.
        parts.append(photo(kinds[0], x0 + m, y0 + m, pw*2 - 2*m, ph - 2*m, uid + "a"))
    elif style == "text":
        # Izquierda: título tipográfico. Derecha: foto con marco.
        parts.append(f'<text x="{x0 + pw/2}" y="{y0 + ph*0.44}" text-anchor="middle" font-family="{SERIF}" font-size="{pw*0.12:.0f}" fill="{BROWN}">{title or "Nuestra historia"}</text>')
        parts.append(f'<text x="{x0 + pw/2}" y="{y0 + ph*0.52}" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-size="{pw*0.06:.0f}" fill="#777">{subtitle or "capítulo uno"}</text>')
        parts.append(f'<rect x="{x0 + pw/2 - pw*0.12}" y="{y0 + ph*0.58}" width="{pw*0.24}" height="2" fill="{GOLD}"/>')
        parts.append(photo(kinds[0], m*1.3, y0 + m*1.3, pw - 2.6*m, ph - 2.6*m, uid + "a"))
    elif style == "grid":
        g = m * 0.6
        cw, ch = (pw - 2*m - g) / 2, (ph - 2*m - g) / 2
        for i, k in enumerate(kinds[:4]):
            parts.append(photo(k, x0 + m + (i % 2)*(cw + g), y0 + m + (i // 2)*(ch + g), cw, ch, uid + f"g{i}"))
        parts.append(photo(kinds[4 % len(kinds)], m, y0 + m, pw - 2*m, ph*0.62, uid + "r"))
        if title:
            parts.append(f'<text x="{pw/2}" y="{y0 + ph*0.62 + m + pw*0.12}" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-size="{pw*0.08:.0f}" fill="{BROWN}">{title}</text>')
        parts.append(f'<rect x="{pw/2 - pw*0.1}" y="{y0 + ph*0.62 + m + pw*0.17}" width="{pw*0.2}" height="2" fill="{GOLD}"/>')

    # sombra del lomo y bordes
    parts.append(f'<rect x="{-pw*0.5}" y="{y0}" width="{pw}" height="{ph}" fill="url(#{uid}spine)"/>')
    parts.append('</g>')
    return "".join(parts)


# --------------------------------------------------------------------------
# Álbum cerrado (tapa)
# --------------------------------------------------------------------------

def closed_album(uid, cx, cy, w, h, cover, title, subtitle="", rot=0, window_kind=None, text_color="#F5EFE6"):
    x0, y0 = -w / 2, -h / 2
    cover = cover_color(cover)
    if cover in ("#F2C9DE", "#BDB9B4"):
        text_color = BROWN
    parts = [f'<g transform="translate({cx} {cy}) rotate({rot})" filter="url(#{uid}shadow)">']
    # canto de hojas
    parts.append(f'<rect x="{x0+8}" y="{y0+6}" width="{w}" height="{h}" rx="8" fill="#E6E4E0"/>')
    parts.append(f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="8" fill="{cover}"/>')
    parts.append(f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="8" fill="{cover}" filter="url(#{uid}grain)"/>')
    # lomo
    parts.append(f'<rect x="{x0}" y="{y0}" width="{w*0.07}" height="{h}" rx="8" fill="#000" opacity=".08"/>')
    parts.append(f'<rect x="{x0 + w*0.07}" y="{y0}" width="2" height="{h}" fill="#000" opacity=".1"/>')
    # marco dorado
    fx, fy, fw, fh = x0 + w*0.16, y0 + h*0.1, w*0.72, h*0.8
    parts.append(f'<rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" fill="none" stroke="{GOLD}" stroke-width="1.6" opacity=".85"/>')
    if window_kind:
        ww, wh = fw * 0.62, fw * 0.62 * 1.1
        parts.append(f'<rect x="{fx + (fw-ww)/2 - 6}" y="{fy + fh*0.12 - 6}" width="{ww+12}" height="{wh+12}" fill="#FFFCF6" opacity=".9"/>')
        parts.append(photo(window_kind, fx + (fw-ww)/2, fy + fh*0.12, ww, wh, uid + "w"))
        ty = fy + fh*0.12 + wh + h*0.1
    else:
        ty = fy + fh*0.48
    parts.append(f'<text x="{fx + fw/2}" y="{ty}" text-anchor="middle" font-family="{SERIF}" font-size="{w*0.085:.0f}" fill="{text_color}" letter-spacing="1">{title}</text>')
    if subtitle:
        parts.append(f'<text x="{fx + fw/2}" y="{ty + w*0.07}" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-size="{w*0.045:.0f}" fill="{text_color}" opacity=".8">{subtitle}</text>')
    parts.append('</g>')
    return "".join(parts)


# --------------------------------------------------------------------------
# Plantilla digital: tablet con pliego editable + hojas impresas
# --------------------------------------------------------------------------

def tablet_template(uid, cx, cy, w, layout, title):
    h = w * 0.72
    x0, y0 = -w / 2, -h / 2
    b = w * 0.035
    sw, sh = w - 2*b, h - 2*b
    parts = [f'<g transform="translate({cx} {cy})" filter="url(#{uid}shadow)">']
    parts.append(f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="{w*0.04}" fill="#1C1C1C"/>')
    parts.append(f'<rect x="{x0+b}" y="{y0+b}" width="{sw}" height="{sh}" rx="{w*0.012}" fill="#F3EEE7"/>')
    # barra de herramientas del editor (genérica)
    parts.append(f'<rect x="{x0+b}" y="{y0+b}" width="{sw}" height="{sh*0.08}" fill="#FFFFFF"/>')
    for i in range(4):
        parts.append(f'<rect x="{x0 + b + sh*0.03 + i*sh*0.09}" y="{y0 + b + sh*0.025}" width="{sh*0.06}" height="{sh*0.03}" rx="3" fill="#E5E3E0"/>')
    parts.append(f'<rect x="{x0 + b + sw - sh*0.22}" y="{y0 + b + sh*0.018}" width="{sh*0.19}" height="{sh*0.045}" rx="{sh*0.022}" fill="{BROWN}"/>')
    # pliego
    pw = sw * 0.38
    ph = pw * 1.1
    px = x0 + b + (sw - 2*pw) / 2
    py = y0 + b + sh*0.08 + (sh*0.92 - ph) / 2
    parts.append(f'<rect x="{px}" y="{py}" width="{pw*2}" height="{ph}" fill="#FFFDF8"/>')
    m = pw * 0.08
    parts.append(photo(layout[0], px + m, py + m, pw - 2*m, ph - 2*m, uid + "t1"))
    parts.append(photo(layout[1], px + pw + m, py + m, pw - 2*m, ph*0.55, uid + "t2"))
    parts.append(f'<text x="{px + pw*1.5}" y="{py + ph*0.55 + m + pw*0.12}" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-size="{pw*0.1:.0f}" fill="{BROWN}">{title}</text>')
    parts.append(f'<rect x="{px + pw*1.5 - pw*0.14}" y="{py + ph*0.55 + m + pw*0.18}" width="{pw*0.28}" height="2" fill="{GOLD}"/>')
    # caja de selección (edición)
    sx, sy, sw2, sh2 = px + pw + m, py + m, pw - 2*m, ph*0.55
    parts.append(f'<rect x="{sx-3}" y="{sy-3}" width="{sw2+6}" height="{sh2+6}" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-dasharray="0"/>')
    for hx, hy in [(sx-3, sy-3), (sx+sw2+3, sy-3), (sx-3, sy+sh2+3), (sx+sw2+3, sy+sh2+3)]:
        parts.append(f'<circle cx="{hx}" cy="{hy}" r="6" fill="#fff" stroke="#8B5CF6" stroke-width="2"/>')
    parts.append(f'<rect x="{px + pw - 1}" y="{py}" width="2" height="{ph}" fill="#4A3228" opacity=".12"/>')
    parts.append('</g>')
    return "".join(parts)


def printed_sheet(uid, cx, cy, w, kind, rot):
    h = w * 1.3
    return (f'<g transform="translate({cx} {cy}) rotate({rot})" filter="url(#{uid}shadow)">'
            f'<rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" fill="#FFFDF8"/>'
            + photo(kind, -w/2 + w*0.08, -h/2 + w*0.08, w*0.84, h*0.7, uid + f"p{kind}")
            + f'<rect x="{-w*0.2}" y="{h*0.34}" width="{w*0.4}" height="3" fill="#CFCBC6"/></g>')


# --------------------------------------------------------------------------
# Escritura de archivos
# --------------------------------------------------------------------------

def svg(w, h, body, uid, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">'
            f'<title>{title}</title>{defs_common(uid)}{body}</svg>')


def write(name, content):
    (OUT / name).write_text(content, encoding="utf-8")
    print("  ✓", name)


def build_hero():
    slides = [
        ("hero-1", "#E9DDCD", dict(style="classic", photos=["couple", "sunset", "flowers"]), "#9C7B6B", "Nuestra historia", -4, True),
        ("hero-2", "#EFE3D9", dict(style="full", photos=["mountains"]), "#4A3228", None, 3, False),
        ("hero-3", "#EADBD3", dict(style="text", photos=["nursery"]), "#D7A8A2", "Mi primer año", -2, True),
        ("hero-4", "#E7DED0", dict(style="grid", photos=["cabin", "sea", "road", "flowers", "sea"]), "#6E5A4F", "La Cabaña", 2, False),
    ]
    W, H = 1600, 1100
    for name, bg, layout, cover, title, rot, cup in slides:
        uid = name.replace("-", "")
        body = background(uid, W, H, bg) + window_light(uid, W, H)
        body += sprig(170, 1060, 1.5, -24) if rot < 0 else sprig(1470, 1080, 1.4, 20, bloom="#F3DCCB")
        body += open_album(uid, 820, 560, 560, 720, layout, cover, rot, title, "capítulo uno")
        if cup:
            body += coffee(1420, 190, 62)
        else:
            body += pencil(90, 170, 18, 300)
        write(f"{name}.svg", svg(W, H, body, uid, "Álbum de fotos abierto sobre una mesa"))


PRODUCTS = [
    # slug, cover, título en tapa, escena ventana, layout interior, tipo
    ("la-cabana", "#6E5A4F", "La Cabaña", "cabin", ["cabin", "mountains", "road", "sea", "flowers"], "fisico"),
    ("nuestra-historia", "#B98B84", "Nuestra Historia", "couple", ["couple", "sunset", "flowers", "sea", "sunset"], "fisico"),
    ("mi-primer-ano", "#E3C2BC", "Mi Primer Año", "nursery", ["nursery", "family", "flowers", "nursery", "family"], "fisico"),
    ("egresados", "#3F3A36", "Egresados", "grad", ["grad", "road", "sunset", "grad", "sea"], "fisico"),
    ("nuestra-historia-canva", "#B98B84", "Nuestra Historia", "couple", ["couple", "sunset"], "digital"),
    ("mama-canva", "#D9B2A8", "Mamá", "family", ["family", "flowers"], "digital"),
    ("viaje-sonado-canva", "#8C9A94", "Viaje Soñado", "sea", ["sea", "mountains"], "digital"),
    ("recuerdos-de-familia-canva", "#9A7B63", "Recuerdos de Familia", "family", ["family", "cabin"], "digital"),
]


def build_products():
    W, H = 1000, 1250
    for slug, cover, title, win, inner, kind in PRODUCTS:
        uid = slug.replace("-", "")[:10]
        text_color = BROWN if cover in ("#E3C2BC", "#D9B2A8") else "#F5EFE6"
        bg = "#EFE6DA" if kind == "fisico" else "#F2E8E2"
        if kind == "fisico":
            # 1) tapa
            body = background(uid, W, H, bg) + window_light(uid, W, H, -32)
            body += sprig(860, 1240, 1.2, 16)
            body += closed_album(uid + "c", 500, 610, 640, 820, cover, title, "Amaré Studio", -3, win, text_color)
            write(f"{slug}-1.svg", svg(W, H, body, uid + "c", f"Tapa del álbum {title}"))
            # 2) abierto
            layout = dict(style=["classic", "grid", "text", "full"][len(slug) % 4], photos=inner)
            if layout["style"] == "full":
                layout["style"] = "classic"
            body = background(uid, W, H, "#F1E8DC") + window_light(uid, W, H, -20)
            body += open_album(uid + "o", 500, 620, 440, 600, layout, cover, 90 if False else 0, title, "capítulo uno")
            body += coffee(830, 150, 50)
            write(f"{slug}-2.svg", svg(W, H, body, uid + "o", f"Interior del álbum {title}"))
            # 3) detalle: pliego panorámico
            body = background(uid, W, H, "#EAE0D2") + window_light(uid, W, H, -40)
            body += open_album(uid + "d", 500, 640, 420, 540, dict(style="full", photos=[inner[1]]), cover, 6)
            body += pencil(120, 130, 12, 260)
            write(f"{slug}-3.svg", svg(W, H, body, uid + "d", f"Pliego panorámico del álbum {title}"))
        else:
            body = background(uid, W, H, bg) + window_light(uid, W, H, -30)
            body += tablet_template(uid + "t", 500, 560, 820, inner, title)
            body += sprig(120, 1240, 1.1, -14)
            body += f'<text x="500" y="1040" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-size="40" fill="{BROWN}">Plantilla editable</text>'
            write(f"{slug}-1.svg", svg(W, H, body, uid + "t", f"Plantilla digital {title} en pantalla"))
            body = background(uid, W, H, "#F4ECE3") + window_light(uid, W, H, -24)
            body += printed_sheet(uid + "p", 360, 560, 380, inner[0], -8)
            body += printed_sheet(uid + "p", 640, 640, 380, inner[1], 7)
            body += coffee(820, 170, 48)
            write(f"{slug}-2.svg", svg(W, H, body, uid + "p", f"Páginas impresas de la plantilla {title}"))
            body = background(uid, W, H, "#EFE5DA") + window_light(uid, W, H, -36)
            body += open_album(uid + "d", 500, 620, 400, 540, dict(style="text", photos=[inner[0]]), cover, -4, title, "editala a tu manera")
            write(f"{slug}-3.svg", svg(W, H, body, uid + "d", f"Plantilla {title} impresa y encuadernada"))


def build_collections():
    cols = [
        ("col-pareja", "#EBD9D2", ["couple", "sunset", "flowers"], "#B98B84", "Te elijo"),
        ("col-dia-madre-padre", "#EFE3D6", ["family", "flowers", "nursery"], "#9A7B63", "Gracias"),
        ("col-egresados", "#E4E1DA", ["grad", "road", "sunset"], "#3F3A36", "Promo 2026"),
        ("col-bebe-familia", "#F1DFDA", ["nursery", "family", "flowers"], "#E3C2BC", "Bienvenida"),
        ("col-viajes", "#E6DED0", ["mountains", "sea", "cabin"], "#6E5A4F", "Ruta 40"),
    ]
    W, H = 900, 1150
    for name, bg, photos, cover, title in cols:
        uid = name.replace("-", "")[:10]
        body = background(uid, W, H, bg) + window_light(uid, W, H, -26)
        body += open_album(uid, 450, 600, 360, 480, dict(style="classic", photos=photos), cover, -5, title)
        body += sprig(780, 1140, 1.0, 18)
        write(f"{name}.svg", svg(W, H, body, uid, f"Colección {title}"))


def build_instagram():
    items = [("sunset", "#EFE3D6"), ("couple", "#EBD9D2"), ("cabin", "#E6DED0"),
             ("nursery", "#F1DFDA"), ("sea", "#EAE3D8"), ("grad", "#E4E1DA")]
    W = H = 800
    for i, (kind, bg) in enumerate(items, 1):
        uid = f"ig{i}"
        body = background(uid, W, H, bg) + window_light(uid, W, H, -30 + i*8)
        if i % 2:
            body += open_album(uid, 400, 420, 290, 390, dict(style="classic", photos=[kind, "flowers", "sunset"]), "#9C7B6B", -6 + i)
        else:
            body += closed_album(uid, 400, 410, 380, 480, ["#B98B84", "#6E5A4F", "#E3C2BC"][i % 3], "Amaré", "", 4, kind)
            body += coffee(690, 110, 40)
        write(f"ig-{i}.svg", svg(W, H, body, uid, "Publicación de Instagram de Amaré Studio"))


def portrait(uid, W, H, bg, skin, hair, top, hair_long=True):
    cx = W / 2
    body = background(uid, W, H, bg) + window_light(uid, W, H, -30)
    body += f'<path d="M{cx - W*0.36} {H} Q{cx - W*0.34} {H*0.66} {cx} {H*0.64} Q{cx + W*0.34} {H*0.66} {cx + W*0.36} {H}Z" fill="{top}"/>'
    if hair_long:
        body += f'<path d="M{cx - W*0.2} {H*0.72} Q{cx - W*0.24} {H*0.3} {cx} {H*0.24} Q{cx + W*0.24} {H*0.3} {cx + W*0.2} {H*0.72}Z" fill="{hair}"/>'
    body += f'<rect x="{cx - W*0.05}" y="{H*0.5}" width="{W*0.1}" height="{H*0.16}" fill="{skin}"/>'
    body += f'<ellipse cx="{cx}" cy="{H*0.43}" rx="{W*0.14}" ry="{H*0.17}" fill="{skin}"/>'
    body += f'<path d="M{cx - W*0.15} {H*0.42} Q{cx - W*0.12} {H*0.24} {cx + W*0.02} {H*0.25} Q{cx + W*0.17} {H*0.28} {cx + W*0.15} {H*0.42} Q{cx + W*0.06} {H*0.3} {cx - W*0.15} {H*0.42}Z" fill="{hair}"/>'
    return body


def build_people():
    people = [
        ("avatar-1", "#F4D3E4", "#E9C3A6", "#5A3B2C", "#F5EFE6"),
        ("avatar-2", "#EDEBE8", "#C99A7A", "#2F2220", "#DE93BE"),
        ("avatar-3", "#E9E7E4", "#F0CDB2", "#9C6B45", "#1E1E1E"),
    ]
    for name, bg, skin, hair, top in people:
        uid = name.replace("-", "")
        write(f"{name}.svg", svg(400, 400, portrait(uid, 400, 400, bg, skin, hair, top), uid, "Retrato de clienta"))

    for name, bg, skin, hair, top in [("hermana-1", "#F1EFEC", "#EBC6AA", "#5A3B2C", "#EBA6CB"),
                                      ("hermana-2", "#ECEAE7", "#E2B998", "#2A2220", "#1E1E1E")]:
        uid = name.replace("-", "")
        write(f"{name}.svg", svg(800, 1000, portrait(uid, 800, 1000, bg, skin, hair, top), uid, "Retrato de una de las fundadoras"))

    # Nosotras: dos hermanas con un álbum
    W, H = 1000, 1250
    uid = "sisters"
    body = background(uid, W, H, "#EDE2D5") + window_light(uid, W, H, -28)
    for cx, skin, hair, top in [(340, "#EBC6AA", "#5A3B2C", "#EBA6CB"), (660, "#E2B998", "#3A2A24", "#1E1E1E")]:
        body += f'<path d="M{cx-200} {H} Q{cx-190} {H*0.62} {cx} {H*0.6} Q{cx+190} {H*0.62} {cx+200} {H}Z" fill="{top}"/>'
        body += f'<path d="M{cx-120} {H*0.66} Q{cx-140} {H*0.3} {cx} {H*0.26} Q{cx+140} {H*0.3} {cx+120} {H*0.66}Z" fill="{hair}"/>'
        body += f'<rect x="{cx-30}" y="{H*0.46}" width="60" height="{H*0.16}" fill="{skin}"/>'
        body += f'<ellipse cx="{cx}" cy="{H*0.4}" rx="88" ry="112" fill="{skin}"/>'
        body += f'<path d="M{cx-92} {H*0.4} Q{cx-80} {H*0.27} {cx+10} {H*0.275} Q{cx+100} {H*0.29} {cx+92} {H*0.4} Q{cx+30} {H*0.31} {cx-92} {H*0.4}Z" fill="{hair}"/>'
    body += open_album(uid, 500, 1060, 230, 300, dict(style="classic", photos=["family", "sunset", "flowers"]), "#9C7B6B", -4, "Amaré")
    write("nosotras.svg", svg(W, H, body, uid, "Las hermanas fundadoras de Amaré Studio con un álbum"))

    # Taller: manos de obra (mesa con materiales)
    uid = "taller"
    W, H = 1400, 900
    body = background(uid, W, H, "#E9DECF") + window_light(uid, W, H, -34)
    body += closed_album(uid + "a", 380, 470, 360, 460, "#B98B84", "Amaré", "hecho a mano", -8)
    body += open_album(uid + "b", 930, 450, 260, 340, dict(style="grid", photos=["sea", "cabin", "sunset", "flowers", "couple"]), "#6E5A4F", 5, "Viajes")
    body += pencil(240, 800, -6, 380) + sprig(1300, 890, 1.2, 14)
    body += '<g transform="translate(1180 150)"><circle r="70" fill="none" stroke="#C9A565" stroke-width="10"/><circle r="40" fill="#E9DECF"/></g>'
    write("taller.svg", svg(W, H, body, uid, "Mesa de trabajo con álbumes en producción"))


def build_flipbook_scenes():
    for kind in SCENES:
        uid = "fb" + kind
        body = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="800" height="600" '
                f'preserveAspectRatio="xMidYMid slice"><title>Foto de ejemplo</title>{SCENES[kind](uid)}</svg>')
        write(f"scene-{kind}.svg", body)


def build_favicon():
    fav = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
           '<rect width="64" height="64" rx="14" fill="#1C1C1C"/>'
           '<rect x="5" y="5" width="54" height="54" rx="10" fill="none" stroke="#E08DBC" stroke-width="1.2" opacity=".8"/>'
           f'<text x="32" y="42" text-anchor="middle" font-family="{SERIF}" font-size="28" fill="#F5EFE6" letter-spacing="1">AS</text></svg>')
    (OUT.parent / "favicon.svg").write_text(fav, encoding="utf-8")
    print("  ✓ favicon.svg")


def build_og():
    uid = "og"
    W, H = 1200, 630
    body = background(uid, W, H, "#FFFFFF") + window_light(uid, W, H, -30)
    body += open_album(uid, 860, 330, 230, 300, dict(style="classic", photos=["couple", "sunset", "flowers"]), "#B98B84", -5)
    body += f'<text x="80" y="250" font-family="{SERIF}" font-size="64" fill="{BROWN}">Amaré Studio</text>'
    body += f'<rect x="80" y="280" width="90" height="2" fill="{GOLD}"/>'
    body += f'<text x="80" y="350" font-family="{SERIF}" font-style="italic" font-size="38" fill="{BROWN}">El regalo que se queda</text>'
    body += f'<text x="80" y="398" font-family="{SERIF}" font-style="italic" font-size="38" fill="{BROWN}">para siempre.</text>'
    write("og-image.svg", svg(W, H, body, uid, "Amaré Studio"))


if __name__ == "__main__":
    print("Generando placeholders en", OUT)
    build_hero()
    build_products()
    build_collections()
    build_instagram()
    build_people()
    build_flipbook_scenes()
    build_favicon()
    build_og()
    print("Listo.")
