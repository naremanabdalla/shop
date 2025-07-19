import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-pink-300 text-gray-800 py-5 text-sm w-full mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <div className="mb-2 md:mb-0">
            <span className="font-semibold">
              Shop © {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex mb-2 md:mb-0">
            <Link to="/contact" className="hover:underline">
              {t("Contact")}
            </Link>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center space-x-2">
              <span>
                {t("Email")}:{" "}
                <a
                  href="mailto:naremanabdalla33@gmail.com"
                  className="hover:underline"
                >
                  naremanabdalla33@gmail.com
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-500 mt-3 pt-6 text-center text-pink-100 text-sm">
          <p className="text-gray-800">{t("Thank you for shopping with us")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
