import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPasswordReset, verifyConfirmPasswordReset } from "../auth/auth";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extract oobCode from URL
  const oobCode = searchParams.get("oobCode");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //Verify the code first
      await verifyPasswordReset(oobCode);

      //Confirm password reset
      await verifyConfirmPasswordReset(oobCode, newPassword);

      toast.success("Password updated successfully!");
      navigate("/signin");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!oobCode) {
    return (
      <div className="p-4 text-red-500">
        Invalid reset link. Please request a new password reset email.
      </div>
    );
  }

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
          className={`w-full bg-[color:var(--color-secondary)] text-white p-2 rounded ${
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
