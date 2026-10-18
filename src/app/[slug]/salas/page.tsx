import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOrganizationBySlug,
  getPublishedRooms,
} from "@/lib/organizations";
import { PRICE_UNIT_LABELS } from "@/types/database";

type Props = { params: Promise<{ slug: string }> };

export default async function RoomsCatalogPage({ params }: Props) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const rooms = await getPublishedRooms(org.id);
  const primary = org.primary_color || "#1B5E3B";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-4">
          <Link href={`/${slug}`} className="text-sm text-stone-500 hover:text-stone-800">
            ← {org.name}
          </Link>
          <h1 className="text-lg font-semibold" style={{ color: primary }}>
            Salas
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {rooms.length === 0 ? (
          <p className="text-stone-500">Nenhuma sala publicada.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <li key={room.id}>
                <Link
                  href={`/${slug}/salas/${room.slug}`}
                  className="block h-full rounded-2xl border border-stone-200 bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <h2 className="font-semibold text-stone-900">{room.name}</h2>
                  {room.description && (
                    <p className="mt-2 text-sm text-stone-600 line-clamp-3">{room.description}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-500">
                    {room.capacity != null && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5">
                        Capacidade {room.capacity}
                      </span>
                    )}
                    {room.base_price != null && (
                      <span className="rounded-full bg-emerald-50 text-emerald-800 px-2 py-0.5">
                        R$ {Number(room.base_price).toFixed(2)}{" "}
                        {PRICE_UNIT_LABELS[room.price_unit]}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
