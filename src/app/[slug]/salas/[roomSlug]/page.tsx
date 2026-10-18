import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOrganizationBySlug,
  getPublishedRoom,
} from "@/lib/organizations";
import { PublicBookingForm } from "@/components/bookings/PublicBookingForm";
import { PRICE_UNIT_LABELS } from "@/types/database";

type Props = {
  params: Promise<{ slug: string; roomSlug: string }>;
};

export default async function RoomDetailPage({ params }: Props) {
  const { slug, roomSlug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const room = await getPublishedRoom(org.id, roomSlug);
  if (!room) notFound();

  const primary = org.primary_color || "#1B5E3B";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link href={`/${slug}/salas`} className="text-sm text-stone-500 hover:text-stone-800">
            ← Salas
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">{room.name}</h1>
          {room.description && (
            <p className="mt-3 text-stone-600 leading-relaxed">{room.description}</p>
          )}
          <dl className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
            {room.capacity != null && (
              <div>
                <dt className="text-stone-500">Capacidade</dt>
                <dd className="font-medium">{room.capacity} pessoas</dd>
              </div>
            )}
            {room.base_price != null && (
              <div>
                <dt className="text-stone-500">Referência de preço</dt>
                <dd className="font-medium">
                  R$ {Number(room.base_price).toFixed(2)}{" "}
                  {PRICE_UNIT_LABELS[room.price_unit]}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-stone-500">Duração mínima</dt>
              <dd className="font-medium">{room.min_duration_minutes} minutos</dd>
            </div>
          </dl>
          {Array.isArray(room.resources) && room.resources.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-stone-500 mb-2">Recursos</p>
              <ul className="flex flex-wrap gap-2">
                {room.resources.map((r) => (
                  <li key={r} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {room.rules && (
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-900">
              <p className="font-medium mb-1">Regras de uso</p>
              <p className="whitespace-pre-line">{room.rules}</p>
            </div>
          )}
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Solicitar reserva</h2>
          <p className="text-sm text-stone-500 mb-6">
            {org.booking_message ||
              "Preencha os dados. A equipe confirmará a disponibilidade."}
          </p>
          <PublicBookingForm
            organizationId={org.id}
            organizationSlug={slug}
            room={room}
            primaryColor={primary}
          />
        </section>
      </main>
    </div>
  );
}
