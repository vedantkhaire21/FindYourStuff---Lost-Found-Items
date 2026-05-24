import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { setConstraint } from "./constraints";
import Navbar from "./Navbar";

import {
  Button,
  Typography,
  Avatar,
  Stack,
  Pagination,
  Box,
} from "@mui/material";
import Axios from "axios";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Paginationn = ({ page, setPage, max }) => {
  const handleChange = (event, page) => setPage(page);
  return (
    <Pagination
      sx={{
        pt: "60px",
        "& .MuiPaginationItem-root": {
          color: "#94A3B8",
          borderColor: "rgba(255,255,255,0.1)",
          borderRadius: "8px",
          "&:hover": { background: "rgba(16,185,129,0.1)", color: "#10B981" },
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            borderColor: "transparent",
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
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

export default function FoundItems() {
  const getUserInfo = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  };
  const [user_info] = useState(getUserInfo);

  setConstraint(true);

  const [item, setitem] = useState("");
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    Axios({ url: "http://localhost:5000/items", method: "GET" })
      .then((response) => {
        const allitems = response.data.items.reverse();
        const foundOnly = allitems.filter((i) => i.type === "Found");
        const itemsPerPage = 9;
        setTotalCount(foundOnly.length);
        setMaxPages(Math.ceil(foundOnly.length / itemsPerPage));
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const data = foundOnly.slice(startIndex, endIndex);

        const items = data.map((item) => {
          const created_date = new Date(item.createdAt);
          const createdAt =
            created_date.getDate() +
            "/" +
            (created_date.getMonth() + 1) +
            "/" +
            created_date.getFullYear();

          const isOwner =
            user_info && user_info._id && item.userId === user_info._id;

          return (
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
              key={item._id}
            >
              <Stack
                sx={{
                  width: "280px",
                  background: "rgba(17, 24, 39, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  "&:hover": {
                    border: "1px solid rgba(16,185,129,0.25)",
                    boxShadow: "0 12px 40px rgba(16,185,129,0.08)",
                  },
                }}
              >
                {/* Image area */}
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    height: "190px",
                    background:
                      "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.03) 100%)",
                    position: "relative",
                    overflow: "hidden",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <Avatar
                    src={Array.isArray(item.img) ? item.img[0] : item.img}
                    variant="square"
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 0,
                      "& img": { objectFit: "cover" },
                    }}
                  />
                  {/* Status badge */}
                  <Stack
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "rgba(16,185,129,0.15)",
                      border: "1px solid rgba(16,185,129,0.35)",
                      borderRadius: "8px",
                      px: 1.2,
                      py: 0.4,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#10B981",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      🎉 FOUND
                    </Typography>
                  </Stack>
                </Stack>

                {/* Content */}
                <Stack p={2.5} gap={1.5}>
                  <Typography
                    noWrap
                    sx={{
                      color: "#F1F5F9",
                      fontSize: "17px",
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.description || "No description provided."}
                  </Typography>

                  <Stack gap={0.8}>
                    {item.location && (
                      <Stack direction="row" alignItems="center" gap={0.8}>
                        <LocationOnIcon
                          sx={{ fontSize: "14px", color: "#10B981" }}
                        />
                        <Typography
                          noWrap
                          sx={{ color: "#94A3B8", fontSize: "12px" }}
                        >
                          {item.location}
                        </Typography>
                      </Stack>
                    )}
                    <Stack direction="row" alignItems="center" gap={0.8}>
                      <CalendarTodayIcon
                        sx={{ fontSize: "13px", color: "#8B5CF6" }}
                      />
                      <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>
                        {createdAt}
                      </Typography>
                    </Stack>
                  </Stack>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      component={Link}
                      to={`/${item.name}?cid=${item._id}&type=${item.type}/${isOwner}`}
                      fullWidth
                      size="small"
                      sx={{
                        mt: 0.5,
                        py: 1,
                        fontSize: "13px",
                        fontWeight: 600,
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.06))",
                        border: "1px solid rgba(16,185,129,0.25)",
                        color: "#10B981",
                        textTransform: "none",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #10B981, #059669)",
                          border: "1px solid transparent",
                          color: "white",
                          boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
                        },
                      }}
                    >
                      View Details →
                    </Button>
                  </motion.div>
                </Stack>
              </Stack>
            </motion.div>
          );
        });

        setitem(items);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, [page]);

  return (
    <Stack width="100%" sx={{ background: "#0B1020", minHeight: "100vh" }}>
      <Navbar />
      {/* Header banner */}
      <Stack
        width="100%"
        sx={{
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(79,124,255,0.06) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Stack maxWidth="1440px" width="100%" alignSelf="center" gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Stack
              sx={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  color: "#10B981",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                FOUND ITEMS
              </Typography>
            </Stack>
            {totalCount > 0 && (
              <Typography sx={{ color: "#64748B", fontSize: "13px" }}>
                {totalCount} items found
              </Typography>
            )}
          </Stack>
          <Typography
            sx={{
              color: "#F1F5F9",
              fontWeight: 800,
              fontSize: { xs: "24px", md: "32px" },
            }}
          >
            {user_info?.nickname
              ? `Hey ${user_info.nickname} 👋`
              : "Found Items"}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "15px" }}>
            Someone may have found your lost item — check here
          </Typography>
        </Stack>
      </Stack>

      {/* Items grid */}
      <Stack
        pt="32px"
        pb="20px"
        direction="row"
        justifyContent="center"
        flexWrap="wrap"
        gap="24px"
        maxWidth="1440px"
        alignSelf="center"
        width="100%"
        px={{ xs: 2, md: 4 }}
      >
        {item.length === 0 ? (
          <Stack alignItems="center" py={10} gap={2}>
            <Typography fontSize="48px">🎉</Typography>
            <Typography
              sx={{ color: "#94A3B8", fontSize: "18px", fontWeight: 600 }}
            >
              No found items yet
            </Typography>
            <Typography sx={{ color: "#475569", fontSize: "14px" }}>
              Help someone by reporting a found item
            </Typography>
          </Stack>
        ) : (
          item
        )}
      </Stack>
      <Stack alignItems="center">
        <Paginationn page={page} setPage={setPage} max={maxPages} />
      </Stack>
      <Box sx={{ height: 60 }} />
    </Stack>
  );
}
