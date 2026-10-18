import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  OPERATIONAL_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type OperationalStatus,
  type PaymentStatus,
} from "@/types/database";

export default async function ReservasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("organization_memberships")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!memberships?.length) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm">
        Sem organização vinculada.{" "}
        <Link href="/app" className="underline">Voltar</Link>
      </div>
    );
  }

  const orgIds = memberships.map((m) => m.organization_id);
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, rooms(name)")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center gap-4">
          <Link href="/app" className="text-sm text-stone-500 hover:text-stone-800">← Painel</Link>
          <h1 className="font-semibold text-stone-900">Reservas</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!bookings?.length ? (
          <p className="text-stone-500 text-sm">Nenhuma reserva ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Solicitante</th>
                  <th className="px-4 py-3 font-medium">Sala</th>
                  <th className="px-4 py-3 font-medium">Início</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const roomName = (b.rooms as { name?: string } | null)?.name ?? "—";
                  return (
                    <tr key={b.id} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-stone-900">{b.contact_name}</div>
                        <div className="text-xs text-stone-500">{b.contact_email || b.contact_phone || "—"}</div>
                      </td>
                      <td className="px-4 py-3 text-stone-700">{roomName}</td>
                      <td className="px-4 py-3 text-stone-700 whitespace-nowrap">
                        {new Date(b.start_at).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs">
                          {OPERATIONAL_STATUS_LABELS[b.operational_status as OperationalStatus] ?? b.operational_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-stone-600">
                          {PAYMENT_STATUS_LABELS[b.payment_status as PaymentStatus] ?? b.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-stone-400">
          Ações de aprovar/recusar/cancelar serão expandidas na próxima etapa.
        </p>
      </main>
    </div>
  );
}
