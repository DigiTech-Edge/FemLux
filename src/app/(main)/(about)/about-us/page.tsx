import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | FemLux",
  description:
    "FemLux - Your trusted online destination for premium female hygiene products.",
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 animate-in slide-in-from-bottom duration-700">
        About FemLUX by MC
      </h1>

      <div className="prose prose-pink mx-auto">
        <section className="mb-12 animate-in slide-in-from-bottom duration-700 delay-150">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Who We Are
          </h2>
          <p className="text-gray-600 mb-6">
            FemLux is a dedicated online retailer specializing in premium female
            hygiene products. We understand that every woman deserves access to
            high-quality personal care items in a convenient and discreet
            manner.
          </p>
          <p className="text-gray-600">
            Our carefully curated selection of products combines comfort,
            reliability, and sustainability to meet the diverse needs of our
            customers. Through our registered online platform, we provide a
            secure and comfortable shopping experience, ensuring that essential
            feminine care products are just a click away.
          </p>
        </section>

        <section className="mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-6">
            To empower women by providing convenient access to superior feminine
            hygiene products while promoting health education and breaking
            stigmas around menstrual wellness. We strive to create a supportive
            online environment where women can make informed choices about their
            personal care needs with confidence and dignity.
          </p>
        </section>

        <section className="mb-12 animate-in slide-in-from-bottom duration-700 delay-400">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Our Vision
          </h2>
          <p className="text-gray-600 mb-6">
            To become the most trusted destination for feminine hygiene
            products, leading the way in promoting menstrual health awareness
            and sustainable practices. We envision a world where every woman has
            access to quality personal care products and feels empowered to
            embrace their wellbeing without compromise.
          </p>
        </section>
      </div>
    </div>
  );
}
