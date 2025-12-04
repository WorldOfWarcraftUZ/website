import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { RichTextEditor } from "@/components/rich-text-editor"; // <-- Import to'g'irlandi

const articleSchema = z.object({
  title: z.string().min(1, "Sarlavha kiritilishi shart"),
  slug: z.string().min(1, "Slug kiritilishi shart"),
  content: z.string().min(1, "Maqola matni bo'sh bo'lmasligi kerak"),
  excerpt: z.string().optional(),
  categoryId: z.string().min(1, "Kategoriya tanlanishi shart"),
  imageUrl: z.string().optional(),
  published: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function ArticleEditor() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/articles/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isEditing = match && params?.id !== "new";
  const articleId = params?.id;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      categoryId: "",
      imageUrl: "",
      published: false,
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt || "",
        categoryId: article.category_id?.toString() || "",
        imageUrl: article.featured_image || "", // <--- featured_image ishlatildi
        published: article.published,
      });
    }
  }, [article, form]);

  // Saqlash funksiyasi (Supabasega yozish)
  const mutation = useMutation({
    mutationFn: async (values: ArticleFormValues) => {
      
      const articleData = {
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt,
        
        // ❌ ESKI (XATO): category_id: parseInt(values.categoryId),
        // ✅ YANGI (TO'G'RI): UUID stringligicha qoladi
        category_id: values.categoryId, 
        
        featured_image: values.imageUrl ? values.imageUrl : null,
        published: values.published,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);
        if (error) throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Muvaffaqiyatli",
        description: `Maqola ${isEditing ? "yangilandi" : "yaratildi"}`,
      });
      setLocation("/admin");
    },
    onError: (error: any) => {
      console.error("Supabase Error:", error);
      toast({
        variant: "destructive",
        title: "Xatolik yuz berdi",
        description: error.message || "Ma'lumotlarni saqlashda xatolik",
      });
    },
  });

  const onSubmit = (values: ArticleFormValues) => {
    mutation.mutate(values);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!isEditing) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug);
    }
  };

  if (isEditing && isLoading) return <div className="p-8">Yuklanmoqda...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-serif">
          {isEditing ? "Maqolani Tahrirlash" : "Yangi Maqola"}
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sarlavha</FormLabel>
                  <FormControl><Input {...field} onChange={handleTitleChange} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoriya</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Holati</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span>{field.value ? "Chop etilgan" : "Qoralama"}</span>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rasm URL (Featured Image)</FormLabel>
                <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qisqacha mazmun</FormLabel>
                <FormControl><Textarea {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asosiy Matn</FormLabel>
                <FormControl><RichTextEditor content={field.value} onChange={field.onChange} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setLocation("/admin")}>Bekor qilish</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saqlanmoqda..." : "Saqlash"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}