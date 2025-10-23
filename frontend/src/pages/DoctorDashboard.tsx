import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentCalendar } from '@/components/AppointmentCalendar';
import { Calendar, Clock, Users, FileText, Pencil } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Appointment } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, updateAppointment, isLoading } = useAppointments(user?._id, 'doctor');
  const [viewMode, setViewMode] = useState<'today' | 'calendar'>('today');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [status, setStatus] = useState<Appointment['status']>('scheduled');

  const todayAppointments = appointments.filter(apt => 
    isToday(new Date(apt.date)) && apt.status === 'scheduled'
  );

  const handleSelectAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setNotes(apt.notes || '');
    setDiagnosis(apt.diagnosis || '');
    setStatus(apt.status);
    setEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;
    
    await updateAppointment(selectedAppointment._id, {
      notes,
      diagnosis,
      status,
    });
    
    setEditingNotes(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Doctor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.fName}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'today' ? 'default' : 'outline'}
              onClick={() => setViewMode('today')}
            >
              <Clock className="h-4 w-4" />
              Today's Schedule
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4" />
              Full Calendar
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{todayAppointments.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <span className="text-2xl font-bold">
                  {new Set(appointments.map(a => a.patientId)).size}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <span className="text-2xl font-bold">
                  {appointments.filter(a => a.status === 'completed').length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : viewMode === 'today' ? (
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No appointments scheduled for today
                </p>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map(apt => (
                    <div
                      key={apt._id}
                      className="flex items-start gap-4 rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {apt.startTime}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">{apt.patientName}</p>
                            <p className="text-sm text-muted-foreground">{apt.patientEmail}</p>
                            <p className="text-sm text-muted-foreground">{apt.patientPhone}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAppointment(apt)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit Notes
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Reason:</span> {apt.reason}
                          </p>
                          {apt.symptoms && (
                            <p className="text-sm">
                              <span className="font-medium">Symptoms:</span> {apt.symptoms}
                            </p>
                          )}
                          {apt.notes && (
                            <div className="mt-2 rounded-md bg-muted/50 p-2">
                              <p className="text-sm font-medium">Doctor's Notes:</p>
                              <p className="text-sm text-muted-foreground">{apt.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <AppointmentCalendar
            appointments={appointments}
            onSelectAppointment={handleSelectAppointment}
          />
        )}
      </div>

      {/* Edit Notes Dialog */}
      <Dialog open={editingNotes} onOpenChange={setEditingNotes}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="font-semibold text-lg">{selectedAppointment.patientName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedAppointment.date), 'PPP')} at {selectedAppointment.startTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reason:</span> {selectedAppointment.reason}
                </p>
                {selectedAppointment.symptoms && (
                  <p className="text-sm">
                    <span className="font-medium">Symptoms:</span> {selectedAppointment.symptoms}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as Appointment['status'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No-show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Doctor's Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes about this consultation..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingNotes(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
