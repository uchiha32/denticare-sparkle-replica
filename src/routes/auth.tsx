import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Denticare" },
      { name: "description", content: "Admin sign-in for Denticare blog management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin/blog" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Map the admin username to the internal email used by the auth backend.
    const normalized = username.trim().toLowerCase().replace(/\s+/g, "");
    const email =
      normalized === "muhammadomersiddique"
        ? "muhammadomersiddique@denticare.local"
        : username.trim();

    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("Invalid username or password");
      return;
    }
    toast.success("Welcome back, admin");
    navigate({ to: "/admin/blog" });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-16">
      <div className="w-full max-w-md bg-card-gradient border border-border/60 rounded-3xl p-8 shadow-elegant">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-semibold text-primary-deep">
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to manage the Denticare blog.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="mb-2 block">Username</Label>
            <Input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Muhammad Omer Siddique"
              autoComplete="username"
            />
          </div>
          <div>
            <Label className="mb-2 block">Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
