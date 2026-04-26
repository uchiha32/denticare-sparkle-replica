import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/denticare-logo.png";

const Footer = () => (
  <footer id="contact" className="relative bg-primary-deep text-primary-foreground pt-20 pb-8 overflow-hidden">
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent blur-3xl" />
    </div>
    <div className="container relative z-10">
      <div className="grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="mb-4">
            <img
              src={logo}
              alt="Denticare Dental Clinic logo"
              className="h-16 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-primary-foreground/70 max-w-md leading-relaxed">
            Premium dental care in Islamabad — led by Asst. Prof. Dr. Muhammad
            Omer Siddiqui (BDS, MHPE). Your smile, our priority.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> Options Arcade, Main Road, PWD, Islamabad</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" /> <a href="tel:+923335299143" className="hover:text-primary-foreground">0333 5299143</a></li>
            <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" /> 5:00 PM – 8:30 PM · Closed Sundays</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Opening Hours</h4>
          <ul className="space-y-1.5 text-sm text-primary-foreground/70">
            {[
              ["Monday", "5:00 – 8:30 PM"],
              ["Tuesday", "5:00 – 8:30 PM"],
              ["Wednesday", "5:00 – 8:30 PM"],
              ["Thursday", "5:00 – 8:30 PM"],
              ["Friday", "5:00 – 8:30 PM"],
              ["Saturday", "5:00 – 8:30 PM"],
              ["Sunday", "Closed"],
            ].map(([day, time]) => (
              <li key={day} className="flex justify-between gap-4">
                <span>{day}</span>
                <span className={time === "Closed" ? "text-accent font-medium" : "text-primary-foreground/90"}>{time}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-5">
            <a href="https://www.instagram.com/denticare.pk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="https://www.facebook.com/denticare.pk/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 shadow-elegant bg-white/10">
        <iframe
          title="Denticare Clinic location on Google Maps"
          src="https://www.google.com/maps?q=Options%20Arcade%2C%20Main%20Road%2C%20PWD%2C%20Islamabad%2C%2044000&output=embed"
          className="h-80 w-full border-0 md:h-96"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-primary-foreground/60">
        © {new Date().getFullYear()} Denticare Dental Clinic. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;