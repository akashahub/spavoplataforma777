/**
 * Tipos do domínio SPAVO Digital
 * Espelham o schema da migration foundation_multitenant
 */

export type OrgStatus = "active" | "inactive" | "suspended";
export type MembershipRole =
  | "organization_admin"
  | "receptionist"
  | "partner"
  | "customer";
export type MembershipStatus = "active" | "inactive" | "invited";
export type PriceUnit = "hour" | "half_day" | "day" | "session" | "custom";
export type OperationalStatus =
  | "requested"
  | "approved"
  | "confirmed"
  | "completed"
  | "rejected"
  | "cancelled";
export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "waived"
  | "refunded"
  | "failed";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: OrgStatus;
  timezone: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  cover_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  whatsapp: string | null;
  booking_message: string | null;
  cancellation_policy: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: MembershipRole;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string | null;
  capacity: number | null;
  resources: string[];
  images: string[];
  base_price: number | null;
  price_unit: PriceUnit;
  min_duration_minutes: number;
  rules: string | null;
  is_published: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  organization_id: string;
  room_id: string;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  start_at: string;
  end_at: string;
  operational_status: OperationalStatus;
  payment_status: PaymentStatus;
  agreed_price: number | null;
  payment_method: string | null;
  payment_notes: string | null;
  origin: string | null;
  operational_notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingEvent {
  id: string;
  organization_id: string;
  booking_id: string;
  action: string;
  actor_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

/** Payload do formulário público de solicitação */
export interface PublicBookingRequest {
  room_id: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  start_at: string;
  duration_minutes: number;
  operational_notes?: string;
}

/** Labels em pt-BR */
export const OPERATIONAL_STATUS_LABELS: Record<OperationalStatus, string> = {
  requested: "Solicitada",
  approved: "Aprovada",
  confirmed: "Confirmada",
  completed: "Concluída",
  rejected: "Recusada",
  cancelled: "Cancelada",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Não pago",
  pending: "Pendente",
  paid: "Pago",
  waived: "Dispensado",
  refunded: "Reembolsado",
  failed: "Falhou",
};

export const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  hour: "por hora",
  half_day: "meio período",
  day: "diária",
  session: "por sessão",
  custom: "personalizado",
};

export const ROLE_LABELS: Record<MembershipRole, string> = {
  organization_admin: "Administrador",
  receptionist: "Recepção",
  partner: "Parceiro",
  customer: "Cliente",
};
