import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlanType = 'free' | 'pro';
export type PaymentMode = 'mock' | 'stripe-test' | 'stripe-live';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: 'success' | 'failed';
  plan: PlanType;
  error?: string;
  metadata?: Record<string, any>;
}

interface PaymentLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  level: 'info' | 'warn' | 'error';
}

interface PaymentState {
  currentPlan: PlanType;
  transactions: Transaction[];
  logs: PaymentLog[];
  isProcessing: boolean;
  paymentMode: PaymentMode;
  setPlan: (plan: PlanType) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  addLog: (event: string, details: string, level?: PaymentLog['level']) => void;
  setProcessing: (status: boolean) => void;
  setPaymentMode: (mode: PaymentMode) => void;
  resetAll: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      currentPlan: 'free',
      transactions: [],
      logs: [],
      isProcessing: false,
      paymentMode: (import.meta.env.VITE_PAYMENT_MODE as PaymentMode) || 'mock',
      setPlan: (plan) => set({ currentPlan: plan }),
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: `txn_${Math.random().toString(36).substring(7)}`,
          date: new Date().toISOString(),
        };
        set((state) => ({ 
          transactions: [newTransaction, ...state.transactions] 
        }));
      },
      addLog: (event, details, level = 'info') => {
        const newLog: PaymentLog = {
          id: `log_${Math.random().toString(36).substring(7)}`,
          timestamp: new Date().toISOString(),
          event,
          details,
          level,
        };
        set((state) => ({ logs: [newLog, ...state.logs] }));
      },
      setProcessing: (status) => set({ isProcessing: status }),
      setPaymentMode: (mode) => set({ paymentMode: mode }),
      resetAll: () => set({ currentPlan: 'free', transactions: [], logs: [] }),
    }),
    {
      name: 'payment-storage',
    }
  )
);
