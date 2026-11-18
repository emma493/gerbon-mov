path = r'D:\PICS ~Pictures\New folder\gerbon-mav\gerbon-mov/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = '    <!-- ===== END AD BANNERS ===== -->\n        <a href="#main-content"'
new = '    <!-- ===== END AD BANNERS ===== -->\n    <div id="root">\n        <a href="#main-content"'

if old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated index.html - added div id=root back')
else:
    print('Pattern not found')
    import re
    match = re.search(r'END AD BANNERS.*?(?=<a)', content, re.DOTALL)
    if match:
        print(repr(match.group()[:200]))
