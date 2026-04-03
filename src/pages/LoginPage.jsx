import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { saveAccessToken, saveRefreshToken } from "../utils/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({ username, password });

      const accessToken =
        res.data?.accessToken || res.data?.data?.accessToken;

      const refreshToken =
        res.data?.refreshToken || res.data?.data?.refreshToken;

      if (!accessToken) {
        setError("Không lấy được access token từ backend");
        console.log("Response backend:", res.data);
        return;
      }

      saveAccessToken(accessToken);

      if (refreshToken) {
        saveRefreshToken(refreshToken);
      }
      navigate("/projects");
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu");
      console.error("Lỗi login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "linear-gradient(135deg, #eff6ff 0%, #dbeafe 35%, #e0e7ff 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(37, 99, 235, 0.15)",
          border: "1px solid rgba(255,255,255,0.6)",
        }}
      >
        <div
          style={{
            padding: "56px 48px",
            background:
              "linear-gradient(160deg, #2563eb 0%, #1d4ed8 45%, #4338ca 100%)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(255,255,255,0.16)",
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              T
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 40,
                lineHeight: 1.2,
                fontWeight: 700,
              }}
            >
              TaskFlow
            </h1>

            <p
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.85)",
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 420,
              }}
            >
              Quản lý project, thành viên và task trong một nơi. Theo dõi tiến
              độ công việc rõ ràng, gọn gàng và dễ sử dụng cho cả team.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              marginTop: 36,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "14px 16px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                Quản lý project
              </div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 14 }}>
                Tạo, sửa, xóa project và quản lý thành viên nhanh chóng.
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "14px 16px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                Theo dõi task board
              </div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 14 }}>
                Kéo thả task, phân công thành viên và theo dõi tiến độ trực
                quan.
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "56px 44px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 30,
                  color: "#111827",
                  fontWeight: 700,
                }}
              >
                Đăng nhập
              </h2>
              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  color: "#6b7280",
                  fontSize: 15,
                }}
              >
                Chào mừng bạn quay lại. Hãy đăng nhập để tiếp tục sử dụng
                TaskFlow.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Nhập username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid #d1d5db",
                    outline: "none",
                    fontSize: 15,
                    boxSizing: "border-box",
                    background: "#f9fafb",
                  }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Password
                </label>

                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 44px 14px 16px",
                      borderRadius: 14,
                      border: "1px solid #d1d5db",
                      outline: "none",
                      fontSize: 15,
                      boxSizing: "border-box",
                      background: "#f9fafb",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#6b7280",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    marginBottom: 18,
                    background: "#fef2f2",
                    color: "#b91c1c",
                    border: "1px solid #fecaca",
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: "none",
                  background: loading
                    ? "#93c5fd"
                    : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.22)",
                }}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                fontSize: 13,
                color: "#9ca3af",
                textAlign: "center",
              }}
            >
              TaskFlow Dashboard • Project Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}