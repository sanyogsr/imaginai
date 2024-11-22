import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | ImaginAi.art",
  description:
    "Learn about ImaginAi.art - Pioneering AI image generation with cutting-edge LLM models",
  openGraph: {
    title: "About Us | ImaginAi.art",
    description:
      "Learn about ImaginAi.art - Pioneering AI image generation with cutting-edge LLM models",
    url: "https://imaginai.art/about",
    siteName: "ImaginAi.art",
    type: "website",
  },
};

export default function AboutUs() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8">
            About ImaginAi.art
          </h1>

          <div className="space-y-6 text-gray-600">
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Vision
              </h2>
              <p className="mb-4">
                At ImaginAi.art, we&apos;re revolutionizing the world of digital
                art creation through cutting-edge AI technology. Our platform
                empowers creators to transform their imagination into stunning
                visual reality with just a few clicks.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Leadership
              </h2>
              <div className="flex items-start space-x-6">
                {/* <div className="w-[10rem] h-20 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div> */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Sanyog
                  </h3>
                  <p className="text-purple-600 mb-2">Founder & CEO</p>
                  <p className="text-gray-600">
                    Leading the vision of ImaginAi.art, Sanyog brings innovative
                    AI technology to creative professionals and enthusiasts
                    worldwide. His passion for AI and art drives our mission to
                    make high-quality AI image generation accessible to
                    everyone.
                  </p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                Business Name
              </h2>
              <div className="flex items-start space-x-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mt-2">
                    ImaginAi
                  </h3>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Technology
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-600">
                    Advanced LLM Models
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Flux Schnell - High quality and lightning fast generation
                    </li>
                    <li>Flux Dev - Professional-grade quality </li>
                    <li>Flux Pro -Ultra-high resolution outputs</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-600">
                    Key Features
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>High-quality image generation</li>
                    <li>Multiple style options</li>
                    <li>Fast processing times</li>
                    <li>Advanced customization</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Commitment
              </h2>
              <p className="mb-4">
                We&apos;re committed to pushing the boundaries of AI image
                generation while maintaining the highest standards of quality
                and user experience. Our team continuously works on improving
                our models and adding new features to meet the evolving needs of
                our creative community.
              </p>
            </section>
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Delivery and Shipment Policy{" "}
              </h2>
              <p className="mb-4">
                We don&apos;t have any Delivery and Shipment policy as we
                don&apos;t deliver any physical product.
              </p>
            </section>

            <div className="text-sm text-gray-500 mt-8 ">
              <p>
                Join us in shaping the future of AI-powered creativity. Start
                creating with ImaginAi.art today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
