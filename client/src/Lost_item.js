import PhotoCamera from "@mui/icons-material/PhotoCamera";
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar.js";
import {
  Button,
  Typography,
  Stack,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import { uploadImage } from "./cloudinary.js";

// ── Shared category list (keep in sync with Home.js and LostItems.js) ──
const CATEGORIES = [
  { icon: "📱", label: "Electronics", color: "#4F7CFF" },
  { icon: "👜", label: "Bags & Wallets", color: "#8B5CF6" },
  { icon: "🔑", label: "Keys", color: "#10B981" },
  { icon: "💍", label: "Jewelry", color: "#F59E0B" },
  { icon: "📄", label: "Documents", color: "#EF4444" },
  { icon: "🪪", label: "Personal", color: "#06B6D4" },
];

const LostItem = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const usertoken = window.localStorage.getItem("token");
  const getUserId = () => {
    try {
      const user = JSON.parse(window.localStorage.getItem("user"));
      return user ? user._id : null;
    } catch {
      return null;
    }
  };

  const [values, setValues] = useState({
    name: "",
    description: "",
    type: "",
    category: "", // ← new field
    location: "",
    date: "",
    number: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const processFiles = (files) => {
    if (files && files.length > 0) {
      setImage(files);
      setImageFileName(
        Array.from(files)
          .map((f) => f.name)
          .join(", "),
      );
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleImageUpload = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "Required";
    if (!values.description.trim()) newErrors.description = "Required";
    if (!values.type) newErrors.type = "Required";
    if (!values.category) newErrors.category = "Required"; // ← validate category
    if (!values.location.trim()) newErrors.location = "Required";
    if (!values.date.trim()) newErrors.date = "Required";
    if (!values.number.trim()) newErrors.number = "Required";
    return newErrors;
  };

  const uploadImages = async (files) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i], (pct) => setProgress(pct));
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }
    const userId = getUserId();
    if (!userId || !usertoken) {
      toast.error("You must be logged in to post an item", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
      window.location.href = "/log-in";
      return;
    }
    setLoading(true);
    try {
      let imgUrls = [];
      if (image && image.length > 0) {
        try {
          imgUrls = await uploadImages(image);
        } catch (uploadErr) {
          console.error("Firebase error:", uploadErr.code, uploadErr.message);
          imgUrls = [];
        }
      }
      const payload = { ...values, userId, img: imgUrls };
      const response = await axios.post(
        "http://localhost:5000/Items/newItem",
        payload,
        { headers: { token: usertoken } },
      );
      if (response.data.ok) {
        toast.success("Item listed successfully! 🎉", {
          position: "bottom-right",
          autoClose: 1500,
          theme: "dark",
        });
        setTimeout(() => {
          window.location.href = "/mylistings";
        }, 1600);
      } else {
        throw new Error(response.data.msg || "Server returned ok: false");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.msg || error?.message || "Something went wrong.";
      toast.error(`Error: ${msg}`, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const typeColor =
    values.type === "Lost"
      ? "#EF4444"
      : values.type === "Found"
        ? "#10B981"
        : "#4F7CFF";
  const typeEmoji =
    values.type === "Lost" ? "😟" : values.type === "Found" ? "🎉" : "📋";

  const selectedCatMeta = CATEGORIES.find((c) => c.label === values.category);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      background: "rgba(255,255,255,0.03)",
      borderRadius: "12px",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: "rgba(79,124,255,0.4)" },
      "&.Mui-focused fieldset": {
        borderColor: "#4F7CFF",
        boxShadow: "0 0 0 3px rgba(79,124,255,0.12)",
      },
    },
    "& .MuiInputLabel-root": { color: "#64748B" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#4F7CFF" },
    "& .MuiOutlinedInput-input": { color: "#F1F5F9" },
    "& .MuiFormHelperText-root": { color: "#EF4444", fontSize: "11px" },
  };

  const selectSx = {
    ...inputSx,
    "& .MuiSelect-icon": { color: "#64748B" },
    "& .MuiSelect-select": { color: "#F1F5F9" },
  };

  return (
    <Box sx={{ background: "#0B1020", minHeight: "100vh" }}>
      <Navbar />

      {/* Page header */}
      <Box
        sx={{
          pt: { xs: "80px", md: "90px" },
          pb: "40px",
          px: { xs: 3, md: 6 },
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background:
            "linear-gradient(180deg, rgba(79,124,255,0.06) 0%, transparent 100%)",
        }}
      >
        <Stack maxWidth="1100px" mx="auto" gap={1}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4F7CFF",
                boxShadow: "0 0 10px #4F7CFF",
              }}
            />
            <Typography
              sx={{
                color: "#4F7CFF",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              New Listing
            </Typography>
          </Stack>
          <Typography
            sx={{
              color: "#F1F5F9",
              fontSize: { xs: "26px", md: "34px" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Post a Lost or Found Item
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "15px" }}>
            Help reunite belongings with their owners — fill in the details
            below
          </Typography>
        </Stack>
      </Box>

      {/* Main layout */}
      <Stack
        direction={{ xs: "column", lg: "row" }}
        maxWidth="1100px"
        mx="auto"
        px={{ xs: 2, md: 4 }}
        py={{ xs: 4, md: 6 }}
        gap={5}
        alignItems="flex-start"
      >
        {/* ── FORM ── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          sx={{
            flex: 1,
            background: "rgba(17,24,39,0.7)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "24px",
            p: { xs: 3, md: 4 },
            backdropFilter: "blur(12px)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap={3.5}>
              {/* Type selector */}
              <Stack gap={1.5}>
                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  What are you posting?
                </Typography>
                <Stack direction="row" gap={2}>
                  {["Lost", "Found"].map((t) => (
                    <motion.div
                      key={t}
                      whileTap={{ scale: 0.96 }}
                      style={{ flex: 1 }}
                    >
                      <Box
                        onClick={() => {
                          setValues((p) => ({ ...p, type: t }));
                          if (errors.type)
                            setErrors((p) => ({ ...p, type: "" }));
                        }}
                        sx={{
                          cursor: "pointer",
                          border:
                            values.type === t
                              ? `2px solid ${t === "Lost" ? "#EF4444" : "#10B981"}`
                              : "2px solid rgba(255,255,255,0.08)",
                          borderRadius: "16px",
                          p: 2.5,
                          textAlign: "center",
                          background:
                            values.type === t
                              ? t === "Lost"
                                ? "rgba(239,68,68,0.08)"
                                : "rgba(16,185,129,0.08)"
                              : "rgba(255,255,255,0.02)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background:
                              t === "Lost"
                                ? "rgba(239,68,68,0.06)"
                                : "rgba(16,185,129,0.06)",
                          },
                        }}
                      >
                        <Typography fontSize="28px">
                          {t === "Lost" ? "😟" : "🎉"}
                        </Typography>
                        <Typography
                          sx={{
                            color:
                              values.type === t
                                ? t === "Lost"
                                  ? "#EF4444"
                                  : "#10B981"
                                : "#64748B",
                            fontWeight: 700,
                            fontSize: "14px",
                            mt: 0.5,
                          }}
                        >
                          I {t} Something
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
                {errors.type && (
                  <Typography sx={{ color: "#EF4444", fontSize: "12px" }}>
                    {errors.type}
                  </Typography>
                )}
              </Stack>

              {/* ── CATEGORY selector ── */}
              <Stack gap={1.5}>
                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Category
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.2}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = values.category === cat.label;
                    return (
                      <motion.div key={cat.label} whileTap={{ scale: 0.94 }}>
                        <Box
                          onClick={() => {
                            setValues((p) => ({ ...p, category: cat.label }));
                            if (errors.category)
                              setErrors((p) => ({ ...p, category: "" }));
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            px: 1.8,
                            py: 0.9,
                            borderRadius: "50px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: isSelected ? 700 : 500,
                            background: isSelected
                              ? `${cat.color}18`
                              : "rgba(255,255,255,0.03)",
                            border: isSelected
                              ? `1.5px solid ${cat.color}55`
                              : "1.5px solid rgba(255,255,255,0.08)",
                            color: isSelected ? cat.color : "#64748B",
                            transition: "all 0.2s ease",
                            boxShadow: isSelected
                              ? `0 0 14px ${cat.color}20`
                              : "none",
                            "&:hover": {
                              background: `${cat.color}12`,
                              border: `1.5px solid ${cat.color}40`,
                              color: cat.color,
                            },
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </Box>
                      </motion.div>
                    );
                  })}
                </Stack>
                {errors.category && (
                  <Typography sx={{ color: "#EF4444", fontSize: "12px" }}>
                    {errors.category}
                  </Typography>
                )}
              </Stack>

              {/* Image upload */}
              <Stack gap={1.5}>
                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Photo{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: "#475569",
                      fontSize: "11px",
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    — optional
                  </Typography>
                </Typography>
                <Box
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  sx={{
                    border: dragOver
                      ? "2px dashed #4F7CFF"
                      : imagePreview
                        ? "2px solid rgba(79,124,255,0.3)"
                        : "2px dashed rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    height: imagePreview ? "auto" : "130px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: dragOver
                      ? "rgba(79,124,255,0.06)"
                      : imagePreview
                        ? "transparent"
                        : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    overflow: "hidden",
                    position: "relative",
                  }}
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <AnimatePresence mode="wait">
                    {imagePreview ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ width: "100%", position: "relative" }}
                      >
                        <Box
                          component="img"
                          src={imagePreview}
                          sx={{
                            width: "100%",
                            maxHeight: "220px",
                            objectFit: "cover",
                            borderRadius: "14px",
                            display: "block",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            background: "rgba(0,0,0,0.6)",
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.5,
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <Typography
                            sx={{ color: "#94A3B8", fontSize: "11px" }}
                          >
                            Click to change
                          </Typography>
                        </Box>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Stack alignItems="center" gap={1}>
                          <PhotoCamera
                            sx={{ color: "#334155", fontSize: "32px" }}
                          />
                          <Typography
                            sx={{ color: "#475569", fontSize: "13px" }}
                          >
                            Drag & drop or click to upload
                          </Typography>
                          <Typography
                            sx={{ color: "#334155", fontSize: "11px" }}
                          >
                            PNG, JPG up to 10MB
                          </Typography>
                        </Stack>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
                {loading && progress > 0 && progress < 100 && (
                  <Stack gap={0.5}>
                    <Box
                      sx={{
                        height: "4px",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${progress}%`,
                          background:
                            "linear-gradient(90deg, #4F7CFF, #8B5CF6)",
                          borderRadius: "4px",
                          transition: "width 0.3s",
                        }}
                      />
                    </Box>
                    <Typography sx={{ color: "#64748B", fontSize: "11px" }}>
                      {progress}% uploaded
                    </Typography>
                  </Stack>
                )}
              </Stack>

              {/* Item name + location row */}
              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <TextField
                  required
                  name="name"
                  label="Item name"
                  size="small"
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={loading}
                  sx={inputSx}
                />
                <TextField
                  required
                  name="location"
                  label="Location"
                  size="small"
                  fullWidth
                  value={values.location}
                  onChange={handleChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  disabled={loading}
                  sx={inputSx}
                />
              </Stack>

              {/* Description */}
              <TextField
                required
                name="description"
                label="Description"
                multiline
                rows={3}
                size="small"
                fullWidth
                value={values.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                disabled={loading}
                sx={inputSx}
                placeholder="Describe the item — colour, brand, distinguishing features..."
              />

              {/* Date + phone row */}
              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <TextField
                  required
                  name="date"
                  label="Date"
                  size="small"
                  fullWidth
                  value={values.date}
                  onChange={handleChange}
                  error={!!errors.date}
                  helperText={errors.date}
                  disabled={loading}
                  sx={inputSx}
                  placeholder="e.g. 23 May 2026"
                />
                <TextField
                  required
                  name="number"
                  label="Contact number"
                  size="small"
                  fullWidth
                  value={values.number}
                  onChange={handleChange}
                  error={!!errors.number}
                  helperText={errors.number}
                  disabled={loading}
                  sx={inputSx}
                />
              </Stack>

              {/* Submit */}
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    fontSize: "15px",
                    fontWeight: 700,
                    borderRadius: "14px",
                    background:
                      values.type === "Lost"
                        ? "linear-gradient(135deg, #EF4444, #DC2626)"
                        : values.type === "Found"
                          ? "linear-gradient(135deg, #10B981, #059669)"
                          : "linear-gradient(135deg, #4F7CFF, #6B5FFF)",
                    color: "white",
                    boxShadow:
                      values.type === "Lost"
                        ? "0 4px 20px rgba(239,68,68,0.3)"
                        : values.type === "Found"
                          ? "0 4px 20px rgba(16,185,129,0.3)"
                          : "0 4px 20px rgba(79,124,255,0.3)",
                    textTransform: "none",
                    letterSpacing: "0.01em",
                    "&:hover": { opacity: 0.92, transform: "translateY(-1px)" },
                    "&:disabled": { opacity: 0.6 },
                    transition: "all 0.2s ease",
                  }}
                  startIcon={
                    loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : null
                  }
                >
                  {loading
                    ? "Posting..."
                    : `${typeEmoji} Post ${values.type || "Item"}`}
                </Button>
              </motion.div>
            </Stack>
          </form>
        </Box>

        {/* ── LIVE PREVIEW PANEL ── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          sx={{ width: { xs: "100%", lg: "340px" }, flexShrink: 0 }}
        >
          <Stack gap={3}>
            {/* Live card preview */}
            <Stack gap={2}>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Live Preview
              </Typography>
              <motion.div layout>
                <Stack
                  sx={{
                    background: "rgba(17,24,39,0.8)",
                    border: `1px solid ${values.type ? typeColor + "30" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: values.type
                      ? `0 8px 32px ${typeColor}12`
                      : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Card image */}
                  <Box
                    sx={{
                      height: "160px",
                      background: imagePreview
                        ? `url(${imagePreview}) center/cover`
                        : `linear-gradient(135deg, ${typeColor}15 0%, rgba(17,24,39,0.8) 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      transition: "background 0.3s",
                    }}
                  >
                    {!imagePreview && (
                      <Typography sx={{ fontSize: "48px", opacity: 0.4 }}>
                        {selectedCatMeta
                          ? selectedCatMeta.icon
                          : values.type === "Lost"
                            ? "😟"
                            : values.type === "Found"
                              ? "🎉"
                              : "📦"}
                      </Typography>
                    )}
                    {values.type && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: `${typeColor}20`,
                          border: `1px solid ${typeColor}40`,
                          borderRadius: "8px",
                          px: 1.2,
                          py: 0.4,
                        }}
                      >
                        <Typography
                          sx={{
                            color: typeColor,
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {values.type === "Lost" ? "😟 LOST" : "🎉 FOUND"}
                        </Typography>
                      </Box>
                    )}
                    {/* Category badge on preview */}
                    {selectedCatMeta && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          left: 12,
                          background: `${selectedCatMeta.color}22`,
                          border: `1px solid ${selectedCatMeta.color}55`,
                          borderRadius: "8px",
                          px: 1.2,
                          py: 0.4,
                        }}
                      >
                        <Typography
                          sx={{
                            color: selectedCatMeta.color,
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          {selectedCatMeta.icon} {selectedCatMeta.label}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Card content */}
                  <Stack p={2.5} gap={1.2}>
                    <Typography
                      sx={{
                        color: values.name ? "#F1F5F9" : "#334155",
                        fontSize: "17px",
                        fontWeight: 700,
                      }}
                    >
                      {values.name || "Item name"}
                    </Typography>
                    <Typography
                      sx={{
                        color: values.description ? "#64748B" : "#1E293B",
                        fontSize: "13px",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {values.description || "Description will appear here..."}
                    </Typography>
                    <Stack gap={0.6}>
                      {(values.location || true) && (
                        <Typography
                          sx={{
                            color: values.location ? "#94A3B8" : "#1E293B",
                            fontSize: "12px",
                          }}
                        >
                          📍 {values.location || "Location"}
                        </Typography>
                      )}
                      {(values.date || true) && (
                        <Typography
                          sx={{
                            color: values.date ? "#94A3B8" : "#1E293B",
                            fontSize: "12px",
                          }}
                        >
                          📅 {values.date || "Date"}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </motion.div>
            </Stack>

            {/* Tips */}
            <Stack
              sx={{
                background: "rgba(79,124,255,0.05)",
                border: "1px solid rgba(79,124,255,0.12)",
                borderRadius: "16px",
                p: 2.5,
              }}
              gap={1.5}
            >
              <Typography
                sx={{
                  color: "#4F7CFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                💡 Tips for better results
              </Typography>
              {[
                "Add a clear photo — posts with images get 3× more responses",
                "Be specific about location (building, floor, room)",
                "Mention unique features like colour, brand, or damage",
              ].map((tip, i) => (
                <Stack key={i} direction="row" gap={1} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#4F7CFF",
                      mt: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{ color: "#64748B", fontSize: "12px", lineHeight: 1.6 }}
                  >
                    {tip}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LostItem;
