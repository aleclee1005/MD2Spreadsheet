import struct, zlib, os

def make_png(size):
    bg = (26, 115, 64)     # Google Sheets green
    fg = (255, 255, 255)   # white
    rr = 0.20

    # Letter "S" strokes via bezier approximation using pixel checks
    def in_s(nx, ny):
        cx, cy = 0.5, 0.5
        # Top bar
        if 0.28 <= nx <= 0.72 and 0.22 <= ny <= 0.32:
            return True
        # Bottom bar
        if 0.28 <= nx <= 0.72 and 0.68 <= ny <= 0.78:
            return True
        # Middle bar
        if 0.28 <= nx <= 0.72 and 0.45 <= ny <= 0.55:
            return True
        # Top-left vertical
        if 0.22 <= nx <= 0.32 and 0.22 <= ny <= 0.50:
            return True
        # Bottom-right vertical
        if 0.68 <= nx <= 0.78 and 0.50 <= ny <= 0.78:
            return True
        return False

    data = []
    for y in range(size):
        row = [0]
        ny = (y + 0.5) / size
        for x in range(size):
            nx = (x + 0.5) / size
            cx = max(rr, min(nx, 1 - rr))
            cy = max(rr, min(ny, 1 - rr))
            in_bg = (nx - cx) ** 2 + (ny - cy) ** 2 <= rr ** 2
            if in_bg:
                row += list(fg if in_s(nx, ny) else bg) + [255]
            else:
                row += [0, 0, 0, 0]
        data.append(bytes(row))

    def chunk(n, d):
        c = n + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    p = b'\x89PNG\r\n\x1a\n'
    p += chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
    p += chunk(b'IDAT', zlib.compress(b''.join(data), 9))
    p += chunk(b'IEND', b'')
    return p

os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs('icons', exist_ok=True)
for s in [16, 48, 128]:
    with open(f'icons/icon{s}.png', 'wb') as f:
        f.write(make_png(s))
    print(f'icons/icon{s}.png ✓')
print('Done!')
