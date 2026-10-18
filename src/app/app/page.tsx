import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberships } = await supabase
    .from("organization_memberships")
    .select("role, status, organizations(id, name, slug)")
    .eq("user_id", user.id)
    .eq("status", "active");

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <span className="font-semibold text-emerald-900">Painel SPAVO Digital</span>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-stone-500 hover:text-stone-800">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-xl font-semibold text-stone-900">
          Olá{user.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Selecione a organização para operar.
        </p>

        {!memberships || memberships.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500 text-sm">
            Você ainda não está vinculado a nenhuma organização.
          </div>
        ) : (
          <ul className="mt-8 grid sm:grid-cols-2 gap-4">
            {memberships.map((m: {
              role: string;
              organizations: { id: string; name: string; slug: string } | null;
            }) => {
              const org = m.organizations;
              if (!org) return null;
              return (
                <li key={org.id}>
                  <div className="rounded-2xl border border-stone-200 bg-white p-5">
                    <h2 className="font-semibold text-stone-900">{org.name}</h2>
                    <p className="text-xs text-stone-500 mt-1">Papel: {m.role}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      <Link
                        href="/app/reservas"
                        className="rounded-full bg-emerald-800 text-white px-3 py-1.5 hover:bg-emerald-700"
                      >
                        Reservas
                      </Link>
                      <Link
                        href="/app/agenda"
                        className="rounded-full border border-stone-300 px-3 py-1.5 hover:bg-stone-50"
                      >
                        Agenda
                      </Link>
                      {m.role === "organization_admin" && (
                        <Link
                          href="/app/salas"
                          className="rounded-full border border-stone-300 px-3 py-1.5 hover:bg-stone-50"
                        >
                          Salas
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
