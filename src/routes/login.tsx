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

  // Switch between Login and Signup
  const switchMode = () => {
    setIsSignup(!isSignup);

    // Clear all previous form data
    setEmail("");
    setPassword("");
    setName("");
    setMessage("");
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
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
          setMessage("Account created successfully!");

          // Clear signup form
          setEmail("");
          setPassword("");
          setName("");

          // Redirect to QR Generator
          setTimeout(() => {
            navigate({ to: "/" });
          }, 800);
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setMessage(error.message || "Login failed");
        } else {
          setMessage("Login successful! 👋");

          // Clear sensitive data
          setPassword("");

          // Redirect to QR Generator
          setTimeout(() => {
            navigate({ to: "/" });
          }, 800);
        }
      }
    } catch (error) {
      console.error(error);

      setMessage(
        isSignup
          ? "Something went wrong while creating your account."
          : "Something went wrong while logging in."
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
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #312e81 0%, #7c3aed 50%, #db2777 100%)",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
          top: "-160px",
          left: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "rgba(79,70,229,0.45)",
          top: "160px",
          right: "10%",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(236,72,153,0.25)",
          bottom: "-150px",
          right: "-50px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "130px",
          height: "130px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          bottom: "80px",
          left: "12%",
        }}
      />

      {/* Decorative emojis */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "19%",
          fontSize: "45px",
        }}
      >
        ✨
      </div>

      <div
        style={{
          position: "absolute",
          top: "38%",
          right: "16%",
          fontSize: "42px",
        }}
      >
        🎨
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "14%",
          right: "19%",
          fontSize: "48px",
        }}
      >
        🚀
      </div>

      {/* Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "42px",
          background: "rgba(255,255,255,0.94)",
          borderRadius: "28px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.28)",
          position: "relative",
          zIndex: 2,
          boxSizing: "border-box",
        }}
      >
        {/* QR Icon */}
        <div
          style={{
            width: "82px",
            height: "82px",
            margin: "0 auto 25px",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "40px",
            boxShadow: "0 12px 25px rgba(124,58,237,0.35)",
          }}
        >
          ▦
        </div>

        <h1
          style={{
            textAlign: "center",
            margin: "0 0 12px",
            color: "#1f2937",
            fontSize: "34px",
          }}
        >
          {isSignup ? "Create Account" : "Welcome Back 👋"}
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          {isSignup
            ? "Create your account and save all your QR codes securely."
            : "Login to access your personal QR code history."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label style={labelStyle}>Your Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </>
          )}

          <label style={labelStyle}>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
              boxShadow: "0 10px 22px rgba(124,58,237,0.28)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create My Account 🚀"
                : "Login to QR Generator →"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "18px",
              color: message.toLowerCase().includes("successful")
                ? "#16a34a"
                : "#dc2626",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "28px 0",
          }}
        >
          <div
            style={{
              height: "1px",
              background: "#e2e8f0",
              flex: 1,
            }}
          />

          <span
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            OR
          </span>

          <div
            style={{
              height: "1px",
              background: "#e2e8f0",
              flex: 1,
            }}
          />
        </div>

        {/* Switch Login / Signup */}
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            margin: 0,
          }}
        >
          {isSignup
            ? "Already have an account?"
            : "New to QR Generator?"}{" "}

          <button
            type="button"
            onClick={switchMode}
            style={{
              border: "none",
              background: "none",
              color: "#5b21b6",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
              padding: 0,
            }}
          >
            {isSignup ? "Login here" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#475569",
  fontWeight: "600",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "20px",
  border: "1px solid #cbd5e1",
  borderRadius: "14px",
  boxSizing: "border-box" as const,
  fontSize: "16px",
  outline: "none",
  background: "#f8fafc",
};