import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, FileText, ArrowRight, Loader2 } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import type { ArticleWithCategory } from "@shared/schema";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articles: ArticleWithCategory[];
}

export function SearchDialog({ open, onOpenChange, articles }: SearchDialogProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setQuery(""), 200);
    }
  }, [open]);

  // Filter articles based on query
  const filteredArticles = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.category?.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  }, [query, articles]);

  const handleArticleClick = (slug: string) => {
    setLocation(`/article/${slug}`);
    onOpenChange(false);
  };

  // Simulate search loading state
  useEffect(() => {
    if (query) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
    setIsSearching(false);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-card border-2 border-border">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Maqola qidirish</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Maqola yoki qo'llanma qidiring..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-lg border-2 border-border focus:border-accent"
              autoFocus
              data-testid="input-search"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setQuery("")}
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="p-4 pt-2">
          {/* Loading state */}
          {isSearching && query && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}

          {/* Results */}
          {!isSearching && query && filteredArticles.length > 0 && (
            <div className="space-y-2" data-testid="search-results">
              <p className="text-xs text-muted-foreground mb-3">
                {filteredArticles.length} ta natija topildi
              </p>
              {filteredArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleArticleClick(article.slug)}
                  className="w-full p-3 rounded-md hover-elevate active-elevate-2 text-left bg-muted/30 border border-transparent hover:border-accent/30 transition-all group"
                  data-testid={`search-result-${article.id}`}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {article.category && (
                          <CategoryBadge 
                            category={article.category.slug}
                            color={article.category.color}
                            size="sm"
                            showIcon={false}
                          />
                        )}
                      </div>
                      <h4 className="font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {article.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {!isSearching && query && filteredArticles.length === 0 && (
            <div className="py-12 text-center" data-testid="search-no-results">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">
                Hech narsa topilmadi
              </h4>
              <p className="text-sm text-muted-foreground">
                "{query}" bo'yicha natija yo'q. Boshqa so'z bilan sinab ko'ring.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!query && (
            <div className="py-8 text-center text-muted-foreground" data-testid="search-empty">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Maqola sarlavhasi yoki mavzuni qidiring
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
