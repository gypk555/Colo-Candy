import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-800 text-white py-5 text-center mt-auto">
      <div className="flex flex-col md:flex-row justify-between flex-wrap gap-5 max-w-screen-xl mx-auto md:text-left px-4">
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-2.5">Contact Us</h3>
          <p className="text-sm mb-1">
            <a href="mailto:contact@mywebsite.com" className="hover:text-blue-400 transition-colors">
              Email: contact@mywebsite.com
            </a>
          </p>
          <p className="text-sm">
            <a href="tel:+1234567890" className="hover:text-blue-400 transition-colors">
              Phone: +123 456 7890
            </a>
          </p>
        </div>

        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-2.5">Follow Us</h3>
          <div className="flex flex-col gap-1.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              📘 Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              🐦 Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              📷 Instagram
            </a>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-2.5">Legal</h3>
          <a
            href="/terms-and-conditions"
            className="text-white text-sm hover:text-blue-400 transition-colors block mb-2"
          >
            Terms and Conditions
          </a>
          <p className="text-sm text-gray-400">
            &copy; {currentYear} MyWebsite. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
