import re
import os

files = [
    r'D:\PICS ~Pictures\New folder\gerbon-mav\gerbon-mov/index.html',
    r'D:\PICS ~Pictures\New folder\gerbon-mav\gerbon-mov/discover/index.html',
    r'D:\PICS ~Pictures\New folder\gerbon-mav\gerbon-mov/trending/index.html',
    r'D:\PICS ~Pictures\New folder\gerbon-mav\gerbon-mov/ads.html',
    r'D:\PICS ~Pictures\New folder\gerbon-mav\gerbon-mov/404.html',
]

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match: <!-- ExoClick ad tags... --> (optional) then <!-- ===== AD BANNERS DISABLED ... ===== --> block
    # Pattern: from "    <!-- ExoClick" or "      <!-- Ad banners disabled" through "===== END AD BANNERS ===== -->"
    
    # Pattern for index.html and ads.html which have leading ExoClick comment
    pattern1 = r'\s*<!-- ExoClick ad tags go here once approved \(insert ExoClick invocation script \+ slots\) -->\s*\n\s*<!-- ===== AD BANNERS DISABLED - Uncomment to enable new provider =====\s*\n.*?===== END AD BANNERS ===== -->\s*\n'
    
    # Pattern for discover/index.html, trending/index.html, 404.html which have shorter comment
    pattern2 = r'\s*<!-- Ad banners disabled - replace with new provider soon -->\s*\n\s*<!-- ===== AD BANNERS DISABLED - Uncomment to enable new provider =====\s*\n.*?===== END AD BANNERS ===== -->\s*\n'
    
    # Pattern for index.html which may have different indentation
    pattern3 = r'\s*<!-- ExoClick ad tags go here once approved \(insert ExoClick invocation script \+ slots\) -->\s*\n\s*<!-- ===== AD BANNERS DISABLED - Uncomment to enable new provider =====\s*\n.*?===== END AD BANNERS ===== -->\s*'
    
    new_content = content
    
    # Try pattern1 (index.html, ads.html style with leading spaces)
    new_content = re.sub(pattern1, '', new_content, flags=re.DOTALL)
    # Try pattern2 (discover, trending, 404 style)
    new_content = re.sub(pattern2, '', new_content, flags=re.DOTALL)
    # Try pattern3 (index.html without trailing newline issues)
    new_content = re.sub(pattern3, '', new_content, flags=re.DOTALL)
    
    # Also try simpler patterns - just remove everything between the start comment and end comment inclusive
    pattern4 = r'\s*<!-- ExoClick ad tags go here once approved \(insert ExoClick invocation script \+ slots\) -->\s*\n\s*<!-- ===== AD BANNERS DISABLED - Uncomment to enable new provider =====\s*\n.*?===== END AD BANNERS ===== -->\s*\n?'
    new_content = re.sub(pattern4, '', new_content, flags=re.DOTALL)
    
    pattern5 = r'\s*<!-- Ad banners disabled - replace with new provider soon -->\s*\n\s*<!-- ===== AD BANNERS DISABLED - Uncomment to enable new provider =====\s*\n.*?===== END AD BANNERS ===== -->\s*\n?'
    new_content = re.sub(pattern5, '', new_content, flags=re.DOTALL)
    
    # Check if any ad banner comments remain
    if 'AD BANNERS DISABLED' in new_content or 'AD BANNERS =====' in new_content:
        print(f"WARNING: {path} - still contains AD BANNERS references")
    else:
        print(f"OK: {path} - AD BANNERS comments removed")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("\nDone processing all files.")
