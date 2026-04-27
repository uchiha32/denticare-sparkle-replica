import {
  Sparkles,
  Wrench,
  Smile,
  Stethoscope,
  Baby,
  Scissors,
  Crown,
  Activity,
  ShieldCheck,
  Pickaxe,
  Layers,
} from "lucide-react";
import whitening from "@/assets/service-whitening.jpg";
import implants from "@/assets/service-implants.jpg";
import veneers from "@/assets/service-veneers.jpg";
import crowns from "@/assets/service-crowns.jpg";
import rootcanal from "@/assets/service-rootcanal.jpg";
import scaling from "@/assets/service-scaling.jpg";
import fillings from "@/assets/service-fillings.jpg";
import braces from "@/assets/service-braces.jpg";
import children from "@/assets/service-children.jpg";
import extraction from "@/assets/service-extraction.jpg";
import prosthodontics from "@/assets/service-prosthodontics.jpg";

const services = [
  { icon: Sparkles, image: whitening, title: "Teeth Whitening", desc: "Brighten your smile with safe, professional whitening treatments." },
  { icon: Wrench, image: implants, title: "Dental Implants", desc: "Permanent, natural-looking tooth replacements that last a lifetime." },
  { icon: Smile, image: veneers, title: "Veneers", desc: "Custom porcelain veneers for a flawless Hollywood smile." },
  { icon: Crown, image: crowns, title: "Crowns & Bridges", desc: "Restore strength and aesthetics with premium zirconia crowns and bridges." },
  { icon: Activity, image: rootcanal, title: "Root Canal Treatment", desc: "Pain-free, modern endodontic care to save your natural teeth." },
  { icon: ShieldCheck, image: scaling, title: "Scaling & Polishing", desc: "Deep cleaning to keep your gums healthy and teeth shining." },
  { icon: Stethoscope, image: fillings, title: "Permanent Fillings", desc: "Durable tooth-colored fillings that blend seamlessly." },
  { icon: Scissors, image: braces, title: "Braces & Orthodontics", desc: "Straighten teeth with modern braces and aligner solutions." },
  { icon: Baby, image: children, title: "Children Dentistry", desc: "Gentle, friendly paediatric dental care for little smiles." },
  { icon: Pickaxe, image: extraction, title: "Extractions & Impactions", desc: "Safe, comfortable removal of damaged or impacted teeth by experts." },
  { icon: Layers, image: prosthodontics, title: "Removable Prosthodontics", desc: "Custom dentures and removable prosthetics for a confident smile." },
];

const Services = () => (
  <section id="services" className="relative py-24 lg:py-32">
    <div className="container relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
        <span className="text-sm font-semibold tracking-widest text-primary uppercase">
          Our Services
        </span>
        <h2 className="font-display text-4xl lg:text-5xl font-semibold mt-3 text-primary-deep">
          Complete Dental Care{" "}
          <span className="text-gradient">Under One Roof</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          From routine cleanings to advanced cosmetic procedures, Denticare offers
          a full spectrum of premium dental treatments.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="group relative bg-card-gradient rounded-2xl overflow-hidden border border-border/60 shadow-soft hover:shadow-elegant hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                width={768}
                height={512}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/70 via-primary-deep/10 to-transparent" />
              <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-hero-gradient grid place-items-center text-primary-foreground shadow-elegant group-hover:scale-110 transition-transform duration-500">
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold text-primary-deep mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;