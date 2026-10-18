import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SalasAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("organization_memberships")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .eq("role", "organization_admin");

  if (!memberships?.length) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm">
        Apenas administradores gerenciam salas.{" "}
        <Link href="/app" className="underline">Voltar</Link>
      </div>
    );
  }

  const orgIds = memberships.map((m) => m.organization_id);
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .in("organization_id", orgIds)
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-4">
          <Link href="/app" className="text-sm text-stone-500 hover:text-stone-800">← Painel</Link>
          <h1 className="font-semibold text-stone-900">Salas</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!rooms?.length ? (
          <p className="text-stone-500 text-sm">Nenhuma sala cadastrada.</p>
        ) : (
          <ul className="space-y-3">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="rounded-xl border border-stone-200 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium text-stone-900">{room.name}</p>
                  <p className="text-xs text-stone-500">/{room.slug}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  {room.is_published ? (
                    <span className="rounded-full bg-emerald-50 text-emerald-800 px-2 py-0.5">Publicada</span>
                  ) : (
                    <span className="rounded-full bg-stone-100 text-stone-600 px-2 py-0.5">Rascunho</span>
                  )}
                  {!room.is_active && (
                    <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5">Inativa</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs text-stone-400">
          Formulário de criar/editar salas será adicionado na próxima etapa.
        </p>
      </main>
    </div>
  );
}
