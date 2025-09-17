-- Create the symposium registrations table
CREATE TABLE IF NOT EXISTS symposium_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  contact TEXT NOT NULL,
  comments TEXT,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE symposium_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow public inserts" ON symposium_registrations
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reads (you might want to restrict this in production)
CREATE POLICY "Allow public reads" ON symposium_registrations
  FOR SELECT
  USING (true);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_symposium_registrations_created_at ON symposium_registrations(created_at DESC);

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE symposium_registrations;