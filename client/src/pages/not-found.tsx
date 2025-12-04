import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Sword, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="relative inline-block mb-8">
          <Shield className="h-24 w-24 text-accent" />
          <Sword className="h-12 w-12 text-primary absolute -bottom-2 -right-2" />
        </div>

        {/* 404 */}
        <h1 className="font-serif text-8xl font-bold text-accent mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="font-serif text-3xl font-bold mb-4">
          Sahifa topilmadi
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Afsuski, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan. 
          Azeroth sayohatingizni bosh sahifadan davom ettiring!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="bg-accent text-accent-foreground" data-testid="button-home">
              <Home className="h-4 w-4 mr-2" />
              Bosh sahifa
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/5 to-transparent" />
    </div>
  );
}
