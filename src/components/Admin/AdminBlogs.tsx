import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, Globe, FileText, Calendar, Eye } from 'lucide-react';
import { BlogService } from '../../services/BlogService';
import type { BlogPost } from '../../types';

const AdminBlogs = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        const fetchedPosts = await BlogService.getAllPosts();
        setPosts(fetchedPosts);
        setIsLoading(false);
    };

    const handleEdit = (post: BlogPost) => {
        setCurrentPost(post);
        setCoverImagePreview(post.featuredImage);
        setCoverImageFile(null);
        setIsEditing(true);
    };

    const handleCreateNew = () => {
        setCurrentPost({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            author: 'Babaji Achar Team',
            isPublished: false,
            seoTitle: '',
            seoDescription: '',
            tags: []
        });
        setCoverImagePreview(null);
        setCoverImageFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (post: BlogPost) => {
        if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
            await BlogService.deletePost(post.id, post.featuredImage);
            loadPosts();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    // ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('Preparing data...');
        try {
            if (!currentPost.slug && currentPost.title) {
                currentPost.slug = generateSlug(currentPost.title);
            }

            // Auto fill SEO fields if empty
            if (!currentPost.seoTitle) currentPost.seoTitle = `${currentPost.title} | Babaji Achar`;
            if (!currentPost.seoDescription) currentPost.seoDescription = currentPost.excerpt || '';

            if (currentPost.id) {
                setSubmitStatus('Updating document...');
                await BlogService.updatePost(currentPost.id, currentPost as BlogPost, coverImageFile || undefined);
            } else {
                if (!coverImageFile) {
                    alert("Please select a cover image for the new post.");
                    setSubmitStatus(null);
                    return;
                }
                setSubmitStatus('Uploading cover image to Storage...');
                await BlogService.createPost(currentPost as Omit<BlogPost, 'id' | 'publishedDate'>, coverImageFile);
            }

            setSubmitStatus('Success! Refreshing...');
            setIsEditing(false);
            loadPosts();
        } catch (error: any) {
            console.error("🔥 Blog CMS Save Error:", error);
            alert("Failed to save article: " + (error?.message || "Check console for details."));
        } finally {
            setSubmitStatus(null);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-orange-950">
                        {currentPost.id ? 'Edit Article' : 'Write New Article'}
                    </h2>
                    <button onClick={() => setIsEditing(false)} className="text-stone-500 hover:text-stone-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-2">Article Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-4 bg-stone-50 rounded-xl border border-stone-200 font-bold text-lg outline-none focus:border-orange-500"
                                    value={currentPost.title || ''}
                                    onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-2">URL Slug (Auto-generated if empty)</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-sm outline-none focus:border-orange-500"
                                    value={currentPost.slug || ''}
                                    onChange={e => setCurrentPost({ ...currentPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-2">Short Excerpt (Shown on blog index)</label>
                                <textarea
                                    required
                                    className="w-full p-4 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 h-24 resize-none"
                                    value={currentPost.excerpt || ''}
                                    onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-2 flex items-center justify-between">
                                    <span>Full Content (Markdown or HTML supported)</span>
                                </label>
                                <textarea
                                    required
                                    className="w-full p-4 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-orange-500 h-96 font-mono text-sm leading-relaxed"
                                    value={currentPost.content || ''}
                                    onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    placeholder="Write your article content here..."
                                />
                            </div>
                        </div>

                        {/* Sidebar Area (SEO & Metadata) */}
                        <div className="space-y-6">
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                                <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><ImageIcon size={18} /> Cover Image</h3>
                                {coverImagePreview && (
                                    <div className="mb-4 rounded-xl overflow-hidden aspect-video border border-stone-200">
                                        <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                                    required={!currentPost.id}
                                />
                            </div>

                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                                <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><Globe size={18} /> SEO Magic (JSON-LD)</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 mb-1">SEO Title (Overrides Title in SERP)</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-white rounded-lg border border-stone-200 text-sm"
                                            value={currentPost.seoTitle || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, seoTitle: e.target.value })}
                                            placeholder="Catchy SEO Title..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 mb-1">Meta Description</label>
                                        <textarea
                                            className="w-full p-2 bg-white rounded-lg border border-stone-200 text-sm h-20"
                                            value={currentPost.seoDescription || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, seoDescription: e.target.value })}
                                            placeholder="Compelling description for Google..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 mb-1">Tags (Comma separated)</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 bg-white rounded-lg border border-stone-200 text-sm"
                                            value={currentPost.tags?.join(', ') || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                            placeholder="mango pickle, homemade"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex items-center justify-between">
                                <span className="font-bold text-stone-800">Publish Article?</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={currentPost.isPublished || false}
                                        onChange={e => setCurrentPost({ ...currentPost, isPublished: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!!submitStatus}
                                className="w-full bg-orange-800 text-white font-black py-4 rounded-xl shadow-lg hover:bg-orange-950 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {submitStatus || 'Save Article'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-orange-950 flex items-center gap-3">
                        <FileText size={28} className="text-orange-700" />
                        Blog CMS Engine
                    </h2>
                    <p className="text-stone-500 font-bold">Write and manage SEO-optimized content to rank higher on Google.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-orange-900 active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                    <Plus size={20} /> Write New Article
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-100 uppercase text-xs font-black text-stone-400 tracking-wider">
                                <th className="p-4">Article</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Views</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-stone-400 font-bold">Loading articles...</td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <FileText size={48} className="text-stone-200" />
                                            <p className="text-stone-500 font-bold text-lg">No articles found.</p>
                                            <button onClick={handleCreateNew} className="text-orange-600 font-bold hover:underline">Write your first post</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : posts.map(post => (
                                <tr key={post.id} className="border-b border-stone-100 hover:bg-orange-50/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                                                {post.featuredImage ? (
                                                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                                                ) : <ImageIcon className="w-6 h-6 m-auto text-stone-300 mt-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-orange-950 text-lg">{post.title}</p>
                                                <p className="text-sm text-stone-500 font-mono">/{post.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-stone-600 font-medium">
                                            <Calendar size={16} />
                                            {new Date(post.publishedDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-stone-500 font-bold">
                                            <Eye size={16} />
                                            --
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {post.isPublished && (
                                                <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-stone-400 hover:text-orange-600 transition-colors bg-stone-50 hover:bg-orange-50 rounded-lg">
                                                    <Globe size={18} />
                                                </a>
                                            )}
                                            <button onClick={() => handleEdit(post)} className="p-2 text-stone-400 hover:text-blue-600 transition-colors bg-stone-50 hover:bg-blue-50 rounded-lg">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(post)} className="p-2 text-stone-400 hover:text-red-600 transition-colors bg-stone-50 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
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
    );
};

export default AdminBlogs;
