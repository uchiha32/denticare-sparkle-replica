import { useEffect, useMemo, useState } from "react";
import { Star, Quote, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { clinicReviews } from "@/data/reviews";

type Review = { name: string; text: string; when: string; rating?: number };

const seedReviews: Review[] = clinicReviews;

const STORAGE_KEY = "denticare_user_reviews";

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  text: z.string().trim().min(10, "Review must be at least 10 characters").max(800),
  rating: z.number().int().min(1).max(5),
});

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Reviews = () => {
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUserReviews(JSON.parse(stored));
    } catch {}
  }, []);

  // Reshuffle only on the client to avoid SSR hydration mismatch
  const displayed = useMemo(
    () =>
      mounted
        ? shuffle([...userReviews, ...seedReviews])
        : [...userReviews, ...seedReviews],
    [userReviews, mounted]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = reviewSchema.safeParse({ name, text, rating });
    if (!result.success) {
      toast.error("Please check your review", {
        description: result.error.errors[0]?.message ?? "Invalid input",
      });
      return;
    }
    const newReview: Review = {
      name: result.data.name,
      text: result.data.text,
      rating: result.data.rating,
      when: "Just now",
    };
    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setName("");
    setText("");
    setRating(5);
    toast.success("Thank you! 🎉", {
      description: "Your review has been added.",
    });
  };

  return (
  <section id="reviews" className="relative py-24 lg:py-32 bg-soft-gradient overflow-hidden">
    <div className="container relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold tracking-widest text-primary uppercase">
          Patient Stories
        </span>
        <h2 className="font-display text-4xl lg:text-5xl font-semibold mt-3 text-primary-deep">
          Loved by <span className="text-gradient">Our Patients</span>
        </h2>
        <div className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full glass shadow-soft">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <span className="font-semibold text-primary-deep">4.7</span>
          <span className="text-muted-foreground text-sm">· 30 Google Reviews</span>
        </div>
      </div>

      <div className="marquee-mask marquee-pause">
        <div className="marquee-track gap-6 py-4">
          {[...displayed, ...displayed].map((r, i) => (
            <div
              key={i}
              className="w-[340px] sm:w-[400px] shrink-0 relative bg-card-gradient rounded-2xl p-8 border border-border/60 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
            >
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              <div className="flex mb-3">
                {[...Array(r.rating ?? 5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed text-sm line-clamp-6">{r.text}</p>
              <div className="mt-6 pt-6 border-t border-border/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-hero-gradient grid place-items-center text-primary-foreground font-semibold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-primary-deep">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.when}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review */}
      <div className="mt-20 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Share Your Experience
          </span>
          <h3 className="font-display text-3xl lg:text-4xl font-semibold mt-3 text-primary-deep">
            Write a <span className="text-gradient">Review</span>
          </h3>
          <p className="mt-3 text-muted-foreground">
            We'd love to hear about your visit to Denticare.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card-gradient rounded-2xl p-6 sm:p-8 border border-border/60 shadow-soft space-y-5"
        >
          <div>
            <label className="text-sm font-medium text-primary-deep mb-2 block">
              Your Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ayesha Khan"
              maxLength={60}
              required
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-primary-deep mb-2 block">
              Rating
            </legend>
            <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= (hover || rating);

                return (
                  <label
                    key={n}
                    className="p-1 cursor-pointer transition-transform hover:scale-110 focus-within:scale-110"
                    onMouseEnter={() => setHover(n)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      checked={rating === n}
                      onChange={() => setRating(n)}
                      className="sr-only"
                    />
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        active
                          ? "fill-primary text-primary"
                          : "fill-transparent text-muted-foreground/40"
                      }`}
                    />
                  </label>
                );
              })}
              <span className="ml-2 text-sm font-semibold text-primary-deep">
                {rating}/5
              </span>
            </div>
          </fieldset>

          <div>
            <label className="text-sm font-medium text-primary-deep mb-2 block">
              Your Review
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              maxLength={800}
              required
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {text.length}/800
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  </section>
  );
};

export default Reviews;