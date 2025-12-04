import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

// Simple admin authentication middleware
// In production, this should use proper authentication (Supabase Auth, sessions, etc.)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "wow-admin-key-2024";

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-admin-key"] || req.query.adminKey;
  
  // For development/demo purposes, allow access if no API key is set
  // In production, this check should be stricter
  if (process.env.NODE_ENV === "development" || apiKey === ADMIN_API_KEY) {
    return next();
  }
  
  return res.status(401).json({ error: "Unauthorized - Admin access required" });
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ CATEGORIES ============
  
  // Get all categories (public)
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get category by slug (public)
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Create category (admin only)
  app.post("/api/categories", adminAuth, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  // ============ ARTICLES ============
  
  // Get all articles (public)
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Get article by slug or id (public)
  app.get("/api/articles/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      
      // Try by slug first, then by id
      let article = await storage.getArticleBySlug(identifier);
      if (!article) {
        article = await storage.getArticleById(identifier);
      }
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Create article (admin only)
  app.post("/api/articles", adminAuth, async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      
      // Check if slug already exists
      const existing = await storage.getArticleBySlug(validatedData.slug);
      if (existing) {
        return res.status(400).json({ error: "Bu slug allaqachon mavjud" });
      }
      
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // Update article (admin only)
  app.patch("/api/articles/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate partial update
      const validatedData = insertArticleSchema.partial().parse(req.body);
      
      // Check if article exists
      const existing = await storage.getArticleById(id);
      if (!existing) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      // If slug is being changed, check it doesn't conflict
      if (validatedData.slug && validatedData.slug !== existing.slug) {
        const slugExists = await storage.getArticleBySlug(validatedData.slug);
        if (slugExists) {
          return res.status(400).json({ error: "Bu slug allaqachon mavjud" });
        }
      }
      
      const article = await storage.updateArticle(id, validatedData);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  // Delete article (admin only)
  app.delete("/api/articles/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteArticle(id);
      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // ============ ADMIN STATUS ============
  
  // Check admin authentication status
  app.get("/api/admin/status", adminAuth, (req, res) => {
    res.json({ authenticated: true, message: "Admin access granted" });
  });

  return httpServer;
}
