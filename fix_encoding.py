import re

path = r'C:\Users\USER\Desktop\cyport2026\src\App.jsx'

with open(path, 'rb') as f:
    raw = f.read()

# These byte sequences are the actual corrupted bytes in the file
# We replace them with clean HTML entities (ASCII-safe)
replacements = [
    # Flag emoji 🇳🇬 corrupted as 4-byte sequence
    (b'\xf0\x9f\x87\xb3\xf0\x9f\x87\xac', b'&#x1F1F3;&#x1F1EC;'),
    # Bullet • corrupted
    (b'\xe2\x80\xa2', b'&bull;'),
    # Em dash — corrupted  
    (b'\xe2\x80\x94', b'&mdash;'),
    # Arrow ↗ corrupted
    (b'\xe2\x86\x97', b'&#x2197;'),
    # Copyright © corrupted
    (b'\xc2\xa9', b'&copy;'),
]

for bad, good in replacements:
    raw = raw.replace(bad, good)

# Also fix the broken footer indentation (replace the weirdly indented footer div)
old_footer = b'                       <div className="px-6 md:px-20 py-20 border-t border-white/5 relative z-10">\r\n                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">\r\n                   <div className="flex flex-col items-center md:items-start"><span className="text-2xl font-black tracking-tighter text-brandCream mb-2">CYDER<span className="text-primary">CODER</span></span><span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brandCream/20">&copy; 2026 DOSUMU MICHAEL</span></div>\r\n                   <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary text-center">Based in Lagos State, NG</div>\r\n                   <div className="flex items-center gap-6">'

new_footer = b'            <div className="px-6 md:px-20 py-16 border-t border-white/5 relative z-10">\r\n               <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">\r\n                  <div className="flex flex-col items-center md:items-start"><span className="text-2xl font-black tracking-tighter text-brandCream mb-2">CYDER<span className="text-primary">CODER</span></span><span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brandCream/20">&copy; 2026 DOSUMU MICHAEL</span></div>\r\n                  <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary text-center">Based in Lagos State, NG</div>\r\n                  <div className="flex items-center gap-6">'

if old_footer in raw:
    raw = raw.replace(old_footer, new_footer)
    print('Footer fixed')
else:
    print('Footer pattern not found (may already be ok)')

# Fix closing tags for footer too
old_close = b'                   </div>\r\n                </div>\r\n             </div>'
new_close = b'                  </div>\r\n               </div>\r\n            </div>'
if old_close in raw:
    raw = raw.replace(old_close, new_close)
    print('Footer closing fixed')

with open(path, 'wb') as f:
    f.write(raw)

print('All done!')
