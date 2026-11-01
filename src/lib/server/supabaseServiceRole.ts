import { createClient } from '@supabase/supabase-js';

import { SUPABASE_KEY, SUPABASE_URL } from '$app/env/private';

import type { Database } from '../database.types';

export const supabaseServiceRole = createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!);
