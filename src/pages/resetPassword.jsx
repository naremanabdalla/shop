import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPasswordReset, confirmPasswordReset } from "../auth/auth";
import toast from "react-hot-toast";
import { getAuth, verifyPasswordResetCode } from "firebase/auth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(null);

  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Extract oobCode from URL
  // Extract oobCode from URL parameters
  const oobCode = new URLSearchParams(window.location.search).get("oobCode");

  // Verify the code when component mounts
  useEffect(() => {
    if (!oobCode) {
      console.error("No oobCode found in URL");
      navigate("/signin");
      return;
    }

    verifyPasswordResetCode(getAuth(), oobCode)
      .then((email) => {
        setVerifiedEmail(email);
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        navigate("/login", {
          state: { error: "Invalid or expired reset link" },
        });
      });
  }, [oobCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(getAuth(), oobCode, newPassword);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (!verifiedEmail) return <div>Verifying reset link...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full p-2 mb-4 border rounded"
          minLength={6}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-pink-500 text-white p-2 rounded ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
