import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
          <Link
            href="/dashboard/about-us"
            className="hover:text-blue-500 transition-colors"
          >
            About us
          </Link>
          <Link
            href="/dashboard/support"
            className="hover:text-blue-500 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/dashboard/terms-and-conditions"
            className="hover:text-blue-500 transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/dashboard/privacy-policy"
            className="hover:text-blue-500 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/dashboard/refund-policy"
            className="hover:text-blue-500 transition-colors"
          >
            Refund Policy
          </Link>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ImaginAi.art All rights reserved.
        </div>
      </div>
    </footer>
  );
}
