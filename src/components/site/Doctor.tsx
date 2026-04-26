import { GraduationCap, Stethoscope, Award, Users, Sparkles } from "lucide-react";
import drOmer from "@/assets/dr-omer.png";
import drEruj from "@/assets/dr-eruj.png";

const Doctor = () => (
  <section id="doctor" className="relative py-24 lg:py-32">
    <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-14 animate-fade-in-up">
        <span className="text-sm font-semibold tracking-widest text-primary uppercase">
          Meet Your Dentists
        </span>
        <h2 className="font-display text-4xl lg:text-5xl font-semibold mt-3 text-primary-deep">
          Expert Care from <span className="text-gradient">Trusted Specialists</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          A team of qualified, PMDC-verified professionals dedicated to your smile.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <DoctorCard
          image={drOmer}
          imageClassName="scale-150 object-[center_25%]"
          alt="Asst. Prof. Dr. Muhammad Omer Siddiqui — Cosmetic Dentist at Denticare Dental Clinic Islamabad"
          name={<>Asst. Prof. Dr. Muhammad <span className="text-gradient">Omer Siddiqui</span></>}
          credentials="BDS, MHPE · Cosmetic Dentist"
          badge="BDS · MHPE"
          role="Lead Dentist"
          bio="With over 16 years of clinical experience, Dr. Omer is renowned for his calm, ethical and patient-first approach. His expertise spans cosmetic dentistry, implants, root canals and complex restorations — delivered with precision and genuine care."
          stats={[
            { icon: GraduationCap, title: "BDS, MHPE", sub: "Qualified Specialist" },
            { icon: Award, title: "16+ Years", sub: "Clinical Experience" },
            { icon: Stethoscope, title: "PMDC Verified", sub: "Licensed Practitioner" },
            { icon: Users, title: "1000+ Patients", sub: "Treated with Care" },
          ]}
        />
        <DoctorCard
          image={drEruj}
          alt="Prof. Dr. Eruj Shuja — Oral & Maxillofacial Surgeon at Denticare Dental Clinic Islamabad"
          name={<>Prof. Dr. <span className="text-gradient">Eruj Shuja</span></>}
          credentials="BDS, FCPS, CHPE · Oral & Maxillofacial Surgeon"
          badge="BDS · FCPS"
          role="Oral Surgeon"
          bio="A decade of experience as a Consultant Oral Surgeon and Dental Implant Specialist. Dr. Eruj brings advanced surgical expertise, combining precision with a compassionate, patient-centered approach to complex oral procedures."
          stats={[
            { icon: GraduationCap, title: "BDS, FCPS, CHPE", sub: "Maxillofacial Surgeon" },
            { icon: Award, title: "10+ Years", sub: "Consultant Experience" },
            { icon: Stethoscope, title: "Implant Specialist", sub: "Surgical Expertise" },
            { icon: Users, title: "PMDC Verified", sub: "Licensed Practitioner" },
          ]}
        />
      </div>
    </div>
  </section>
);

type StatItem = { icon: any; title: string; sub: string };

const DoctorCard = ({
  image,
  imageClassName,
  alt,
  name,
  credentials,
  badge,
  role,
  bio,
  stats,
}: {
  image: string;
  imageClassName?: string;
  alt: string;
  name: React.ReactNode;
  credentials: string;
  badge: string;
  role: string;
  bio: string;
  stats: StatItem[];
}) => (
  <div className="animate-fade-in-up">
    <div className="relative">
      <div className="absolute -inset-6 bg-hero-gradient rounded-[2.5rem] blur-3xl opacity-25" />
      <div className="relative rounded-[2rem] overflow-hidden bg-primary-deep shadow-elegant aspect-[4/5]">
        <img
          src={image}
          alt={alt}
          className={`w-full h-full object-cover object-top ${imageClassName ?? ""}`}
          loading="lazy"
        />
      </div>
      <div className="absolute -bottom-5 -right-5 glass rounded-2xl px-5 py-3 shadow-elegant float-anim">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">{role}</div>
            <div className="text-sm font-semibold text-primary-deep">{badge}</div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-10">
      <h3 className="font-display text-2xl lg:text-3xl font-semibold text-primary-deep">
        {name}
      </h3>
      <p className="mt-2 text-primary font-medium text-sm">{credentials}</p>
      <p className="mt-4 text-muted-foreground leading-relaxed">{bio}</p>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {stats.map((s) => (
          <Item key={s.title} icon={s.icon} title={s.title} sub={s.sub} />
        ))}
      </div>
    </div>
  </div>
);

const Item = ({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-card-gradient border border-border/60 shadow-soft">
    <div className="w-12 h-12 rounded-xl bg-hero-gradient grid place-items-center text-primary-foreground shadow-elegant">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="font-semibold text-primary-deep">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  </div>
);

export default Doctor;