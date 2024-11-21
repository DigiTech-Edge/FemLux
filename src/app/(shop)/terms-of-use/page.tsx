import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use | FemLux",
  description: "FemLux terms of use and conditions for our services.",
}

export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-12 animate-in slide-in-from-bottom duration-700">
        Terms of Use
      </h1>

      <div className="prose prose-pink mx-auto">
        <div className="space-y-8">
          <section className="animate-in slide-in-from-bottom duration-700 delay-150">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using FemLux's website and services, you agree to be bound by these Terms of Use, 
              our Privacy Policy, and any additional terms and conditions that may apply to specific sections of 
              our website or to products and services available through our website or from FemLux.
            </p>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-300">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">2. User Accounts</h2>
            <p className="text-gray-600">
              When you create an account with us, you must provide accurate, complete, and current information. 
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-450">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">3. Privacy Policy</h2>
            <p className="text-gray-600">
              Your use of FemLux's website is subject to our Privacy Policy. Please review our Privacy Policy, 
              which also governs the site and informs users of our data collection practices.
            </p>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-600">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">4. Electronic Communications</h2>
            <p className="text-gray-600">
              When you use our website or send emails to us, you are communicating with us electronically. 
              You consent to receive communications from us electronically. We will communicate with you by 
              email or by posting notices on this site.
            </p>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-750">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">5. Products and Services</h2>
            <p className="text-gray-600">
              All products and services are subject to availability. We reserve the right to discontinue 
              any product or service at any time. Prices for our products are subject to change without notice.
            </p>
          </section>

          <section className="animate-in slide-in-from-bottom duration-700 delay-900">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">6. Shipping and Returns</h2>
            <p className="text-gray-600">
              Please review our Shipping Policy and Return Policy for information on how we ship items 
              and handle returns. By making a purchase, you agree to be bound by our shipping and return policies.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-pink-50 rounded-lg animate-in fade-in duration-700 delay-1000">
          <p className="text-sm text-gray-600">
            Last updated: November 2023. These terms and conditions are subject to change without notice.
            Please check back regularly for updates.
          </p>
        </div>
      </div>
    </div>
  )
}
