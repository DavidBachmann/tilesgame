import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SB_URL;
const supabaseKey = import.meta.env.VITE_SB_KEY;

export default createClient(supabaseUrl, supabaseKey);
