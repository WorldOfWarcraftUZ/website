import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function ArticleDetail() {
  // URL dan slug ni olish (/article/:slug)
  const [match, params] = useRoute("/article/:slug");
  const slug = params?.slug;

  // Kategoriyalarni olish (Navigation uchun)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Maqolani Supabasedan yuklash
  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      // Slug bo'yicha qidiramiz va kategoriyasi bilan birga olamiz
      const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug, // Slug bor bo'lsagina so'rov yuboriladi
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation categories={categories} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-96 bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Agar maqola topilmasa yoki xatolik bo'lsa
  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation categories={categories} />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold font-serif mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Maqola topilmadi</p>
          <Link href="/">
            <Button>Bosh sahifaga qaytish</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation categories={categories} />

      <main className="flex-1">
        {/* Header Section */}
        <header className="relative w-full h-[60vh] min-h-[400px] flex items-end">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={article.featured_image || "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a"}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="container mx-auto px-4 pb-12 relative z-10">
            <Link href="/">
              <Button variant="ghost" className="mb-6 hover:bg-background/20 text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Orqaga
              </Button>
            </Link>

            <div className="max-w-4xl">
              {article.category && (
                <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  {article.category.name}
                </Badge>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Admin</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(article.created_at), "d MMMM, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>5 daqiqalik o'qish</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {article.excerpt && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-serif leading-relaxed italic border-l-4 border-primary pl-6">
                {article.excerpt}
              </p>
            )}

            <Separator className="my-8" />

            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-headings:font-serif"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}