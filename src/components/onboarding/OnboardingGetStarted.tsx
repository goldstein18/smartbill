
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Rocket, 
  BookOpen, 
  HelpCircle, 
  MessageCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface OnboardingGetStartedProps {
  onComplete: () => void;
  isCompleting: boolean;
}

export const OnboardingGetStarted = ({ onComplete, isCompleting }: OnboardingGetStartedProps) => {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Rocket className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          You're All Set!
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Congratulations! You now have everything you need to start tracking your time and growing your legal practice with SmartBill.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Ready to Track</h3>
            <p className="text-green-800 text-sm">Your account is configured and ready for time tracking</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Start Earning</h3>
            <p className="text-blue-800 text-sm">Begin capturing more billable hours today</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Button 
          size="lg" 
          className="px-8 py-3 text-lg"
          onClick={onComplete}
          disabled={isCompleting}
        >
          {isCompleting ? "Setting up..." : "Start Tracking Time"}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <BookOpen className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Help Center</span>
            <span className="text-xs text-gray-500">Guides & tutorials</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <HelpCircle className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">FAQ</span>
            <span className="text-xs text-gray-500">Common questions</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <MessageCircle className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Contact Support</span>
            <span className="text-xs text-gray-500">Get personalized help</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h4 className="font-semibold mb-2">Welcome to the SmartBill Community!</h4>
        <p className="text-blue-100 text-sm">
          You're joining thousands of legal professionals who have transformed their practice with intelligent time tracking. 
          We're excited to help you capture more billable hours and grow your business.
        </p>
      </div>
    </div>
  );
};
