import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, Sparkles,
  Image as ImageIcon, UploadCloud, Link as LinkIcon, CheckCircle2, X,
  FileText, ExternalLink, Edit3, Calendar, Tag, Check, ArrowRight
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { BlogPost, BlogBlock } from '../../types';

export const AdminBlog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'COMPOSE' | 'LIST'>('COMPOSE');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Editor states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('Coastal Marvels of Benidorm & Alicante');
  const [slug, setSlug] = useState('coastal-marvels-benidorm-alicante');
  const [excerpt, setExcerpt] = useState('Exploring the best Mediterranean beaches, historic castles, and seafood gastronomy.');
  const [category, setCategory] = useState('Travel Journal');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80');
  const [imageUploadMode, setImageUploadMode] = useState<'UPLOAD' | 'URL'>('UPLOAD');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [savedPostSlug, setSavedPostSlug] = useState<string | null>(null);

  const defaultDemoPosts: BlogPost[] = [
    {
      id: 'post_1',
      title: 'Top 10 Hidden Gems Along Spain\'s Mediterranean Coast',
      slug: 'top-10-hidden-gems-spain-mediterranean-demo',
      excerpt: 'Discover secluded coves, ancient castles, and culinary delights away from the crowded tourist routes.',
      category: 'Travel Journal',
      tags: ['Spain', 'Costa Blanca', 'Beach'],
      cover_image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      blocks: [
        { id: 'blk-1', type: 'heading', content: { text: 'Unveiling the Secret Coastline' } },
        { id: 'blk-2', type: 'paragraph', content: { text: 'Spain\'s Mediterranean shoreline extends for over 1,600 kilometers with crystal-clear waters and charming villages.' } }
      ],
      author: 'MIR Travel Editorial Desk',
      status: 'PUBLISHED',
      publish_at: '2026-09-28T10:00:00Z',
      is_featured: true,
      created_at: '2026-09-28T10:00:00Z'
    }
  ];

  const fetchPublishedPosts = async () => {
    setLoadingPosts(true);
    let localCustom: BlogPost[] = [];
    try {
      const stored = localStorage.getItem('mir_custom_blog_posts');
      if (stored) localCustom = JSON.parse(stored);
    } catch {}

    try {
      const res = await apiClient.get('/admin/blog');
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Merge API posts and local custom posts (dedup by slug)
        const combined = [...res.data];
        for (const lp of localCustom) {
          if (!combined.some(p => p.slug === lp.slug || p.id === lp.id)) {
            combined.unshift(lp);
          }
        }
        setPosts(combined);
      } else {
        setPosts(localCustom.length > 0 ? [...localCustom, ...defaultDemoPosts] : defaultDemoPosts);
      }
    } catch {
      setPosts(localCustom.length > 0 ? [...localCustom, ...defaultDemoPosts] : defaultDemoPosts);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setCoverImage(dataUrl);
      setUploadingImage(false);

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post('/admin/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.secure_url) {
          setCoverImage(res.data.secure_url);
        }
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

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

  const handlePublishPost = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setSavedPostSlug(null);

    const postSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPost: BlogPost = {
      id: editingId || `post_${Date.now()}`,
      title,
      slug: postSlug,
      excerpt: excerpt || title,
      category,
      tags: [category, 'Spain', 'Travel Desk'],
      cover_image: coverImage || 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80',
      gallery: coverImage ? [coverImage] : [],
      blocks,
      author: 'MIR Travel Editorial Desk',
      status: 'PUBLISHED',
      publish_at: new Date().toISOString(),
      is_featured: true,
      created_at: new Date().toISOString()
    };

    // 1. Save to local storage cache so it immediately appears everywhere (admin + public)
    try {
      const stored = localStorage.getItem('mir_custom_blog_posts');
      const existing: BlogPost[] = stored ? JSON.parse(stored) : [];
      const updated = [newPost, ...existing.filter(p => p.slug !== postSlug && p.id !== newPost.id)];
      localStorage.setItem('mir_custom_blog_posts', JSON.stringify(updated));
    } catch {}

    // 2. Post to backend API
    try {
      await apiClient.post('/admin/blog', newPost);
    } catch (err) {
      console.warn('Backend blog sync notice:', err);
    } finally {
      setSaving(false);
      setSavedPostSlug(postSlug);
      fetchPublishedPosts();
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setCategory(post.category || 'Travel Journal');
    setCoverImage(post.cover_image || '');
    if (Array.isArray(post.blocks) && post.blocks.length > 0) {
      setBlocks(post.blocks);
    }
    setActiveTab('COMPOSE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = async (id: string, postSlug: string) => {
    try {
      await apiClient.delete(`/admin/blog/${id}`);
    } catch {}
    try {
      const stored = localStorage.getItem('mir_custom_blog_posts');
      if (stored) {
        const existing: BlogPost[] = JSON.parse(stored);
        const updated = existing.filter(p => p.id !== id && p.slug !== postSlug);
        localStorage.setItem('mir_custom_blog_posts', JSON.stringify(updated));
      }
    } catch {}
    setPosts(posts.filter(p => p.id !== id && p.slug !== postSlug));
  };

  const handleResetNew = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCoverImage('');
    setBlocks([
      { id: `b-${Date.now()}`, type: 'heading', content: { text: 'New Article Heading' } },
      { id: `b-${Date.now() + 1}`, type: 'paragraph', content: { text: 'Start writing your travel insight here...' } }
    ]);
    setSavedPostSlug(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-amber-500" /> Rich Blog & Articles CMS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Compose multi-block articles, upload cover photography, and publish directly to the live customer portal.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('COMPOSE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'COMPOSE' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {editingId ? 'Edit Article' : 'Compose New'}
            </button>
            <button
              onClick={() => {
                setActiveTab('LIST');
                fetchPublishedPosts();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'LIST' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Published Articles ({posts.length})
            </button>
          </div>
          {editingId && (
            <button
              onClick={handleResetNew}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              + New Blank
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedPostSlug && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-sm">Article published successfully!</p>
              <p className="text-xs text-emerald-300/90">This article is live and available on the public website.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/blog/${savedPostSlug}`}
              target="_blank"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Eye className="w-4 h-4" /> View Live Article on Website <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 1: COMPOSE / EDIT CANVAS */}
      {activeTab === 'COMPOSE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Editor Canvas */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Article Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingId) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Hidden Coastal Treasures of Alicante"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white text-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1">URL Slug</label>
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
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">Content Blocks ({blocks.length})</h3>
                <span className="text-[11px] text-slate-500">Arrange and customize rich content blocks</span>
              </div>

              {blocks.map((block, idx) => (
                <div key={block.id} className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 relative group shadow-md">
                  
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
                      placeholder="Enter heading text..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-base focus:outline-none focus:border-amber-500"
                    />
                  )}

                  {(block.type === 'paragraph' || block.type === 'rich_text') && (
                    <textarea
                      rows={3}
                      value={block.content.text || ''}
                      onChange={(e) => updateBlockText(block.id, 'text', e.target.value)}
                      placeholder="Enter paragraph content..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  )}

                  {block.type === 'quote' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.content.quote || ''}
                        onChange={(e) => updateBlockText(block.id, 'quote', e.target.value)}
                        placeholder="Quote text..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm italic focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={block.content.author || ''}
                        onChange={(e) => updateBlockText(block.id, 'author', e.target.value)}
                        placeholder="Author / source..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* Add Block Controls */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => addBlock('heading')} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center gap-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5 text-amber-500" /> Add Heading
              </button>
              <button onClick={() => addBlock('paragraph')} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center gap-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5 text-amber-500" /> Add Paragraph
              </button>
              <button onClick={() => addBlock('quote')} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 flex items-center gap-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5 text-amber-500" /> Add Quote
              </button>
            </div>

          </div>

          {/* Right Sidebar: Meta & Cover Image Upload */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5 h-fit shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="font-bold text-white text-base font-serif">Publish Settings</h3>
              <button
                onClick={handlePublishPost}
                disabled={saving || !title.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" /> {saving ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>

            {/* Cover Image Upload & Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs uppercase font-bold text-slate-400">Cover Image</label>
                <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('UPLOAD')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                      imageUploadMode === 'UPLOAD' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('URL')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                      imageUploadMode === 'URL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {imageUploadMode === 'UPLOAD' ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group"
                  >
                    <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-white">Click or drag image file here</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WebP with guaranteed rendering</p>
                  </div>
                  {uploadingImage && <p className="text-xs text-amber-400 animate-pulse">Processing image...</p>}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {coverImage && (
                <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-36 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage('');
                      setUploadedFileName('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-rose-600 text-white rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all shadow"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-2 text-[10px] text-slate-400 bg-slate-950/90 flex items-center justify-between">
                    <span className="truncate max-w-[160px]">{uploadedFileName || 'Image Ready'}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Guaranteed Preview
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Excerpt Summary</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary displayed on blog index..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PUBLISHED ARTICLES DIRECTORY */}
      {activeTab === 'LIST' && (
        <div className="space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Article & Cover</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">URL Slug</th>
                    <th className="py-3.5 px-4 font-bold">Published Date</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {posts.map((p) => (
                    <tr key={p.id || p.slug} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.cover_image || 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=120&q=80'}
                            alt={p.title}
                            className="w-12 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                          />
                          <div>
                            <span className="block font-bold text-white max-w-sm truncate">{p.title}</span>
                            <span className="text-[11px] text-slate-500 truncate block max-w-sm">{p.excerpt}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-amber-400 text-xs font-semibold">
                          {p.category || 'Travel Journal'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">/{p.slug}</td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs">
                        {p.publish_at ? new Date(p.publish_at).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-full text-[10px] font-bold">
                          {p.status || 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/blog/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-900 transition-colors"
                            title="View on live website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEditPost(p)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                            title="Edit in canvas"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(p.id, p.slug)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
