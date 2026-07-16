import React from "react";
import { FaLeaf } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { IoHeart } from "react-icons/io5";

const About = () => {
  return (
    <>
      <section className="min-h-screen w-full bg-gradient-to-b from-[#f0fff4] to-white py-16 px-6 overflow-hidden">
        <h1 className="text-4xl font-bold text-center mb-14 text-secondary">
          About Our Organic Store
        </h1>

        <p className="text-sm text-primary text-center mt-3 max-w-2xl mx-auto">
          Fresh Organic Fruits & Vegetables Directly From Trusted Farms.
        </p>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 py-14 relative">
          <div className="size-[500px] rounded-full absolute blur-[250px] -z-10 bg-green-100"></div>

          <img
            className="max-w-sm w-full rounded-2xl shadow-lg"
            src="/images/img2.png"
            alt="Organic products"/>
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-secondary">
              Why Choose Us
            </h2>

            <p className="text-primary mt-3 text-sm leading-6">
              We provide fresh organic fruits & vegetables directly from farms
              with guaranteed quality and trust.
            </p>

            <div className="flex flex-col gap-8 mt-8">
              <div className="flex items-start gap-4">
                <div className="size-12 flex items-center justify-center bg-green-100 borderrounded-lg">
                  <FaLeaf className="text-secondary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">
                    100% Organic Products
                  </h3>
                  <p className="text-sm text-primary">
                    Naturally grown fresh products without chemicals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 flex items-center justify-center bg-green-100 border rounded-lg">
                  <FaTruckFast className="text-secondary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">
                    Fast Delivery
                  </h3>
                  <p className="text-sm text-primary">
                    Quick & safe delivery to your doorstep.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-12 flex items-center justify-center bg-green-100 border rounded-lg">
                  <IoHeart className="text-secondarytext-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">
                    Healthy Lifestyle
                  </h3>
                  <p className="text-sm text-primary">
                    Nutritious food for a healthy family life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
<div className="bg-green-100 border-l-4 border-secondary rounded-xl p-5 mt-10 shadow">
  <h2 className="text-2xl font-bold text-secondary mb-3">
    Ordering Information
  </h2>

  <ul className="list-disc list-inside text-gray-700 space-y-2">
    <li><strong>Minimum Order Quantity:</strong> 250g</li>
    <li><strong>Maximum Order Quantity:</strong> 50kg</li>
    <li>Fresh organic products are packed with care before delivery.</li>
    <li>Products are sourced directly from trusted local farmers.</li>
  </ul>
</div>
        <h1 className="text-4xl font-bold text-center text-secondary mb-10">
          Our Strategy Pyramid
        </h1>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 md:w-52 text-secondary bg-white text-center py-3 rounded-full border-2 border-secondary font-semibold shadow">
              Vision
            </div>

            <div className="w-52 md:w-64 text-secondary bg-white text-center py-3 rounded-full border-2 border-secondary  font-semibold shadow">
              Mission
            </div>

            <div className="w-64 md:w-72 text-secondary bg-white text-center py-3 rounded-full border-2 border-secondary  font-semibold shadow">
              Values
            </div>

            <div className="w-72 md:w-80 text-secondary bg-white text-center py-3 rounded-full border-2 border-secondary  font-semibold shadow">
              Goals
            </div>

            <div className="w-80 md:w-96 text-secondary bg-white text-center py-3 rounded-full border-2 border-secondary  font-semibold shadow">
              Strategy
            </div>

            <div className="w-full md:w-[420px] text-secondary bg-white text-center py-3 rounded-full border-2 border-secondary  font-semibold shadow">
              Action Plan
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-secondary">1. Vision</h2>
              <p className="text-primary text-sm">
                To become the most trusted organic food platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-secondary">2. Mission</h2>
              <p className="text-primary text-sm">
                Deliver fresh organic food directly from farmers to customers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-secondary">3. Values</h2>
              <p className="text-primary text-sm">
                Trust, quality, sustainability, and healthy living.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-secondary">4. Goals</h2>
              <p className="text-primary text-sm">
                Support local farmers and build a strong customer base.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-secondary">5. Strategy</h2>
              <p className="text-primary text-sm">
                Connect farmers and customers through a digital platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-secondary">6. Action Plan</h2>
              <p className="text-primary text-sm">
                Develop website, manage orders, and improve delivery system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;