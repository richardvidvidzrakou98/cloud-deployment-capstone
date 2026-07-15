import { Link } from "@tanstack/react-router";
import { Sprout, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-forest text-cream">
      <div className="kente-band h-2 w-full" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-forest">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="font-heading text-xl font-bold text-cream">Akuafo.market</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Connecting Ghanaian farmers directly with the tables of the world. From soil to supper,
            honestly grown.
          </p>
        </div>
        <div>
          <h4 className="text-cream mb-4 font-heading text-lg">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>
              <Link to="/products" className="hover:text-accent">
                All crops
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-accent">
                Featured farms
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-accent">
                In-season
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream mb-4 font-heading text-lg">Company</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>
              <Link to="/about" className="hover:text-accent">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <a className="hover:text-accent" href="#">
                Farmer program
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream mb-4 font-heading text-lg">Follow the harvest</h4>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 transition-colors hover:bg-accent hover:text-forest"
                aria-label="social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-cream/50">
            © {new Date().getFullYear()} Akuafo Market. Grown in Ghana.
          </p>
        </div>
      </div>
    </footer>
  );
}
