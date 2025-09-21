/*
  # Home Service Booking Database Schema

  1. New Tables
    - `service_categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `icon` (text, icon name for UI)
      - `description` (text, category description)
      - `created_at` (timestamp)
    
    - `services`
      - `id` (uuid, primary key)
      - `title` (text, service title)
      - `description` (text, service description)
      - `category_id` (uuid, foreign key to service_categories)
      - `price` (decimal, service price)
      - `image_url` (text, service image)
      - `rating` (decimal, average rating)
      - `availability` (boolean, service availability)
      - `created_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `service_id` (uuid, foreign key to services)
      - `booking_date` (date, booking date)
      - `booking_time` (text, booking time slot)
      - `status` (text, booking status)
      - `total_price` (decimal, total booking price)
      - `customer_name` (text, customer name)
      - `customer_phone` (text, customer phone)
      - `customer_address` (text, customer address)
      - `special_instructions` (text, optional instructions)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
*/

-- Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read service categories"
  ON service_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE,
  price decimal(10,2) NOT NULL,
  image_url text,
  rating decimal(3,2) DEFAULT 0,
  availability boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (true);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  total_price decimal(10,2) NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  special_instructions text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample service categories
INSERT INTO service_categories (name, icon, description) VALUES
  ('Plumbing', 'Wrench', 'Professional plumbing services for your home'),
  ('Electrical', 'Zap', 'Licensed electrical work and repairs'),
  ('Cleaning', 'Sparkles', 'Professional cleaning services'),
  ('HVAC', 'Wind', 'Heating, ventilation, and air conditioning'),
  ('Gardening', 'Leaf', 'Landscaping and garden maintenance'),
  ('Painting', 'Paintbrush2', 'Interior and exterior painting services');

-- Insert sample services
INSERT INTO services (title, description, category_id, price, image_url, rating) VALUES
  ('Emergency Plumbing Repair', 'Quick response plumbing repairs for emergencies', (SELECT id FROM service_categories WHERE name = 'Plumbing'), 899, 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800', 4.8),
  ('Kitchen Sink Installation', 'Professional kitchen sink installation service', (SELECT id FROM service_categories WHERE name = 'Plumbing'), 1499, 'https://images.pexels.com/photos/1599771/pexels-photo-1599771.jpeg?auto=compress&cs=tinysrgb&w=800', 4.9),
  ('Electrical Outlet Installation', 'Safe installation of electrical outlets', (SELECT id FROM service_categories WHERE name = 'Electrical'), 799, 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', 4.7),
  ('Home Wiring Inspection', 'Complete electrical system inspection', (SELECT id FROM service_categories WHERE name = 'Electrical'), 1999, 'https://images.pexels.com/photos/162539/architecture-building-construction-work-162539.jpeg?auto=compress&cs=tinysrgb&w=800', 4.6),
  ('Deep House Cleaning', 'Comprehensive deep cleaning service', (SELECT id FROM service_categories WHERE name = 'Cleaning'), 1299, 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=800', 4.9),
  ('Window Cleaning', 'Professional window cleaning service', (SELECT id FROM service_categories WHERE name = 'Cleaning'), 699, 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=800', 4.5),
  ('AC Installation & Repair', 'Air conditioning installation and maintenance', (SELECT id FROM service_categories WHERE name = 'HVAC'), 2999, 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=800', 4.8),
  ('Garden Design & Landscaping', 'Complete garden design and landscaping', (SELECT id FROM service_categories WHERE name = 'Gardening'), 3999, 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=800', 4.7),
  ('Interior Room Painting', 'Professional interior painting service', (SELECT id FROM service_categories WHERE name = 'Painting'), 2499, 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=800', 4.6);