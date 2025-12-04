import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Sword, ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToContent = () => {
    const element = document.getElementById("featured-articles");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2065&auto=format&fit=crop')`,
        }}
      />
      
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent">
            <Sword className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wider">
              World of Warcraft Guides
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide text-white drop-shadow-lg">
            Azeroth{" "}
            <span className="text-accent">Chronicles</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Eng yaxshi WoW qo'llanmalari, reidlar uchun strategiyalar, 
            PvP sirlari va Azeroth dunyosining qiziqarli tarixi
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/category/guides">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 uppercase tracking-wider font-semibold bg-accent text-accent-foreground border-accent-border"
                data-testid="button-explore-guides"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Qo'llanmalarni ko'rish
              </Button>
            </Link>
            <Link href="/category/raids">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 uppercase tracking-wider font-semibold bg-background/30 backdrop-blur border-white/20 text-white hover:bg-white/10"
                data-testid="button-raid-strategies"
              >
                <Sword className="h-5 w-5 mr-2" />
                Raid Strategiyalari
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll down"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
