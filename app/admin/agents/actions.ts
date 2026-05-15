'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  agentId: z.string().uuid(),
  status: z.enum(['approved', 'suspended']),
});

export async function updateAgentStatus(formData: FormData) {
  const parsed = schema.safeParse({
    agentId: formData.get('agentId'),
    status: formData.get('status'),
  });

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
    .from('agents')
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.agentId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/agents');
}

export async function deleteAgent(formData: FormData) {
  const parsed = z.object({ agentId: z.string().uuid() }).safeParse({
    agentId: formData.get('agentId'),
  });

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

  const { error } = await service.from('agents').delete().eq('id', parsed.data.agentId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/agents');
}
