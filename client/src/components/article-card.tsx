import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/category-badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { ArticleWithCategory } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithCategory;
  featured?: boolean;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0c?w=800&h=450&fit=crop",
];

function getRandomImage(id: string) {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultImages.length;
  return defaultImages[index];
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const imageUrl = article.featuredImage || getRandomImage(article.id);
  const readTime = estimateReadTime(article.content);
  const formattedDate = article.createdAt 
    ? format(new Date(article.createdAt), "dd MMM, yyyy")
    : "Yangi";

  return (
    <Link href={`/article/${article.slug}`}>
      <Card 
        className={`group overflow-hidden border-2 border-border hover:border-accent/50 transition-all duration-300 cursor-pointer bg-card ${featured ? 'wow-border-glow' : ''}`}
        data-testid={`card-article-${article.id}`}
      >
        {/* Image container */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category badge */}
          {article.category && (
            <div className="absolute top-3 left-3">
              <CategoryBadge 
                category={article.category.slug} 
                color={article.category.color || "default"}
                size="sm"
              />
            </div>
          )}

          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-accent text-accent-foreground rounded">
                Featured
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-3">
          {/* Title */}
          <h3 className="font-serif text-xl font-bold leading-tight text-card-foreground group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {article.author || "Admin"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime} min
              </span>
            </div>
            
            {/* Read more arrow */}
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
