"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is SimBusiness?",
    answer: "SimBusiness is an interactive platform for learning and practicing dropshipping business strategies. It provides a realistic simulation of running an online store, managing suppliers, and handling product fulfillment without the financial risk of starting a real business."
  },
  {
    question: "How does the dropshipping simulation work?",
    answer: "Our simulation lets you experience the full dropshipping lifecycle: finding suppliers, importing products to your store, marketing to customers, processing orders, and analyzing business performance. You'll learn practical skills in a risk-free environment."
  },
  {
    question: "Is SimBusiness suitable for beginners?",
    answer: "Absolutely! SimBusiness is designed for users of all experience levels. If you're new to e-commerce and dropshipping, our platform provides a guided learning experience with tutorials and helpful resources to get you started."
  },
  {
    question: "What features does SimBusiness offer?",
    answer: "SimBusiness includes supplier management, product importing, inventory syncing, order routing and fulfillment, automated shipping calculations, and marketing tools like abandoned cart recovery - all the essential features of a real dropshipping business."
  },
  {
    question: "How realistic is the simulation?",
    answer: "Very realistic! We've modeled our simulation on real-world dropshipping operations, including actual market conditions, supplier relationships, shipping delays, and customer behaviors. The skills you learn here are directly transferable to a real business."
  },
  {
    question: "Can I use SimBusiness to practice before starting my own dropshipping business?",
    answer: "Yes, that's exactly what SimBusiness is designed for! Practice selecting profitable products, setting prices, marketing strategies, and customer service in our risk-free environment before investing real money in your own business."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to know about SimBusiness
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 mb-4">
            Still have questions? We&apos;re here to help!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 