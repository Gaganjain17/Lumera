export interface Inquiry {
  id: string;
  createdAt: number;
  name: string;
  email?: string;
  mobile: string;
  message: string;
  productId?: number;
  productName?: string;
  status: 'new' | 'resolved';
}

const STORAGE_KEY = 'lumera_inquiries_v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getAllInquiries(): Inquiry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Inquiry[];
  } catch {
    return [];
  }
}

function persist(inquiries: Inquiry[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  } catch {
    // ignore
  }
}

export function addInquiry(partial: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
  const all = getAllInquiries();
  const inquiry: Inquiry = {
    ...partial,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    status: 'new',
  };
  const next = [inquiry, ...all];
  persist(next);
  return inquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry['status']): void {
  const all = getAllInquiries();
  const next = all.map(i => i.id === id ? { ...i, status } : i);
  persist(next);
}

export function deleteInquiry(id: string): void {
  const all = getAllInquiries();
  persist(all.filter(i => i.id !== id));
}

