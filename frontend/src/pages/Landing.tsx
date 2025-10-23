import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Calendar, Clock, Shield, Users, Heart, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-medical.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Effortlessly book and manage appointments with our intelligent calendar system.',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay informed with instant notifications and appointment reminders.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your medical data is protected with enterprise-grade security.',
    },
    {
      icon: Users,
      title: 'Patient-Centric',
      description: 'Designed with both doctors and patients in mind for seamless care.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Modern Healthcare Management</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Healthcare Made{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Simple & Efficient
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground lg:text-xl">
                Connect patients with doctors seamlessly. Schedule appointments, manage consultations,
                and deliver exceptional care—all in one platform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => navigate('/auth?mode=signup')}
                  className="group"
                >
                  Get Started
                  <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl" />
              <img
                src={heroImage}
                alt="Modern medical office"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline healthcare management for both doctors and patients.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group relative overflow-hidden border-border/50 bg-gradient-to-b from-card to-card/80 transition-all hover:shadow-lg hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Founders Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32 bg-muted/30">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Meet Our Founders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dedicated healthcare professionals committed to revolutionizing patient care.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-border/50 bg-card">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Users className="h-20 w-20 text-primary/40" />
              </div>
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-lg">Founder {i}</h3>
                <p className="text-sm text-muted-foreground">Details to be added</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of healthcare professionals and patients using MedPlanner.
          </p>
          <Button
            variant="accent"
            size="lg"
            onClick={() => navigate('/auth?mode=signup')}
            className="bg-background text-primary hover:bg-background/90"
          >
            Start Free Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
