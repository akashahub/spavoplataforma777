import { NextResponse } from "next/server";
import { createPublicBookingRequest } from "@/lib/bookings";

/**
 * POST /api/bookings
 * Formulário público de solicitação de reserva.
 * Não confia em status/preço enviados pelo cliente.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const organizationId = body.organization_id as string | undefined;

    if (!organizationId || !body.room_id) {
      return NextResponse.json(
        { error: "Dados incompletos." },
        { status: 400 }
      );
    }

    const { booking, error } = await createPublicBookingRequest(organizationId, {
      room_id: body.room_id,
      contact_name: body.contact_name ?? "",
      contact_email: body.contact_email,
      contact_phone: body.contact_phone,
      start_at: body.start_at,
      duration_minutes: Number(body.duration_minutes),
      operational_notes: body.operational_notes,
    });

    if (error || !booking) {
      return NextResponse.json({ error: error ?? "Erro" }, { status: 400 });
    }

    return NextResponse.json(
      { id: booking.id, status: booking.operational_status },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
