export interface Client {
  id: number;
  created_at?: string;
  name: string;
  slug: string;
  email: string;
  company: string;
  notes: string;
  is_subscribed?: boolean;
}
