import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArticleCard } from "@/components/article-card";
import { ArticleCardSkeleton } from "@/components/article-skeleton";
import { SearchDialog } from "@/components/search-dialog";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Newspaper, 
  Sword, 
  Users, 
  Sparkles,
  Scroll,
  ArrowLeft
} from "lucide-react";
import type { ArticleWithCategory, Category } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
  guides: BookOpen,
  news: Newspaper,
  raids: Sword,
  pvp: Users,
  "class-guides": Sparkles,
  class: Sparkles,
  lore: Scroll,
};

const categoryDescriptions: Record<string, string> = {
  guides: "World of Warcraft o'yini bo'yicha to'liq qo'llanmalar va ko'rsatmalar",
  news: "O'yindagi so'nggi yangiliklar, patchlar va yangilanishlar",
  raids: "Raid boss strategiyalari, taktikalar va jamoaviy o'yin sirlari",
  pvp: "PvP arena va maydon janglari uchun strategiyalar",
  "class-guides": "Har bir klass uchun maxsus qo'llanmalar va buildlar",
  lore: "Azeroth dunyosining boy tarixi va afsonalari",
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch all articles
  const { data: allArticles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles"],
  });

  // Find current category
  const currentCategory = categories.find((c) => c.slug === slug);

  // Filter articles by category
  const categoryArticles = useMemo(() => {
    return allArticles.filter((article) => article.category?.slug === slug);
  }, [allArticles, slug]);

  const Icon = iconMap[slug || ""] || BookOpen;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation categories={categories} onSearchClick={() => setSearchOpen(true)} />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-card to-background border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-accent/20 border border-accent/30">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="font-serif text-4xl font-bold" data-testid="category-title">
                  {currentCategory?.name || slug}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {categoryDescriptions[slug || ""] || currentCategory?.description}
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground">
              {categoryArticles.length} ta maqola topildi
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="articles-loading">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="articles-grid">
              {categoryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-testid="articles-empty">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6">
                <Icon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Bu kategoriyada maqola yo'q
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Tez orada yangi maqolalar qo'shiladi. Boshqa kategoriyalarni ko'rib chiqing.
              </p>
              <Link href="/">
                <Button data-testid="button-home">
                  Bosh sahifaga qaytish
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        articles={allArticles}
      />
    </div>
  );
}
