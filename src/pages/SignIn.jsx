import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { signin, loginWithGoogle } from "../auth/auth"; // Assuming you have a sign-in function in auth.js
import { useAuth } from "../Context/authContext"; // Assuming you have an Auth context
const SignIn = () => {
  const { userLoggedIn } = useAuth(); // Using the Auth context to get the current user
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        .catch((error) => {
          setIsSigningIn(false);
          setErrorMessage(error.message);
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
        .catch((error) => {
          setIsSigningIn(false);
          setErrorMessage(error.message);
        });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 -mt-7">
      {userLoggedIn && <Navigate to="/" replace={true} />}

      <h2 className="text-3xl font-bold text-center mt-10 text-gray-800">
        Sign In Page
      </h2>
      <form
        onSubmit={handleSignIn}
        className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg"
      >
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="text"
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
          Password
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
          {isSigningIn ? "Signing In..." : "Sign In"}
        </button>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gray-600 ">
            Sign up
          </Link>
        </p>
        <p className="mt-4 text-center text-gray-600">
          <Link to="/forgot-password" className="text-gray-800">
            Forgot Password?
          </Link>
        </p>
        <p
          onClick={(e) => {
            onGoogleSignin(e);
          }}
          className="mt-4 text-center text-gray-600"
        >
          sign in with Google
        </p>
      </form>
    </div>
  );
};

export default SignIn;
