import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2 border-border">
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-3 pt-2 border-t border-border/50">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <Skeleton className="w-full h-[50vh]" />
      
      {/* Content skeleton */}
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="space-y-4 pt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-md">
          <Skeleton className="h-16 w-24 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      ))}
    </div>
  );
}
