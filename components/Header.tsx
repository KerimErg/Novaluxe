import Link from "next/link";
import { config } from "@/config";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="wordmark">
          {config.shopName}
        </Link>
        <Link href="/#commander" className="site-header__cta">
          Commander
        </Link>
      </div>
    </header>
  );
}
