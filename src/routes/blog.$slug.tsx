import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import AnimatedBackground from "@/components/site/AnimatedBackground";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="text-center">
        <h1 className="font-display text-3xl text-primary-deep">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
          ← Back to blog
        </Link>
      </div>
    </div>
  ),
});

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
};

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setMissing(true);
        else setPost(data as Post);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container pt-32 pb-20 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> All posts
          </Link>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : missing || !post ? (
            <div className="text-center py-20">
              <h1 className="font-display text-3xl text-primary-deep">Post not found</h1>
              <p className="text-muted-foreground mt-2">This blog post may have been removed or unpublished.</p>
            </div>
          ) : (
            <article>
              {post.cover_image_url && (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-3xl mb-8 shadow-elegant"
                />
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at ?? post.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-semibold text-primary-deep leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p>
              )}
              <div className="mt-8 prose prose-lg max-w-none text-foreground/85 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </article>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
