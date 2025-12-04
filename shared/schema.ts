import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories for WoW articles
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").default("default"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Articles/Guides
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  categoryId: varchar("category_id").references(() => categories.id),
  author: text("author").default("Admin"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Extended article type with category info
export type ArticleWithCategory = Article & {
  category?: Category | null;
};

// Users table (for admin authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Default categories for WoW blog
export const defaultCategories: InsertCategory[] = [
  { name: "Guides", slug: "guides", description: "Comprehensive guides for all aspects of WoW", color: "guides" },
  { name: "News", slug: "news", description: "Latest World of Warcraft news and updates", color: "news" },
  { name: "Raids", slug: "raids", description: "Raid strategies, boss guides, and tactics", color: "raids" },
  { name: "PvP", slug: "pvp", description: "PvP strategies, arena guides, and battleground tips", color: "pvp" },
  { name: "Class Guides", slug: "class-guides", description: "Class-specific guides and builds", color: "class" },
  { name: "Lore", slug: "lore", description: "Explore the rich lore of Azeroth", color: "lore" },
];
