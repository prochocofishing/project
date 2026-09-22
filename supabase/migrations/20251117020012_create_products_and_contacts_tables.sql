/*
  # PROCHOCO Website Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name_pt` (text) - Product name in Portuguese
      - `name_en` (text) - Product name in English
      - `description_pt` (text) - Description in Portuguese
      - `description_en` (text) - Description in English
      - `image_url` (text) - Product image URL
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `contact_inquiries`
      - `id` (uuid, primary key)
      - `store_name` (text) - Name of the store
      - `contact_person` (text) - Contact person name
      - `email` (text) - Email address
      - `phone` (text) - Phone number
      - `message` (text) - Inquiry message
      - `status` (text) - Inquiry status (new, contacted, closed)
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Public read access for products
    - Public insert for contact inquiries
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_pt text NOT NULL,
  name_en text NOT NULL,
  description_pt text DEFAULT '',
  description_en text DEFAULT '',
  image_url text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit contact inquiries"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS products_order_idx ON products(order_index);
CREATE INDEX IF NOT EXISTS contact_inquiries_created_idx ON contact_inquiries(created_at DESC);