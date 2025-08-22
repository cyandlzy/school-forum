const supabaseUrl = 'https://ntqzspumxbjarombbftg.supabase.co'; // 替换为你的 Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cXpzcHVteGJqYXJvbWJiZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NjY3MjMsImV4cCI6MjA3MTQ0MjcyM30.eyHi1511JGHFrzyeJQ6DjdM_LYIDE_vCmtOjgtMdoq4'; // 替换为你的 anon public Key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
