import type { Transaction, Appointment, Customer, Project } from './types';

// Get today's date to make the data recent
const today = new Date();

export const initialTransactions: Transaction[] = [
  { id: '1', type: 'revenue', date: new Date(new Date(today).setDate(today.getDate() - 60)), amount: 2500, description: 'Web Design Project', category: 'Client Work' },
  { id: '2', type: 'expense', date: new Date(new Date(today).setDate(today.getDate() - 58)), amount: 450, description: 'Software Subscription', category: 'Software' },
  { id: '3', type: 'revenue', date: new Date(new Date(today).setDate(today.getDate() - 55)), amount: 1800, description: 'Consulting Services', category: 'Consulting' },
  { id: '4', type: 'expense', date: new Date(new Date(today).setDate(today.getDate() - 50)), amount: 120, description: 'Office Supplies', category: 'Office' },
  { id: '5', type: 'revenue', date: new Date(new Date(today).setDate(today.getDate() - 28)), amount: 3200, description: 'Mobile App Development', category: 'Client Work' },
  { id: '6', type: 'expense', date: new Date(new Date(today).setDate(today.getDate() - 25)), amount: 800, description: 'Freelancer Payment', category: 'Contractors' },
  { id: '7', type: 'revenue', date: new Date(new Date(today).setDate(today.getDate() - 15)), amount: 750, description: 'Logo Design', category: 'Design' },
  { id: '8', type: 'expense', date: new Date(new Date(today).setDate(today.getDate() - 10)), amount: 250, description: 'Marketing Campaign', category: 'Marketing' },
  { id: '9', type: 'revenue', date: new Date(new Date(today).setDate(today.getDate() - 5)), amount: 4500, description: 'E-commerce Site', category: 'Client Work' },
  { id: '10', type: 'expense', date: new Date(new Date(today).setDate(today.getDate() - 2)), amount: 65, description: 'Domain Renewal', category: 'Software' },
];

export const initialAppointments: Appointment[] = [
  { id: '1', title: 'Project Kickoff with Acme Inc.', date: new Date(new Date().setDate(new Date().getDate() + 2)), description: 'Initial meeting to discuss project scope.' },
  { id: '2', title: 'Design Review', date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Review the latest design mockups.' },
  { id: '3', title: 'Follow-up with John Doe', date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Discuss potential collaboration.' },
  { id: '4', title: 'Accountant Meeting', date: new Date(new Date().setDate(new Date().getDate() + 10)), description: 'Quarterly financial review.' },
];

export const initialCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@acme.com', phone: '123-456-7890', company: 'Acme Inc.', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@globex.com', phone: '987-654-3210', company: 'Globex Corporation', createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Peter Jones', email: 'peter.jones@stark.com', phone: '555-123-4567', company: 'Stark Industries', createdAt: new Date('2024-03-10') },
];

export const initialProjects: Project[] = [
  { id: 'proj-1', name: 'New Website Design', customerId: '1', status: 'In Progress', deadline: new Date(new Date().setDate(new Date().getDate() + 30)) },
  { id: 'proj-2', name: 'Marketing Campaign Q3', customerId: '2', status: 'Not Started', deadline: new Date(new Date().setDate(new Date().getDate() + 60)) },
  { id: 'proj-3', name: 'Mobile App CI/CD', customerId: '1', status: 'Completed', deadline: new Date(new Date().setDate(new Date().getDate() - 15)) },
  { id: 'proj-4', name: 'Iron Suit MK II', customerId: '3', status: 'In Progress', deadline: new Date(new Date().setDate(new Date().getDate() + 90)) },
];
