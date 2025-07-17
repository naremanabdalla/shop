import React, { useState } from "react";
import { doPasswordReset } from "../auth/auth";
import { useTranslation } from "react-i18next";

const Resetpasswordpopup = () => {
  const [email, setemail] = useState("");
  const [open, setOpen] = useState(false);

  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Crucial addition
    setOpen(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    doPasswordReset(email)
      .then(() => {
        alert("Password reset email sent!");
        setemail("");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
      });
  };
  const { t } = useTranslation(); // Assuming you have a translation function

  return (
    <>
      <div>
        <p
          className="mt-4 text-center text-gray-600 cursor-pointer"
          onClick={handleTriggerClick}
        >
          {t("Forgot Password?")}
        </p>
      </div>
      {open && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {t("Reset Password")}
            </h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary"
              />
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-200 text-gray-800  rounded-md hover:bg-primary-dark"
                >
                  {t("Send Reset Link")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Resetpasswordpopup;
