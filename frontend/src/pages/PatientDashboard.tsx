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
import { useForms } from '@/hooks/useForms';
import { Calendar, Clock, FileText, Plus, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { api, apiGateway, ApiError } from '@/lib/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { appointments, createAppointment, isLoading } = useAppointments(user?.first_name, 'patient');
  const { forms, isLoading: formsLoading, specializations  } = useForms();
  const { doctors, isLoading: doctorsLoading, setDoctors} = useDoctors();
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
  // use a generic type for selectedForm (forms hook controls the shape)
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  // answers can be number | string | boolean depending on question/type/optionsValue
  const [answers, setAnswers] = useState<Record<number, number | string | boolean>>({});
  // selected doctor id chosen by the patient from the doctors list
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  const validateForm = (): string | null => {
    if (!selectedSpecialization) return null;
    if (!selectedForm) return 'Please select a specialization and wait for the form to load.';
    for (const q of selectedForm.questions) {
      const v = answers[q.questionId];
      if (v === undefined || v === null || v === '') return 'Please fill in all required fields.';
      if (q.type === 'number') {
        if (typeof v !== 'number' || Number.isNaN(v)) return 'Please enter a valid number.';
      }
      // if hasOptions we expect a mapped value (usually number) — additional checks can be added if needed
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //const err = validateForm();
    // if (err) {
    //   toast({ title: 'Form incomplete', description: err, variant: 'destructive' });
    //   return;
    // }
    
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
      // prefer the doctor selected by the patient; fallback to first available
      const selectedDoctor = doctors.find((d: any) => d._id === selectedDoctorId) ?? doctors[0];
      // Build an array of answers with questionId and value
      const answersBetter = Object.values(answers);

      const status = await apiGateway.post<string>('/get-results/' + selectedForm.model_eval_id, {
        "questions": answersBetter}
      );
      console.log(status);

      const date = await apiGateway.post<string>('/planner', {
        "doctor_id": selectedDoctor._id,
        "prior": status["Status"]
      });

      console.log(date);

      const appointmentFinal = await api.post<string>('/appointments/create', {
        "medic_id": selectedDoctor._id,
        "date": date["date"]
      })
      window.location.reload();
      // const resp2 = await customApi.post
      toast({
        title: 'Appointment requested',
        description: 'Your appointment request has been submitted successfully.',
      });
      
      setFormData({ date: '', time: '', reason: '', symptoms: '', phone: '' });
      setSelectedSpecialization('');
      setSelectedForm(null);
      setAnswers({});
      setSelectedDoctorId('');
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
            Welcome, {user?.first_name}
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
                           // reset any previously selected doctor when specialization changes
                           setSelectedDoctorId('');
                           // pass the specialization string to the hook so it can fetch filtered doctors
                           setDoctors(value);
                           const found = forms.find(f => f.specialization === value) ?? null;
                           setSelectedForm(found);
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
                       formsLoading ? (
                         <div className="flex justify-center py-4">
                           <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                         </div>
                       ) : selectedForm ? (
                         <div className="space-y-4">
                           {selectedForm.questions.map((q: any) => (
                             <div key={q.questionId} className="space-y-2">
                               <Label>{q.question}</Label>
                               {q.hasOptions && q.options ? (
                                 <Select
                                   value={(() => {
                                     const cur = answers[q.questionId];
                                     // show label if available; otherwise stringify the stored value
                                     if (q.optionsMap && cur !== undefined) {
                                       const found = q.optionsMap.find((o: any) => o.value === cur);
                                       return found ? found.label : String(cur ?? '');
                                     }
                                     return String(cur ?? '');
                                   })()}
                                   onValueChange={(val) => {
                                     // Inline mapping: prefer optionsMap, fallback to options/optionsValue arrays
                                     const mapped = (() => {
                                       if (Array.isArray(q.optionsMap) && q.optionsMap.length > 0) {
                                         const f = q.optionsMap.find((o: any) =>
                                           o.label === val || (typeof o.label === 'string' && o.label.toLowerCase() === String(val).toLowerCase())
                                         );
                                         if (f) return f.value;
                                       }
                                       if (Array.isArray(q.options) && Array.isArray(q.optionsValue)) {
                                         const idx = q.options.findIndex((opt: string) =>
                                           opt === val || (typeof opt === 'string' && opt.toLowerCase() === String(val).toLowerCase())
                                         );
                                         if (idx !== -1 && idx < q.optionsValue.length) return q.optionsValue[idx];
                                       }
                                       // fallback: store raw label
                                       return val;
                                     })();
                                     setAnswers(prev => ({ ...prev, [q.questionId]: mapped }));
                                   }}
                                 >
                                   <SelectTrigger>
                                     <SelectValue placeholder="Select an option" />
                                   </SelectTrigger>
                                   <SelectContent>
                                     {q.options.map((opt: string, idx: number) => (
                                       <SelectItem key={`${q.questionId}-${idx}`} value={opt}>{opt}</SelectItem>
                                     ))}
                                   </SelectContent>
                                 </Select>
                               ) : (
                                 <Input
                                   type={q.type === 'number' ? 'number' : 'text'}
                                   value={answers[q.questionId] ?? ''}
                                   onChange={(e) => {
                                     const v = e.target.value;
                                     setAnswers(prev => ({
                                       ...prev,
                                       [q.questionId]: q.type === 'number' ? (v === '' ? '' : Number(v)) : v
                                     }));
                                   }}
                                   required
                                   placeholder={q.type === 'number' ? 'Enter a number' : 'Enter your answer'}
                                 />
                               )}
                             </div>
                           ))}
                           {/* Doctor select populated from the doctors array */}
                           <div key="doctor" className="space-y-2">
                             <Label htmlFor="doctor">Doctor</Label>
                             <Select
                               value={selectedDoctorId}
                               onValueChange={(val) => setSelectedDoctorId(val)}
                             >
                               <SelectTrigger>
                                 <SelectValue placeholder={doctors.length ? 'Select a doctor' : 'No doctors available'} />
                               </SelectTrigger>
                               <SelectContent>
                                 {doctors.map((d: any) => (
                                   <SelectItem key={d._id} value={d._id}>{d.first_name} {d.last_name}</SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>
                           
                           
                         </div>
                       ) : (
                         <p className="text-sm text-muted-foreground">No form available for the selected specialization.</p>
                       )
                     )}

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
                            <p className="font-semibold">{apt.doctor_first_name} {apt.doctor_last_name}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              apt.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                              apt.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(apt.date), 'PPP')} at {apt.date}
                          </p>
                          <p className="text-sm">{apt.doctor_specialization}</p>
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
                      {appointments.filter(a => a.status === 'upcoming').length}
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                    <Ban className="h-5 w-5 text-danger" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cancelled</p>
                    <p className="text-2xl font-bold">
                      {appointments.filter(a => a.status === 'cancelled').length}
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
