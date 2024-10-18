import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbiznmijmfitigrtwgqa.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiaXpubWlqbWZpdGlncnR3Z3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2NTgwMjQsImV4cCI6MjA0NDIzNDAyNH0.tfX2jR5fEsE0YZ88qUhZRfPD3sxbHUllG79F3HLe0MM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
