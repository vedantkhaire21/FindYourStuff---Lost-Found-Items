import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setConstraint } from "./constraints";
import Navbar from "./Navbar";
import {
  Button,
  Typography,
  Avatar,
  Stack,
  Pagination,
  Box,
  InputBase,
} from "@mui/material";
import Axios from "axios";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";

// ── Shared category config (keep in sync with Home.js and Lost_item.js) ──
const CATEGORIES = [
  { icon: "📱", label: "Electronics", color: "#4F7CFF" },
  { icon: "👜", label: "Bags & Wallets", color: "#8B5CF6" },
  { icon: "🔑", label: "Keys", color: "#10B981" },
  { icon: "💍", label: "Jewelry", color: "#F59E0B" },
  { icon: "📄", label: "Documents", color: "#EF4444" },
  { icon: "🪪", label: "Personal", color: "#06B6D4" },
];

const Paginationn = ({ page, setPage, max }) => {
  const handleChange = (event, page) => setPage(page);
  return (
    <Pagination
      sx={{
        pt: "48px",
        "& .MuiPaginationItem-root": {
          color: "#64748B",
          borderColor: "rgba(255,255,255,0.07)",
          borderRadius: "10px",
          fontWeight: 600,
          "&:hover": { background: "rgba(239,68,68,0.1)", color: "#EF4444" },
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #EF4444, #DC2626)",
            color: "white",
            borderColor: "transparent",
            boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
          },
        },
      }}
      count={Math.ceil(max)}
      page={page}
      onChange={handleChange}
      showLastButton
      showFirstButton
    />
  );
};

const ItemCard = ({ item, index }) => {
  const created_date = new Date(item.createdAt);
  const createdAt =
    created_date.getDate() +
    "/" +
    (created_date.getMonth() + 1) +
    "/" +
    created_date.getFullYear();

  const getUserInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  };
  const user_info = getUserInfo();
  const isOwner = user_info && user_info._id && item.userId === user_info._id;

  // Find the category meta for the badge colour
  const catMeta = CATEGORIES.find((c) => c.label === item.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      style={{ width: "290px" }}
    >
      <Stack
        sx={{
          width: "100%",
          background: "rgba(15,20,35,0.9)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          "&:hover": {
            border: "1px solid rgba(239,68,68,0.3)",
            boxShadow: "0 16px 48px rgba(239,68,68,0.1)",
          },
        }}
      >
        {/* Image */}
        <Box sx={{ position: "relative", height: "180px", overflow: "hidden" }}>
          <Avatar
            src={Array.isArray(item.img) ? item.img[0] : item.img}
            variant="square"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 0,
              "& img": { objectFit: "cover" },
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(15,20,35,0.9))",
            }}
          />
          {/* Gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(15,20,35,0.7) 0%, transparent 50%)",
            }}
          />
          {/* Lost badge */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(239,68,68,0.18)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "8px",
              px: 1.2,
              py: 0.4,
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography
              sx={{
                color: "#EF4444",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              😟 LOST
            </Typography>
          </Box>
          {/* Category badge */}
          {catMeta && (
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: `${catMeta.color}22`,
                border: `1px solid ${catMeta.color}55`,
                borderRadius: "8px",
                px: 1.2,
                py: 0.4,
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography
                sx={{ color: catMeta.color, fontSize: "10px", fontWeight: 700 }}
              >
                {catMeta.icon} {catMeta.label}
              </Typography>
            </Box>
          )}
          {/* Owner badge */}
          {isOwner && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(79,124,255,0.18)",
                border: "1px solid rgba(79,124,255,0.4)",
                borderRadius: "8px",
                px: 1.2,
                py: 0.4,
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography
                sx={{ color: "#4F7CFF", fontSize: "11px", fontWeight: 700 }}
              >
                You
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content */}
        <Stack p={2.5} gap={1.8}>
          <Typography
            noWrap
            sx={{
              color: "#F1F5F9",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {item.name}
          </Typography>

          <Typography
            sx={{
              color: "#475569",
              fontSize: "13px",
              lineHeight: 1.6,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.description || "No description provided."}
          </Typography>

          <Stack gap={0.7}>
            {item.location && (
              <Stack direction="row" alignItems="center" gap={1}>
                <LocationOnIcon
                  sx={{ fontSize: "13px", color: "#EF4444", flexShrink: 0 }}
                />
                <Typography noWrap sx={{ color: "#64748B", fontSize: "12px" }}>
                  {item.location}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" gap={1}>
              <CalendarTodayIcon
                sx={{ fontSize: "12px", color: "#8B5CF6", flexShrink: 0 }}
              />
              <Typography sx={{ color: "#64748B", fontSize: "12px" }}>
                {createdAt}
              </Typography>
            </Stack>
            {item.number && (
              <Stack direction="row" alignItems="center" gap={1}>
                <PhoneIcon
                  sx={{ fontSize: "12px", color: "#10B981", flexShrink: 0 }}
                />
                <Typography sx={{ color: "#64748B", fontSize: "12px" }}>
                  {item.number}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Button
            component={Link}
            to={`/${item.name}?cid=${item._id}&type=${item.type}/${isOwner}`}
            fullWidth
            size="small"
            sx={{
              mt: 0.5,
              py: 1.1,
              fontSize: "13px",
              fontWeight: 700,
              borderRadius: "12px",
              textTransform: "none",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#EF4444",
              "&:hover": {
                background: "linear-gradient(135deg, #EF4444, #DC2626)",
                border: "1px solid transparent",
                color: "white",
                boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
              },
              transition: "all 0.2s ease",
            }}
          >
            View Details →
          </Button>
        </Stack>
      </Stack>
    </motion.div>
  );
};

export default function LostItems() {
  const getUserInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  };
  const [user_info] = useState(getUserInfo);
  setConstraint(true);

  // Read ?category= from the URL
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const urlCategory = urlParams.get("category") || "";

  const [allItems, setAllItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;

  // Keep activeCategory in sync if the user navigates back/forward
  useEffect(() => {
    setActiveCategory(urlCategory);
    setPage(1);
  }, [urlCategory]);

  useEffect(() => {
    Axios({ url: "http://localhost:5000/items", method: "GET" })
      .then((response) => {
        const lostOnly = response.data.items
          .reverse()
          .filter((i) => i.type === "Lost");
        setAllItems(lostOnly);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setLoading(false);
      });
  }, []);

  // Re-filter whenever search, activeCategory, or allItems changes
  useEffect(() => {
    const q = search.toLowerCase();
    let result = allItems;

    if (activeCategory) {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (q) {
      result = result.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q),
      );
    }

    setFiltered(result);
    setMaxPages(Math.ceil(result.length / itemsPerPage));
    setPage(1);
  }, [search, activeCategory, allItems]);

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleCategoryClick = (label) => {
    const next = activeCategory === label ? "" : label;
    setActiveCategory(next);
    // Update URL so the browser back button still works
    if (next) {
      navigate(`/lostitems?category=${encodeURIComponent(next)}`, {
        replace: true,
      });
    } else {
      navigate("/lostitems", { replace: true });
    }
  };

  const clearCategory = () => handleCategoryClick(activeCategory);

  const activeCatMeta = CATEGORIES.find((c) => c.label === activeCategory);

  return (
    <Stack width="100%" sx={{ background: "#0B1020", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Header ── */}
      <Box
        sx={{
          pt: { xs: "80px", md: "90px" },
          pb: { xs: 4, md: 5 },
          px: { xs: 3, md: 6 },
          background:
            "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(15,20,35,0) 60%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Stack maxWidth="1200px" mx="auto" gap={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            justifyContent="space-between"
            gap={2}
          >
            <Stack gap={1}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "8px",
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#EF4444",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    😟 LOST ITEMS
                  </Typography>
                </Box>
                <Typography sx={{ color: "#334155", fontSize: "13px" }}>
                  {filtered.length} {filtered.length === 1 ? "item" : "items"}
                  {activeCategory ? ` in ${activeCategory}` : ""}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  color: "#F1F5F9",
                  fontWeight: 800,
                  fontSize: { xs: "24px", md: "32px" },
                  letterSpacing: "-0.02em",
                }}
              >
                {user_info?.nickname
                  ? `Hey ${user_info.nickname} 👋`
                  : "Lost Items"}
              </Typography>
              <Typography sx={{ color: "#475569", fontSize: "14px" }}>
                Browse reported lost items — you might recognise something
              </Typography>
            </Stack>

            {/* Search */}
            <Stack
              direction="row"
              alignItems="center"
              gap={1.5}
              sx={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                px: 2,
                py: 1.2,
                width: { xs: "100%", sm: "280px" },
                "&:focus-within": {
                  border: "1px solid rgba(239,68,68,0.35)",
                  boxShadow: "0 0 0 3px rgba(239,68,68,0.08)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <SearchIcon
                sx={{ color: "#334155", fontSize: "18px", flexShrink: 0 }}
              />
              <InputBase
                placeholder="Search items, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  color: "#F1F5F9",
                  fontSize: "14px",
                  flex: 1,
                  "& ::placeholder": { color: "#334155" },
                }}
              />
            </Stack>
          </Stack>

          {/* ── Category filter pills ── */}
          <Stack direction="row" flexWrap="wrap" gap={1.2}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <motion.div key={cat.label} whileTap={{ scale: 0.95 }}>
                  <Box
                    onClick={() => handleCategoryClick(cat.label)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      px: 1.8,
                      py: 0.7,
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive
                        ? `${cat.color}20`
                        : "rgba(255,255,255,0.04)",
                      border: isActive
                        ? `1.5px solid ${cat.color}60`
                        : "1.5px solid rgba(255,255,255,0.08)",
                      color: isActive ? cat.color : "#64748B",
                      transition: "all 0.2s ease",
                      boxShadow: isActive ? `0 0 12px ${cat.color}25` : "none",
                      "&:hover": {
                        background: `${cat.color}15`,
                        border: `1.5px solid ${cat.color}40`,
                        color: cat.color,
                      },
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    {isActive && (
                      <CloseIcon
                        sx={{ fontSize: "12px", ml: 0.3, opacity: 0.8 }}
                      />
                    )}
                  </Box>
                </motion.div>
              );
            })}
          </Stack>

          {/* Active category banner */}
          {activeCatMeta && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{
                  background: `${activeCatMeta.color}10`,
                  border: `1px solid ${activeCatMeta.color}30`,
                  borderRadius: "12px",
                  px: 2,
                  py: 1,
                  width: "fit-content",
                }}
              >
                <Typography sx={{ fontSize: "18px" }}>
                  {activeCatMeta.icon}
                </Typography>
                <Typography
                  sx={{
                    color: activeCatMeta.color,
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Showing {activeCatMeta.label} only
                </Typography>
                <Box
                  onClick={clearCategory}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "#475569",
                    "&:hover": { color: "#F1F5F9" },
                    ml: 0.5,
                  }}
                >
                  <CloseIcon sx={{ fontSize: "14px" }} />
                </Box>
              </Stack>
            </motion.div>
          )}
        </Stack>
      </Box>

      {/* ── Grid ── */}
      <Stack
        maxWidth="1200px"
        mx="auto"
        width="100%"
        px={{ xs: 2, md: 4 }}
        pt="36px"
        pb="20px"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <Stack key="loading" alignItems="center" py={12} gap={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "3px solid rgba(239,68,68,0.2)",
                  borderTopColor: "#EF4444",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <Typography sx={{ color: "#334155", fontSize: "14px" }}>
                Loading items...
              </Typography>
            </Stack>
          ) : paginated.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Stack alignItems="center" py={12} gap={2}>
                <Typography fontSize="52px">
                  {activeCategory ? activeCatMeta?.icon : search ? "🔍" : "😟"}
                </Typography>
                <Typography
                  sx={{ color: "#94A3B8", fontSize: "18px", fontWeight: 700 }}
                >
                  {activeCategory
                    ? `No lost ${activeCategory} items yet`
                    : search
                      ? `No results for "${search}"`
                      : "No lost items yet"}
                </Typography>
                <Typography sx={{ color: "#334155", fontSize: "14px" }}>
                  {activeCategory
                    ? "Try a different category or clear the filter"
                    : search
                      ? "Try a different search term"
                      : "Be the first to report a lost item"}
                </Typography>
                {(search || activeCategory) && (
                  <Stack direction="row" gap={1}>
                    {activeCategory && (
                      <Button
                        onClick={clearCategory}
                        sx={{
                          color: "#EF4444",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Clear category
                      </Button>
                    )}
                    {search && (
                      <Button
                        onClick={() => setSearch("")}
                        sx={{
                          color: "#EF4444",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Clear search
                      </Button>
                    )}
                  </Stack>
                )}
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Stack
                direction="row"
                flexWrap="wrap"
                gap="24px"
                justifyContent="center"
              >
                {paginated.map((item, i) => (
                  <ItemCard key={item._id} item={item} index={i} />
                ))}
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      {maxPages > 1 && (
        <Stack alignItems="center">
          <Paginationn page={page} setPage={setPage} max={maxPages} />
        </Stack>
      )}
      <Box sx={{ height: 60 }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Stack>
  );
}
