import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, ArrowRight, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
};

const Blog = () => {
  const { isOwner } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,cover_image_url,published_at,created_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="blog" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Clinic Journal
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold mt-3 text-primary-deep">
            Denticare <span className="text-gradient">Blog</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dental tips, treatment guides, and clinic updates.
          </p>
          {isOwner && (
            <div className="mt-6">
              <Button asChild variant="hero" size="lg">
                <Link to="/admin/blog">
                  <PenLine className="w-4 h-4" /> Write Blog
                </Link>
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-card-gradient rounded-3xl border border-border/60 max-w-2xl mx-auto">
            <p className="text-muted-foreground">No blog posts yet. Check back soon.</p>
          </div>
        ) : (
          <>
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
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-primary-deep group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="outline" size="lg">
                <Link to="/blog">
                  View all posts <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Blog;
