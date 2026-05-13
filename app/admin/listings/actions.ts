'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  listingId: z.string().uuid(),
});

export async function adminDeleteListing(formData: FormData) {
  const parsed = schema.safeParse({ listingId: formData.get('listingId') });
  if (!parsed.success) throw new Error('Invalid input');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const service = createServiceClient();
  const { data: actor } = await service
    .from('agents')
    .select('role')
    .eq('id', user.id)
    .single();

  if (actor?.role !== 'super_admin') throw new Error('Forbidden');

  const { error } = await service
    .from('properties')
    .delete()
    .eq('id', parsed.data.listingId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/listings');
}
