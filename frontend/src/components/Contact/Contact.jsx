import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

function Contact() {
  return (
    <div className="bg-green-50 min-h-screen">

      <div className="relative h-[350px]">
        <img
          src="/images/banner.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-bold mb-3">
            Contact Us
          </h1>

          <p className="text-lg">
            Fresh Organic Products • Direct from Farmers
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <h2 className="text-3xl font-bold text-green-700 text-center mb-3">
            Get In Touch
          </h2>

          <p className="text-center text-gray-600 mb-10">
            We are always happy to assist you. Feel free to contact us using
            the information below.
          </p>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="flex items-center gap-5 bg-green-50 p-6 rounded-xl hover:shadow-lg transition">
              <div className="bg-green-600 text-white p-4 rounded-full">
                <FaPhoneAlt size={22} />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Phone Number
                </h3>

                <p className="text-gray-600">
                  +94 77 123 4567
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-green-50 p-6 rounded-xl hover:shadow-lg transition">
              <div className="bg-green-600 text-white p-4 rounded-full">
                <FaEnvelope size={22} />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Email Address
                </h3>

                <p className="text-gray-600">
                  elanharvest@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-green-50 p-6 rounded-xl hover:shadow-lg transition">
              <div className="bg-green-600 text-white p-4 rounded-full">
                <FaMapMarkerAlt size={22} />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Office Address
                </h3>

                <p className="text-gray-600">
                  No.25, Main Street,
                  <br />
                  Colombo, Sri Lanka.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-green-50 p-6 rounded-xl hover:shadow-lg transition">
              <div className="bg-green-600 text-white p-4 rounded-full">
                <FaClock size={22} />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Working Hours
                </h3>

                <p className="text-gray-600">
                  Monday - Saturday
                  <br />
                  8.00 AM - 6.00 PM
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Contact;