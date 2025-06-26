'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { Appointment } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type AppointmentCalendarProps = {
    appointments: Appointment[];
    openDialog: (appointment?: Appointment) => void;
    deleteAppointment: (id: string) => void;
    selectedDate: Date | undefined;
    setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
};

export function AppointmentCalendar({ 
    appointments, 
    openDialog, 
    deleteAppointment,
    selectedDate,
    setSelectedDate,
}: AppointmentCalendarProps) {

  const appointmentsOnSelectedDay = selectedDate
    ? appointments.filter(
        (appointment) =>
          appointment.date.toDateString() === selectedDate.toDateString()
      ).sort((a,b) => a.date.getTime() - b.date.getTime())
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
                        cell: "h-12 w-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                        day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100",
                        day_selected: "bg-primary text-primary-foreground rounded-full hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
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
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>
                            Appointments for{' '}
                            {selectedDate ? format(selectedDate, 'PPP') : 'today'}
                        </CardTitle>
                        <CardDescription>
                            You have {appointmentsOnSelectedDay.length} appointment(s) scheduled.
                        </CardDescription>
                    </div>
                    <Button onClick={() => openDialog()}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
            {appointmentsOnSelectedDay.length > 0 ? (
                appointmentsOnSelectedDay.map((appointment) => (
                    <div key={appointment.id} className="flex items-start gap-4 rounded-lg border p-3">
                        <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full bg-primary" />
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold">{appointment.title}</div>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 -mr-2">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openDialog(appointment)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => deleteAppointment(appointment.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className="text-sm text-muted-foreground">{appointment.description || <span className="italic">No description</span>}</p>
                            <p className="text-xs text-muted-foreground">{format(appointment.date, 'p')}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-center text-sm text-muted-foreground py-8">No appointments for this day.</p>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
  );
}
