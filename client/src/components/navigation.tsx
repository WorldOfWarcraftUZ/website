import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search, 
  Shield, 
  Sword,
  BookOpen,
  Newspaper,
  Users,
  Scroll,
  Settings
} from "lucide-react";
import type { Category } from "@shared/schema";

interface NavigationProps {
  categories: Category[];
  onSearchClick?: () => void;
}

export function Navigation({ categories, onSearchClick }: NavigationProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Bosh sahifa", icon: Shield },
    { href: "/category/guides", label: "Qo'llanmalar", icon: BookOpen },
    { href: "/category/news", label: "Yangiliklar", icon: Newspaper },
    { href: "/category/raids", label: "Reidlar", icon: Sword },
    { href: "/category/pvp", label: "PvP", icon: Users },
    { href: "/category/lore", label: "Lore", icon: Scroll },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <Shield className="h-8 w-8 text-accent" />
                <Sword className="h-4 w-4 text-primary absolute -bottom-1 -right-1" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-xl font-bold tracking-wide text-foreground">
                  Azeroth <span className="text-accent">Chronicles</span>
                </h1>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  size="sm"
                  className="font-medium uppercase tracking-wider text-xs"
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-4 w-4 mr-1.5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchClick}
              data-testid="button-search"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Link href="/admin">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-admin"
                aria-label="Admin panel"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-l border-border">
                <div className="flex flex-col gap-4 pt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-8 w-8 text-accent" />
                    <span className="font-serif text-xl font-bold">
                      Azeroth <span className="text-accent">Chronicles</span>
                    </span>
                  </div>
                  
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className="w-full justify-start font-medium uppercase tracking-wider text-sm"
                          onClick={() => setIsOpen(false)}
                          data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-border pt-4 mt-4">
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setIsOpen(false)}
                        data-testid="mobile-nav-admin"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
