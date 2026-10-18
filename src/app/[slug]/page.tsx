import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOrganizationBySlug,
  getPublishedRooms,
} from "@/lib/organizations";
import { PRICE_UNIT_LABELS } from "@/types/database";

type Props = { params: Promise<{ slug: string }> };

export default async function OrganizationPublicPage({ params }: Props) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const rooms = await getPublishedRooms(org.id);
  const primary = org.primary_color || "#1B5E3B";

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header
        className="border-b border-stone-200 bg-white"
        style={{ borderBottomColor: primary + "33" }}
      >
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold" style={{ color: primary }}>
              {org.name}
            </h1>
            {org.address && (
              <p className="text-xs text-stone-500 mt-0.5">{org.address}</p>
            )}
          </div>
          <nav className="flex gap-3 text-sm">
            <Link href={`/${slug}/salas`} className="text-stone-600 hover:opacity-80">
              Salas
            </Link>
            {org.whatsapp && (
              <a
                href={`https://wa.me/${org.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de mais informações.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-3 py-1 text-white text-xs font-medium"
                style={{ backgroundColor: primary }}
              >
                WhatsApp
              </a>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-12">
          {org.description && (
            <p className="text-stone-600 max-w-2xl text-lg leading-relaxed">{org.description}</p>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Salas disponíveis</h2>
            {rooms.length === 0 ? (
              <p className="text-stone-500 text-sm">Nenhuma sala publicada no momento.</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <li key={room.id}>
                    <Link
                      href={`/${slug}/salas/${room.slug}`}
                      className="block rounded-2xl border border-stone-200 bg-white p-5 hover:border-stone-300 hover:shadow-sm transition-all"
                    >
                      <h3 className="font-semibold text-stone-900">{room.name}</h3>
                      {room.description && (
                        <p className="mt-1 text-sm text-stone-600 line-clamp-2">{room.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
                        {room.capacity != null && <span>Até {room.capacity} pessoas</span>}
                        {room.base_price != null && (
                          <span>
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
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
        {org.email && <span>{org.email}</span>}
        {org.phone && <span className="ml-3">{org.phone}</span>}
      </footer>
    </div>
  );
}
