import re

with open('src/components/HomePageSections.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(
    r"const title = activeLang === 'ar'\s*\?\s*\(customSecData\?\.titleAr \|\| currentSecData\?\.title \|\| sec\.titleAr\)\s*:\s*\(customSecData\?\.titleEn \|\| currentSecData\?\.title \|\| sec\.titleEn\);\s*"
    r"const desc = activeLang === 'ar'\s*\?\s*\(customSecData\?\.descAr !== undefined \? customSecData\.descAr : \(currentSecData\?\.desc !== undefined \? currentSecData\.desc : sec\.descAr\)\)\s*:\s*\(customSecData\?\.descEn !== undefined \? customSecData\.descEn : \(currentSecData\?\.desc !== undefined \? currentSecData\.desc : sec\.descEn\)\);\s*"
    r"const badgeText = activeLang === 'ar'\s*\?\s*\(customSecData\?\.badgeAr \|\| currentSecData\?\.badge \|\| sec\.badge\)\s*:\s*\(customSecData\?\.badgeEn \|\| currentSecData\?\.badge \|\| sec\.badge\);"
)

new_block = """            const isAr = activeLang === 'ar';
            const customTitle = isAr ? customSecData?.titleAr : customSecData?.titleEn;
            const customDesc = isAr ? customSecData?.descAr : customSecData?.descEn;
            const customBadge = isAr ? customSecData?.badgeAr : customSecData?.badgeEn;
            
            const title = customTitle || currentSecData?.title || (isAr ? sec.titleAr : sec.titleEn);
            const desc = customDesc !== undefined ? customDesc : (currentSecData?.desc !== undefined ? currentSecData.desc : (isAr ? sec.descAr : sec.descEn));
            const badgeText = customBadge || currentSecData?.badge || sec.badge;"""

if pattern.search(content):
    content = pattern.sub(new_block, content)
    with open('src/components/HomePageSections.tsx', 'w') as f:
        f.write(content)
    print("Replaced successfully via regex!")
else:
    print("Pattern not found!")
