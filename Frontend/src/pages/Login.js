import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setMessage("Please enter both username and password.");
            return;
        }
        setMessage("");
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Redirect based on role
                if (data.role === "admin") {
                    navigate("/admin");
                } else if (data.role === "analyst") {
                    navigate("/analyst");
                } else if (data.role === "organization") {
                    navigate("/organization");
                } else {
                    setMessage("Unknown role");
                }
            } else {
                setMessage(data.detail || "Login failed");
            }
        } catch (error) {
            setMessage("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)"
        }}>
            <div style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "10px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                width: "100%",
                maxWidth: "350px"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="username" style={{ display: "block", marginBottom: ".5rem" }}>Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: ".5rem",
                                borderRadius: "5px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="password" style={{ display: "block", marginBottom: ".5rem" }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: ".5rem",
                                borderRadius: "5px",
                                border: "1px solid #ccc"
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: ".75rem",
                            borderRadius: "5px",
                            border: "none",
                            background: "#1976d2",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer"
                        }}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {message && (
                    <div style={{
                        marginTop: "1rem",
                        textAlign: "center",
                        color: message.includes("successful") ? "green" : "red"
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
