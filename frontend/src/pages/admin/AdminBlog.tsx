import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, Sparkles, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../../api/client';
import { BlogBlock } from '../../types';

export const AdminBlog: React.FC = () => {
  const [title, setTitle] = useState('Coastal Marvels of Benidorm & Alicante');
  const [slug, setSlug] = useState('coastal-marvels-benidorm-alicante');
  const [excerpt, setExcerpt] = useState('Exploring the best Mediterranean beaches, historic castles, and seafood gastronomy.');
  const [category, setCategory] = useState('Travel Journal');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80');

  const [blocks, setBlocks] = useState<BlogBlock[]>([
    {
      id: 'b-1',
      type: 'heading',
      content: { text: 'Welcome to the Mediterranean Sun' }
    },
    {
      id: 'b-2',
      type: 'paragraph',
      content: { text: 'The Costa Blanca stretches across more than 200 kilometers of Mediterranean coastline in the province of Alicante.' }
    },
    {
      id: 'b-3',
      type: 'quote',
      content: { quote: 'The sun shines brightest over the waters of Alicante.', author: 'Spanish Travel Lore' }
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const addBlock = (type: string) => {
    const newBlock: BlogBlock = {
      id: `blk-${Date.now()}`,
      type,
      content: type === 'heading' ? { text: 'New Heading' } : (type === 'quote' ? { quote: 'Sample Quote', author: '' } : { text: 'Sample paragraph text...' })
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'UP' | 'DOWN') => {
    const newBlocks = [...blocks];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setBlocks(newBlocks);
  };

  const updateBlockText = (id: string, key: string, value: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === id) {
        return { ...b, content: { ...b.content, [key]: value } };
      }
      return b;
    }));
  };

  const handleSavePost = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiClient.post('/admin/blog', {
        title,
        slug,
        excerpt,
        category,
        cover_image: coverImage,
        blocks,
        status: 'PUBLISHED'
      });
      setSavedSuccess(true);
    } catch (err) {
      console.error('Failed to save blog post:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-500" /> Rich Blog & Content Block Editor
          </h1>
          <p className="text-slate-400 text-sm mt-1">Compose multi-block articles with custom headings, quotes, images, callouts, and galleries.</p>
        </div>

        <button
          onClick={handleSavePost}
          disabled={saving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? 'Publishing...' : 'Publish Article'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm font-bold rounded-2xl">
          Article published successfully to CMS database!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Editor Canvas */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white text-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Block List */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Content Blocks ({blocks.length})</h3>

            {blocks.map((block, idx) => (
              <div key={block.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 relative group">
                
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-extrabold uppercase rounded-full">
                    Block Type: {block.type}
                  </span>

                  <div className="flex items-center gap-1">
                    <button onClick={() => moveBlock(idx, 'UP')} className="p-1 text-slate-400 hover:text-white"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveBlock(idx, 'DOWN')} className="p-1 text-slate-400 hover:text-white"><ArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => removeBlock(block.id)} className="p-1 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {block.type === 'heading' && (
                  <input
                    type="text"
                    value={block.content.text || ''}
                    onChange={(e) => updateBlockText(block.id, 'text', e.target.value)}
                    placeholder="Enter heading..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-base"
                  />
                )}

                {(block.type === 'paragraph' || block.type === 'rich_text') && (
                  <textarea
                    rows={3}
                    value={block.content.text || ''}
                    onChange={(e) => updateBlockText(block.id, 'text', e.target.value)}
                    placeholder="Enter paragraph content..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm"
                  />
                )}

                {block.type === 'quote' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={block.content.quote || ''}
                      onChange={(e) => updateBlockText(block.id, 'quote', e.target.value)}
                      placeholder="Quote text..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm italic"
                    />
                    <input
                      type="text"
                      value={block.content.author || ''}
                      onChange={(e) => updateBlockText(block.id, 'author', e.target.value)}
                      placeholder="Author / source..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs"
                    />
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Add Block Controls */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={() => addBlock('heading')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Heading
            </button>
            <button onClick={() => addBlock('paragraph')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Paragraph
            </button>
            <button onClick={() => addBlock('quote')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Quote
            </button>
          </div>

        </div>

        {/* Right Sidebar: Meta & Cover */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 h-fit">
          <h3 className="font-bold text-white text-base font-serif">Publishing Settings</h3>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Cover Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300"
            />
            {coverImage && <img src={coverImage} alt="Cover preview" className="w-full h-32 object-cover rounded-xl mt-2 border border-slate-800" />}
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Excerpt Summary</label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
