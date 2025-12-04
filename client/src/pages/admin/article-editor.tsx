import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import slugify from "slugify";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Shield,
  Sword,
  Loader2,
  ImageIcon
} from "lucide-react";
import type { ArticleWithCategory, Category, InsertArticle } from "@shared/schema";

const articleSchema = z.object({
  title: z.string().min(5, "Sarlavha kamida 5 ta belgidan iborat bo'lishi kerak"),
  slug: z.string().min(3, "Slug kamida 3 ta belgidan iborat bo'lishi kerak"),
  excerpt: z.string().min(20, "Qisqa tavsif kamida 20 ta belgidan iborat bo'lishi kerak"),
  content: z.string().min(50, "Maqola matni kamida 50 ta belgidan iborat bo'lishi kerak"),
  featuredImage: z.string().url("To'g'ri URL kiriting").optional().or(z.literal("")),
  categoryId: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = id && id !== "new";

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch article if editing
  const { data: existingArticle, isLoading: isLoadingArticle } = useQuery<ArticleWithCategory>({
    queryKey: ["/api/articles", id],
    enabled: !!isEditing,
  });

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categoryId: "",
      author: "Admin",
      published: false,
    },
  });

  // Update form when article loads
  useEffect(() => {
    if (existingArticle) {
      form.reset({
        title: existingArticle.title,
        slug: existingArticle.slug,
        excerpt: existingArticle.excerpt,
        content: existingArticle.content,
        featuredImage: existingArticle.featuredImage || "",
        categoryId: existingArticle.categoryId || "",
        author: existingArticle.author || "Admin",
        published: existingArticle.published || false,
      });
    }
  }, [existingArticle, form]);

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (!isEditing && watchTitle) {
      const slug = slugify(watchTitle, { lower: true, strict: true });
      form.setValue("slug", slug);
    }
  }, [watchTitle, isEditing, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormValues) => {
      const response = await apiRequest("POST", "/api/articles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Muvaffaqiyat",
        description: "Maqola yaratildi",
      });
      setLocation("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "Xato",
        description: error.message || "Maqolani yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ArticleFormValues) => {
      const response = await apiRequest("PATCH", `/api/articles/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles", id] });
      toast({
        title: "Muvaffaqiyat",
        description: "Maqola yangilandi",
      });
      setLocation("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "Xato",
        description: error.message || "Maqolani yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingArticle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Shield className="h-8 w-8 text-accent" />
                  <Sword className="h-4 w-4 text-primary absolute -bottom-1 -right-1" />
                </div>
                <div>
                  <h1 className="font-serif text-xl font-bold">
                    {isEditing ? "Maqolani tahrirlash" : "Yangi Maqola"}
                  </h1>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setLocation("/admin")}
                disabled={isSubmitting}
                data-testid="button-cancel"
              >
                Bekor qilish
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-accent text-accent-foreground"
                data-testid="button-save"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Saqlash
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Asosiy Ma'lumotlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sarlavha</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Maqola sarlavhasini kiriting"
                              {...field}
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (URL)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="maqola-nomi"
                              {...field}
                              data-testid="input-slug"
                            />
                          </FormControl>
                          <FormDescription>
                            Maqola URL manzilida ko'rinadigan qism
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qisqa tavsif</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Maqolaning qisqa tavsifini yozing (ro'yxatda ko'rinadi)"
                              rows={3}
                              {...field}
                              data-testid="input-excerpt"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maqola matni</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="Maqola matnini yozing..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chop etish</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Holat</FormLabel>
                            <FormDescription>
                              {field.value ? (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <Eye className="h-3 w-3" />
                                  Chop etilgan
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                  <EyeOff className="h-3 w-3" />
                                  Qoralama
                                </span>
                              )}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-published"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Muallif</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Muallif ismi"
                              {...field}
                              data-testid="input-author"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Category */}
                <Card>
                  <CardHeader>
                    <CardTitle>Kategoriya</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Kategoriyani tanlang" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Muqova rasmi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Rasm URL manzilini kiriting"
                              {...field}
                              data-testid="input-featured-image"
                            />
                          </FormControl>
                          <FormDescription>
                            Maqola uchun muqova rasm URL
                          </FormDescription>
                          <FormMessage />
                          {field.value && (
                            <div className="mt-3 rounded-md overflow-hidden border border-border">
                              <img
                                src={field.value}
                                alt="Preview"
                                className="w-full h-40 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
