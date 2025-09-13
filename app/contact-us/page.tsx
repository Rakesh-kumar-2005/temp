"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook backend API / email service
    setSubmitted(true);
  };

  return (
    <div className="flex justify-center items-center py-16 px-4 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Contact <span className="text-orange-500">Us</span>
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition"
                placeholder="example@email.com"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-sm font-medium">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition resize-none"
                placeholder="Write your message here..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-md hover:shadow-orange-500/50 transition"
            >
              Send Message <Send size={18} />
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-green-400">
              🎉 Thank you for reaching out!
            </h3>
            <p className="text-gray-300 mt-2">
              We'll get back to you as soon as possible.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
