import React from "react";
import { FaLeaf, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { GiLindenLeaf } from "react-icons/gi";
import { SiOverleaf } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-10">

      <div className="max-w-6xl mx-auto px-6 py-11 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <SiOverleaf /> Elan Harvest
          </h2>
          <p className="mt-3 text-sm text-gray-200">
            Fresh organic fruits & vegetables directly from farmers to your home.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>

          <ul className="space-y-2 text-gray-200">

            <li className="hover:text-white">
              <Link to="/">Home</Link>
            </li>

            <li className="hover:text-white">
              <Link to="/products">Products</Link>
            </li>

            <li className="hover:text-white">
              <Link to="/about">About</Link>
            </li>

            <li className="hover:text-white">
              <Link to="/contact">Contact</Link>
            </li>

            <li className="hover:text-white font-semibold text-yellow-200 flex items-center gap-2">
              <GiLindenLeaf />
              <Link to="/farmerlogin">Farmer Login</Link>
              </li>
            <li className="hover:text-white font-semibold text-yellow-200 flex items-center gap-2">
              <GiLindenLeaf />
              <Link to="/adminlogin">Admin Login</Link>
              </li>

          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>

          <div className="flex gap-4 text-2xl mt-2">
            <a href="#"><FaFacebook className="hover:text-blue-300" /></a>
            <a href="#"><FaInstagram className="hover:text-pink-300" /></a>
            <a href="#"><FaTwitter className="hover:text-sky-300" /></a>
          </div>

          <p className="mt-4 text-sm text-gray-300">
            Stay connected for fresh updates & offers
          </p>
        </div>

      </div>

    </footer>
  );
};

export default Footer;