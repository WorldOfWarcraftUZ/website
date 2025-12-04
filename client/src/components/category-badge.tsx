import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Newspaper, 
  Sword, 
  Users, 
  Sparkles,
  Scroll
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  color?: string;
  showIcon?: boolean;
  size?: "sm" | "default";
  className?: string;
}

const categoryConfig: Record<string, { icon: React.ElementType; label: string }> = {
  guides: { icon: BookOpen, label: "Qo'llanma" },
  news: { icon: Newspaper, label: "Yangilik" },
  raids: { icon: Sword, label: "Raid" },
  pvp: { icon: Users, label: "PvP" },
  "class-guides": { icon: Sparkles, label: "Klass" },
  class: { icon: Sparkles, label: "Klass" },
  lore: { icon: Scroll, label: "Lore" },
};

export function CategoryBadge({ 
  category, 
  color = "default", 
  showIcon = true, 
  size = "default",
  className 
}: CategoryBadgeProps) {
  const config = categoryConfig[category.toLowerCase()] || categoryConfig.guides;
  const Icon = config.icon;

  const colorClass = `badge-${color}`;

  return (
    <Badge 
      variant="outline"
      className={cn(
        colorClass,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        "font-medium uppercase tracking-wider border",
        className
      )}
      data-testid={`badge-category-${category}`}
    >
      {showIcon && <Icon className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
      {config.label}
    </Badge>
  );
}
