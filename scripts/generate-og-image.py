"""Generate a brand-aligned Open Graph image (1200x630 PNG)."""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
# Brand palette from portfolio
PAPER = (18, 17, 16)       # #121110
SURFACE = (28, 26, 23)     # #1C1A17
VOID = (10, 9, 8)          # #0A0908
INK = (242, 239, 232)      # #F2EFE8
MUTED = (181, 175, 164)    # #B5AFA4
ORANGE = (212, 101, 58)    # #D4653A
ORANGE_SOFT = (232, 160, 122)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "og-image.png")


def load_font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)

    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    # Vertical gradient wash
    for y in range(H):
        t = y / H
        r = int(PAPER[0] + (SURFACE[0] - PAPER[0]) * t * 0.5)
        g = int(PAPER[1] + (SURFACE[1] - PAPER[1]) * t * 0.5)
        b = int(PAPER[2] + (SURFACE[2] - PAPER[2]) * t * 0.5)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Left accent bar
    draw.rectangle([0, 0, 12, H], fill=ORANGE)

    # Soft orange glow (top-right)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for i, a in enumerate([20, 12, 7, 3]):
        rad = 300 - i * 45
        gdraw.ellipse(
            [W - 200 - rad, -100 - rad // 3, W - 200 + rad, -100 + rad],
            fill=(*ORANGE, a),
        )
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Logo mark (stylized C + node)
    cx, cy, R = 140, 200, 70
    draw.ellipse([cx - R, cy - R, cx + R, cy + R], outline=ORANGE, width=10)
    draw.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=ORANGE)
    # Open the C on the right
    draw.pieslice(
        [cx - R - 2, cy - R - 2, cx + R + 2, cy + R + 2],
        start=-35,
        end=35,
        fill=PAPER,
    )
    draw.line([cx, cy, cx + 90, cy], fill=ORANGE, width=6)

    font_label = load_font(28, bold=True)
    font_name = load_font(72, bold=True)
    font_title = load_font(34, bold=False)
    font_sub = load_font(26, bold=False)
    font_footer = load_font(22, bold=False)

    x, y = 250, 130
    draw.text((x, y), "CYDERCODER", font=font_label, fill=ORANGE)
    draw.text((x, y + 50), "Dosumu Michael", font=font_name, fill=INK)
    draw.text(
        (x, y + 145),
        "Full-Stack Developer & Creative Engineer",
        font=font_title,
        fill=MUTED,
    )
    draw.text(
        (x, y + 200),
        "React  ·  Three.js  ·  WebGL  ·  AI  ·  Lagos, Nigeria",
        font=font_sub,
        fill=MUTED,
    )

    # Bottom bar
    draw.rectangle([0, H - 64, W, H], fill=VOID)
    draw.text((48, H - 44), "cydercoder.vercel.app", font=font_footer, fill=MUTED)
    draw.text((W - 320, H - 44), "10+ live projects", font=font_footer, fill=ORANGE_SOFT)

    img.save(OUT, "PNG", optimize=True)
    with open(OUT, "rb") as f:
        sig = f.read(8)
    print(f"saved {OUT}")
    print(f"size={os.path.getsize(OUT)} dims={img.size} mode={img.mode}")
    print(f"png signature ok: {sig == b'\x89PNG\r\n\x1a\n'}")


if __name__ == "__main__":
    main()
