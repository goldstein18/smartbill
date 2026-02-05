
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useDemo } from "@/context/DemoContext";
import { Shield, Search, Clock, Calendar, FileText, DollarSign } from "lucide-react";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { enterDemoMode } = useDemo();

  const handleWatchDemo = () => {
    enterDemoMode();
    navigate("/demo");
  };

  return (
    <section className="bg-navy text-navy-foreground min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-slate-deep opacity-90" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            <h1 className="font-sans font-semibold text-5xl md:text-6xl lg:text-[3.5rem] leading-[1.1] text-white mb-6 tracking-tight">
              Capture Every Billable Hour.
              <br />
              Defend Every Invoice.
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
              Accurate time tracking and compliant billing built for law firms, 
              ensuring you never miss a billable minute and get paid accurately 
              for your work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-warning hover:bg-warning/90 text-warning-foreground font-semibold rounded-full"
                onClick={() => navigate("/register")}
              >
                {t('landing.hero.startFreeTrial')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 border-slate-500 bg-slate-deep/50 text-white hover:bg-slate-deep hover:text-white rounded-full"
                onClick={handleWatchDemo}
              >
                {t('landing.hero.watchDemo')}
              </Button>
            </div>
            
            <p className="text-sm text-slate-400">
              No credit card required • Set up in minutes • Cancel anytime.
            </p>
          </div>

          {/* Right content - Product mockup */}
          <div className="relative hidden lg:block">
            {/* Laptop frame */}
            <div className="relative">
              {/* Laptop screen */}
              <div className="bg-slate-800 rounded-t-xl p-1 shadow-2xl">
                <div className="bg-slate-deep rounded-lg overflow-hidden">
                  {/* App header */}
                  <div className="bg-navy px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                    <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-white font-medium text-sm">SmartBill</span>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="p-4 grid grid-cols-2 gap-4">
                    {/* Timer section */}
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-2xl font-mono text-white">00:00</span>
                      </div>
                      {/* Calendar mini */}
                      <div className="mt-4">
                        <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Sessions - May 2024
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-500">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-center">{day}</div>
                          ))}
                          {Array.from({ length: 31 }, (_, i) => (
                            <div 
                              key={i} 
                              className={`text-center py-0.5 rounded ${i === 9 ? 'bg-accent text-white' : i > 19 && i < 23 ? 'bg-slate-600 text-white' : ''}`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Invoice section */}
                    <div className="bg-white rounded-lg p-3 text-slate-800">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-sm">Acme Corp.</div>
                          <div className="text-[10px] text-slate-500">July 15, 2024</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">$4,350.00</div>
                          <div className="text-[10px] text-slate-500">Salary bonus</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-[10px]">
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Total Billed</span>
                          <span className="font-medium">$3,150</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Draft & Review Agreement</span>
                          <span className="font-medium">$2,150.00</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span>Draft Amendments</span>
                          <span className="font-medium">$300.00</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-accent">$4,350.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Laptop base */}
              <div className="h-4 bg-slate-700 rounded-b-xl mx-8" />
              <div className="h-2 bg-slate-600 rounded-b-lg mx-16" />
            </div>

            {/* Floating badges */}
            <div className="absolute bottom-32 left-0 bg-slate-deep/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Built for Legal</div>
                <div className="text-slate-400 text-xs">Billing Compliance</div>
              </div>
            </div>

            <div className="absolute bottom-12 left-16 bg-slate-deep/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Audit-Ready</div>
                <div className="text-slate-400 text-xs">Records</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
