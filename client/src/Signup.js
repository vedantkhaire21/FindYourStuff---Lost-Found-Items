import React, { useState, useRef, useCallback, useEffect } from "react";
import { Formik, Form } from "formik";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { uploadImage } from "./cloudinary.js";
import {
  Typography,
  Button,
  Stack,
  TextField,
  Avatar,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// ── Full-page magnetic particle canvas (identical to Login) ───────────────
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
        p.vx += (p.ox - p.x) * 0.04;
        p.vy += (p.oy - p.y) * 0.04;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;
        const homeDist = Math.sqrt((p.x - p.ox) ** 2 + (p.y - p.oy) ** 2);
        const brightness = Math.min(1, 0.25 + homeDist / 60);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 68%, ${brightness})`;
        ctx.fill();
      });

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

// ── Typewriter cycling subtitle (identical to Login) ──────────────────────
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

// ── Magnetic button (same as Login's MagneticBtn) ────────────────────────
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

// ── Success flash (same as Login) ────────────────────────────────────────
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

// ── Password strength meter ───────────────────────────────────────────────
function PasswordStrength({ password }) {
  const score = !password
    ? 0
    : [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
        r.test(password),
      ).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  if (!password) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Stack gap={0.8}>
        <Stack direction="row" gap={0.5}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 2 }}
              animate={{
                background:
                  i <= score ? colors[score] : "rgba(255,255,255,0.08)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </Stack>
        <Typography
          sx={{ fontSize: "11px", color: colors[score], fontWeight: 600 }}
        >
          {labels[score]}
        </Typography>
      </Stack>
    </motion.div>
  );
}

// ── Main Signup ───────────────────────────────────────────────────────────
export default function Signup() {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [passwordVal, setPasswordVal] = useState("");
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const registerUser = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/create",
        payload,
      );
      if (response.data === "Done") {
        setSuccess(true);
        toast.success("Account created! Please log in.", {
          position: "bottom-right",
          autoClose: 1500,
          theme: "dark",
        });
        setTimeout(() => {
          window.location.href = "/log-in";
        }, 1600);
      } else {
        const msg =
          response.data?.msg || "Signup failed. Please check your details.";
        toast.error(msg, {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch {
      toast.error("Could not connect to server.", {
        position: "bottom-right",
        autoClose: 4000,
        theme: "dark",
      });
    }
  };

  async function handleSubmit(values) {
    const { nickname, fullname, email, password } = values;
    if (!nickname || !email || !password) {
      toast.error("Nickname, email and password are required.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    setSubmitting(true);
    try {
      let imgUrl = null;
      if (image) {
        imgUrl = await uploadImage(image, (pct) => setProgress(pct));
      }
      await registerUser({
        nickname,
        fullname,
        email,
        password,
        ...(imgUrl && { img: imgUrl }),
      });
    } catch {
      await registerUser({ nickname, fullname, email, password });
    } finally {
      setSubmitting(false);
    }
  }

  // Same field style factory as Login
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

  const COLORS = {
    nickname: "#4F7CFF",
    fullname: "#8B5CF6",
    email: "#10B981",
    password: "#F59E0B",
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
      <MagneticCanvas />

      {/* ── Site name — top center ────────────────────────────────── */}
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

      {/* ── Glass card — signup form ──────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        style={{
          zIndex: 2,
          width: "100%",
          maxWidth: 460,
          padding: "0 20px",
          marginTop: "28px",
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
          <Stack gap={3}>
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
                  Create your account ✨
                </Typography>
                <Typography
                  sx={{ color: "#4A5F80", fontSize: "14px", lineHeight: 1.6 }}
                >
                  Join the community helping people find their lost belongings.
                </Typography>
              </Stack>
            </motion.div>

            {/* Avatar upload */}
            <motion.div variants={row}>
              <Stack direction="row" alignItems="center" gap={2.5}>
                <Box
                  sx={{ position: "relative" }}
                  onMouseEnter={() => setAvatarHovered(true)}
                  onMouseLeave={() => setAvatarHovered(false)}
                >
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      border: "2px solid rgba(79,124,255,0.4)",
                    }}
                    animate={{
                      scale: avatarHovered ? [1, 1.08, 1] : [1, 1.05, 1],
                      opacity: avatarHovered ? [0.6, 1, 0.6] : [0.2, 0.5, 0.2],
                      boxShadow: avatarHovered
                        ? [
                            "0 0 0 0 rgba(79,124,255,0)",
                            "0 0 20px 4px rgba(79,124,255,0.3)",
                            "0 0 0 0 rgba(79,124,255,0)",
                          ]
                        : ["none"],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    animate={{ scale: avatarHovered ? 1.06 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar
                      src={imagePreview}
                      sx={{
                        width: 62,
                        height: 62,
                        border: "2px solid rgba(79,124,255,0.3)",
                        background: "rgba(79,124,255,0.08)",
                        fontSize: "26px",
                        boxShadow: imagePreview
                          ? "0 0 30px rgba(79,124,255,0.3)"
                          : "none",
                        transition: "box-shadow 0.3s",
                      }}
                    >
                      {!imagePreview && "👤"}
                    </Avatar>
                  </motion.div>
                  <Box
                    component="label"
                    htmlFor="avatar-upload"
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4F7CFF, #8B5CF6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "2px solid #080E1E",
                      boxShadow: "0 4px 12px rgba(79,124,255,0.5)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.2)",
                        boxShadow: "0 6px 20px rgba(79,124,255,0.7)",
                      },
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: "12px", color: "white" }} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </Box>
                </Box>
                <Stack gap={0.3}>
                  <Typography
                    sx={{ color: "#94A3B8", fontSize: "13px", fontWeight: 700 }}
                  >
                    {imagePreview ? "Photo selected ✓" : "Profile photo"}
                  </Typography>
                  <Typography sx={{ color: "#4A5F80", fontSize: "12px" }}>
                    Optional · click the camera icon to upload
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>

            {/* Form */}
            <Formik
              initialValues={{
                nickname: "",
                fullname: "",
                email: "",
                password: "",
              }}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange }) => (
                <Form style={{ width: "100%" }}>
                  <Stack gap={2.5}>
                    {/* Nickname + Full name row */}
                    <motion.div variants={row}>
                      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                        {[
                          {
                            name: "nickname",
                            label: "Nickname *",
                            placeholder: "e.g. jay99",
                            Icon: PersonIcon,
                            color: COLORS.nickname,
                          },
                          {
                            name: "fullname",
                            label: "Full Name",
                            placeholder: "e.g. Jay Mehta",
                            Icon: BadgeIcon,
                            color: COLORS.fullname,
                          },
                        ].map((f) => (
                          <Stack key={f.name} gap={0.7} flex={1}>
                            <Typography
                              sx={{
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: focused === f.name ? f.color : "#4A5F80",
                                transition: "color 0.2s",
                              }}
                            >
                              {f.label}
                            </Typography>
                            <TextField
                              type="text"
                              name={f.name}
                              placeholder={f.placeholder}
                              size="small"
                              required={f.name === "nickname"}
                              onChange={handleChange}
                              value={values[f.name]}
                              disabled={submitting}
                              onFocus={() => setFocused(f.name)}
                              onBlur={() => setFocused(null)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <f.Icon
                                      sx={{
                                        fontSize: "17px",
                                        color:
                                          focused === f.name
                                            ? f.color
                                            : "#253555",
                                        transition: "color 0.2s",
                                      }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              sx={field(f.color, focused === f.name)}
                            />
                          </Stack>
                        ))}
                      </Stack>
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={row}>
                      <Stack gap={0.7}>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color:
                              focused === "email" ? COLORS.email : "#4A5F80",
                            transition: "color 0.2s",
                          }}
                        >
                          Email Address *
                        </Typography>
                        <TextField
                          required
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          size="small"
                          onChange={handleChange}
                          value={values.email}
                          disabled={submitting}
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
                                        ? COLORS.email
                                        : "#253555",
                                    transition: "color 0.2s",
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={field(COLORS.email, focused === "email")}
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
                              focused === "password"
                                ? COLORS.password
                                : "#4A5F80",
                            transition: "color 0.2s",
                          }}
                        >
                          Password *
                        </Typography>
                        <TextField
                          required
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Minimum 6 characters"
                          size="small"
                          onChange={(e) => {
                            handleChange(e);
                            setPasswordVal(e.target.value);
                          }}
                          value={values.password}
                          disabled={submitting}
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
                                        ? COLORS.password
                                        : "#253555",
                                    transition: "color 0.2s",
                                  }}
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                  sx={{
                                    color: "#253555",
                                    "&:hover": { color: COLORS.password },
                                    transition: "color 0.2s",
                                  }}
                                >
                                  <motion.div
                                    key={showPassword ? "vis" : "hid"}
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
                                    {showPassword ? (
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
                          sx={field(COLORS.password, focused === "password")}
                        />
                        <PasswordStrength password={passwordVal} />
                      </Stack>
                    </motion.div>

                    {/* Upload progress */}
                    <AnimatePresence>
                      {submitting &&
                        image &&
                        progress > 0 &&
                        progress < 100 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Stack
                              gap={1}
                              sx={{
                                background: "rgba(79,124,255,0.06)",
                                border: "1px solid rgba(79,124,255,0.15)",
                                borderRadius: "12px",
                                p: 1.5,
                              }}
                            >
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography
                                  sx={{
                                    color: "#4F7CFF",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                  }}
                                >
                                  Uploading photo...
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#4F7CFF",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {progress}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  height: 4,
                                  borderRadius: 2,
                                  background: "rgba(79,124,255,0.15)",
                                  "& .MuiLinearProgress-bar": {
                                    background:
                                      "linear-gradient(90deg, #4F7CFF, #8B5CF6)",
                                    borderRadius: 2,
                                  },
                                }}
                              />
                            </Stack>
                          </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div variants={row}>
                      <MagneticBtn disabled={submitting}>
                        <motion.div whileTap={{ scale: 0.97 }}>
                          <Button
                            variant="contained"
                            type="submit"
                            disabled={submitting}
                            fullWidth
                            size="large"
                            sx={{
                              py: 1.6,
                              fontSize: "15px",
                              fontWeight: 700,
                              borderRadius: "14px",
                              letterSpacing: "0.01em",
                              background: submitting
                                ? "rgba(79,124,255,0.4)"
                                : "linear-gradient(135deg, #4F7CFF 0%, #7B5FFF 100%)",
                              boxShadow: submitting
                                ? "none"
                                : "0 4px 28px rgba(79,124,255,0.5), 0 1px 0 rgba(255,255,255,0.15) inset",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #6089FF 0%, #8B6FFF 100%)",
                                boxShadow: "0 8px 36px rgba(79,124,255,0.65)",
                              },
                              "&:disabled": { opacity: 1 },
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
                                animation: submitting
                                  ? "none"
                                  : "shimmer 2.8s infinite",
                              },
                              "@keyframes shimmer": {
                                "0%": { left: "-100%" },
                                "100%": { left: "200%" },
                              },
                            }}
                            startIcon={
                              submitting ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : null
                            }
                          >
                            {submitting
                              ? "Creating account..."
                              : "Create Account →"}
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
                  Already have an account?
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

            {/* Sign in link */}
            <motion.div variants={row}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/log-in"
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
                  Sign in to existing account
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
