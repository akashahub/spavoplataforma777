# SPAVO Digital — Plataforma SaaS Multiempresa

MVP de plataforma para espaços terapêuticos, clínicas, estúdios e centros de yoga.  
Primeiro tenant de referência: **SPAVO · Espaço de Cura e Consciência** (Salvador, BA).

## O que este MVP inclui

- Fundação multiempresa (`organizations`, `organization_memberships`, RLS)
- Site público por slug (`/[slug]`, salas, formulário de solicitação)
- Painel da equipe (`/app`) com login Supabase Auth
- Papéis: `organization_admin` e `receptionist`
- Reservas com status operacional e financeiro separados
- Prevenção de sobreposição de horários no banco (EXCLUDE + gist)
- Auditoria básica (`booking_events`)
- Seed de demonstração claramente marcado (`spavo-demo`)

## O que ainda não está no MVP

- Checkout online / Pix / Stripe
- Academy, loja, eventos com ingressos
- App nativo
- Cobrança de assinatura SaaS
- Domínios personalizados / subdomínios automáticos

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (PostgreSQL, Auth, RLS)
- Hospedagem sugerida: Vercel + projeto Supabase

## Configuração local

### 1. Pré-requisitos

- Node.js 20+
- Conta Supabase (projeto novo ou existente)

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha (somente nomes — nunca commite valores):

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima (pública) |

**Não** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend.

### 3. Banco de dados

No SQL Editor do Supabase (ou CLI):

```bash
# Aplique a migration
# Arquivo: supabase/migrations/20260318000001_foundation_multitenant.sql
```

Isso cria tabelas, RLS, funções de autorização e seed `spavo-demo` com 2 salas publicadas e 1 rascunho.

### 4. Dependências e execução

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

- Site demo: `/spavo-demo`
- Login equipe: `/login` → `/app`

### 5. Usuários de teste

1. Crie usuários no Supabase Auth (Authentication → Users).
2. Insira memberships ligando `user_id` à organização `a0000000-0000-4000-8000-000000000001` com role `organization_admin` ou `receptionist`.

## Estrutura principal

```
src/
  app/
    [slug]/          # Site público da organização
      salas/
    app/              # Painel autenticado
    login/
    api/bookings/     # Solicitação pública
  components/
  lib/                # organizations, bookings, supabase clients
  types/database.ts
supabase/migrations/
```

## Segurança (obrigatório)

- RLS ativo em todas as tabelas expostas
- Políticas por organização e papel
- Validações server-side de duração, sala e status
- Constraint de não-sobreposição para reservas `approved` / `confirmed`
- Nunca confiar em `organization_id`, `role` ou preço vindos do browser

## Deploy

1. Conecte o repositório ao provedor (ex.: Vercel).
2. Configure as mesmas variáveis de ambiente de produção.
3. Aplique a migration no projeto Supabase de produção.
4. Não publique com dados de seed misturados a dados reais.

## Próximas etapas recomendadas

1. Completar telas de agenda, lista de reservas e CRUD de salas no painel.
2. Testes de isolamento com duas organizações.
3. Registro manual de pagamento e botão WhatsApp.
4. Documentar rollback e rodar build de produção.

## Licença / uso

Projeto sob construção para SPAVO Digital / Akasha Hub.  
Dados de demonstração **não** representam a operação real da SPAVO.
