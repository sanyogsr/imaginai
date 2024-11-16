import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Solutions", href: "/solutions" },
        { name: "Pricing", href: "/pricing" },
        { name: "Documentation", href: "/docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About us", href: "/about-us" },
        { name: "Contact", href: "/contact-us" },
        { name: "Terms & Conditions", href: "/terms-and-conditions" },
        { name: "Privacy policy", href: "/privacy-policy" },
        { name: "Refund Policy", href: "/refund-policy" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t bg-white/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4 text-2xl font-bold">
              Imagin<span className="text-blue-500">Ai</span>
            </div>
            <p className="mb-6 text-sm text-gray-600 max-w-md">
              Transforming ideas into reality with AI-powered innovation. Join
              us in shaping the future of creative technology.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-500 transition"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} ImaginAi.art All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
