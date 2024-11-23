import { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | FemLux",
  description: "Get in touch with FemLux for any questions or support.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-12 animate-in slide-in-from-bottom duration-700">
        Contact Us
      </h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="animate-in slide-in-from-left duration-700">
          <h2 className="text-2xl font-semibold mb-6 text-pink-600">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            We'd love to hear from you! Whether you have a question about our products,
            need assistance with an order, or want to provide feedback, our team is here to help.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-gray-600">
              <Mail className="w-5 h-5 text-pink-500" />
              <span>support@femlux.com</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <Phone className="w-5 h-5 text-pink-500" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span>123 Fashion Street, Style City, ST 12345</span>
            </div>
          </div>
        </div>

        <div className="animate-in slide-in-from-right duration-700">
          <h2 className="text-2xl font-semibold mb-6 text-pink-600">Business Hours</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex justify-between">
              <span>Monday - Friday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday:</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday:</span>
              <span>Closed</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-600">Customer Support</h3>
            <p className="text-gray-600">
              Our dedicated customer support team typically responds within 24 hours during business hours.
              For urgent matters, please contact us by phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
