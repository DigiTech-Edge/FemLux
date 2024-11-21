import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | FemLux",
  description: "Learn about FemLux's journey in revolutionizing women's fashion.",
}

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 animate-in slide-in-from-bottom duration-700">
        Our Story
      </h1>
      
      <div className="prose prose-pink mx-auto">
        <section className="mb-12 animate-in slide-in-from-bottom duration-700 delay-150">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">Who We Are</h2>
          <p className="text-gray-600 mb-6">
            FemLux was born from a vision to create a fashion destination that celebrates the essence of modern femininity. 
            Founded in 2023, we set out to revolutionize the way women shop for fashion by combining luxury with accessibility.
          </p>
          <p className="text-gray-600">
            Our curated collection represents the perfect blend of contemporary trends and timeless elegance, 
            ensuring that every piece tells a story of sophistication and style.
          </p>
        </section>

        <section className="mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At FemLux, we believe that fashion is more than just clothing – it's a form of self-expression that empowers women 
            to feel confident and beautiful. Our mission is to provide high-quality, trendsetting fashion pieces that inspire 
            confidence and celebrate individuality.
          </p>
        </section>

        <section className="animate-in slide-in-from-bottom duration-700 delay-500">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">Our Values</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>Quality: We source only the finest materials and partner with skilled artisans.</li>
            <li>Sustainability: Our commitment to ethical fashion guides every decision we make.</li>
            <li>Innovation: We continuously evolve to meet the changing needs of our customers.</li>
            <li>Community: We foster a supportive community that celebrates diversity and inclusion.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
