import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, LogIn, LogOut, PenLine } from "lucide-react";
import logo from "@/assets/denticare-logo.png";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#doctor", label: "Dentists" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isOwner, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`container transition-all duration-500 ${
          scrolled
            ? "glass shadow-soft rounded-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center" aria-label="Denticare Dental Clinic — Home">
            <img
              src={logo}
              alt="Denticare Dental Clinic logo"
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-base font-medium text-foreground/80 hover:text-primary transition-colors story-link"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <a
              href="tel:+923335299143"
              className="flex items-center gap-2 text-base font-medium text-primary-deep hover:text-primary transition-colors whitespace-nowrap"
            >
              <Phone className="w-5 h-5" /> 0333 5299143
            </a>
            {isOwner && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/blog"><PenLine className="w-4 h-4" /> Write</Link>
              </Button>
            )}
            {user ? (
              <Button onClick={() => signOut()} variant="ghost" size="icon" aria-label="Sign out">
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Button asChild variant="ghost" size="icon" aria-label="Sign in">
                <Link to="/auth"><LogIn className="w-4 h-4" /></Link>
              </Button>
            )}
            <Button asChild variant="hero" size="lg">
              <a href="/#book" className="whitespace-nowrap text-base">Book Appointment</a>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg text-primary-deep"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden px-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-foreground/80 font-medium"
                >
                  {l.label}
                </a>
              ))}
              <Button asChild variant="hero" className="mt-2">
                <a href="#book" onClick={() => setOpen(false)}>
                  Book Appointment
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;