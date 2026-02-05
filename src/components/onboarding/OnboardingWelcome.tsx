
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Users, TrendingUp } from "lucide-react";

export const OnboardingWelcome = () => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Welcome to SmartBill
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The intelligent time tracking and billing solution designed specifically for legal professionals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Increase Revenue</h3>
            <p className="text-muted-foreground">Capture 30% more billable hours with automatic time tracking</p>
          </CardContent>
        </Card>
        
        <Card className="border-success/20">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-success/10 mb-4">
              <Clock className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Accurate Billing</h3>
            <p className="text-muted-foreground">Never miss a billable minute with precise time tracking</p>
          </CardContent>
        </Card>
        
        <Card className="border-accent/20">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Client Management</h3>
            <p className="text-muted-foreground">Organize all your clients and projects in one place</p>
          </CardContent>
        </Card>
        
        <Card className="border-warning/20">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10 mb-4">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Smart Analytics</h3>
            <p className="text-muted-foreground">Get insights into your productivity and billing patterns</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-slate-deep rounded-lg">
        <p className="text-slate-deep-foreground font-medium">
          SmartBill helps legal professionals capture more billable hours, create accurate invoices, 
          and gain valuable insights into their practice.
        </p>
      </div>
    </div>
  );
};
