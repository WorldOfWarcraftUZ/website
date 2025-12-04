import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Newspaper, 
  Sword, 
  Users, 
  Sparkles,
  Scroll,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

const iconMap: Record<string, React.ElementType> = {
  guides: BookOpen,
  news: Newspaper,
  raids: Sword,
  pvp: Users,
  "class-guides": Sparkles,
  class: Sparkles,
  lore: Scroll,
};

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <div className="w-full py-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center gap-2 px-1">
          {/* All categories button */}
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(null)}
            className={cn(
              "shrink-0 font-medium uppercase tracking-wider text-xs",
              selectedCategory === null && "bg-accent text-accent-foreground"
            )}
            data-testid="button-category-all"
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            Barchasi
          </Button>

          {/* Category buttons */}
          {categories.map((category) => {
            const Icon = iconMap[category.slug] || BookOpen;
            const isSelected = selectedCategory === category.slug;
            
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCategory(category.slug)}
                className={cn(
                  "shrink-0 font-medium uppercase tracking-wider text-xs",
                  isSelected && "bg-accent text-accent-foreground"
                )}
                data-testid={`button-category-${category.slug}`}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {category.name}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
