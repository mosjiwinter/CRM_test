'use client';

import { useState } from 'react';
import { AppointmentCalendar } from '@/components/calendar/appointment-calendar';
import { AppointmentDialog } from '@/components/calendar/appointment-dialog';
import type { Appointment } from '@/lib/types';
import { useAppContext } from '@/lib/app-context';

export default function CalendarPage() {
  const { appointments, addOrUpdateAppointment, deleteAppointment } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const openDialog = (appointment?: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsDialogOpen(true);
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
