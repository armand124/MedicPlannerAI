import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/hooks/useAppointments';
import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { appointments, createAppointment, isLoading } = useAppointments(user?._id, 'patient');
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAppointment({
        patientId: user?._id || '',
        patientName: user?.name || '',
        patientEmail: user?.email || '',
        patientPhone: formData.phone,
        doctorId: 'doctor_1', // TODO: Allow doctor selection
        doctorName: 'Dr. Sarah Johnson',
        date: new Date(formData.date),
        startTime: formData.time,
        endTime: '', // TODO: Calculate based on appointment duration
        status: 'scheduled',
        reason: formData.reason,
        symptoms: formData.symptoms,
      });
      
      toast({
        title: 'Appointment requested',
        description: 'Your appointment request has been submitted successfully.',
      });
      
      setFormData({ date: '', time: '', reason: '', symptoms: '', phone: '' });
      setShowForm(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments and medical records
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Appointment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Book an Appointment</CardTitle>
                    <CardDescription>Schedule a consultation with our doctors</CardDescription>
                  </div>
                  <Button
                    variant={showForm ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? 'Hide Form' : <><Plus className="h-4 w-4" /> New Appointment</>}
                  </Button>
                </div>
              </CardHeader>
              
              {showForm && (
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Input
                        id="reason"
                        placeholder="e.g., Annual checkup, Follow-up"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms or Concerns</Label>
                      <Textarea
                        id="symptoms"
                        placeholder="Describe your symptoms or health concerns..."
                        value={formData.symptoms}
                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Appointments History */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>View your upcoming and past consultations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : appointments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No appointments found. Book your first appointment above!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div
                        key={apt._id}
                        className="flex items-start gap-4 rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{apt.doctorName}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              apt.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                              apt.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(apt.date), 'PPP')} at {apt.startTime}
                          </p>
                          <p className="text-sm">{apt.reason}</p>
                          {apt.diagnosis && (
                            <div className="mt-2 rounded-md bg-muted/50 p-2">
                              <p className="text-sm font-medium">Diagnosis:</p>
                              <p className="text-sm text-muted-foreground">{apt.diagnosis}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">
                      {appointments.filter(a => a.status === 'scheduled').length}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {appointments.filter(a => a.status === 'completed').length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <p className="text-2xl font-bold">{appointments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
