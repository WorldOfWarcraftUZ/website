import { Link } from "wouter";
import { Shield, Sword, Github, Twitter, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    categories: [
      { href: "/category/guides", label: "Qo'llanmalar" },
      { href: "/category/news", label: "Yangiliklar" },
      { href: "/category/raids", label: "Reidlar" },
      { href: "/category/pvp", label: "PvP" },
      { href: "/category/class-guides", label: "Klass Qo'llanmalari" },
      { href: "/category/lore", label: "Lore" },
    ],
    resources: [
      { href: "/admin", label: "Admin Panel" },
    ],
  };

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="flex items-center gap-2 mb-4 cursor-pointer">
                <div className="relative">
                  <Shield className="h-10 w-10 text-accent" />
                  <Sword className="h-5 w-5 text-primary absolute -bottom-1 -right-1" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-wide">
                    Azeroth <span className="text-accent">Chronicles</span>
                  </h2>
                </div>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              World of Warcraft o'yinchilari uchun eng yaxshi qo'llanmalar, 
              strategiyalar va yangiliklar. Azeroth sayohatlaringizda biz bilan birga bo'ling!
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Github" data-testid="link-github">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Youtube" data-testid="link-youtube">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Email" data-testid="link-email">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Kategoriyalar</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-muted-foreground hover:text-accent transition-colors cursor-pointer text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Resurslar</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-muted-foreground hover:text-accent transition-colors cursor-pointer text-sm">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} Azeroth Chronicles. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            World of Warcraft® va Blizzard Entertainment® belgilari Blizzard Entertainment, Inc. kompaniyasiga tegishli.
          </p>
        </div>
      </div>
    </footer>
  );
}
