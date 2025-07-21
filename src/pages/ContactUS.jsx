import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPaperPlane } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
const ContactUS = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        "service_icusg5g", // Replace with your EmailJS service ID
        "template_5ycwfqs", // Replace with your EmailJS template ID
        formData,
        "YPJu1XDCIfc1ZPyK-" // Replace with your EmailJS public key
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      toast.success(
        `${t("Message sent successfully! We'll get back to you soon.")}`
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(`${t("Failed to send message. Please try again later.")}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { t } = useTranslation();

  return (
    <div className=" py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-700 sm:text-4xl">
            {t("Contact Us")}
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            {t("We'd love to hear from you! Send us a message below")}.
          </p>
        </div>

        <div className=" rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 w-9/10 lg:w-1/2 mx-auto">
           
            {/* Contact Form */}
            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Full Name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Email Address")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Subject")}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[color:var(--color-secondary)] hover:bg-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <FaPaperPlane className="mr-2 h-4 w-4" />
                    {t("Send Message")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUS;
