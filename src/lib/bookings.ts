import { createClient } from "@/lib/supabase/server";
import type {
  Booking,
  OperationalStatus,
  PaymentStatus,
  PublicBookingRequest,
} from "@/types/database";

/**
 * Cria solicitação pública de reserva.
 * Validação crítica no servidor: duração, sala ativa, end_at > start_at.
 * Não confia em preço ou status vindos do cliente.
 */
export async function createPublicBookingRequest(
  organizationId: string,
  payload: PublicBookingRequest
): Promise<{ booking: Booking | null; error: string | null }> {
  const supabase = await createClient();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, organization_id, is_active, is_published, min_duration_minutes, base_price")
    .eq("id", payload.room_id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (roomError || !room) {
    return { booking: null, error: "Sala não encontrada." };
  }
  if (!room.is_active || !room.is_published) {
    return { booking: null, error: "Esta sala não está disponível para reserva." };
  }

  const duration = Number(payload.duration_minutes);
  if (!Number.isFinite(duration) || duration <= 0) {
    return { booking: null, error: "Duração inválida." };
  }
  if (duration < (room.min_duration_minutes ?? 60)) {
    return {
      booking: null,
      error: `Duração mínima é de ${room.min_duration_minutes} minutos.`,
    };
  }

  const startAt = new Date(payload.start_at);
  if (Number.isNaN(startAt.getTime())) {
    return { booking: null, error: "Data/hora de início inválida." };
  }
  const endAt = new Date(startAt.getTime() + duration * 60 * 1000);

  if (!payload.contact_name?.trim()) {
    return { booking: null, error: "Informe seu nome." };
  }
  if (!payload.contact_email?.trim() && !payload.contact_phone?.trim()) {
    return { booking: null, error: "Informe e-mail ou telefone para contato." };
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      organization_id: organizationId,
      room_id: payload.room_id,
      contact_name: payload.contact_name.trim(),
      contact_email: payload.contact_email?.trim() || null,
      contact_phone: payload.contact_phone?.trim() || null,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      operational_status: "requested" as OperationalStatus,
      payment_status: "unpaid" as PaymentStatus,
      origin: "public_form",
      operational_notes: payload.operational_notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return { booking: null, error: "Não foi possível registrar a solicitação. Tente novamente." };
  }

  return { booking: data as Booking, error: null };
}

export async function listOrganizationBookings(
  organizationId: string,
  filters?: {
    status?: OperationalStatus;
    roomId?: string;
    from?: string;
    to?: string;
  }
): Promise<Booking[]> {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .eq("organization_id", organizationId)
    .order("start_at", { ascending: true });

  if (filters?.status) query = query.eq("operational_status", filters.status);
  if (filters?.roomId) query = query.eq("room_id", filters.roomId);
  if (filters?.from) query = query.gte("start_at", filters.from);
  if (filters?.to) query = query.lte("end_at", filters.to);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as Booking[];
}

export async function updateBookingOperationalStatus(
  organizationId: string,
  bookingId: string,
  newStatus: OperationalStatus,
  actorId: string,
  notes?: string
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (fetchError || !existing) {
    return { ok: false, error: "Reserva não encontrada." };
  }

  const updates: Partial<Booking> & { updated_by: string } = {
    operational_status: newStatus,
    updated_by: actorId,
  };
  if (notes !== undefined) updates.operational_notes = notes;

  if (
    (newStatus === "approved" || newStatus === "confirmed") &&
    existing.agreed_price == null
  ) {
    const { data: room } = await supabase
      .from("rooms")
      .select("base_price")
      .eq("id", existing.room_id)
      .maybeSingle();
    if (room?.base_price != null) updates.agreed_price = room.base_price;
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", bookingId)
    .eq("organization_id", organizationId);

  if (updateError) {
    if (updateError.code === "23P01" || updateError.message?.includes("overlap")) {
      return {
        ok: false,
        error:
          "Já existe uma reserva bloqueante neste horário para esta sala. Escolha outro horário.",
      };
    }
    return { ok: false, error: "Não foi possível atualizar a reserva." };
  }

  await supabase.from("booking_events").insert({
    organization_id: organizationId,
    booking_id: bookingId,
    action: `status:${existing.operational_status}->${newStatus}`,
    actor_id: actorId,
    metadata: { previous: existing.operational_status, next: newStatus },
  });

  return { ok: true, error: null };
}
