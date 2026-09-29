import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Tag, Calendar, User, ArrowRight, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { BlogPost, BlogBlock } from '../types';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

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
        { id: 'blk-2', type: 'paragraph', content: { text: 'Spain\'s Mediterranean shoreline extends for over 1,600 kilometers, offering far more than popular resort beaches. Beyond the major hubs lie whitewashed cliff villages, pristine marine reserves, and centuries-old fortresses.' } },
        { id: 'blk-3', type: 'callout', content: { title: 'Traveler Tip', text: 'Visit Tabarca Island during spring or early autumn for calm seas and uncrowded beaches.' } },
        { id: 'blk-4', type: 'quote', content: { quote: 'The Mediterranean is not a sea; it is an emotion.', author: 'Spanish Travel Lore' } }
      ],
      author: 'MIR Travel Editorial Desk',
      status: 'PUBLISHED',
      publish_at: '2026-09-28T10:00:00Z',
      is_featured: true,
      created_at: '2026-09-28T10:00:00Z'
    }
  ];

  useEffect(() => {
    let localCustom: BlogPost[] = [];
    try {
      const stored = localStorage.getItem('mir_custom_blog_posts');
      if (stored) localCustom = JSON.parse(stored);
    } catch {}

    apiClient.get('/blog')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
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
      })
      .catch(() => {
        setPosts(localCustom.length > 0 ? [...localCustom, ...defaultDemoPosts] : defaultDemoPosts);
      });
  }, []);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-amber-500" /> MIR Travel Journal & Insights
        </h1>
        <p className="text-slate-500 text-sm">
          Destination advice, hidden coastal gems, and travel tips across Spain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link key={post.id || post.slug} to={`/blog/${post.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col">
            <div className="h-60 overflow-hidden relative bg-slate-100">
              <img src={post.cover_image || 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow">
                {post.category || 'Travel Journal'}
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-amber-600 transition-colors">{post.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{post.excerpt}</p>
              </div>
              <div className="pt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    let localCustom: BlogPost[] = [];
    try {
      const stored = localStorage.getItem('mir_custom_blog_posts');
      if (stored) localCustom = JSON.parse(stored);
    } catch {}

    const matchLocal = localCustom.find(p => p.slug === slug || p.id === slug);
    if (matchLocal) {
      setPost(matchLocal);
    }

    apiClient.get(`/blog/${slug}`)
      .then((res) => {
        if (res.data && res.data.title) setPost(res.data);
      })
      .catch(() => {
        if (slug === 'top-10-hidden-gems-spain-mediterranean-demo') {
          setPost({
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
              { id: 'blk-2', type: 'paragraph', content: { text: 'Spain\'s Mediterranean shoreline extends for over 1,600 kilometers, offering far more than popular resort beaches. Beyond the major hubs lie whitewashed cliff villages, pristine marine reserves, and centuries-old fortresses.' } },
              { id: 'blk-3', type: 'callout', content: { title: 'Traveler Tip', text: 'Visit Tabarca Island during spring or early autumn for calm seas and uncrowded beaches.' } },
              { id: 'blk-4', type: 'quote', content: { quote: 'The Mediterranean is not a sea; it is an emotion.', author: 'Spanish Travel Lore' } }
            ],
            author: 'MIR Travel Editorial Desk',
            status: 'PUBLISHED',
            publish_at: '2026-09-28T10:00:00Z',
            is_featured: true,
            created_at: '2026-09-28T10:00:00Z'
          });
        }
      });
  }, [slug]);

  if (!post) return <div className="pt-32 text-center text-slate-500">Loading blog post...</div>;

  const renderBlock = (block: BlogBlock) => {
    const c = block.content || {};
    switch (block.type) {
      case 'heading':
        return <h2 key={block.id} className="text-2xl font-bold font-serif text-slate-900 mt-8 mb-4">{c.text}</h2>;
      case 'paragraph':
      case 'rich_text':
        return <p key={block.id} className="text-slate-700 leading-relaxed text-base mb-4">{c.text}</p>;
      case 'image':
        return (
          <div key={block.id} className="my-6 space-y-2">
            <img src={c.url || c.src} alt={c.alt || ''} className="w-full rounded-2xl shadow-md max-h-96 object-cover" />
            {c.caption && <p className="text-xs text-center text-slate-500 italic">{c.caption}</p>}
          </div>
        );
      case 'gallery':
        return (
          <div key={block.id} className="grid grid-cols-2 gap-4 my-6">
            {(c.images || []).map((img: string, idx: number) => (
              <img key={idx} src={img} alt="Gallery" className="rounded-xl object-cover h-48 w-full shadow-sm" />
            ))}
          </div>
        );
      case 'quote':
        return (
          <blockquote key={block.id} className="my-6 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl italic text-slate-800 font-serif">
            "{c.quote}"
            {c.author && <span className="block mt-2 text-xs font-sans font-bold text-amber-900">— {c.author}</span>}
          </blockquote>
        );
      case 'callout':
        return (
          <div key={block.id} className="my-6 p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Info className="w-4 h-4" /> {c.title || 'Note'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{c.text}</p>
          </div>
        );
      default:
        return <div key={block.id} className="my-4 text-slate-700">{JSON.stringify(c)}</div>;
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-4 text-center">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">{post.category}</span>
        <h1 className="text-4xl font-bold font-serif text-slate-900">{post.title}</h1>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{post.created_at ? post.created_at.split('T')[0] : 'Recent'}</span>
        </div>
      </div>

      <img src={post.cover_image} alt={post.title} className="w-full h-96 object-cover rounded-3xl shadow-lg" />

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {post.blocks && post.blocks.length > 0 ? (
          post.blocks.map((block) => renderBlock(block))
        ) : (
          <p className="text-slate-700 leading-relaxed">{post.excerpt}</p>
        )}
      </div>
    </div>
  );
};
