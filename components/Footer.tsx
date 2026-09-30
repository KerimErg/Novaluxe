import Link from "next/link";
import { config } from "@/config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="wordmark">{config.shopName}</p>
        <nav aria-label="Informations légales">
          <ul className="site-footer__links">
            <li><Link href="/mentions-legales">Mentions légales</Link></li>
            <li><Link href="/cgv">CGV</Link></li>
            <li><Link href="/confidentialite">Confidentialité</Link></li>
          </ul>
        </nav>
        <p className="site-footer__note">Revendeur indépendant. Nike est une marque de Nike, Inc.</p>
      </div>
    </footer>
  );
}
