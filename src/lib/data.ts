import type { Transaction, Appointment } from './types';

export const initialTransactions: Transaction[] = [
  { id: '1', type: 'revenue', date: new Date('2024-05-01'), amount: 2500, description: 'Web Design Project', category: 'Client Work' },
  { id: '2', type: 'expense', date: new Date('2024-05-03'), amount: 450, description: 'Software Subscription', category: 'Software' },
  { id: '3', type: 'revenue', date: new Date('2024-05-05'), amount: 1800, description: 'Consulting Services', category: 'Consulting' },
  { id: '4', type: 'expense', date: new Date('2024-05-10'), amount: 120, description: 'Office Supplies', category: 'Office' },
  { id: '5', type: 'revenue', date: new Date('2024-06-02'), amount: 3200, description: 'Mobile App Development', category: 'Client Work' },
  { id: '6', type: 'expense', date: new Date('2024-06-05'), amount: 800, description: 'Freelancer Payment', category: 'Contractors' },
  { id: '7', type: 'revenue', date: new Date('2024-06-15'), amount: 750, description: 'Logo Design', category: 'Design' },
  { id: '8', type: 'expense', date: new Date('2024-06-20'), amount: 250, description: 'Marketing Campaign', category: 'Marketing' },
  { id: '9', type: 'revenue', date: new Date('2024-07-01'), amount: 4500, description: 'E-commerce Site', category: 'Client Work' },
  { id: '10', type: 'expense', date: new Date('2024-07-03'), amount: 65, description: 'Domain Renewal', category: 'Software' },
];

export const initialAppointments: Appointment[] = [
  { id: '1', title: 'Project Kickoff with Acme Inc.', date: new Date(new Date().setDate(new Date().getDate() + 2)), description: 'Initial meeting to discuss project scope.' },
  { id: '2', title: 'Design Review', date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Review the latest design mockups.' },
  { id: '3', title: 'Follow-up with John Doe', date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Discuss potential collaboration.' },
  { id: '4', title: 'Accountant Meeting', date: new Date(new Date().setDate(new Date().getDate() + 10)), description: 'Quarterly financial review.' },
];
