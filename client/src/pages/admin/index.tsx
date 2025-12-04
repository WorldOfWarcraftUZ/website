import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdminTableSkeleton } from "@/components/article-skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  Eye,
  EyeOff,
  ArrowLeft,
  LayoutDashboard,
  BookOpen,
  Shield,
  Sword
} from "lucide-react";
import { format } from "date-fns";
import type { ArticleWithCategory, Category } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch articles
  const { data: articles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles"],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Muvaffaqiyat",
        description: "Maqola o'chirildi",
      });
    },
    onError: () => {
      toast({
        title: "Xato",
        description: "Maqolani o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  // Filter articles by search
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.published).length;
  const draftArticles = totalArticles - publishedArticles;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back-home">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Shield className="h-8 w-8 text-accent" />
                  <Sword className="h-4 w-4 text-primary absolute -bottom-1 -right-1" />
                </div>
                <div>
                  <h1 className="font-serif text-xl font-bold">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">Azeroth Chronicles</p>
                </div>
              </div>
            </div>

            <Link href="/admin/article/new">
              <Button className="bg-accent text-accent-foreground" data-testid="button-new-article">
                <Plus className="h-4 w-4 mr-2" />
                Yangi Maqola
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-testid="admin-stats">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Jami Maqolalar
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalArticles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chop etilgan
              </CardTitle>
              <Eye className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">{publishedArticles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Qoralama
              </CardTitle>
              <EyeOff className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{draftArticles}</div>
            </CardContent>
          </Card>
        </div>

        {/* Articles List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Maqolalar
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-articles"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <AdminTableSkeleton />
            ) : filteredArticles.length > 0 ? (
              <div className="space-y-3" data-testid="articles-list">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-md border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                    data-testid={`article-row-${article.id}`}
                  >
                    {/* Image */}
                    <div className="w-full sm:w-24 h-32 sm:h-16 rounded overflow-hidden bg-muted shrink-0">
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium line-clamp-1">{article.title}</h3>
                        {article.category && (
                          <Badge variant="outline" className="text-xs shrink-0">
                            {article.category.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{article.author || "Admin"}</span>
                        <span>
                          {article.createdAt
                            ? format(new Date(article.createdAt), "dd MMM, yyyy")
                            : "Yangi"}
                        </span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={article.published ? "default" : "secondary"}
                        className={
                          article.published
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        }
                      >
                        {article.published ? "Chop etilgan" : "Qoralama"}
                      </Badge>

                      <Link href={`/admin/article/${article.id}`}>
                        <Button variant="ghost" size="icon" data-testid={`button-edit-${article.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-${article.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Maqolani o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{article.title}" maqolasini o'chirishni xohlaysizmi? 
                              Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(article.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-testid="articles-empty">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Maqola topilmadi</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Qidiruv natijasi bo'sh. Boshqa so'z bilan sinab ko'ring."
                    : "Hozircha maqola yo'q. Birinchi maqolangizni yarating!"}
                </p>
                {!searchQuery && (
                  <Link href="/admin/article/new">
                    <Button data-testid="button-create-first">
                      <Plus className="h-4 w-4 mr-2" />
                      Yangi Maqola
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
