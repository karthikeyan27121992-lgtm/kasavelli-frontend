export interface Category {
  id: number;
  name: string;
  display_name: string;
  description: string;
  image?: string;
  is_active: boolean;
  products_count: number;
}

export interface Product {
  id: number;
  name: string;
  title: string;
  description: string;
  category: number;
  category_name: string;
  price: number;
  discounted_price?: number;
  discount_percentage: number;
  final_price: number;
  image: string;
  image_2?: string;
  image_3?: string;
  in_stock: boolean;
  stock_quantity: number;
  weight?: number;
  purity: string;
  is_featured: boolean;
  slug: string;
  views_count: number;
  reviews?: ProductReview[];
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: number;
  product: number;
  user: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_price: number;
  product_image: string;
  discounted_price?: number;
  quantity: number;
  added_at: string;
}

export interface Order {
  id: number;
  order_id: string;
  user: number;
  user_name: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  phone_number: string;
  payment_id?: string;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  discount_offer: string;
  link_url?: string;
  product?: number;
  product_name?: string;
  is_visible: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
}

// Made with Bob
