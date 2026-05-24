import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Typography,
  Button,
  Stack,
  TextField,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

// ── Full-page magnetic particle canvas ───────────────────────────────────
function MagneticCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-scatter home positions on resize
      particlesRef.current.forEach((p) => {
        p.ox = Math.random() * canvas.width;
        p.oy = Math.random() * canvas.height;
        if (!p.initialised) {
          p.x = p.ox;
          p.y = p.oy;
          p.initialised = true;
        }
      });
    };

    const N = 90;
    particlesRef.current = Array.from({ length: N }, () => {
      const ox = Math.random() * window.innerWidth;
      const oy = Math.random() * window.innerHeight;
      return {
        x: ox,
        y: oy,
        ox,
        oy,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 0.8,
        hue: Math.random() > 0.55 ? 220 : 255,
        initialised: true,
      };
    });

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const ps = particlesRef.current;

      ps.forEach((p) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 160;

        if (dist < radius && mx > 0) {
          const force = 1 - dist / radius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 2.5;
          p.vy += Math.sin(angle) * force * 2.5;
        }

        // Spring back to home
        p.vx += (p.ox - p.x) * 0.04;
        p.vy += (p.oy - p.y) * 0.04;

        // Damping
        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        // Distance from home — affects brightness
        const homeDist = Math.sqrt((p.x - p.ox) ** 2 + (p.y - p.oy) ** 2);
        const brightness = Math.min(1, 0.25 + homeDist / 60);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 68%, ${brightness})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            const alpha = (1 - d / 110) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(90, 130, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      // Cursor glow
      if (mx > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 130);
        grd.addColorStop(0, "rgba(79, 124, 255, 0.13)");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ── Typewriter cycling subtitle ───────────────────────────────────────────
function Typewriter({ phrases }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) {
      const t = setTimeout(() => {
        setPause(false);
        setDel(true);
      }, 1600);
      return () => clearTimeout(t);
    }
    const target = phrases[idx];
    if (!del) {
      if (text.length < target.length) {
        const t = setTimeout(
          () => setText(target.slice(0, text.length + 1)),
          65,
        );
        return () => clearTimeout(t);
      } else setPause(true);
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 38);
        return () => clearTimeout(t);
      } else {
        setDel(false);
        setIdx((i) => (i + 1) % phrases.length);
      }
    }
  }, [text, del, pause, idx, phrases]);

  return (
    <Box component="span" sx={{ color: "#7BA4FF" }}>
      {text}
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: "2px",
          height: "0.9em",
          background: "#7BA4FF",
          ml: "2px",
          verticalAlign: "text-bottom",
          animation: "blink 1s step-end infinite",
          "@keyframes blink": { "50%": { opacity: 0 } },
        }}
      />
    </Box>
  );
}

// ── Magnetic button ───────────────────────────────────────────────────────
function MagneticBtn({ children, disabled }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20 });
  const sy = useSpring(y, { stiffness: 220, damping: 20 });

  const onMove = useCallback(
    (e) => {
      if (disabled) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * 0.3);
      y.set((e.clientY - r.top - r.height / 2) * 0.3);
    },
    [disabled, x, y],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

// ── Success flash ─────────────────────────────────────────────────────────
function SuccessFlash({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8,14,30,0.7)",
            backdropFilter: "blur(12px)",
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
          >
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10B981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                boxShadow: "0 0 80px rgba(16,185,129,0.6)",
              }}
            >
              ✓
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Login ────────────────────────────────────────────────────────────
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(null);
  const [success, setSuccess] = useState(false);

  function login(values) {
    setLoading(true);
    axios({
      url: "http://localhost:5000/users/login",
      method: "POST",
      data: { email: values.email, password: values.password },
    })
      .then((res) => {
        if (res.data.user) {
          setSuccess(true);
          toast.success("Logged in!", {
            position: "bottom-right",
            autoClose: 1000,
            theme: "dark",
          });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setTimeout(() => {
            window.location.href = "/home";
          }, 1200);
        } else {
          setLoading(false);
          toast.error("Email or password is incorrect.", {
            position: "bottom-right",
            autoClose: 2000,
            theme: "dark",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Something went wrong.", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "dark",
        });
      });
  }

  const field = (color, isFocused) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      background: isFocused ? `${color}0D` : "rgba(255,255,255,0.03)",
      fontSize: "14px",
      transition: "all 0.25s ease",
      "& fieldset": {
        borderColor: isFocused ? color : "rgba(255,255,255,0.09)",
        transition: "all 0.25s",
      },
      "&:hover fieldset": { borderColor: `${color}88` },
      "&.Mui-focused fieldset": {
        borderColor: color,
        boxShadow: `0 0 0 3px ${color}22`,
      },
      "& input": { color: "#DDE6F0" },
      "& input::placeholder": { color: "#243045", opacity: 1 },
    },
  });

  const cardVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const row = {
    hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        background: "#080E1E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SuccessFlash show={success} />

      {/* Full-page magnetic canvas — sits behind everything */}
      <MagneticCanvas />

      {/* ── Site name — top center ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          zIndex: 2,
          textAlign: "center",
          paddingTop: "52px",
          paddingBottom: "8px",
        }}
      >
        {/* Logo mark */}

        <Typography
          sx={{
            fontFamily: '"Playfair Display", "Georgia", serif',
            fontWeight: 700,
            fontSize: { xs: "38px", sm: "52px", md: "64px" },
            lineHeight: 1,
            letterSpacing: "-0.03em",
            background:
              "linear-gradient(135deg, #ffffff 0%, #A5BFFF 45%, #8B5CF6 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1.5,
          }}
        >
          FindYourStuff
        </Typography>

        <Typography
          sx={{
            color: "#2A3A5A",
            fontSize: "14px",
            letterSpacing: "0.04em",
            fontWeight: 500,
            minHeight: "20px",
          }}
        >
          <Typewriter
            phrases={[
              "Find lost items.",
              "Help your community.",
              "Reunite people with what matters.",
            ]}
          />
        </Typography>
      </motion.div>

      {/* ── Glass card — login form ──────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        style={{
          zIndex: 2,
          width: "100%",
          maxWidth: 420,
          padding: "0 20px",
          marginTop: "36px",
          marginBottom: "48px",
        }}
      >
        <Box
          sx={{
            background: "rgba(10, 18, 40, 0.72)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "28px",
            px: { xs: 3, sm: 4 },
            py: 4.5,
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
            position: "relative",
            overflow: "hidden",
            // Subtle inner top glow
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(79,124,255,0.5), transparent)",
            },
          }}
        >
          <Stack gap={3.5}>
            {/* Heading */}
            <motion.div variants={row}>
              <Stack gap={0.6}>
                <Typography
                  sx={{
                    color: "#EFF4FF",
                    fontWeight: 700,
                    fontSize: { xs: "22px", sm: "26px" },
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  Welcome back 👋
                </Typography>
                <Typography
                  sx={{ color: "#4A5F80", fontSize: "14px", lineHeight: 1.6 }}
                >
                  Sign in to continue managing your listings.
                </Typography>
              </Stack>
            </motion.div>

            {/* Form */}
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={login}
            >
              {({ values, handleChange }) => (
                <Form style={{ width: "100%" }}>
                  <Stack gap={2.5}>
                    {/* Email */}
                    <motion.div variants={row}>
                      <Stack gap={0.7}>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: focused === "email" ? "#4F7CFF" : "#4A5F80",
                            transition: "color 0.2s",
                          }}
                        >
                          Email Address
                        </Typography>
                        <TextField
                          required
                          id="email"
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          size="small"
                          value={values.email}
                          onChange={handleChange}
                          disabled={loading}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon
                                  sx={{
                                    fontSize: "17px",
                                    color:
                                      focused === "email"
                                        ? "#4F7CFF"
                                        : "#253555",
                                    transition: "color 0.2s",
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={field("#4F7CFF", focused === "email")}
                        />
                      </Stack>
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={row}>
                      <Stack gap={0.7}>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color:
                              focused === "password" ? "#8B5CF6" : "#4A5F80",
                            transition: "color 0.2s",
                          }}
                        >
                          Password
                        </Typography>
                        <TextField
                          required
                          id="password"
                          name="password"
                          type={showPw ? "text" : "password"}
                          placeholder="Enter your password"
                          size="small"
                          value={values.password}
                          onChange={handleChange}
                          disabled={loading}
                          onFocus={() => setFocused("password")}
                          onBlur={() => setFocused(null)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon
                                  sx={{
                                    fontSize: "17px",
                                    color:
                                      focused === "password"
                                        ? "#8B5CF6"
                                        : "#253555",
                                    transition: "color 0.2s",
                                  }}
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPw(!showPw)}
                                  edge="end"
                                  size="small"
                                  sx={{
                                    color: "#253555",
                                    "&:hover": { color: "#8B5CF6" },
                                    transition: "color 0.2s",
                                  }}
                                >
                                  <motion.div
                                    key={showPw ? "vis" : "hid"}
                                    initial={{
                                      rotate: -90,
                                      opacity: 0,
                                      scale: 0.5,
                                    }}
                                    animate={{
                                      rotate: 0,
                                      opacity: 1,
                                      scale: 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {showPw ? (
                                      <VisibilityOffIcon
                                        sx={{ fontSize: "17px" }}
                                      />
                                    ) : (
                                      <VisibilityIcon
                                        sx={{ fontSize: "17px" }}
                                      />
                                    )}
                                  </motion.div>
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={field("#8B5CF6", focused === "password")}
                        />
                      </Stack>
                    </motion.div>

                    {/* Submit */}
                    <motion.div variants={row}>
                      <MagneticBtn disabled={loading}>
                        <motion.div whileTap={{ scale: 0.97 }}>
                          <Button
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            fullWidth
                            size="large"
                            sx={{
                              py: 1.6,
                              fontSize: "15px",
                              fontWeight: 700,
                              borderRadius: "14px",
                              letterSpacing: "0.01em",
                              background:
                                "linear-gradient(135deg, #4F7CFF 0%, #7B5FFF 100%)",
                              boxShadow:
                                "0 4px 28px rgba(79,124,255,0.5), 0 1px 0 rgba(255,255,255,0.15) inset",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #6089FF 0%, #8B6FFF 100%)",
                                boxShadow: "0 8px 36px rgba(79,124,255,0.65)",
                              },
                              "&:disabled": { opacity: 0.6 },
                              transition: "all 0.25s ease",
                              position: "relative",
                              overflow: "hidden",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: "-100%",
                                width: "60%",
                                height: "100%",
                                background:
                                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
                                animation: loading
                                  ? "none"
                                  : "shimmer 2.8s infinite",
                              },
                              "@keyframes shimmer": {
                                "0%": { left: "-100%" },
                                "100%": { left: "200%" },
                              },
                            }}
                            startIcon={
                              loading ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : null
                            }
                          >
                            {loading ? "Signing in..." : "Sign In →"}
                          </Button>
                        </motion.div>
                      </MagneticBtn>
                    </motion.div>
                  </Stack>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <motion.div variants={row}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, rgba(255,255,255,0.06))",
                  }}
                />
                <Typography
                  sx={{ color: "#4A5F80", fontSize: "12px", fontWeight: 600 }}
                >
                  New here?
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    background:
                      "linear-gradient(to left, transparent, rgba(255,255,255,0.06))",
                  }}
                />
              </Stack>
            </motion.div>

            {/* Sign up */}
            <motion.div variants={row}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/sign-up"
                  fullWidth
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.4,
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "14px",
                    borderColor: "rgba(255,255,255,0.07)",
                    color: "#334155",
                    "&:hover": {
                      borderColor: "rgba(79,124,255,0.4)",
                      color: "#7BA4FF",
                      background: "rgba(79,124,255,0.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Create a new account
                </Button>
              </motion.div>
            </motion.div>
          </Stack>
        </Box>
      </motion.div>

      {/* ── Tiny footer ─────────────────────────────────────────── */}
      <Box sx={{ position: "fixed", bottom: 20, zIndex: 2 }}>
        <Typography
          sx={{
            color: "#141E30",
            fontSize: "12px",
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          FindYourStuff · Reuniting people with what matters
        </Typography>
      </Box>
    </Box>
  );
}
