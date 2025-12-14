"use client";

import Link from 'next/link';
import {
  FiBarChart2,
  FiPackage,
  FiDollarSign,
  FiUsers,
  FiTarget,
  FiAlertTriangle,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden pt-16 lg:pt-20">
      {/* Hero Section - Apple Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-background via-white to-background overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
                Business Simulation Platform
              </span>
            </motion.div>

            <motion.h1
              className="text-display-2 lg:text-display-1 font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Master Dropshipping
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Without the Risk
              </span>
            </motion.h1>

            <motion.p
              className="text-title-2 lg:text-headline text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Experience all aspects of running a dropshipping business with our interactive simulation platform. Learn, practice, and perfect your strategy.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
                >
                  Start Simulation
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-outline text-lg px-8 py-4 flex items-center gap-2"
                >
                  Sign Up Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Apple Style Grid */}
      <section id="features" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-display-3 font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-title-2 text-gray-600 max-w-2xl mx-auto">
              Experience all aspects of running a dropshipping business without the financial risk
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              title="Market Research"
              description="Analyze market trends and identify profitable niches with our advanced research tools."
              icon={<FiBarChart2 />}
              color="primary"
              delay={0}
            />
            <FeatureCard
              title="Supplier Management"
              description="Find and connect with reliable suppliers for your products."
              icon={<FiUsers />}
              color="accent"
              delay={0.1}
            />
            <FeatureCard
              title="Inventory Sync"
              description="Automatically sync inventory levels with your suppliers in real-time."
              icon={<FiPackage />}
              color="warning"
              delay={0.2}
            />
            <FeatureCard
              title="Profit Analytics"
              description="Track your earnings and analyze performance with detailed reports."
              icon={<FiDollarSign />}
              color="success"
              delay={0.3}
            />
            <FeatureCard
              title="Marketing Tools"
              description="Test marketing strategies and analyze their effectiveness."
              icon={<FiTarget />}
              color="primary"
              delay={0.4}
            />
            <FeatureCard
              title="Risk Assessment"
              description="Identify and mitigate potential risks in your business model without real losses."
              icon={<FiAlertTriangle />}
              color="danger"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - Apple Style */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-display-3 font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-title-2 text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and begin your dropshipping journey
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            <StepCard
              number="1"
              title="Create Your Store"
              description="Set up your virtual dropshipping store and customize it to your liking."
            />
            <StepCard
              number="2"
              title="Find Suppliers"
              description="Browse our database of virtual suppliers and add their products to your store."
            />
            <StepCard
              number="3"
              title="Market Your Products"
              description="Use simulated marketing tools to attract virtual customers to your store."
            />
            <StepCard
              number="4"
              title="Process Orders"
              description="Handle customer orders and coordinate with suppliers for fulfillment."
            />
            <StepCard
              number="5"
              title="Analyze & Optimize"
              description="Review your performance and optimize your strategy to increase profits."
            />
          </div>
        </div>
      </section>

      {/* Testimonials - Apple Style */}
      <section id="testimonials" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-display-3 font-bold text-gray-900 mb-4">
              Loved by Entrepreneurs
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <TestimonialCard
              quote="SimBusiness gave me the confidence to start my own dropshipping business. I learned so much without risking my savings!"
              author="Alex Johnson"
              role="New Entrepreneur"
              delay={0}
            />
            <TestimonialCard
              quote="The simulation is incredibly realistic. It helped me identify and fix issues in my business model before launching."
              author="Sarah Williams"
              role="E-commerce Store Owner"
              delay={0.1}
            />
            <TestimonialCard
              quote="I use SimBusiness to test new product ideas and marketing strategies before implementing them in my actual store."
              author="Michael Chen"
              role="Experienced Dropshipper"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Call to Action - Apple Style */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 rounded-full blur-3xl opacity-20" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-display-3 font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              className="text-title-2 text-gray-300 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Jump into our simulation and learn without financial risk. Start building your dropshipping skills today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 flex items-center gap-2"
                >
                  Get Started Free
                  <FiArrowRight />
                </motion.button>
              </Link>
              <Link href="/faq">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-outline border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  delay?: number;
}

function FeatureCard({ title, description, icon, color, delay = 0 }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  return (
    <motion.div
      ref={ref}
      className="card card-hover"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`w-14 h-14 rounded-2xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <div className="text-2xl">
          {icon}
        </div>
      </div>
      <h3 className="text-title-2 font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-body text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-6 p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-apple-lg transition-all"
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: Number(number) * 0.1 }}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-lg font-bold shadow-apple">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-title-2 font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-body text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, delay = 0 }: { quote: string; author: string; role: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="card card-hover"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mb-4 text-primary-500">
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 32 32">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>
      <p className="text-body text-gray-700 mb-6 leading-relaxed">{quote}</p>
      <div>
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </motion.div>
  );
}
