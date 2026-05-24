import React, { useEffect } from "react";
import { Stack, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
  const isLoggedIn = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Space+Grotesk:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleButtonClick = () => {
    window.location.href = isLoggedIn ? "/postitem" : "/log-in";
  };
  const handleButtonClickLost = () => {
    window.location.href = isLoggedIn ? "/lostitems" : "/log-in";
  };
  const handleButtonClickFound = () => {
    window.location.href = isLoggedIn ? "/founditems" : "/log-in";
  };

  // Navigate to lost items filtered by category
  const handleCategoryClick = (categoryLabel) => {
    if (!isLoggedIn) {
      window.location.href = "/log-in";
      return;
    }
    navigate(`/lostitems?category=${encodeURIComponent(categoryLabel)}`);
  };

  const categories = [
    { icon: "📱", label: "Electronics", color: "#4F7CFF" },
    { icon: "👜", label: "Bags & Wallets", color: "#8B5CF6" },
    { icon: "🔑", label: "Keys", color: "#10B981" },
    { icon: "💍", label: "Jewelry", color: "#F59E0B" },
    { icon: "📄", label: "Documents", color: "#EF4444" },
    { icon: "🪪", label: "Personal", color: "#06B6D4" },
  ];

  return (
    <Stack
      width="100%"
      gap={0}
      alignItems="center"
      sx={{ background: "#0B1020", minHeight: "100vh" }}
    >
      <Navbar />
      {/* ── HERO ── */}
      <Stack
        width="100%"
        alignItems="center"
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: "60px", md: "80px" },
          pb: { xs: "60px", md: "100px" },
        }}
      >
        {/* Background glow blobs */}
        <Box
          sx={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(79,124,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "0",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Stack
          direction={{ xs: "column", md: "row" }}
          maxWidth="1200px"
          width="100%"
          px={{ xs: 3, md: 6 }}
          alignItems="center"
          gap={{ xs: 5, md: 8 }}
          position="relative"
          zIndex={1}
        >
          <Stack gap={3.5} width={{ xs: "100%", md: "55%" }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                sx={{
                  display: "inline-flex",
                  background: "rgba(79,124,255,0.1)",
                  border: "1px solid rgba(79,124,255,0.25)",
                  borderRadius: "50px",
                  px: 2,
                  py: 0.6,
                  width: "fit-content",
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#4F7CFF",
                    boxShadow: "0 0 8px #4F7CFF",
                    animation: "pulse 2s infinite",
                  }}
                />
                <Typography
                  sx={{ color: "#4F7CFF", fontSize: "13px", fontWeight: 600 }}
                >
                  Project By Vedant & Jay
                </Typography>
              </Stack>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", md: "4.2rem" },
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontFamily: "'Syne', sans-serif",
                  color: "#F1F5F9",
                }}
              >
                Find
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(135deg, #4F7CFF 20%, #8B5CF6 60%, #06B6D4 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                    position: "relative",
                    ml: "0.12em",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      right: 0,
                      height: "3px",
                      borderRadius: "2px",
                      background:
                        "linear-gradient(90deg, #4F7CFF, #8B5CF6, #06B6D4)",
                      opacity: 0.6,
                    },
                  }}
                >
                  YourStuff
                </Box>
              </Typography>
            </motion.div>
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "15px" },
                fontWeight: 500,
                mt: 1.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "linear-gradient(90deg, #4F7CFF, #8B5CF6, #10B981)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ✦ Reunite with what matters ✦
            </Typography>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: { xs: "16px", md: "18px" },
                  lineHeight: 1.7,
                  maxWidth: "500px",
                }}
              >
                The smartest way to recover lost belongings. Post your lost item
                or help someone find theirs — our DBATU community makes it
                happen.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={handleButtonClick}
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "16px",
                      borderRadius: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Post an Item →
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={handleButtonClickLost}
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "16px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "#CBD5E1",
                      "&:hover": {
                        borderColor: "rgba(79,124,255,0.5)",
                        backgroundColor: "rgba(79,124,255,0.06)",
                        color: "#4F7CFF",
                      },
                    }}
                  >
                    Browse Items
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Stack direction="row" gap={4} pt={1}></Stack>
            </motion.div>
          </Stack>

          {/* Hero visual */}
          <Stack
            width={{ xs: "100%", md: "45%" }}
            display={{ xs: "none", md: "flex" }}
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ width: "100%" }}
            >
              <Stack
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(79,124,255,0.08) 0%, rgba(139,92,246,0.08) 100%)",
                  border: "1px solid rgba(79,124,255,0.15)",
                  borderRadius: "24px",
                  p: 4,
                  backdropFilter: "blur(12px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
                  }}
                />
                {/* Mock item cards */}
                {[
                  {
                    icon: "📱",
                    name: "iPhone 14 Pro",
                    status: "Lost",
                    location: "LH : 002",
                    color: "#EF4444",
                  },
                  {
                    icon: "👜",
                    name: "Black Backpack",
                    status: "Found",
                    location: "Library",
                    color: "#10B981",
                  },
                  {
                    icon: "🔑",
                    name: "Car Keys",
                    status: "Lost",
                    location: "Degree Canteen",
                    color: "#EF4444",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={2}
                      sx={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "12px",
                        p: 1.8,
                        mb: 1.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(255,255,255,0.07)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Typography fontSize="24px">{item.icon}</Typography>
                      <Stack flex={1}>
                        <Typography
                          sx={{
                            color: "#F1F5F9",
                            fontWeight: 600,
                            fontSize: "14px",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: "12px" }}>
                          📍 {item.location}
                        </Typography>
                      </Stack>
                      <Stack
                        sx={{
                          background: `${item.color}20`,
                          border: `1px solid ${item.color}40`,
                          borderRadius: "6px",
                          px: 1.2,
                          py: 0.3,
                        }}
                      >
                        <Typography
                          sx={{
                            color: item.color,
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {item.status}
                        </Typography>
                      </Stack>
                    </Stack>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Stack>
        </Stack>
      </Stack>

      {/* ── CATEGORIES ── */}
      <Stack
        width="100%"
        alignItems="center"
        sx={{
          py: { xs: 6, md: 10 },
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Stack maxWidth="1200px" width="100%" px={{ xs: 3, md: 6 }} gap={5}>
          <Stack alignItems="center" gap={1}>
            <Typography
              variant="h3"
              sx={{
                color: "#F1F5F9",
                fontSize: { xs: "24px", md: "32px" },
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Browse by Category
            </Typography>
            <Typography
              sx={{ color: "#64748B", textAlign: "center", fontSize: "15px" }}
            >
              Click a category to see lost items in that group
            </Typography>
          </Stack>

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={2.5}
            justifyContent="center"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <Stack
                  onClick={() => handleCategoryClick(cat.label)}
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    p: 3,
                    width: { xs: "130px", md: "155px" },
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: `${cat.color}12`,
                      border: `1px solid ${cat.color}35`,
                      boxShadow: `0 8px 30px ${cat.color}20`,
                    },
                  }}
                >
                  <Typography fontSize="32px">{cat.icon}</Typography>
                  <Typography
                    sx={{
                      color: "#CBD5E1",
                      fontSize: "13px",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {cat.label}
                  </Typography>
                  {/* subtle hint */}
                  <Typography
                    sx={{
                      color: cat.color,
                      fontSize: "10px",
                      fontWeight: 600,
                      opacity: 0.7,
                      letterSpacing: "0.04em",
                    }}
                  >
                    View lost →
                  </Typography>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* ── HOW IT WORKS ── */}
      <Stack
        width="100%"
        alignItems="center"
        sx={{
          py: { xs: 6, md: 10 },
          background:
            "linear-gradient(180deg, transparent, rgba(79,124,255,0.04), transparent)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Stack maxWidth="1200px" width="100%" px={{ xs: 3, md: 6 }} gap={6}>
          <Stack alignItems="center" gap={1}>
            <Typography
              variant="h3"
              sx={{
                color: "#F1F5F9",
                fontSize: { xs: "24px", md: "32px" },
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              How It Works
            </Typography>
            <Typography
              sx={{ color: "#64748B", textAlign: "center", fontSize: "15px" }}
            >
              Three simple steps to reunite with your belongings
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={3}
            justifyContent="center"
          >
            {[
              {
                step: "01",
                title: "Post Your Item",
                desc: "Describe your lost item or something you found with details and a photo.",
                icon: "📝",
                color: "#4F7CFF",
              },
              {
                step: "02",
                title: "Community Searches",
                desc: "Our network of users actively looks out and reports matching items.",
                icon: "🔍",
                color: "#8B5CF6",
              },
              {
                step: "03",
                title: "Get Reunited",
                desc: "Connect with the finder or owner through our secure contact system.",
                icon: "🤝",
                color: "#10B981",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                style={{ flex: 1 }}
              >
                <Stack
                  gap={2.5}
                  sx={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "20px",
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      background: `${item.color}08`,
                      border: `1px solid ${item.color}25`,
                      transform: "translateY(-4px)",
                      boxShadow: `0 20px 40px ${item.color}15`,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: item.color,
                      letterSpacing: "0.1em",
                      opacity: 0.7,
                    }}
                  >
                    STEP {item.step}
                  </Typography>
                  <Typography fontSize="36px">{item.icon}</Typography>
                  <Typography
                    sx={{ color: "#F1F5F9", fontWeight: 700, fontSize: "18px" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{ color: "#64748B", fontSize: "14px", lineHeight: 1.7 }}
                  >
                    {item.desc}
                  </Typography>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* ── CTA ── */}
      <Stack
        width="100%"
        alignItems="center"
        sx={{
          py: { xs: 6, md: 10 },
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Stack
          maxWidth="700px"
          px={3}
          alignItems="center"
          gap={3}
          textAlign="center"
        >
          <Typography
            variant="h3"
            sx={{
              color: "#F1F5F9",
              fontWeight: 800,
              fontSize: { xs: "26px", md: "36px" },
              lineHeight: 1.2,
            }}
          >
            Ready to find what you lost?
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "16px" }}>
            Join thousands of people who have already reunited with their
            belongings through FindYourStuff.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleButtonClickLost}
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: "15px", borderRadius: "12px" }}
              >
                😟 Report Lost Item
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleButtonClickFound}
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "15px",
                  borderRadius: "12px",
                  borderColor: "rgba(16,185,129,0.4)",
                  color: "#10B981",
                  "&:hover": {
                    borderColor: "#10B981",
                    backgroundColor: "rgba(16,185,129,0.08)",
                  },
                }}
              >
                🎉 I Found Something
              </Button>
            </motion.div>
          </Stack>
        </Stack>
      </Stack>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px #4F7CFF; opacity: 1; }
          50% { box-shadow: 0 0 16px #4F7CFF; opacity: 0.6; }
        }
      `}</style>
    </Stack>
  );
};

export default Home;
