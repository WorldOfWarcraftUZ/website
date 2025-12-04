import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ArticleCard } from "@/components/article-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchDialog } from "@/components/search-dialog";
import { Footer } from "@/components/footer";
import { ArticleCardSkeleton } from "@/components/article-skeleton";
import type { ArticleWithCategory, Category } from "@shared/schema";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Kategoriyalarni Supabasedan olish
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error("Kategoriyalarni olishda xatolik:", error);
        throw error;
      }
      return data as Category[];
    },
  });

  // Maqolalarni Supabasedan olish
  const { data: articles = [], isLoading: isLoadingArticles } = useQuery<ArticleWithCategory[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Maqolalarni olishda xatolik:", error);
        throw error;
      }
      return data as unknown as ArticleWithCategory[];
    },
  });

  // Filtrlash logikasi
  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter((article) => article.category?.slug === selectedCategory);
  }, [articles, selectedCategory]);

  // Tanlangan maqolalar (published bo'lganlar)
  const featuredArticles = useMemo(() => {
    // Agar bazada 'published' ustuni bo'lmasa, barchasini chiqaradi
    return articles.filter(a => a.published !== false).slice(0, 3);
  }, [articles]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation categories={categories} onSearchClick={() => setSearchOpen(true)} />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1">
        {/* Featured Articles Section */}
        {featuredArticles.length > 0 && (
          <section id="featured-articles" className="container mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif text-3xl font-bold">
                Tanlanganlar
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Articles Section */}
        <section className="container mx-auto px-4 py-16 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <h2 className="font-serif text-3xl font-bold shrink-0">
              Barcha Maqolalar
            </h2>
            <div className="flex-1 h-px bg-border hidden sm:block" />
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Articles Grid */}
          {isLoadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" data-testid="articles-loading">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" data-testid="articles-grid">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-testid="articles-empty">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6">
                <svg
                  className="h-10 w-10 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Hozircha maqola yo'q
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedCategory
                  ? "Bu kategoriyada hozircha maqola yo'q. Boshqa kategoriyani ko'ring."
                  : "Yangi maqolalar tez orada qo'shiladi. Bizni kuzatishda davom eting!"}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Search Dialog */}
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        articles={articles}
      />
    </div>
  );
}