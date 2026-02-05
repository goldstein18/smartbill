
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Scale, Handshake, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/ui-custom/LanguageToggle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PartnerContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const applicationData = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      company: formData.get('company') as string,
      position: formData.get('position') as string,
      experience: formData.get('experience') as string || null,
      network: formData.get('network') as string || null,
      motivation: formData.get('motivation') as string || null,
    };

    try {
      const { error } = await supabase
        .from('partner_applications')
        .insert(applicationData);

      if (error) throw error;

      toast.success('Partnership application submitted successfully! We will review your application and contact you within 5 business days.');
      navigate('/pricing');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Scale className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold text-brand-700">SmartBill</span>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button
                variant="ghost"
                onClick={() => navigate("/pricing")}
                className="text-gray-600 hover:text-brand-600 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Pricing
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Handshake className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Partner with SmartBill
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Join our exclusive partner program and help other legal professionals transform their practice while earning commissions.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Partnership Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company/Firm Name *</Label>
                  <Input id="company" name="company" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Your Position *</Label>
                  <Input id="position" name="position" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience with Legal Software</Label>
                  <Textarea 
                    id="experience" 
                    name="experience" 
                    placeholder="Tell us about your experience with legal practice management software..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network">Your Professional Network</Label>
                  <Textarea 
                    id="network" 
                    name="network" 
                    placeholder="Describe your network of legal professionals and potential reach..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to become a partner?</Label>
                  <Textarea 
                    id="motivation" 
                    name="motivation" 
                    placeholder="Tell us about your motivation and goals..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Partnership Application'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              We review all applications within 5 business days. 
              Selected partners will be contacted for a brief interview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerContactPage;
