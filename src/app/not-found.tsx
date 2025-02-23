"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 inline-block p-3 bg-white rounded-xl shadow-lg">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="FemLUX by MC Logo"
              width={150}
              height={50}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* 404 Message */}
        <h1 className="text-4xl font-bold text-pink-600 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t find the page you&apos;re looking for. It might have
          been moved, deleted, or never existed.
        </p>

        {/* Helpful Suggestions */}
        <div className="bg-pink-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-pink-600 mb-4">
            Here&apos;s what you can do:
          </h2>
          <ul className="text-gray-600 space-y-2 text-left">
            <li>• Check if the URL is correct</li>
            <li>• Return to our homepage</li>
            <li>• Browse our product categories</li>
            <li>• Contact our support team for help</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            href="/"
            color="primary"
            variant="flat"
            startContent={<Home className="w-4 h-4" />}
            className="flex-1 sm:flex-initial max-sm:py-2"
          >
            Go to Homepage
          </Button>
          <Button
            as={Link}
            href="/products"
            color="primary"
            variant="light"
            startContent={<Search className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Browse Products
          </Button>
          <Button
            as="button"
            onClick={() => window.history.back()}
            color="primary"
            variant="light"
            startContent={<ArrowLeft className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
