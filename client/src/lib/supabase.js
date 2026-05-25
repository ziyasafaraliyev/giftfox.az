import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export function fromProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    occasion: row.occasion,
    productType: row.product_type ?? "ready_box",
    price: Number(row.price),
    rating: Number(row.rating ?? 4.8),
    image: row.image_url,
    description: row.description,
    inStock: row.in_stock,
  };
}

export function toProductRow(product) {
  return {
    name: product.name,
    category: product.category,
    occasion: product.occasion,
    product_type: product.productType ?? "ready_box",
    price: Number(product.price),
    rating: Number(product.rating || 4.8),
    image_url: product.image,
    description: product.description,
    in_stock: Boolean(product.inStock),
  };
}
