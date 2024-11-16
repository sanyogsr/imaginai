import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ImaginAi.art",
  description:
    "Privacy policy and data protection information for ImaginAi.art users",
  openGraph: {
    title: "Privacy Policy | ImaginAi.art",
    description:
      "Privacy policy and data protection information for ImaginAi.art users",
    url: "https://imaginai.art/privacy-policy",
    siteName: "ImaginAi.art",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-600">
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information that you provide directly to us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Payment information</li>
              <li>Generated images and prompts</li>
              <li>Usage data and preferences</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To process your payments</li>
              <li>To improve our AI models</li>
              <li>To communicate with you about service updates</li>
              <li>To protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Data Security
            </h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Your Rights
            </h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <div className="text-sm text-gray-500 mt-8">
            <p>Last updated: November 16, 2024</p>
            <p className="mt-2">
              For privacy-related questions, please contact us at{" "}
              <a
                href="mailto:support@imaginai.art"
                className="text-purple-600 hover:text-purple-700"
              >
                support@imaginai.art
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
