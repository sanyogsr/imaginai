import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | ImaginAi.art",
  description: "Cancellation and refund policy for ImaginAi.art services",
  openGraph: {
    title: "Cancellation & Refund Policy | ImaginAi.art",
    description: "Cancellation and refund policy for ImaginAi.art services",
    url: "https://imaginai.art/cancellation-refund-policy",
    siteName: "ImaginAi.art",
    type: "website",
  },
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8">
          Cancellation & Refund Policy
        </h1>

        <div className="space-y-6 text-gray-600">
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Commitment to Quality
            </h2>
            <p className="mb-4">
              At ImaginAi.art, we pour our heart and soul into providing you
              with the most advanced AI image generation technology. Our team
              works tirelessly to ensure that every credit you purchase
              translates into a magical creative experience.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Understanding Our No-Refund Policy
            </h2>
            <p className="mb-4">
              We believe in transparency and want to maintain an honest
              relationship with our valued users. Due to the instant-use nature
              of our digital credits and the computational resources involved,
              we are unable to offer refunds once credits are purchased.
            </p>
            <p className="mb-4">
              Think of each credit as a unique moment of creativity - once it&apos;s
              transformed into pixels, that magical moment can&apos;t be reversed.
              This policy helps us maintain the quality and reliability of our
              service while keeping costs reasonable for all users.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Promise to You
            </h2>
            <p className="mb-4">
              While we don&apos;t offer refunds, we do promise to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide detailed tutorials to help you make the most of your
                credits
              </li>
              <li>
                Offer exceptional customer support to address any technical
                issues
              </li>
              <li>Continuously improve our AI models for better results</li>
              <li>Be transparent about all costs and credit usage</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Need Assistance?
            </h2>
            <p className="mb-4">
              While we cannot provide refunds, our dedicated support team is
              here to help you make the most of your ImaginAi.art experience. If
              you&apos;re encountering any issues or need guidance, please don&apos;t
              hesitate to reach out to us at{" "}
              <a
                href="mailto:support@imaginai.art"
                className="text-purple-600 hover:text-purple-700"
              >
                support@imaginai.art
              </a>
            </p>
          </section>

          <div className="text-sm text-gray-500 mt-8">
            <p>Last updated: November 16, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
