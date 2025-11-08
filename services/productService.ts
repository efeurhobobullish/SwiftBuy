import { Product, Category } from '../types';

// Mock product data for demo
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    description: 'Latest iPhone with A16 Bionic chip, Dynamic Island, and 48MP camera',
    price: 850000,
    image: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPhone+14+Pro',
    category: 'electronics',
    inStock: true,
    rating: 4.8,
    reviews: 1250,
    features: ['6.1" Super Retina XDR Display', '48MP Main Camera', 'A16 Bionic Chip', 'All-day Battery Life']
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    description: 'Premium Android flagship with exceptional camera and performance',
    price: 750000,
    image: 'https://via.placeholder.com/300x300/1f77b4/FFFFFF?text=Galaxy+S23',
    category: 'electronics',
    inStock: true,
    rating: 4.6,
    reviews: 980,
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air unit for excellent cushioning',
    price: 45000,
    image: 'https://via.placeholder.com/300x300/ff7f0e/FFFFFF?text=Nike+Air+Max',
    category: 'fashion',
    inStock: true,
    rating: 4.5,
    reviews: 340,
  },
  {
    id: '4',
    name: 'Adidas Originals T-Shirt',
    description: 'Classic cotton t-shirt with iconic Adidas branding',
    price: 8500,
    image: 'https://via.placeholder.com/300x300/2ca02c/FFFFFF?text=Adidas+T-Shirt',
    category: 'fashion',
    inStock: true,
    rating: 4.3,
    reviews: 210,
  },
  {
    id: '5',
    name: 'Modern Sofa Set',
    description: '3-piece living room sofa set with premium fabric finish',
    price: 250000,
    image: 'https://via.placeholder.com/300x300/d62728/FFFFFF?text=Modern+Sofa',
    category: 'home',
    inStock: true,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '6',
    name: 'Smart LED TV 55"',
    description: '4K Ultra HD Smart TV with built-in streaming apps',
    price: 180000,
    image: 'https://via.placeholder.com/300x300/9467bd/FFFFFF?text=Smart+TV',
    category: 'electronics',
    inStock: true,
    rating: 4.6,
    reviews: 440,
  },
  {
    id: '7',
    name: 'Luxury Skincare Set',
    description: 'Complete facial care kit with natural ingredients',
    price: 25000,
    image: 'https://via.placeholder.com/300x300/8c564b/FFFFFF?text=Skincare+Set',
    category: 'beauty',
    inStock: true,
    rating: 4.8,
    reviews: 620,
  },
  {
    id: '8',
    name: 'Premium Headphones',
    description: 'Wireless noise-canceling headphones with premium sound',
    price: 65000,
    image: 'https://via.placeholder.com/300x300/e377c2/FFFFFF?text=Headphones',
    category: 'electronics',
    inStock: true,
    rating: 4.7,
    reviews: 890,
  },
];

export const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: 'laptop' },
  { id: 'fashion', name: 'Fashion', icon: 'shirt' },
  { id: 'home', name: 'Home & Living', icon: 'home' },
  { id: 'beauty', name: 'Beauty', icon: 'sparkles' },
];

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  }

  static async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(product => product.id === id) || null;
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProducts.filter(product => product.category === category);
  }

  static async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  static async getCategories(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return categories;
  }
}