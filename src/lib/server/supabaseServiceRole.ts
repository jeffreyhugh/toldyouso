import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/private";
import type { Database } from "../database.types";

export const supabaseServiceRole = createClient<Database>(env.SUPABASE_URL!, env.SUPABASE_KEY!);
