import { FiMail } from "react-icons/fi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - Femlux",
  description: "Please verify your email address to continue",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email Icon with Animation */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center animate-bounce">
              <FiMail className="w-10 h-10 text-gray-200" />
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We&apos;ve sent you a confirmation link to verify your email
              address. Please check your inbox and click the link to complete
              your registration.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-indigo-600">1</span>
              </div>
              <p className="text-gray-600 text-sm">
                Open the email from Femlux
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-indigo-600">2</span>
              </div>
              <p className="text-gray-600 text-sm">
                Click the confirmation link
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold text-indigo-600">3</span>
              </div>
              <p className="text-gray-600 text-sm">Start exploring Femlux!</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <p className="text-sm text-gray-500 text-center">
              Didn&apos;t receive the email? Check your spam folder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
