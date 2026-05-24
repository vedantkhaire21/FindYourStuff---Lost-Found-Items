import React, { useEffect, useState } from "react";
import { setConstraint } from "./constraints";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { Button, Typography, Stack, Pagination, Box } from "@mui/material";
import Axios from "axios";

const fmt = (iso) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

// ImgBB blocks requests that send a referrer header.
// Using a plain <img> with referrerPolicy="no-referrer" fixes it.
const ItemImage = ({ src, alt, accentColor }) => {
  const [err, setErr] = useState(false);
  const raw = Array.isArray(src) ? src[0] : src;

  if (raw && !err) {
    return (
      <img
        src={raw}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setErr(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", height: "100%", background: `${accentColor}10` }}
    >
      <Typography sx={{ fontSize: "32px", opacity: 0.3 }}>📷</Typography>
      <Typography sx={{ color: "#374151", fontSize: "11px", mt: 0.5 }}>No image</Typography>
    </Stack>
  );
};

const ItemCard = ({ item, index }) => {
  const isLost = item.type === "Lost";
  const accent = isLost ? "#F87171" : "#34D399";
  const accentBg = isLost ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)";
  const accentBorder = isLost ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.25)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      style={{ width: "100%" }}
    >
      <Stack
        sx={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          overflow: "hidden",
          height: "100%",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: accentBorder,
            boxShadow: `0 20px 48px -8px ${accent}18`,
          },
        }}
      >
        {/* Image */}
        <Box sx={{ height: "180px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <ItemImage src={item.img} alt={item.name} accentColor={accent} />

          {/* Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              background: accentBg,
              border: `1px solid ${accentBorder}`,
              backdropFilter: "blur(8px)",
              borderRadius: "8px",
              px: 1.2,
              py: 0.5,
            }}
          >
            <Typography sx={{ color: accent, fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em" }}>
              {isLost ? "LOST" : "FOUND"}
            </Typography>
          </Box>

          {/* Bottom gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(17,24,39,0.5) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />
        </Box>

        {/* Body */}
        <Stack p={2} gap={1.2} flex={1}>
          <Typography noWrap sx={{ color: "#F9FAFB", fontSize: "15px", fontWeight: 700 }}>
            {item.name}
          </Typography>

          <Typography
            sx={{
              color: "#6B7280",
              fontSize: "12.5px",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {item.description || "No description provided."}
          </Typography>

          <Stack gap={0.5} mt="auto">
            {item.location && (
              <Stack direction="row" alignItems="center" gap={0.7}>
                <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#4F7CFF", flexShrink: 0 }} />
                <Typography noWrap sx={{ color: "#9CA3AF", fontSize: "11.5px" }}>
                  {item.location}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" gap={0.7}>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#8B5CF6", flexShrink: 0 }} />
              <Typography sx={{ color: "#9CA3AF", fontSize: "11.5px" }}>
                {fmt(item.createdAt)}
              </Typography>
            </Stack>
          </Stack>

          <Button
            component={Link}
            to={`/${item.name}?cid=${item._id}&type=${item.type}/true`}
            fullWidth
            size="small"
            sx={{
              mt: 0.5,
              py: 0.85,
              fontSize: "12.5px",
              fontWeight: 600,
              borderRadius: "9px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#CBD5E1",
              textTransform: "none",
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(135deg, #4F7CFF, #6B5FFF)",
                borderColor: "transparent",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(79,124,255,0.35)",
              },
            }}
          >
            Manage →
          </Button>
        </Stack>
      </Stack>
    </motion.div>
  );
};

const Stat = ({ icon, label, value, color }) => (
  <Stack
    direction="row"
    alignItems="center"
    gap={1.5}
    sx={{
      px: 2.5,
      py: 1.5,
      borderRadius: "12px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      minWidth: "120px",
    }}
  >
    <Typography fontSize="18px">{icon}</Typography>
    <Stack>
      <Typography sx={{ color, fontSize: "20px", fontWeight: 800, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ color: "#6B7280", fontSize: "11px", mt: 0.2 }}>
        {label}
      </Typography>
    </Stack>
  </Stack>
);

const Pager = ({ page, setPage, max }) => (
  <Pagination
    count={Math.ceil(max)}
    page={page}
    onChange={(_, p) => setPage(p)}
    showFirstButton
    showLastButton
    sx={{
      "& .MuiPaginationItem-root": {
        color: "#9CA3AF",
        borderColor: "rgba(255,255,255,0.08)",
        borderRadius: "8px",
        fontSize: "13px",
        "&:hover": { background: "rgba(79,124,255,0.1)", color: "#4F7CFF" },
        "&.Mui-selected": {
          background: "linear-gradient(135deg, #4F7CFF, #6B5FFF)",
          color: "#fff",
          borderColor: "transparent",
          boxShadow: "0 4px 12px rgba(79,124,255,0.3)",
        },
      },
    }}
  />
);

export default function MyListings() {
  const getUserInfo = () => {
    try { return JSON.parse(window.localStorage.getItem("user")) || null; }
    catch { return null; }
  };
  const user_info = getUserInfo();
  setConstraint(true);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user_info) return;
    setLoading(true);
    Axios({ url: "http://localhost:5000/items", method: "GET" })
      .then(({ data }) => {
        const mine = data.items.reverse().filter((i) => i.userId === user_info._id);
        setStats({
          total: mine.length,
          lost: mine.filter((i) => i.type === "Lost").length,
          found: mine.filter((i) => i.type === "Found").length,
        });
        const perPage = 9;
        setMaxPages(Math.ceil(mine.length / perPage));
        setItems(mine.slice((page - 1) * perPage, page * perPage));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  if (!user_info) {
    return (
      <>
        <Navbar />
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "80vh", background: "#080E1A" }} gap={2}>
          <Typography fontSize="48px">🔒</Typography>
          <Typography sx={{ color: "#9CA3AF", fontSize: "18px", fontWeight: 600 }}>
            Sign in to see your listings
          </Typography>
          <Button component={Link} to="/log-in" variant="contained"
            sx={{ borderRadius: "10px", px: 4, mt: 1 }}>
            Go to Login
          </Button>
        </Stack>
      </>
    );
  }

  return (
    <Stack sx={{ background: "#080E1A", minHeight: "100vh" }}>
      <Navbar />

      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(180deg, rgba(79,124,255,0.07) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 6 },
        }}
      >
        <Stack maxWidth="1320px" mx="auto" gap={3}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} gap={2}>
            <Stack gap={0.5}>
              <Typography sx={{ color: "#4F7CFF", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                My Listings
              </Typography>
              <Typography sx={{ color: "#F9FAFB", fontWeight: 800, fontSize: { xs: "22px", md: "28px" }, lineHeight: 1.2 }}>
                Hey, {user_info.nickname} 👋
              </Typography>
              <Typography sx={{ color: "#6B7280", fontSize: "14px", mt: 0.3 }}>
                All your posts in one place
              </Typography>
            </Stack>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                component={Link}
                to="/postitem"
                variant="contained"
                sx={{
                  px: 3,
                  py: 1.1,
                  borderRadius: "11px",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #4F7CFF, #6B5FFF)",
                  boxShadow: "0 4px 20px rgba(79,124,255,0.3)",
                  whiteSpace: "nowrap",
                  "&:hover": { boxShadow: "0 6px 28px rgba(79,124,255,0.45)" },
                }}
              >
                + Post New Item
              </Button>
            </motion.div>
          </Stack>

          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <Stat icon="📋" label="Total Posts" value={stats.total} color="#4F7CFF" />
            <Stat icon="😟" label="Lost" value={stats.lost} color="#F87171" />
            <Stat icon="🎉" label="Found" value={stats.found} color="#34D399" />
          </Stack>
        </Stack>
      </Box>

      {/* Grid */}
      <Box sx={{ maxWidth: "1320px", width: "100%", mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
        {loading ? (
          <Stack alignItems="center" py={12}>
            <Typography sx={{ color: "#374151" }}>Loading your items…</Typography>
          </Stack>
        ) : items.length === 0 ? (
          <Stack alignItems="center" py={14} gap={2.5}>
            <Typography fontSize="52px">📭</Typography>
            <Typography sx={{ color: "#D1D5DB", fontSize: "18px", fontWeight: 700 }}>Nothing here yet</Typography>
            <Typography sx={{ color: "#6B7280", fontSize: "13.5px", textAlign: "center", maxWidth: "280px" }}>
              Post a lost or found item to start helping your community
            </Typography>
            <Button
              component={Link}
              to="/postitem"
              variant="contained"
              sx={{ borderRadius: "11px", px: 3, mt: 1, textTransform: "none", fontWeight: 600, background: "linear-gradient(135deg, #4F7CFF, #6B5FFF)" }}
            >
              Post Your First Item
            </Button>
          </Stack>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: "20px",
            }}
          >
            <AnimatePresence>
              {items.map((item, i) => (
                <ItemCard key={item._id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Box>

      {maxPages > 1 && (
        <Stack alignItems="center" pb={8}>
          <Pager page={page} setPage={setPage} max={maxPages} />
        </Stack>
      )}
    </Stack>
  );
}
