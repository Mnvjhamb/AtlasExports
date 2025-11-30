import type { Express } from 'express';
import type { Server } from 'http';
import { isInitialized } from './lib/firebase-admin';
import {
  getCategories,
  getProducts,
  getApprovedReviews,
  submitContact,
  getContacts,
  getById,
  create,
  update,
  remove,
  COLLECTIONS,
  type Category,
  type Product,
  type Review,
  type ContactSubmission,
} from './lib/firestore';

// Middleware to check if Firebase is configured
function requireFirebase(req: any, res: any, next: any) {
  if (!isInitialized) {
    return res.status(503).json({
      message:
        'Database not configured. Please set up Firebase credentials in server/.env',
    });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ==================== PUBLIC ROUTES ====================

  // Categories
  app.get('/api/categories', requireFirebase, async (_req, res) => {
    try {
      const categories = await getCategories(true);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.get('/api/categories/:id', requireFirebase, async (req, res) => {
    try {
      const category = await getById<Category>(
        COLLECTIONS.CATEGORIES,
        req.params.id
      );
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  });

  // Products
  app.get('/api/products', requireFirebase, async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const products = await getProducts(true, categoryId);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', requireFirebase, async (req, res) => {
    try {
      const product = await getById<Product>(
        COLLECTIONS.PRODUCTS,
        req.params.id
      );
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  // Reviews
  app.get('/api/reviews', requireFirebase, async (_req, res) => {
    try {
      const reviews = await getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  });

  // Contact form submission
  app.post('/api/contact', requireFirebase, async (req, res) => {
    try {
      const { name, email, phone, company, country, message, productInterest } =
        req.body;

      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ message: 'Name, email, and message are required' });
      }

      const id = await submitContact({
        name,
        email,
        phone,
        company,
        country,
        message,
        productInterest,
      });

      res
        .status(201)
        .json({ id, message: 'Contact form submitted successfully' });
    } catch (error) {
      console.error('Error submitting contact:', error);
      res.status(500).json({ message: 'Failed to submit contact form' });
    }
  });

  // ==================== ADMIN ROUTES ====================
  // Note: These routes should be protected with Firebase Auth middleware in production

  // Admin - Categories
  app.get('/api/admin/categories', requireFirebase, async (_req, res) => {
    try {
      const categories = await getCategories(false);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.post('/api/admin/categories', requireFirebase, async (req, res) => {
    try {
      const id = await create<Category>(COLLECTIONS.CATEGORIES, req.body);
      res.status(201).json({ id });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Failed to create category' });
    }
  });

  app.put('/api/admin/categories/:id', requireFirebase, async (req, res) => {
    try {
      await update<Category>(COLLECTIONS.CATEGORIES, req.params.id, req.body);
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  app.delete('/api/admin/categories/:id', requireFirebase, async (req, res) => {
    try {
      await remove(COLLECTIONS.CATEGORIES, req.params.id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // Admin - Products
  app.get('/api/admin/products', requireFirebase, async (_req, res) => {
    try {
      const products = await getProducts(false);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.post('/api/admin/products', requireFirebase, async (req, res) => {
    try {
      const id = await create<Product>(COLLECTIONS.PRODUCTS, req.body);
      res.status(201).json({ id });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  });

  app.put('/api/admin/products/:id', requireFirebase, async (req, res) => {
    try {
      await update<Product>(COLLECTIONS.PRODUCTS, req.params.id, req.body);
      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product' });
    }
  });

  app.delete('/api/admin/products/:id', requireFirebase, async (req, res) => {
    try {
      await remove(COLLECTIONS.PRODUCTS, req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Failed to delete product' });
    }
  });

  // Admin - Reviews
  app.get('/api/admin/reviews', requireFirebase, async (_req, res) => {
    try {
      const reviews = await getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/admin/reviews', requireFirebase, async (req, res) => {
    try {
      const id = await create<Review>(COLLECTIONS.REVIEWS, req.body);
      res.status(201).json({ id });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Failed to create review' });
    }
  });

  app.put('/api/admin/reviews/:id', requireFirebase, async (req, res) => {
    try {
      await update<Review>(COLLECTIONS.REVIEWS, req.params.id, req.body);
      res.json({ message: 'Review updated successfully' });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ message: 'Failed to update review' });
    }
  });

  app.delete('/api/admin/reviews/:id', requireFirebase, async (req, res) => {
    try {
      await remove(COLLECTIONS.REVIEWS, req.params.id);
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Failed to delete review' });
    }
  });

  // Admin - Contacts
  app.get('/api/admin/contacts', requireFirebase, async (_req, res) => {
    try {
      const contacts = await getContacts(false);
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Failed to fetch contacts' });
    }
  });

  app.put('/api/admin/contacts/:id/read', requireFirebase, async (req, res) => {
    try {
      await update<ContactSubmission>(COLLECTIONS.CONTACTS, req.params.id, {
        isRead: true,
      });
      res.json({ message: 'Contact marked as read' });
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(500).json({ message: 'Failed to update contact' });
    }
  });

  app.delete('/api/admin/contacts/:id', requireFirebase, async (req, res) => {
    try {
      await remove(COLLECTIONS.CONTACTS, req.params.id);
      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ message: 'Failed to delete contact' });
    }
  });

  return httpServer;
}
