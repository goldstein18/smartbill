
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scale } from "lucide-react";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

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
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Last updated: January 1, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                </p>
                <p><strong>Personal Information:</strong> Name, email address, billing information, and profile details.</p>
                <p><strong>Usage Data:</strong> Time entries, client information, billing rates, and application usage patterns.</p>
                <p><strong>Technical Data:</strong> IP address, browser type, device information, and usage analytics.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                </p>
                <p><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf.</p>
                <p><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</p>
                <p><strong>Business Transfers:</strong> Information may be transferred in connection with mergers, acquisitions, or asset sales.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data transmission, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete your personal information within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and personal information</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request correction of inaccurate information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to operate and improve our services, analyze usage, and provide personalized content. You can control cookie settings through your browser, though this may affect service functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>Our service integrates with third-party services including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Supabase:</strong> Database and authentication services</li>
                  <li><strong>Stripe:</strong> Payment processing (when applicable)</li>
                  <li><strong>Analytics providers:</strong> Usage analytics and performance monitoring</li>
                </ul>
                <p>These services have their own privacy policies that govern their use of your information.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at support@smartbill.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
