import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { signup } from "../auth/auth";
import { useAuth } from "../Context/authContext"; // Assuming you have an Auth context
import { auth } from "../auth/firebse";

const SignUp = () => {
  const { userLoggedIn, addUserFirestore } = useAuth(); // Using the Auth context to get the current user

  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState(null);
  //   const [confirmPassword, setConfirmPassword] = useState("");
  //   const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      setError(null);
      try {
        await signup(email, password);
        await addUserFirestore(name, email, password, auth.currentUser.uid);
        setName("");
        setemail("");
        setpassword("");
      } catch (error) {
        setError(error.message);
      }
      setIsRegistering(false);
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
            htmlFor="name"
          >
            Name
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
            className="w-full bg-pink-400 text-white font-bold py-2 px-4 rounded hover:bg-pink-500 mt-4"
          >
            {isRegistering ? "Registering..." : "Sign Up"}
          </button>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-gray-800 ">
              Sign In
            </Link>
          </p>
          <p className="mt-4 text-center text-gray-600 cursor-pointer">
            Sign Up with Google
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
