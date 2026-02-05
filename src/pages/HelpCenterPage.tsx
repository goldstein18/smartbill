
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scale, Mail, FileText, Shield, MessageCircle } from "lucide-react";

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Frequently Asked Questions",
      description: "Find answers to common questions",
      icon: MessageCircle,
      path: "/faq"
    },
    {
      title: "Terms of Service",
      description: "Read our terms and conditions",
      icon: FileText,
      path: "/terms"
    },
    {
      title: "Privacy Policy",
      description: "Learn about our privacy practices",
      icon: Shield,
      path: "/privacy"
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team",
      icon: Mail,
      path: "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-brand-700" />
              <span className="text-2xl font-bold text-brand-700">SmartBill</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help you get the most out of SmartBill
          </p>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 text-center">
          <Mail className="h-16 w-16 text-brand-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Personal Support?
          </h2>
          <p className="text-gray-600 mb-6">
            Our support team is ready to help you with any questions or issues you may have.
          </p>
          <div className="bg-brand-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Email us at:</p>
            <a 
              href="mailto:support@smartbill.com" 
              className="text-2xl font-semibold text-brand-600 hover:text-brand-700"
            >
              support@smartbill.com
            </a>
          </div>
          <p className="text-sm text-gray-500">
            We typically respond within 24 hours during business days
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quickLinks.map((link, index) => (
              <div 
                key={index}
                onClick={() => navigate(link.path)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-brand-200"
              >
                <link.icon className="h-8 w-8 text-brand-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {link.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {link.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Getting Started with SmartBill
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold text-gray-900">1. Create Your Account</h3>
              <p className="text-gray-600 text-sm">Sign up for free and set up your profile with your billing information.</p>
            </div>
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold text-gray-900">2. Add Your First Client</h3>
              <p className="text-gray-600 text-sm">Set up your clients with their hourly rates and project details.</p>
            </div>
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold text-gray-900">3. Start Tracking Time</h3>
              <p className="text-gray-600 text-sm">Use manual entry or download our desktop app for automatic tracking.</p>
            </div>
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold text-gray-900">4. Generate Invoices</h3>
              <p className="text-gray-600 text-sm">Create professional invoices with detailed time breakdowns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
