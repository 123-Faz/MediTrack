import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How quickly will I receive a response to my inquiry?",
      answer: "We typically respond to all inquiries within 24 hours. For urgent medical concerns, please call our emergency support line which is available 24/7."
    },
    {
      question: "Do you accept insurance?",
      answer: "Yes, we work with most major insurance providers. Our team will verify your coverage before your appointment and help you understand your benefits."
    },
    {
      question: "Can I schedule same-day appointments?",
      answer: "Absolutely! We reserve slots for same-day appointments and urgent care needs. You can book online or call our scheduling line for immediate assistance."
    },
    {
      question: "Are virtual consultations available?",
      answer: "Yes, we offer comprehensive virtual consultations through our secure platform. This includes video calls, messaging, and remote monitoring options."
    },
    {
      question: "How do I access my medical records?",
      answer: "You can access your medical records through our patient portal. If you need assistance, our support team can help you set up your account and navigate the system."
    },
    {
      question: "What safety measures are in place at your facilities?",
      answer: "All our facilities follow strict safety protocols including regular sanitization, air filtration systems, and proper PPE usage to ensure patient and staff safety."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Quick answers to common questions about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions? We're here to help.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection