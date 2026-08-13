import re

with open('src/components/NavPageDrawer.tsx', 'r') as f:
    content = f.read()

# Add imports
if 'useState, useEffect' not in content:
    content = content.replace('import React from', 'import React, { useState, useEffect } from')

# Add state and event listener inside NavPageDrawer
hook_code = """
  const [customGallery, setCustomGallery] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('n3_custom_gallery_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('n3_custom_gallery_list');
        if (saved) setCustomGallery(JSON.parse(saved));
      } catch(e) {}
    };
    window.addEventListener('n3_content_updated', handleUpdate);
    return () => window.removeEventListener('n3_content_updated', handleUpdate);
  }, []);
"""

# Inject hook code right after "export const NavPageDrawer... {"
content = re.sub(
    r'(export const NavPageDrawer: React\.FC<NavPageDrawerProps> = \(\{.*?\}\) => \{)',
    r'\1' + hook_code,
    content,
    flags=re.DOTALL
)

# Replace the hardcoded Activities grid
old_activities_code = """        {activePage === 'Activities' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {[
                {
                  title: t.activity1Title,
                  img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
                  desc: t.activity1Desc,
                },
                {
                  title: t.activity2Title,
                  img: 'https://images.unsplash.com/photo-1533174000243-ea7c71ba4f40?auto=format&fit=crop&w=800&q=80',
                  desc: t.activity2Desc,
                },
                {
                  title: t.activity3Title,
                  img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                  desc: t.activity3Desc,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] cursor-pointer"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-base text-white group-hover:text-neutral-200 transition-colors mb-2">{item.title}</h3>
                      <p className="text-xs text-neutral-300">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}"""

new_activities_code = """        {activePage === 'Activities' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {customGallery.length > 0 ? (
                customGallery.filter(item => item.active !== false).map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] cursor-pointer"
                  >
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-base text-white group-hover:text-neutral-200 transition-colors mb-2">{item.title}</h3>
                        <p className="text-xs text-neutral-300">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-white text-center w-full col-span-3">No gallery items yet. Please add them from the Admin Dashboard.</p>
              )}
            </div>
          </div>
        )}"""

content = content.replace(old_activities_code, new_activities_code)

with open('src/components/NavPageDrawer.tsx', 'w') as f:
    f.write(content)
