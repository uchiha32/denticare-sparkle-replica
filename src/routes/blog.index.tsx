import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PenLine, ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import AnimatedBackground from "@/components/site/AnimatedBackground";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Denticare Dental Clinic" },
      { name: "description", content: "Dental tips, treatment guides, and clinic updates from Denticare Islamabad." },
      { property: "og:title", content: "Denticare Blog" },
      { property: "og:description", content: "Dental tips, treatment guides, and clinic updates." },
    ],
  }),
  component: BlogList,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
};

function BlogList() {
  const { isOwner } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,cover_image_url,published_at,created_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container pt-32 pb-20">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-3">
                <ArrowLeft className="w-4 h-4" /> Home
              </Link>
              <h1 className="font-display text-4xl lg:text-5xl font-semibold text-primary-deep">
                Denticare <span className="text-gradient">Blog</span>
              </h1>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Dental tips, treatment guides, and clinic updates.
              </p>
            </div>
            {isOwner && (
              <Button asChild variant="hero" size="lg">
                <Link to="/admin/blog">
                  <PenLine className="w-4 h-4" /> Write Blog
                </Link>
              </Button>
            )}
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-card-gradient rounded-3xl border border-border/60">
              <p className="text-muted-foreground">No blog posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group bg-card-gradient rounded-3xl border border-border/60 shadow-soft hover:shadow-elegant transition-all overflow-hidden"
                >
                  {p.cover_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(p.published_at ?? p.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-primary-deep group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                    )}
                    <span className="mt-4 inline-block text-sm font-medium text-primary">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
