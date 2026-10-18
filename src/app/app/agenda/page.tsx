import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AgendaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("organization_memberships")
    .select("organization_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!memberships?.length) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm">
        Sem organização.{" "}
        <Link href="/app" className="underline">Voltar</Link>
      </div>
    );
  }

  const orgIds = memberships.map((m) => m.organization_id);
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, rooms(name)")
    .in("organization_id", orgIds)
    .in("operational_status", ["approved", "confirmed", "requested"])
    .gte("start_at", now.toISOString())
    .lte("start_at", weekAhead.toISOString())
    .order("start_at", { ascending: true });

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-4">
          <Link href="/app" className="text-sm text-stone-500 hover:text-stone-800">← Painel</Link>
          <h1 className="font-semibold text-stone-900">Agenda (7 dias)</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!bookings?.length ? (
          <p className="text-stone-500 text-sm">Nenhuma reserva nos próximos 7 dias.</p>
        ) : (
          <ul className="space-y-3">
            {bookings.map((b) => {
              const roomName = (b.rooms as { name?: string } | null)?.name ?? "Sala";
              return (
                <li
                  key={b.id}
                  className="rounded-xl border border-stone-200 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-stone-900">{roomName} · {b.contact_name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {new Date(b.start_at).toLocaleString("pt-BR", {
                        weekday: "short",
                        dateStyle: "short",
                        timeStyle: "short",
                      })}{" "}→{" "}
                      {new Date(b.end_at).toLocaleTimeString("pt-BR", { timeStyle: "short" })}
                    </p>
                  </div>
                  <span className="text-xs rounded-full bg-stone-100 px-2 py-1">{b.operational_status}</span>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
