import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { signin, loginWithGoogle } from "../auth/auth"; // Assuming you have a sign-in function in auth.js
import { useAuth } from "../Context/authContext"; // Assuming you have an Auth context
import { useTranslation } from "react-i18next";
import { doPasswordReset } from "../auth/auth";
import toast from "react-hot-toast";

const SignIn = () => {
  const { userLoggedIn } = useAuth(); // Using the Auth context to get the current user
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

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

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }
    doPasswordReset(email)
      .then(() => {
        setemail("");
        setpassword("");
        toast.success(
          <div className="flex gap-2 items-center justify-between">
            <div className="text-sm">
              Password reset email sent! Check your inbox
            </div>
            <button className="bg-pink-400 text-sm rounded-md px-1 py-1">
              done
            </button>
          </div>,
          { duration: 2500 }
        );
      })
      .catch((err) => {
        getAuthErrorMessage(err);
        // toast.error(getAuthErrorMessage(err));
        console.error("Error sending password reset email:", err);
      });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      signin(email, password)
        .then(() => {
          setIsSigningIn(false);
          setemail("");
          setpassword("");
        })
        .catch((err) => {
          getAuthErrorMessage(err);
          // toast.error(getAuthErrorMessage(err));
          setIsSigningIn(false);
        });
    }
  };
  const onGoogleSignin = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      loginWithGoogle()
        .then(() => {
          setIsSigningIn(false);
        })
        .catch((err) => {
          getAuthErrorMessage(err);
          // toast.error(getAuthErrorMessage(error));
        })
        .finally(() => {
          setIsSigningIn(false);
        });
    }
  };
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center  -mt-7  ">
      {userLoggedIn && <Navigate to="/" replace={true} />}

      <h2 className="text-3xl font-bold text-center mt-10 text-gray-800">
        {t("Sign In Page")}
      </h2>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <form onSubmit={handleSignIn} className=" ">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            {t("Email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            className="w-full p-2 border rounded mb-4"
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
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            className="w-full p-2 border rounded mb-4"
          />

          <button
            type="submit"
            disabled={isSigningIn}
            className={`w-full bg-pink-400 text-white font-bold py-2 px-4 rounded hover:bg-pink-500 mt-4 ${
              isSigningIn ? "opacity-50" : ""
            }`}
          >
            {isSigningIn ? t("Signing In...") : t("Sign In")}
          </button>
          <p className="mt-4 text-center text-gray-600">
            {t("Don't have an account?")}{" "}
            <Link to="/signup" className="text-gray-600 ">
              {t("Sign Up")}
            </Link>
          </p>
        </form>
        <p
          className="mt-4 text-center text-gray-600 cursor-pointer"
          onClick={handleResetPassword}
        >
          {t("Forgot Password?")}
        </p>
        <p
          onClick={(e) => {
            onGoogleSignin(e);
          }}
          className="mt-4 text-center text-gray-600 cursor-pointer"
        >
          {t("Sign In with Google")}
        </p>
      </div>
    </div>
  );
};

export default SignIn;
