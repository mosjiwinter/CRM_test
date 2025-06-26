'use client';

import { useState } from 'react';
import { AppointmentCalendar } from '@/components/calendar/appointment-calendar';
import { AppointmentDialog } from '@/components/calendar/appointment-dialog';
import { initialAppointments } from '@/lib/data';
import type { Appointment } from '@/lib/types';

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const openDialog = (appointment?: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsDialogOpen(true);
  };
  
  const addOrUpdateAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    setAppointments(current => {
      const existing = appointmentToEdit ? current.find(t => t.id === appointmentToEdit.id) : undefined;
      
      if (existing) {
        return current.map(t => t.id === existing.id ? { ...existing, ...appointmentData } : t);
      }
      return [...current, { ...appointmentData, id: new Date().toISOString() }];
    });
  };
  
  const deleteAppointment = (id: string) => {
    setAppointments(current => current.filter(t => t.id !== id));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <AppointmentCalendar 
        appointments={appointments}
        openDialog={openDialog}
        deleteAppointment={deleteAppointment}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <AppointmentDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        addOrUpdateAppointment={addOrUpdateAppointment}
        appointmentToEdit={appointmentToEdit}
        selectedDate={selectedDate}
      />
    </main>
  );
}
