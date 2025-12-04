import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CategoryBadge } from "@/components/category-badge";
import { ArticleCard } from "@/components/article-card";
import { ArticleDetailSkeleton } from "@/components/article-skeleton";
import { SearchDialog } from "@/components/search-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  ChevronRight,
  User
} from "lucide-react";
import { format } from "date-fns";
import type { ArticleWithCategory, Category } from "@shared/schema";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch all articles for search and related
  const { data: allArticles = [] } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles"],
  });

  // Fetch specific article
  const { data: article, isLoading } = useQuery<ArticleWithCategory>({
    queryKey: ["/api/articles", slug],
  });

  // Get related articles (same category, excluding current)
  const relatedArticles = allArticles
    .filter(
      (a) =>
        a.id !== article?.id &&
        a.category?.slug === article?.category?.slug &&
        a.published
    )
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation categories={categories} onSearchClick={() => setSearchOpen(true)} />
        <ArticleDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation categories={categories} onSearchClick={() => setSearchOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="font-serif text-4xl font-bold mb-4">
              Maqola topilmadi
            </h1>
            <p className="text-muted-foreground mb-8">
              Siz qidirayotgan maqola mavjud emas yoki o'chirilgan.
            </p>
            <Link href="/">
              <Button data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Bosh sahifaga qaytish
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
  const formattedDate = article.createdAt
    ? format(new Date(article.createdAt), "dd MMMM, yyyy")
    : "Yangi";

  const defaultImage = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920&h=1080&fit=crop";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation categories={categories} onSearchClick={() => setSearchOpen(true)} />

      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={article.featuredImage || defaultImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
              <Link href="/">
                <span className="hover:text-accent cursor-pointer">Bosh sahifa</span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              {article.category && (
                <>
                  <Link href={`/category/${article.category.slug}`}>
                    <span className="hover:text-accent cursor-pointer">{article.category.name}</span>
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
              <span className="text-foreground line-clamp-1">{article.title}</span>
            </nav>

            {/* Category Badge */}
            {article.category && (
              <div className="mb-4">
                <CategoryBadge
                  category={article.category.slug}
                  color={article.category.color}
                />
              </div>
            )}

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6" data-testid="article-title">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium" data-testid="article-author">{article.author || "Admin"}</p>
                  <p className="text-sm text-muted-foreground">Muallif</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span data-testid="article-date">{formattedDate}</span>
              </div>

              {/* Read time */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{readTime} daqiqa o'qish</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="ghost" size="icon" aria-label="Share" data-testid="button-share">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Bookmark" data-testid="button-bookmark">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed my-8 italic" data-testid="article-excerpt">
              {article.excerpt}
            </p>

            {/* Content */}
            <div 
              className="prose-wow max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              data-testid="article-content"
            />

            {/* Back button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Link href="/">
                <Button variant="outline" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Barcha maqolalarga qaytish
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="container mx-auto px-4 py-16 mt-8 border-t border-border">
            <h2 className="font-serif text-3xl font-bold mb-8">O'xshash Maqolalar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="related-articles">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </section>
        )}
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
