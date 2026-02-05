
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  FileText, 
  Users, 
  BarChart3, 
  Zap, 
  Shield,
  Download,
  Calculator
} from "lucide-react";

export const OnboardingFeatures = () => {
  const features = [
    {
      icon: Clock,
      title: "Automatic Time Tracking",
      description: "Track time automatically in the background while you work. Never forget to start or stop a timer again.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Calculator,
      title: "Smart Billing & Invoicing",
      description: "Generate professional invoices with accurate time entries and customizable rates per client.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Organize clients with custom hourly rates, contact information, and project categorization.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Get detailed insights into your time usage, productivity patterns, and revenue trends.",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed and efficiency"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected"
    },
    {
      icon: Download,
      title: "Export & Reports",
      description: "Export your data and generate detailed reports"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Powerful Features for Legal Professionals
        </h2>
        <p className="text-lg text-gray-600">
          Everything you need to track time, manage clients, and grow your practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {additionalFeatures.map((feature, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
            <feature.icon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 font-medium">
          Join thousands of legal professionals who have increased their billable hours by an average of 30%
        </p>
      </div>
    </div>
  );
};
