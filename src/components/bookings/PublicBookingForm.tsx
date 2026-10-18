"use client";

import { useState } from "react";
import type { Room } from "@/types/database";

type Props = {
  organizationId: string;
  organizationSlug: string;
  room: Room;
  primaryColor?: string;
};

export function PublicBookingForm({
  organizationId,
  organizationSlug,
  room,
  primaryColor = "#1B5E3B",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      organization_id: organizationId,
      room_id: room.id,
      contact_name: String(form.get("contact_name") || ""),
      contact_email: String(form.get("contact_email") || "") || undefined,
      contact_phone: String(form.get("contact_phone") || "") || undefined,
      start_at: String(form.get("start_at") || ""),
      duration_minutes: Number(form.get("duration_minutes") || 60),
      operational_notes: String(form.get("operational_notes") || "") || undefined,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erro ao enviar solicitação.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Falha de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-medium text-emerald-900">Solicitação enviada</p>
        <p className="mt-2 text-sm text-emerald-800">
          Nossa equipe receberá seu pedido e entrará em contato em breve.
        </p>
        <a
          href={`/${organizationSlug}/salas`}
          className="mt-4 inline-block text-sm underline text-emerald-700"
        >
          Voltar às salas
        </a>
      </div>
    );
  }

  const minDuration = room.min_duration_minutes || 60;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact_name" className="block text-sm font-medium text-stone-700">
          Nome *
        </label>
        <input
          id="contact_name"
          name="contact_name"
          required
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-stone-700">
            E-mail
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-stone-700">
            Telefone / WhatsApp
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            type="tel"
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
      </div>
      <p className="text-xs text-stone-500">Informe e-mail ou telefone.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_at" className="block text-sm font-medium text-stone-700">
            Data e hora de início *
          </label>
          <input
            id="start_at"
            name="start_at"
            type="datetime-local"
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
        <div>
          <label htmlFor="duration_minutes" className="block text-sm font-medium text-stone-700">
            Duração (minutos) *
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min={minDuration}
            step={30}
            defaultValue={minDuration}
            required
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
        </div>
      </div>
      <div>
        <label htmlFor="operational_notes" className="block text-sm font-medium text-stone-700">
          Observações
        </label>
        <textarea
          id="operational_notes"
          name="operational_notes"
          rows={3}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          placeholder="Finalidade, equipamentos necessários, etc."
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full py-3 text-sm font-medium text-white disabled:opacity-60"
        style={{ backgroundColor: primaryColor }}
      >
        {loading ? "Enviando…" : "Solicitar reserva"}
      </button>
    </form>
  );
}
