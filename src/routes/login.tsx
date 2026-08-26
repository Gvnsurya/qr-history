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
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

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
          setMessage("Account created successfully! 🎉");

          setTimeout(() => {
            setIsSignup(false);
            setMessage("");
          }, 1500);
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setMessage(error.message || "Login failed");
        } else {
          setShowWelcome(true);

          setTimeout(() => {
            navigate({ to: "/" });
          }, 1800);
        }
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div style={welcomePageStyle}>
        <div style={welcomeGlow1}></div>
        <div style={welcomeGlow2}></div>

        <div style={welcomeCardStyle}>
          <div style={waveStyle}>👋</div>

          <h1
            style={{
              fontSize: "38px",
              marginBottom: "10px",
              color: "#ffffff",
            }}
          >
            Hi, Welcome!
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#dbeafe",
              marginBottom: "25px",
            }}
          >
            Great to see you again.
          </p>

          <div style={loadingBarContainer}>
            <div style={loadingBar}></div>
          </div>

          <p
            style={{
              color: "#bfdbfe",
              marginTop: "18px",
              fontSize: "14px",
            }}
          >
            Taking you to your QR Generator...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Background decorative circles */}
      <div style={circle1}></div>
      <div style={circle2}></div>
      <div style={circle3}></div>
      <div style={circle4}></div>

      {/* Floating QR decorations */}
      <div style={floatingEmoji1}>✨</div>
      <div style={floatingEmoji2}>🎨</div>
      <div style={floatingEmoji3}>🚀</div>

      <div style={cardStyle}>
        {/* Top icon */}
        <div style={iconContainer}>
          <div style={qrIcon}>▦</div>
        </div>

        <h1 style={titleStyle}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        <p style={subtitleStyle}>
          {isSignup
            ? "Create your account and save all your QR codes securely."
            : "Login to access your personal QR code history."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label style={labelStyle}>Your Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...buttonStyle,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading
              ? "Please wait..."
              : isSignup
                ? "Create My Account 🚀"
                : "Login to QR Generator →"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "18px",
              padding: "12px",
              borderRadius: "12px",
              textAlign: "center",
              background: message.includes("success")
                ? "#dcfce7"
                : "#fee2e2",
              color: message.includes("success")
                ? "#166534"
                : "#b91c1c",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <div style={divider}>
          <div style={dividerLine}></div>
          <span style={{ color: "#94a3b8", fontSize: "13px" }}>OR</span>
          <div style={dividerLine}></div>
        </div>

        <p style={switchTextStyle}>
          {isSignup ? "Already have an account?" : "New to QR Generator?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
            style={switchButtonStyle}
          >
            {isSignup ? "Login here" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* =========================
   PAGE STYLES
========================= */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative" as const,
  overflow: "hidden",
  padding: "30px",
  background:
    "linear-gradient(135deg, #312e81 0%, #4f46e5 35%, #7c3aed 70%, #ec4899 100%)",
};

const cardStyle = {
  width: "420px",
  maxWidth: "100%",
  padding: "38px",
  borderRadius: "28px",
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 25px 70px rgba(0,0,0,0.30)",
  position: "relative" as const,
  zIndex: 5,
  backdropFilter: "blur(20px)",
};

const iconContainer = {
  width: "76px",
  height: "76px",
  borderRadius: "22px",
  margin: "0 auto 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #4f46e5, #8b5cf6, #ec4899)",
  boxShadow: "0 12px 30px rgba(99,102,241,0.4)",
};

const qrIcon = {
  fontSize: "42px",
  color: "white",
  fontWeight: "bold",
};

const titleStyle = {
  textAlign: "center" as const,
  fontSize: "30px",
  color: "#111827",
  margin: "0 0 10px",
};

const subtitleStyle = {
  textAlign: "center" as const,
  color: "#64748b",
  fontSize: "15px",
  lineHeight: "1.6",
  marginBottom: "28px",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "18px",
  border: "1px solid #dbe1ea",
  borderRadius: "14px",
  fontSize: "15px",
  boxSizing: "border-box" as const,
  outline: "none",
  background: "#f8fafc",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  boxShadow: "0 10px 25px rgba(79,70,229,0.35)",
  transition: "all 0.3s ease",
};

const divider = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "25px 0 18px",
};

const dividerLine = {
  flex: 1,
  height: "1px",
  background: "#e2e8f0",
};

const switchTextStyle = {
  textAlign: "center" as const,
  color: "#64748b",
  fontSize: "14px",
};

const switchButtonStyle = {
  border: "none",
  background: "none",
  color: "#6d28d9",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

/* =========================
   BACKGROUND DECORATIONS
========================= */

const circle1 = {
  position: "absolute" as const,
  width: "380px",
  height: "380px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.12)",
  top: "-140px",
  left: "-100px",
};

const circle2 = {
  position: "absolute" as const,
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "rgba(236,72,153,0.25)",
  bottom: "-120px",
  right: "-80px",
};

const circle3 = {
  position: "absolute" as const,
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(59,130,246,0.25)",
  top: "20%",
  right: "10%",
};

const circle4 = {
  position: "absolute" as const,
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: "rgba(250,204,21,0.25)",
  bottom: "12%",
  left: "12%",
};

const floatingEmoji1 = {
  position: "absolute" as const,
  top: "15%",
  left: "18%",
  fontSize: "40px",
  zIndex: 2,
};

const floatingEmoji2 = {
  position: "absolute" as const,
  top: "30%",
  right: "18%",
  fontSize: "38px",
  zIndex: 2,
};

const floatingEmoji3 = {
  position: "absolute" as const,
  bottom: "16%",
  right: "20%",
  fontSize: "42px",
  zIndex: 2,
};

/* =========================
   WELCOME SCREEN
========================= */

const welcomePageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative" as const,
  overflow: "hidden",
  background:
    "linear-gradient(135deg, #0f172a 0%, #312e81 45%, #7c3aed 100%)",
};

const welcomeCardStyle = {
  position: "relative" as const,
  zIndex: 5,
  textAlign: "center" as const,
  padding: "55px 70px",
  borderRadius: "35px",
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
};

const waveStyle = {
  fontSize: "100px",
  marginBottom: "15px",
  animation: "wave 1s infinite",
};

const welcomeGlow1 = {
  position: "absolute" as const,
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "rgba(236,72,153,0.25)",
  filter: "blur(80px)",
  top: "-100px",
  left: "-100px",
};

const welcomeGlow2 = {
  position: "absolute" as const,
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "rgba(59,130,246,0.25)",
  filter: "blur(80px)",
  bottom: "-100px",
  right: "-100px",
};

const loadingBarContainer = {
  width: "100%",
  height: "7px",
  background: "rgba(255,255,255,0.2)",
  borderRadius: "20px",
  overflow: "hidden",
};

const loadingBar = {
  width: "100%",
  height: "100%",
  background: "linear-gradient(90deg, #60a5fa, #c084fc, #f472b6)",
  borderRadius: "20px",
};