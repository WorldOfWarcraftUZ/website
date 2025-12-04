import { 
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory,
  type Article,
  type InsertArticle,
  type ArticleWithCategory,
  defaultCategories,
  categories,
  articles,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Articles
  getArticles(): Promise<ArticleWithCategory[]>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticleById(id: string): Promise<ArticleWithCategory | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  
  // Initialization
  initializeDefaultCategories(): Promise<void>;
}

// Database Storage Implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  private initialized = false;

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeDefaultCategories();
      await this.initializeSampleArticles();
      this.initialized = true;
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Articles
  async getArticles(): Promise<ArticleWithCategory[]> {
    await this.ensureInitialized();
    
    const result = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .orderBy(desc(articles.createdAt));
    
    return result.map((row) => ({
      ...row.article,
      category: row.category,
    }));
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const [result] = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.slug, slug));
    
    if (!result) return undefined;
    
    return {
      ...result.article,
      category: result.category,
    };
  }

  async getArticleById(id: string): Promise<ArticleWithCategory | undefined> {
    const [result] = await db
      .select({
        article: articles,
        category: categories,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.article,
      category: result.category,
    };
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage || null,
      categoryId: article.categoryId || null,
      author: article.author || "Admin",
      published: article.published || false,
    }).returning();
    return newArticle;
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (article.title !== undefined) updateData.title = article.title;
    if (article.slug !== undefined) updateData.slug = article.slug;
    if (article.excerpt !== undefined) updateData.excerpt = article.excerpt;
    if (article.content !== undefined) updateData.content = article.content;
    if (article.featuredImage !== undefined) updateData.featuredImage = article.featuredImage || null;
    if (article.categoryId !== undefined) updateData.categoryId = article.categoryId || null;
    if (article.author !== undefined) updateData.author = article.author;
    if (article.published !== undefined) updateData.published = article.published;

    const [updated] = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning();
    
    return updated;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id)).returning();
    return result.length > 0;
  }

  async initializeDefaultCategories(): Promise<void> {
    try {
      const existingCategories = await db.select().from(categories);
      
      if (existingCategories.length === 0) {
        for (const category of defaultCategories) {
          try {
            await db.insert(categories).values(category);
          } catch (e) {
            // Skip if already exists
          }
        }
        console.log("Default categories initialized");
      }
    } catch (error) {
      console.error("Error initializing categories:", error);
    }
  }

  private async initializeSampleArticles(): Promise<void> {
    try {
      const existingArticles = await db.select().from(articles);
      
      if (existingArticles.length > 0) return;

      const allCategories = await db.select().from(categories);
      const guidesCategory = allCategories.find(c => c.slug === 'guides');
      const raidsCategory = allCategories.find(c => c.slug === 'raids');
      const pvpCategory = allCategories.find(c => c.slug === 'pvp');
      const newsCategory = allCategories.find(c => c.slug === 'news');
      const loreCategory = allCategories.find(c => c.slug === 'lore');
      const classCategory = allCategories.find(c => c.slug === 'class-guides');

      const sampleArticles: InsertArticle[] = [
        {
          title: "Yangi boshlayotganlar uchun WoW qo'llanmasi",
          slug: "yangi-boshlayotganlar-uchun-wow-qollanmasi",
          excerpt: "World of Warcraft dunyosiga ilk qadamingizni qo'yish uchun bilishingiz kerak bo'lgan barcha asosiy ma'lumotlar.",
          content: `<h2>World of Warcraft ga xush kelibsiz!</h2>
<p>World of Warcraft (WoW) - bu Blizzard Entertainment tomonidan yaratilgan dunyo bo'ylab eng mashhur MMORPG o'yinlardan biri. Bu qo'llanmada siz o'yinning asosiy tushunchalarini o'rganasiz.</p>

<h3>Klass tanlash</h3>
<p>O'yinda 12 ta turli klass mavjud. Har bir klass o'ziga xos qobiliyatlarga ega:</p>
<ul>
<li><strong>Warrior</strong> - Kuchli jangchi, tank yoki DPS roli</li>
<li><strong>Mage</strong> - Sehrgar, masofadan kuchli zarar yetkazadi</li>
<li><strong>Priest</strong> - Davolovchi, jamoani davolash uchun</li>
<li><strong>Rogue</strong> - Yashirin jangchi, yuqori DPS</li>
</ul>

<h3>Birinchi qadamlar</h3>
<p>O'yinni boshlaganingizda, avval o'z xarakteringizni yarating va starting zone'da topshiriqlarni bajaring. Bu sizga o'yin mexanikasini tushunishga yordam beradi.</p>

<blockquote>Pro tip: Questlarni diqqat bilan o'qing - ular sizga dunyo haqida ko'p narsa o'rgatadi!</blockquote>`,
          featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
          categoryId: guidesCategory?.id,
          author: "Admin",
          published: true,
        },
        {
          title: "Raid Boss: Ny'alotha strategiyasi",
          slug: "raid-boss-nyalotha-strategiyasi",
          excerpt: "N'Zoth raid bossi uchun to'liq strategiya va taktikalar. Heroic va Mythic difficulty uchun tavsiyalar.",
          content: `<h2>Ny'alotha, the Waking City</h2>
<p>Bu raid World of Warcraft: Battle for Azeroth kengaytmasining final raid instance hisoblanadi.</p>

<h3>Boss mexanikalari</h3>
<p>N'Zoth bilan jang qilishda quyidagi asosiy mexanikalarga e'tibor bering:</p>
<ul>
<li>Psychus realm phase</li>
<li>Corruption management</li>
<li>Add control va priority</li>
</ul>

<h3>Rol bo'yicha vazifalar</h3>
<p><strong>Tanklar:</strong> Boss positioning va add aggro muhim.</p>
<p><strong>Healerlar:</strong> Raid-wide damage vaqtida cooldown rotation.</p>
<p><strong>DPS:</strong> Priority target switching va personal CD usage.</p>`,
          featuredImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
          categoryId: raidsCategory?.id,
          author: "RaidMaster",
          published: true,
        },
        {
          title: "Arena PvP: 2v2 kompozitsiyalar",
          slug: "arena-pvp-2v2-kompozitsiyalar",
          excerpt: "Eng kuchli 2v2 arena kompozitsiyalari va ularni qanday o'ynash kerakligi haqida batafsil.",
          content: `<h2>2v2 Arena Guide</h2>
<p>Arena PvP - WoW ning eng competitive content turlaridan biri. Bu qo'llanmada eng yaxshi 2v2 kompozitsiyalarni ko'rib chiqamiz.</p>

<h3>Top Kompozitsiyalar</h3>
<ul>
<li><strong>Rogue + Mage</strong> - Control va burst damage</li>
<li><strong>Warrior + Healer</strong> - Sustained pressure</li>
<li><strong>Affliction Warlock + Healer</strong> - Rot comp</li>
</ul>

<h3>Arena Tips</h3>
<p>Communication juda muhim! Voice chat ishlatish katta ustunlik beradi.</p>

<blockquote>Rating olish uchun sabr va mashq talab qilinadi. Har bir yutqazishdan dars oling!</blockquote>`,
          featuredImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0c?w=800&h=450&fit=crop",
          categoryId: pvpCategory?.id,
          author: "PvPChamp",
          published: true,
        },
        {
          title: "The War Within: Yangi kengaytma haqida",
          slug: "the-war-within-yangi-kengaytma",
          excerpt: "World of Warcraft: The War Within kengaytmasi haqida bilishingiz kerak bo'lgan barcha yangiliklar.",
          content: `<h2>The War Within</h2>
<p>Blizzard Entertainment yangi kengaytmani e'lon qildi! The War Within bizni Azeroth ning yangi, hali ko'rilmagan joylariga olib boradi.</p>

<h3>Yangi features</h3>
<ul>
<li>Yangi zones va dungeonlar</li>
<li>Hero Talents tizimi</li>
<li>Delves - yangi solo/small group content</li>
<li>Yangi raid instance</li>
</ul>

<h3>Release sanasi</h3>
<p>The War Within 2024 yilning ikkinchi yarmida chiqishi kutilmoqda.</p>`,
          featuredImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
          categoryId: newsCategory?.id,
          author: "NewsReporter",
          published: true,
        },
        {
          title: "Arthas Menethil: Lich King tarixi",
          slug: "arthas-menethil-lich-king-tarixi",
          excerpt: "Warcraft universining eng iconic villainlaridan biri - Arthas Menethil ning to'liq tarixi.",
          content: `<h2>Arthas Menethil - The Lich King</h2>
<p>Arthas Menethil - Lordaeron qirolligi shahzodasi, keyinchalik Lich King ga aylangan tragic hero.</p>

<h3>Yoshlik davri</h3>
<p>Arthas Lordaeron qiroli Terenas II ning o'g'li sifatida tug'ilgan. U yosh yoshidan boshlab paladin bo'lishga tayyorlangan.</p>

<h3>Stratholme fojiasi</h3>
<p>Undead plague tarqalganda, Arthas Stratholme aholisini plague dan himoya qilish uchun o'ldirish qarorini qabul qildi - bu uning tushkunlikka qadam bosishining boshlanishi edi.</p>

<h3>Frostmourne</h3>
<p>Northrend da Arthas Frostmourne qilichini topdi. Bu qilich uning ruhini yeb, Lich King ga bo'ysunishiga olib keldi.</p>

<blockquote>"No king rules forever, my son." - Terenas Menethil II</blockquote>`,
          featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=450&fit=crop",
          categoryId: loreCategory?.id,
          author: "Lorekeeper",
          published: true,
        },
        {
          title: "Mage Class Guide: Fire Spec",
          slug: "mage-class-guide-fire-spec",
          excerpt: "Fire Mage spec uchun to'liq qo'llanma - talantlar, rotatsiya va gear tavsiyalari.",
          content: `<h2>Fire Mage Guide</h2>
<p>Fire Mage - WoW ning eng fun va rewarding DPS speclaridan biri. Bu qo'llanmada Fire Mage ni professional darajada o'ynashni o'rganasiz.</p>

<h3>Talent Build</h3>
<p>Current patch uchun optimal talent build:</p>
<ul>
<li>Firestarter - muhim opener talent</li>
<li>Pyromaniac - sustained damage uchun</li>
<li>Kindling - Combustion cooldown reduction</li>
</ul>

<h3>Rotatsiya</h3>
<p><strong>Opener:</strong> Fireball cast qiling va Hot Streak proc olguncha davom eting.</p>
<p><strong>Combustion window:</strong> Barcha Pyroblast procs ni ishlating.</p>
<p><strong>Filler:</strong> Fireball spam va Fire Blast usage.</p>

<h3>Stat Priority</h3>
<p>Intellect > Critical Strike > Haste > Versatility > Mastery</p>`,
          featuredImage: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop",
          categoryId: classCategory?.id,
          author: "ClassExpert",
          published: true,
        },
      ];

      for (const article of sampleArticles) {
        await db.insert(articles).values(article);
      }
      console.log("Sample articles initialized");
    } catch (error) {
      console.error("Error initializing sample articles:", error);
    }
  }
}

// Export storage instance
export const storage: IStorage = new DatabaseStorage();
