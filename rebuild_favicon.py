import io, struct
from PIL import Image

BASE = "D:\\PICS ~Pictures\\New folder\\gerbon-movies-site\\favmoney-user"
lt = "<"

# Load the square source (192x192 RGBA)
square = Image.open(BASE + "\\icons\\icon-192.png").convert("RGBA")
sizes = [16, 32, 48, 256]

# PNG-encode each size directly — no background padding added
png_blobs = []
for s in sizes:
    im = square.resize((s, s), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    png_blobs.append(buf.getvalue())

# Build ICO container manually (transparent where source is transparent)
out = io.BytesIO()
out.write(struct.pack(lt + "HHH", 0, 1, len(sizes)))  # header: reserved=0, type=1, count=N

data_offset = 6 + 16 * len(sizes)
entries = b""
for s, blob in zip(sizes, png_blobs):
    w = s if s < 256 else 0
    h = s if s < 256 else 0
    entries += struct.pack(
        lt + "BBBBHHII",
        w, h, 0, 0, 1, 32, len(blob), data_offset
    )
    data_offset += len(blob)

out.write(entries)
for blob in png_blobs:
    out.write(blob)

ico_path = BASE + "\\favicon.ico"
with open(ico_path, "wb") as f:
    f.write(out.getvalue())

# Verify
b = out.getvalue()
reserved, imgtype, count = struct.unpack(lt + "HHH", b[0:6])
print(f"favicon.ico: {len(b)} bytes, count={count}, type={imgtype}, reserved={reserved}")
off = 6
for i in range(count):
    e = b[off:off + 16]
    w = e[0] or 256
    h = e[1] or 256
    print(f"  img{i}: {w}x{h}, bpp=32")
    off += 16

print("Done — no background padding added (transparent where source is transparent).")
