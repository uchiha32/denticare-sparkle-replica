import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Pencil, Plus, Eye, EyeOff, LogOut, Upload } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import AnimatedBackground from "@/components/site/AnimatedBackground";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({ meta: [{ title: "Manage Blog — Denticare" }, { name: "robots", content: "noindex" }] }),
  component: AdminBlog,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

const empty = { id: "", title: "", excerpt: "", content: "", cover_image_url: "" };

function AdminBlog() {
  const { user, isOwner, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<typeof empty | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleNewPost = () => {
    console.log("New Post clicked");
    setEditing({ ...empty });
  };

  const handleAdminSignOut = async () => {
    console.log("Sign out clicked");
    await signOut();
    navigate({ to: "/" });
  };

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (isOwner) refresh();
  }, [isOwner]);

  const refresh = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  };

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;

  if (user && !isOwner) {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl text-primary-deep">Access denied</h1>
          <p className="text-muted-foreground mt-3">
            Your account doesn't have owner privileges. Ask the site owner to grant you access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline"><Link to="/">Go home</Link></Button>
            <Button onClick={() => signOut()} variant="hero">Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpload = async (file: File): Promise<string | null> => {
    if (!user) return null;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      return data.publicUrl;
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const save = async (publish: boolean) => {
    if (!editing || !user) return;
    if (editing.title.trim().length < 3 || editing.content.trim().length < 20) {
      toast.error("Add a title and a longer post body.");
      return;
    }
    setSaving(true);
    const baseSlug = slugify(editing.title);
    const isNew = !editing.id;
    const payload: any = {
      title: editing.title.trim(),
      excerpt: editing.excerpt.trim() || null,
      content: editing.content.trim(),
      cover_image_url: editing.cover_image_url.trim() || null,
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
    };

    let result;
    if (isNew) {
      payload.slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      payload.author_id = user.id;
      result = await supabase.from("blog_posts").insert(payload).select().single();
    } else {
      result = await supabase.from("blog_posts").update(payload).eq("id", editing.id).select().single();
    }
    setSaving(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    toast.success(publish ? "Published!" : "Saved as draft");
    setEditing(null);
    refresh();
  };

  const togglePublish = async (p: Post) => {
    const next = !p.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: next, published_at: next ? new Date().toISOString() : null })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Published" : "Unpublished");
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container pt-52 sm:pt-56 lg:pt-60 pb-20">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to blog
              </Link>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold text-primary-deep">
                Manage Blog
              </h1>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleNewPost} variant="hero">
                <Plus className="w-4 h-4" /> New Post
              </Button>
              <Button onClick={handleAdminSignOut} variant="outline">
                <LogOut className="w-4 h-4" /> Sign out
              </Button>
            </div>
          </div>

          {editing && (
            <div className="bg-card-gradient rounded-3xl p-6 sm:p-8 border border-border/60 shadow-elegant mb-10 space-y-5">
              <h2 className="font-display text-2xl font-semibold text-primary-deep">
                {editing.id ? "Edit post" : "New post"}
              </h2>
              <div>
                <Label className="mb-2 block">Title *</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label className="mb-2 block">Excerpt (short preview)</Label>
                <Input value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} maxLength={200} />
              </div>
              <div>
                <Label className="mb-2 block">Cover image</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await handleUpload(file);
                      if (url) setEditing({ ...editing, cover_image_url: url });
                    }}
                  />
                  {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                </div>
                {editing.cover_image_url && (
                  <img src={editing.cover_image_url} alt="" className="mt-3 max-h-40 rounded-xl object-cover" />
                )}
              </div>
              <div>
                <Label className="mb-2 block">Content *</Label>
                <Textarea
                  rows={14}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  placeholder="Write your blog post..."
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => save(true)} variant="hero" disabled={saving}>
                  <Upload className="w-4 h-4" /> {saving ? "Saving..." : "Publish"}
                </Button>
                <Button onClick={() => save(false)} variant="outline" disabled={saving}>
                  Save as draft
                </Button>
                <Button onClick={() => setEditing(null)} variant="ghost">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {posts.length === 0 && !editing && (
              <p className="text-muted-foreground">No posts yet. Create your first one!</p>
            )}
            {posts.map((p) => (
              <div key={p.id} className="bg-card-gradient rounded-2xl p-5 border border-border/60 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-semibold text-primary-deep truncate">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">/{p.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => togglePublish(p)}>
                    {p.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing({
                    id: p.id,
                    title: p.title,
                    excerpt: p.excerpt ?? "",
                    content: p.content,
                    cover_image_url: p.cover_image_url ?? "",
                  })}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
