export type Transaction = {
  id: string;
  type: 'revenue' | 'expense';
  date: Date;
  amount: number;
  description: string;
  category: string;
};

export type Appointment = {
  id: string;
  title: string;
  date: Date;
  description: string;
};
