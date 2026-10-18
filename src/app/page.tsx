import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight text-emerald-900">
            SPAVO Digital
          </span>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/login"
              className="text-stone-600 hover:text-emerald-800 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/spavo-demo"
              className="rounded-full bg-emerald-800 text-white px-4 py-1.5 hover:bg-emerald-700 transition-colors"
            >
              Ver demo
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <p className="text-sm font-medium text-emerald-700 mb-3">
            Plataforma SaaS multiempresa
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 max-w-2xl leading-tight">
            Reservas, agenda e operação para espaços de bem-estar
          </h1>
          <p className="mt-6 text-lg text-stone-600 max-w-xl">
            Cada organização tem seu site público, salas, equipe e dados
            isolados. Comece pela SPAVO e expanda para clínicas, estúdios e
            centros de yoga.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/spavo-demo"
              className="inline-flex items-center rounded-full bg-emerald-800 text-white px-6 py-3 text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Explorar site demo
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Painel da equipe
            </Link>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 grid sm:grid-cols-3 gap-8">
            <div>
              <h2 className="font-semibold text-stone-900">Site público</h2>
              <p className="mt-2 text-sm text-stone-600">
                Catálogo de salas, identidade visual e formulário de solicitação
                de reserva.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">Recepção</h2>
              <p className="mt-2 text-sm text-stone-600">
                Fila de solicitações, calendário operacional e mudança de status
                com auditoria.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">Multiempresa</h2>
              <p className="mt-2 text-sm text-stone-600">
                Isolamento por organização desde a primeira migration, com RLS e
                papéis.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        SPAVO Digital — MVP em construção · Dados de demonstração claramente
        identificados
      </footer>
    </div>
  );
}
