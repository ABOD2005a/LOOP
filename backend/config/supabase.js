const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
  process.env.SUPABASE_URL || "https://xkhhilqskmxxemmcrnmg.supabase.co";
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhpbHFza214eGVtbWNybm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjUyNjAsImV4cCI6MjA4MDYwMTI2MH0.xMEI9YPWvtjfIVYM9ImMW6HeZEBsOZ70ef5nQHsOhfg";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhpbHFza214eGVtbWNybm1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTAyNTI2MCwiZXhwIjoyMDgwNjAxMjYwfQ.tq8yo41bLnHy2662n03kumzIbb2TofGFwgXHBeU1jZU";

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase, supabaseAdmin };
