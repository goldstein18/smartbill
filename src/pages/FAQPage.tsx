
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Scale, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first time entry?",
          answer: "You can create time entries manually by clicking the 'Add Entry' button on your dashboard. Manual entries require you to specify the start time, duration, and associate it with a client."
        },
        {
          question: "How do I set up my first client?",
          answer: "Go to the Clients page and click 'Add Client'. Enter the client name, hourly rate, and any additional details. You can then assign time entries to this client for accurate billing."
        },
        {
          question: "What's the difference between merged and unmerged entries?",
          answer: "Merged entries combine consecutive time blocks for the same client into single entries, while unmerged entries show each individual time block separately. Use the toggle on your dashboard to switch between views."
        }
      ]
    },
    {
      category: "Time Tracking",
      questions: [
        {
          question: "Can I edit time entries after creating them?",
          answer: "Yes! Click on any time entry in your activities list to edit the duration, client assignment, or description. Changes are saved automatically."
        },
        {
          question: "How do I track time automatically?",
          answer: "You can create time entries manually by clicking the 'Add Entry' button on your dashboard. Simply specify the start time, duration, and associate it with a client for accurate billing."
        },
        {
          question: "Can I delete time entries?",
          answer: "Yes, you can delete individual time entries from the Activities page. Click the delete button next to any entry and confirm the action."
        }
      ]
    },
    {
      category: "Billing & Invoicing",
      questions: [
        {
          question: "How do I set different hourly rates for different clients?",
          answer: "Each client can have their own hourly rate. Set this when creating a new client or edit it anytime from the Clients page. All calculations will automatically use the client-specific rate."
        },
        {
          question: "Can I generate invoices from my time entries?",
          answer: "Yes! Use the invoice generation feature to create professional invoices based on your tracked time. The system automatically calculates totals based on each client's hourly rate."
        },
        {
          question: "What export formats are available?",
          answer: "You can export your data as PDF invoices and CSV files for further analysis in spreadsheet applications."
        }
      ]
    },
    {
      category: "Account Management",
      questions: [
        {
          question: "How do I update my profile information?",
          answer: "Go to your Profile page from the user menu. You can update your display name and view your account information there."
        },
        {
          question: "How do I change my password?",
          answer: "Password changes are handled through the authentication system. Use the 'Forgot Password' link on the login page to reset your password via email."
        },
        {
          question: "Can I export all my data?",
          answer: "Yes, you can export your time entries and client data from the Activities and Clients pages respectively. This ensures you always have access to your billing information."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "Why aren't my time entries showing up?",
          answer: "Check that you're looking at the correct date range and that the entries are properly saved. Make sure you've clicked 'Save' after creating an entry."
        },
        {
          question: "The app seems slow or unresponsive",
          answer: "Try refreshing your browser and ensure you have a stable internet connection. If problems persist, contact our support team at support@smartbill.com."
        },
        {
          question: "How do I edit multiple time entries at once?",
          answer: "You can select multiple entries on the Activities page and use bulk actions to edit or delete them. This makes it easy to manage your time tracking data efficiently."
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about SmartBill
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((item, questionIndex) => (
                  <AccordionItem 
                    key={questionIndex} 
                    value={`${categoryIndex}-${questionIndex}`}
                    className="border border-gray-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-brand-600">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {filteredFAQ.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No FAQs found matching "{searchTerm}"
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Still Need Help */}
        <div className="bg-brand-50 rounded-xl p-8 text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button
            onClick={() => navigate("/help")}
            className="bg-brand-600 hover:bg-brand-700"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
