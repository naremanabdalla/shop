import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { signup } from "../auth/auth";
import { useAuth } from "../Context/authContext"; // Assuming you have an Auth context

const SignUp = () => {
  const { userLoggedIn } = useAuth(); // Using the Auth context to get the current user

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  //   const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      await signup(email, password);
      setemail("");
      setpassword("");
    }
  };
  return (
    <>
      {userLoggedIn && <Navigate to="/" replace={true} />}
      <div className="flex flex-col items-center justify-center  bg-gray-100 -mt-7">
        <h2 className="text-3xl font-bold text-center mt-10 text-gray-800">
          Sign Up Page
        </h2>
        <form className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
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
            Password
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
            className="w-full bg-pink-400 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mt-4"
          >
            Sign Up
          </button>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-gray-800 ">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
