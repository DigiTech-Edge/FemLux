import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | FemLux",
  description: "Learn about how FemLux protects and handles your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-12 animate-in slide-in-from-bottom duration-700">
        Privacy Policy
      </h1>

      <div className="prose prose-pink mx-auto">
        <div className="space-y-8">
          <section className="animate-in slide-in-from-bottom duration-700 delay-150">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Name and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information</li>
              <li>Email address</li>
              <li>Shopping preferences and history</li>
            </ul>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-300">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process your orders and payments</li>
              <li>Communicate with you about your orders</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-450">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Information Sharing</h2>
            <p className="text-gray-600">
              We do not sell your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Service providers who assist in our operations</li>
              <li>Payment processors for secure transactions</li>
              <li>Shipping partners to deliver your orders</li>
            </ul>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-600">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-750">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Security</h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-900">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Cookies</h2>
            <p className="text-gray-600">
              We use cookies and similar tracking technologies to track activity on our website and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-pink-50 rounded-lg animate-in fade-in duration-700 delay-1000">
          <p className="text-sm text-gray-600">
            Last updated: November 2023. If you have any questions about our Privacy Policy, please contact us
            at privacy@femlux.com.
          </p>
        </div>
      </div>
    </div>
  )
}
