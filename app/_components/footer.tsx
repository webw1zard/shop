import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { SiPaypal, SiMastercard, SiVisa, SiAmericanexpress } from "react-icons/si";
import pot from "@/public/pot.png"
import watering from "@/public/watering.png"
import logo from "@/public/logo.png"

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center space-x-4">
          <Image src="/cactus.png" alt="Garden Care" width={100} height={100} />
          <div>
            <h3 className="font-bold text-lg">Garden Care</h3>
            <p>We are an online plant shop offering a wide range of cheap and trendy plants.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Image src={pot} alt="Plant Renovation" width={100} height={100} />
          <div>
            <h3 className="font-bold text-lg">Plant Renovation</h3>
            <p>We are an online plant shop offering a wide range of cheap and trendy plants.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Image src="/watering.png" alt="Watering Garden" width={100} height={100} />
          <div>
            <h3 className="font-bold text-lg">Watering Garden</h3>
            <p>We are an online plant shop offering a wide range of cheap and trendy plants.</p>
          </div>
        </div>
      </div>

      <div className="bg-green-100 py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">Would you like to join newsletters?</h3>
            <p className="text-sm text-gray-600">We usually post offers and challenges in our newsletter.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="p-2 rounded-md border border-gray-300"
            />
            <button className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md">Join</button>
          </div>
        </div>
      </div>

      <div className="bg-green-100 py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="GreenShop Logo" width={200} height={100} />
          </div>
          <p className="text-gray-600">📍 70 West Buckingham Ave. Farmingdale, NY 11735</p>
          <p className="text-gray-600">📧 contact@greenshop.com</p>
          <p className="text-gray-600">📞 +88 01911 717 490</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold">My Account</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>My Account</li>
            <li>Our Stores</li>
            <li>Contact Us</li>
            <li>Career</li>
            <li>Specials</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Help & Guide</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Help Center</li>
            <li>How to Buy</li>
            <li>Shipping & Delivery</li>
            <li>Product Policy</li>
            <li>How to Return</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Categories</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>House Plants</li>
            <li>Potter Plants</li>
            <li>Seeds</li>
            <li>Small Plants</li>
            <li>Accessories</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Social Media</h3>
          <div className="flex space-x-3 my-2">
            <FaFacebookF className="text-green-600 text-xl cursor-pointer" />
            <FaInstagram className="text-green-600 text-xl cursor-pointer" />
            <FaTwitter className="text-green-600 text-xl cursor-pointer" />
            <FaLinkedinIn className="text-green-600 text-xl cursor-pointer" />
            <FaYoutube className="text-green-600 text-xl cursor-pointer" />
          </div>

          <h3 className="font-bold mt-4">We accept</h3>
          <div className="flex space-x-3 mt-2">
            <SiPaypal className="text-blue-600 text-xl" />
            <SiMastercard className="text-red-600 text-xl" />
            <SiVisa className="text-blue-500 text-xl" />
            <SiAmericanexpress className="text-blue-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="text-center py-4 bg-gray-200 text-gray-600">
        © 2024 GreenShop. All Rights Reserved.
      </div>
    </footer>
  );
}
