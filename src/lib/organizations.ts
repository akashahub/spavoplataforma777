import { createClient } from "@/lib/supabase/server";
import type { Organization, Room } from "@/types/database";

/**
 * Busca organização pública por slug.
 * Usado no site público — não exige autenticação.
 */
export async function getOrganizationBySlug(
  slug: string
): Promise<Organization | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;
  return data as Organization;
}

/**
 * Lista salas publicadas e ativas de uma organização.
 */
export async function getPublishedRooms(
  organizationId: string
): Promise<Room[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_published", true)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Room[];
}

/**
 * Detalhe de sala publicada por slug da organização + slug da sala.
 */
export async function getPublishedRoom(
  organizationId: string,
  roomSlug: string
): Promise<Room | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("slug", roomSlug)
    .eq("is_published", true)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Room;
}
