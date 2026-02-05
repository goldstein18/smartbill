
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  UserPlus, 
  FileText,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export const OnboardingQuickStart = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Add Your First Client",
      description: "Go to the Clients page and create a new client profile with their hourly rate and contact information.",
      path: "/clients",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Clock,
      title: "Create a Manual Time Entry",
      description: "Use the 'Add Entry' button to manually log time for work you've already completed.",
      path: "/activities",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Users,
      title: "Assign Time to Clients",
      description: "Edit time entries to assign them to specific clients for accurate billing and tracking.",
      path: "/activities",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: FileText,
      title: "Generate Your First Invoice",
      description: "Create professional invoices from your tracked time entries with just a few clicks.",
      path: "/analytics",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Quick Start Guide
        </h2>
        <p className="text-lg text-gray-600">
          Follow these simple steps to get started with SmartBill
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="text-sm font-semibold">
                Step {index + 1}
              </Badge>
            </div>
            <CardHeader className="pt-12">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${step.bgColor} flex items-center justify-center`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 ml-16">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Pro Tip</h4>
              <p className="text-green-800 text-sm">
                Start with the desktop app running in the background for automatic tracking, 
                then use manual entries to fill in any gaps. This ensures you capture all 
                your billable hours without any extra effort.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-blue-50">
          <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
          <p className="text-sm text-blue-700">Visit our Help Center for detailed guides and tutorials.</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-purple-50">
          <h4 className="font-semibold text-purple-900 mb-2">Video Tutorials</h4>
          <p className="text-sm text-purple-700">Watch step-by-step video guides for each feature.</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-green-50">
          <h4 className="font-semibold text-green-900 mb-2">Support</h4>
          <p className="text-sm text-green-700">Contact our support team if you have any questions.</p>
        </div>
      </div>
    </div>
  );
};
