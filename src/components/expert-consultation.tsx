'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MessageCircle, Phone, Mail, User, MapPin, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExpertConsultation() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    consultationType: '',
    message: ''
  });
  const { toast } = useToast();

  const consultationTypes = [
    'Jewelry Selection',
    'Gemstone Consultation',
    'Custom Design',
    'Investment Advice',
    'Appraisal',
    'Other'
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!appointmentForm.name || !appointmentForm.email || !appointmentForm.phone || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    // In a real app, this would send the data to your backend
    console.log('Appointment submitted:', appointmentForm);
    
    toast({
      title: 'Appointment Requested',
      description: 'We will contact you soon to confirm your appointment.',
    });

    // Reset form and close dialog
    setAppointmentForm({
      name: '', email: '', phone: '', date: '', time: '', consultationType: '', message: ''
    });
    setIsAppointmentOpen(false);
  };

  const handleWhatsAppChat = () => {
    const phoneNumber = '+917249413017';
    const message = 'Hi! I would like to consult with a jewelry expert. Can you help me?';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">
            Talk with Our Expert
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized advice from our certified jewelry experts. Book a consultation or chat with us on WhatsApp for instant support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Appointment Booking Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Book an Appointment</CardTitle>
              <CardDescription>
                Schedule a personalized consultation with our jewelry experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Available consultation types:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {consultationTypes.slice(0, 4).map((type) => (
                      <span key={type} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <Dialog open={isAppointmentOpen} onOpenChange={setIsAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book Your Consultation</DialogTitle>
                      <DialogDescription>
                        Fill in the details below and we'll get back to you to confirm your appointment.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={appointmentForm.name}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={appointmentForm.email}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={appointmentForm.phone}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Preferred Date *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={appointmentForm.date}
                            onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time">Preferred Time *</Label>
                          <Select value={appointmentForm.time} onValueChange={(value) => setAppointmentForm({ ...appointmentForm, time: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="consultationType">Consultation Type</Label>
                        <Select value={appointmentForm.consultationType} onValueChange={(value) => setAppointmentForm({ ...appointmentForm, consultationType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select consultation type" />
                          </SelectTrigger>
                          <SelectContent>
                            {consultationTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Message</Label>
                        <Textarea
                          id="message"
                          value={appointmentForm.message}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, message: e.target.value })}
                          placeholder="Tell us about your specific needs..."
                          rows={3}
                        />
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit" className="w-full">
                          Request Appointment
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Chat Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Chat on WhatsApp</CardTitle>
              <CardDescription>
                Get instant answers and expert advice via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">+91 7249413017</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Available for quick questions, price inquiries, and instant support
                  </p>
                </div>
                
                <Button 
                  onClick={handleWhatsAppChat}
                  className="w-full bg-green-600 hover:bg-green-700" 
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start WhatsApp Chat
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Click to open WhatsApp with a pre-filled message
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Available Mon-Sat, 9 AM - 6 PM</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">In-store & Virtual Consultations</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <User className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Certified Jewelry Experts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



