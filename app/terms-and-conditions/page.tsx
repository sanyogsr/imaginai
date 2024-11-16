import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | ImaginAi.art",
  description:
    "Terms and conditions for using ImaginAi.art - Your AI-powered image generation platform",
  openGraph: {
    title: "Terms & Conditions | ImaginAi.art",
    description:
      "Terms and conditions for using ImaginAi.art - Your AI-powered image generation platform",
    url: "https://imaginai.art/terms-and-conditions",
    siteName: "ImaginAi.art",
    type: "website",
  },
};

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8">
          Terms & Conditions
        </h1>

        <div className="space-y-6 text-gray-600">
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using ImaginAi.art, you acknowledge that you have
              read, understood, and agree to be bound by these Terms &
              Conditions. These terms govern your use of our AI-powered image
              generation service.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Service Description
            </h2>
            <p className="mb-4">
              ImaginAi.art provides AI-powered image generation services. We
              reserve the right to modify, suspend, or discontinue any aspect of
              our services at any time without notice.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to use our services</li>
              <li>
                You agree not to use our service for any illegal or unauthorized
                purposes
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account
              </li>
              <li>
                You agree not to generate content that violates our content
                policies
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Intellectual Property
            </h2>
            <p className="mb-4">
              You retain rights to the images you generate using our service.
              However, we maintain the right to use generated images for service
              improvement and promotional purposes.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Termination
            </h2>
            <p className="mb-4">
              We reserve the right to terminate or suspend your account at our
              discretion, without prior notice, for violations of these terms.
            </p>
          </section>

          <div className="text-sm text-gray-500 mt-8">
            <p>Last updated: November 16, 2024</p>
            <p className="mt-2">
              For any questions about these terms, please contact us at{" "}
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
