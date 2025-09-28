export interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  upiId: string;
  qrImageUrl: string;
  gstDetails?: string;
}

const STORAGE_KEY = 'lumera_bank_details_v1';

export const defaultBankDetails: BankDetails = {
  accountHolder: 'HARSHIT JAIN',
  bankName: 'INDIAN OVERSEAS BANK',
  accountNumber: '054201000030228',
  ifscCode: 'IOBA0000542',
  accountType: 'Saving Account',
  upiId: 'harshitjain083@oksbi',
  qrImageUrl: '/assets/images/bank_qr.png',
  gstDetails: '',
};

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getBankDetails(): BankDetails {
  if (!isBrowser()) return defaultBankDetails;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultBankDetails;
    const parsed = JSON.parse(raw);
    return { ...defaultBankDetails, ...parsed } as BankDetails;
  } catch {
    return defaultBankDetails;
  }
}

export function setBankDetails(next: BankDetails): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

