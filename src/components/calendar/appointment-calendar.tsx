'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { initialAppointments } from '@/lib/data';
import type { Appointment } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export function AppointmentCalendar() {
  const [appointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const appointmentsOnSelectedDay = selectedDate
    ? appointments.filter(
        (appointment) =>
          appointment.date.toDateString() === selectedDate.toDateString()
      )
    : [];

  const appointmentDays = appointments.map((appointment) => appointment.date);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardContent className="p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="p-0"
                    classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4",
                        month: "space-y-4 w-full",
                        caption_label: "text-lg font-medium",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex justify-around",
                        head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                        row: "flex w-full mt-2 justify-around",
                        cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground rounded-full",
                    }}
                    modifiers={{
                        hasAppointment: appointmentDays,
                    }}
                    modifiersStyles={{
                        hasAppointment: {
                            border: '2px solid hsl(var(--primary))',
                            borderRadius: '9999px',
                        },
                    }}
                />
            </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
            <CardTitle>
                Appointments for{' '}
                {selectedDate ? format(selectedDate, 'PPP') : 'today'}
            </CardTitle>
            <CardDescription>
                You have {appointmentsOnSelectedDay.length} appointment(s) scheduled.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {appointmentsOnSelectedDay.length > 0 ? (
                appointmentsOnSelectedDay.map((appointment) => (
                    <div key={appointment.id}>
                        <div className="font-semibold">{appointment.title}</div>
                        <p className="text-sm text-muted-foreground">{appointment.description}</p>
                        <p className="text-xs text-muted-foreground">{format(appointment.date, 'p')}</p>
                        <Separator className="my-2" />
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">No appointments for this day.</p>
            )}
            </CardContent>
        </Card>
    </div>
  );
}
