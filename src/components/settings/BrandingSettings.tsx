
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile, UserBrandingProfile } from "@/hooks/useUserProfile";
import { Palette, Building, Mail, Phone, MapPin } from "lucide-react";

export const BrandingSettings: React.FC = () => {
  const { profile, isLoading, isSaving, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState<Partial<UserBrandingProfile>>({
    company_name: '',
    company_tagline: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    primary_color: '#2563eb'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        company_tagline: profile.company_tagline || '',
        company_email: profile.company_email || '',
        company_phone: profile.company_phone || '',
        company_address: profile.company_address || '',
        primary_color: profile.primary_color || '#2563eb'
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleInputChange = (field: keyof UserBrandingProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Company Branding
        </CardTitle>
        <CardDescription>
          Customize how your company appears on invoices and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Your Company Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primary_color">Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  placeholder="#2563eb"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_tagline">Tagline/Description</Label>
            <Input
              id="company_tagline"
              value={formData.company_tagline}
              onChange={(e) => handleInputChange('company_tagline', e.target.value)}
              placeholder="Professional Time Tracking Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Company Email
              </Label>
              <Input
                id="company_email"
                type="email"
                value={formData.company_email}
                onChange={(e) => handleInputChange('company_email', e.target.value)}
                placeholder="contact@yourcompany.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="company_phone"
                value={formData.company_phone}
                onChange={(e) => handleInputChange('company_phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Company Address
            </Label>
            <Textarea
              id="company_address"
              value={formData.company_address}
              onChange={(e) => handleInputChange('company_address', e.target.value)}
              placeholder="123 Main St, City, State 12345"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Branding Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
