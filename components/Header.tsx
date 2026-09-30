import Link from "next/link";
import { config } from "@/config";
import { sales } from "@/lib/sales";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="wordmark">
          {config.shopName}
        </Link>
        <Link href={`/#${sales.anchor}`} className="site-header__cta">
          {sales.cta}
        </Link>
      </div>
    </header>
  );
}
