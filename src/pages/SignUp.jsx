import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { signup } from "../auth/auth";
import { useAuth } from "../Context/authContext"; // Assuming you have an Auth context
import { auth } from "../auth/firebse";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const SignUp = () => {
  const { userLoggedIn, addUserFirestore } = useAuth(); // Using the Auth context to get the current user

  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  //   const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const getAuthErrorMessage = (error) => {
    const errorMap = {
      "auth/missing-password": "Please enter your password",
      "auth/missing-email": "Please enter your email address",
      "auth/invalid-email": "Please enter a valid email address",
      "auth/invalid-credential": "Invalid email or password",
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/too-many-requests": "Too many attempts. Please try again later",
      "auth/user-disabled": "This account has been disabled",
      "auth/network-request-failed":
        "Network error. Please check your connection",
      "auth/email-already-in-use": "This email is already registered",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/operation-not-allowed": "This operation is not allowed",
    };

    toast.error(errorMap[error.code]);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await signup(email, password);
        await addUserFirestore(name, email, password, auth.currentUser.uid);
        setName("");
        setemail("");
        setpassword("");
      } catch (error) {
        getAuthErrorMessage(error);
      }
      setIsRegistering(false);
    }
  };
  const { t } = useTranslation();
  return (
    <>
      {userLoggedIn && <Navigate to="/" replace={true} />}
      <div className="flex flex-col items-center justify-center -mt-7">
        <h2 className="text-3xl font-bold text-center mt-10 text-gray-800">
          {t("Sign Up Page")}
        </h2>
        <form className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            {t("Full Name")}
          </label>
          <input
            type="text"
            value={name}
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            {t("Email")}
          </label>
          <input
            type="text"
            value={email}
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            {t("Password")}
          </label>
          <input
            type="password"
            value={password}
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />

          <button
            onClick={(e) => {
              handleSignUp(e);
            }}
            className="w-full bg-[color:var(--color-secondary)] text-white font-bold py-2 px-4 rounded hover:bg-[color:var(--color-primary)] mt-4"
          >
            {isRegistering ? t("Registering...") : t("Sign Up")}
          </button>

          <p className="mt-4 text-center text-gray-600">
            {t("Already have an account?")}{" "}
            <Link to="/signin" className="text-gray-800 ">
              {t("Sign In")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
