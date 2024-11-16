import { Metadata } from "next";
import { Mail, Phone, Clock, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | ImaginAi.art",
  description: "Get in touch with ImaginAi.art for support and inquiries",
  openGraph: {
    title: "Contact Us | ImaginAi.art",
    description: "Get in touch with ImaginAi.art for support and inquiries",
    url: "https://imaginai.art/contact",
    siteName: "ImaginAi.art",
    type: "website",
  },
};

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8">
          Contact Us
        </h1>

        <div className="space-y-6">
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Email Us
                  </h2>
                  <a
                    href="mailto:support@imaginai.art"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    support@imaginai.art
                  </a>
                </div>
              </div>
              <p className="text-gray-600">
                For general inquiries, support requests, and feedback
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Call Us
                  </h2>
                  <a
                    href="tel:+918059570676"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    +91 8059570676
                  </a>
                </div>
              </div>
              <p className="text-gray-600">
                Available for urgent support needs during business hours
              </p>
            </div>
          </section>

          {/* <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                  rows={4}
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
              >
                Send Message
              </button>
            </form>
          </section> */}

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Additional Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <Clock className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-800">Response Time</h3>
                  <p className="text-gray-600">Usually within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Support Languages
                  </h3>
                  <p className="text-gray-600">English, Hindi</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
