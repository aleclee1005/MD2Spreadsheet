import struct, zlib, os, math

def make_png(size):
    bg_color = (0, 0, 0)        # black background
    fg_color = (255, 255, 255)  # white
    cx, cy = 0.5, 0.5

    # Rounded square background
    corner_r = 0.18
    def in_bg(nx, ny):
        qx = abs(nx - cx) - (0.5 - corner_r)
        qy = abs(ny - cy) - (0.5 - corner_r)
        return math.sqrt(max(qx, 0)**2 + max(qy, 0)**2) <= corner_r

    # White circle ring
    ring_outer = 0.44
    ring_inner = 0.37
    def in_ring(nx, ny):
        d2 = (nx - cx)**2 + (ny - cy)**2
        return ring_inner**2 <= d2 <= ring_outer**2

    # White S — bounding box sized so area ≈ 1/3 of circle area
    # circle area = π * ring_outer² ≈ 0.608; 1/3 ≈ 0.203; box side = √0.203 ≈ 0.45 → half = 0.225
    s = 0.225
    s_x0, s_x1 = cx - s, cx + s
    s_y0, s_y1 = cy - s, cy + s
    t = 0.22  # bar thickness (in normalised S coords)

    def in_s(nx, ny):
        if not (s_x0 <= nx <= s_x1 and s_y0 <= ny <= s_y1):
            return False
        lx = (nx - s_x0) / (s_x1 - s_x0)
        ly = (ny - s_y0) / (s_y1 - s_y0)
        if 0.08 <= lx <= 0.92 and ly <= t:           return True  # top bar
        if 0.08 <= lx <= 0.92 and ly >= 1 - t:       return True  # bottom bar
        if 0.08 <= lx <= 0.92 and 0.5-t/2 <= ly <= 0.5+t/2: return True  # mid bar
        if lx <= 0.08 + t and ly <= 0.5 + t/2:       return True  # top-left vert
        if lx >= 0.92 - t and ly >= 0.5 - t/2:       return True  # bottom-right vert
        return False

    data = []
    for y in range(size):
        row = [0]
        ny = (y + 0.5) / size
        for x in range(size):
            nx = (x + 0.5) / size
            if in_bg(nx, ny):
                if in_s(nx, ny):
                    row += list(fg_color) + [255]
                else:
                    row += list(bg_color) + [255]
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
