import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/hooks/useAppointments';
import { useDoctors } from '@/hooks/useDoctors';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import type { QuestionnaireSpec } from '@/types';
import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { appointments, createAppointment, isLoading } = useAppointments(user?._id, 'patient');
  const { doctors, isLoading: doctorsLoading, specializations } = useDoctors();
  const { spec, isLoading: specLoading, fetchSpec } = useQuestionnaire();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  // Helper function to calculate end time
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    phone: '',
  });

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const validateQuestionnaire = (): string | null => {
    if (!spec) return 'Please select a specialization and wait for the form to load.';
    for (const q of spec.questions) {
      const v = (answers[q.questionId] ?? '').trim();
      if (!v) return 'Please fill in all required fields.';
      if (!q.hasOptions && q.value === 'number') {
        // accept int, float, or string per spec, but ensure not empty (already checked)
        // No extra validation since strings are allowed
      }
      if (q.hasOptions && q.options && !q.options.includes(v)) {
        return 'Please select a valid option.';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateQuestionnaire();
    if (err) {
      toast({ title: 'Form incomplete', description: err, variant: 'destructive' });
      return;
    }
    
    if (doctors.length === 0) {
      toast({
        title: 'Error',
        description: 'No doctors available. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Use the first available doctor for now
      const selectedDoctor = doctors[0];
      
      await createAppointment({
        patientId: user?._id || '',
        patientName: user?.fName || '',
        patientEmail: user?.email || '',
        patientPhone: formData.phone,
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        date: new Date(formData.date),
        startTime: formData.time,
        endTime: calculateEndTime(formData.time, 30), // 30-minute appointments
        status: 'scheduled',
        reason: formData.reason,
        symptoms: formData.symptoms,
        questionnaire: spec ? {
          specialization: spec.specialization,
          questions: spec.questions.map(q => ({
            questionId: q.questionId,
            value: answers[q.questionId] ?? ''
          }))
        } : undefined,
      });
      
      toast({
        title: 'Appointment requested',
        description: 'Your appointment request has been submitted successfully.',
      });
      
      setFormData({ date: '', time: '', reason: '', symptoms: '', phone: '' });
      setSelectedSpecialization('');
      setAnswers({});
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
            Welcome, {user?.fName}
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
                   {doctorsLoading ? (
                     <div className="flex justify-center py-8">
                       <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                     </div>
                   ) : (
                     <form onSubmit={handleSubmit} className="space-y-4">
                     {/* Specialization select */}
                     <div className="space-y-2">
                       <Label htmlFor="specialization">Specialization</Label>
                       <Select
                         value={selectedSpecialization}
                         onValueChange={(value) => {
                           setSelectedSpecialization(value);
                           setAnswers({});
                           if (value) fetchSpec(value);
                         }}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Select specialization" />
                         </SelectTrigger>
                         <SelectContent>
                           {specializations.map((s) => (
                             <SelectItem key={s} value={s}>{s}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     {/* Dynamic questionnaire fields */}
                     {selectedSpecialization && (
                       specLoading ? (
                         <div className="flex justify-center py-4">
                           <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                         </div>
                       ) : spec ? (
                         <div className="space-y-4">
                           {spec.questions.map(q => (
                             <div key={q.questionId} className="space-y-2">
                               <Label>{q.question}</Label>
                               {q.hasOptions && q.options ? (
                                 <Select
                                   value={answers[q.questionId] ?? ''}
                                   onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.questionId]: val }))}
                                 >
                                   <SelectTrigger>
                                     <SelectValue placeholder="Select an option" />
                                   </SelectTrigger>
                                   <SelectContent>
                                     {q.options.map((opt, idx) => (
                                       <SelectItem key={`${q.questionId}-${idx}`} value={opt}>{opt}</SelectItem>
                                     ))}
                                   </SelectContent>
                                 </Select>
                               ) : (
                                 <Input
                                   value={answers[q.questionId] ?? ''}
                                   onChange={(e) => setAnswers(prev => ({ ...prev, [q.questionId]: e.target.value }))}
                                   required
                                   placeholder={q.value === 'number' ? 'Enter a number or text' : 'Enter your answer'}
                                 />
                               )}
                             </div>
                           ))}
                         </div>
                       ) : null
                     )}

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
                   )}
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
