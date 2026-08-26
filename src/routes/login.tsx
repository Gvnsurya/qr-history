import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("Please wait...");
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (error) {
          setMessage(error.message || "Signup failed");
        } else {
          setMessage("Account created successfully! Please login.");

          setIsSignup(false);
          setPassword("");
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setMessage(error.message || "Login failed");
        } else {
          setMessage("Login successful!");

          setTimeout(() => {
            navigate({ to: "/" });
          }, 500);
        }
      }
    } catch (error) {
      console.error(error);

      setMessage(
        isSignup ? "Signup failed. Please try again." : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "32px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        <p style={{ textAlign: "center", color: "#666" }}>
          {isSignup
            ? "Create an account to save your QR history"
            : "Login to access your QR history"}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "10px",
              background: "#111827",
              color: "white",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Sign Up"
                : "Login"}
          </button>
        </form>

        {message && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>
            {message}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
              setPassword("");
            }}
            style={{
              border: "none",
              background: "none",
              color: "#4f46e5",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  boxSizing: "border-box" as const,
};