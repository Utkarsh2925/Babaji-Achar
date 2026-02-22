import { BlogService } from '../../../src/services/BlogService';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

// Dynamic SEO Metadata per post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await BlogService.getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found | Babaji Achar',
        };
    }

    return {
        title: post.seoTitle || `${post.title} | Babaji Achar`,
        description: post.seoDescription || post.excerpt,
        keywords: post.tags?.join(', '),
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            images: post.featuredImage ? [{ url: post.featuredImage }] : [],
            type: 'article',
            publishedTime: post.publishedDate,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await BlogService.getPostBySlug(slug);

    if (!post || !post.isPublished) {
        notFound();
    }

    // JSON-LD Article Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        image: post.featuredImage ? [post.featuredImage] : [],
        datePublished: post.publishedDate,
        dateModified: post.publishedDate,
        author: [{
            '@type': 'Person',
            name: post.author,
        }],
        publisher: {
            '@type': 'Organization',
            name: 'Babaji Achar',
            logo: {
                '@type': 'ImageObject',
                url: 'https://babaji-achar.vercel.app/logo.png' // Adjust to actual logo URL
            }
        },
        description: post.seoDescription || post.excerpt
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-stone-50 selection:bg-orange-200 selection:text-orange-900 pb-20">

                {/* Navigation Header */}
                <header className="bg-white border-b border-stone-200 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                        <Link href="/blog" className="flex items-center gap-2 text-stone-500 hover:text-orange-800 font-bold transition-colors">
                            <ArrowLeft size={20} />
                            <span>Back to Blog</span>
                        </Link>
                        <Link href="/" className="font-black text-xl text-orange-950 tracking-widest uppercase">
                            Babaji<span className="text-orange-600">Achar</span>
                        </Link>
                    </div>
                </header>

                <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Article Header */}
                    <header className="text-center mb-12 space-y-6">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm font-bold text-stone-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Calendar size={16} className="text-orange-500" /> {new Date(post.publishedDate).toLocaleDateString()}</span>
                            <span className="text-stone-300">•</span>
                            <span className="flex items-center gap-1"><User size={16} className="text-orange-500" /> {post.author}</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-orange-950 leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl sm:text-2xl text-stone-500 italic font-medium max-w-2xl mx-auto leading-relaxed">
                            {post.excerpt}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                                {post.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-sm font-bold border border-stone-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Hero Image */}
                    {post.featuredImage && (
                        <div className="w-full aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl border-4 border-white bg-white">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-lg sm:prose-xl prose-stone mx-auto prose-headings:font-black prose-headings:text-orange-950 prose-a:text-orange-600 hover:prose-a:text-orange-800 prose-img:rounded-3xl prose-img:shadow-xl">
                        <ReactMarkdown>
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Call to Action Wrapper */}
                    <div className="mt-24 pt-16 border-t border-stone-200 text-center">
                        <h2 className="text-3xl font-black text-orange-950 mb-6">Want to taste the tradition?</h2>
                        <Link href="/" className="inline-block bg-orange-800 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-xl hover:bg-orange-950 hover:scale-105 active:scale-95 transition-all">
                            Shop Babaji Achar
                        </Link>
                    </div>

                </article>
            </div>
        </>
    );
}
