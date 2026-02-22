import { BlogService } from '../../src/services/BlogService';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog | Babaji Achar - Authentic Indian Pickles & Culinary Heritage',
    description: 'Explore recipes, health benefits, and the rich culinary heritage of traditional Indian pickles by Babaji Achar.',
    openGraph: {
        title: 'Babaji Achar Blog - The Taste of Tradition',
        description: 'Explore recipes, health benefits, and the rich culinary heritage of traditional Indian pickles.',
        type: 'website',
    }
};
export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
    const posts = await BlogService.getPublishedPosts();

    return (
        <div className="min-h-screen bg-stone-50 pb-20 selection:bg-orange-200 selection:text-orange-900">

            {/* Navigation Header */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-orange-800 font-bold transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Main Site</span>
                    </Link>
                    <Link href="/" className="font-black text-xl text-orange-950 tracking-widest uppercase">
                        Babaji<span className="text-orange-600">Achar</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 sm:mt-20 px-4">

                {/* Page Header */}
                <div className="text-center mb-16 animate-in slide-in-from-bottom duration-700">
                    <p className="text-orange-600 font-black tracking-[0.2em] uppercase text-sm mb-4">A Taste of Tradition</p>
                    <h1 className="text-5xl sm:text-7xl font-black text-orange-950 mb-6 leading-tight">
                        The Family <br className="hidden sm:block" />Recipe Book.
                    </h1>
                    <p className="text-xl sm:text-2xl text-stone-500 font-medium max-w-2xl mx-auto">
                        Discover the secrets, health benefits, and stories behind India's most loved pickles.
                    </p>
                </div>

                {/* Blog Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                        <h3 className="text-2xl font-black text-stone-400 mb-2">No articles yet</h3>
                        <p className="text-stone-500 font-medium">We're writing our first traditional recipe. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post.id}
                                className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-stone-100 flex flex-col animate-in fade-in slide-in-from-bottom fill-mode-both`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {/* Article Image Image */}
                                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                                    {post.featuredImage ? (
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                                            <span className="text-orange-900 font-black text-2xl opacity-20">BABAJI ACHAR</span>
                                        </div>
                                    )}
                                    {/* Floating Date Badge */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-white">
                                        <Calendar size={14} className="text-orange-600" />
                                        <span className="text-xs font-black text-stone-700 uppercase tracking-widest">{new Date(post.publishedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="p-6 sm:p-8 flex flex-col flex-1">
                                    <h2 className="text-2xl font-black text-orange-950 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                                        {post.title}
                                    </h2>
                                    <p className="text-stone-500 font-medium mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-orange-700 font-black text-sm tracking-widest uppercase mt-auto group-hover:gap-2 transition-all">
                                        Read Article <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
