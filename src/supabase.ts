import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPA_KEY ?? "";

export default createClient(supabaseUrl, supabaseKey);
