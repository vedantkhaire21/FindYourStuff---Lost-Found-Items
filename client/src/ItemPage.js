import React, { useState, useEffect } from "react";
import { setConstraint } from "./constraints";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactsIcon from "@mui/icons-material/Contacts";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal, Button, Typography, Avatar, Stack, Box } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Navbar from "./Navbar";

function ItemPage() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showContact, setShowContact] = useState(false);

  setConstraint(true);

  const queryParams = new URLSearchParams(window.location.search);
  const item_id = queryParams.get("cid");
  const typeParam = queryParams.get("type") || "";
  const current_user = typeParam.split("/")[1] === "true";

  useEffect(() => {
    if (!item_id) return;
    axios({ url: `http://localhost:5000/items/${item_id}`, method: "GET" })
      .then((res) => setItem(res.data.item))
      .catch((err) => console.log("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const delete_item = () => {
    const usertoken = window.localStorage.getItem("token");
    axios({
      url: `http://localhost:5000/items/delete/${item_id}`,
      method: "DELETE",
      headers: { token: usertoken },
    })
      .then(() => {
        setShowDelete(false);
        toast.success("Item deleted successfully!", { position: "bottom-right", autoClose: 1000, theme: "dark" });
        window.location.href = "/mylistings";
      })
      .catch(() => {
        toast.error("Failed to delete item.", { position: "bottom-right", autoClose: 1000, theme: "dark" });
      });
  };

  const isLost = item?.type === "Lost";
  const accentColor = isLost ? "#EF4444" : "#10B981";

  const created_date = item ? new Date(item.createdAt) : null;
  const createdAt = created_date
    ? `${created_date.getDate()}/${created_date.getMonth() + 1}/${created_date.getFullYear()} ${created_date.getHours()}:${String(created_date.getMinutes()).padStart(2, "0")}`
    : "";

  const slides = item
    ? Array.isArray(item.img)
      ? item.img.filter(Boolean)
      : item.img
      ? [item.img]
      : []
    : [];

  return (
    <>
      <Stack width="100%" sx={{ background: "#0B1020", minHeight: "100vh" }}>
        <Navbar />

        {/* Page header */}
        <Stack
          width="100%"
          sx={{
            background: "linear-gradient(135deg, rgba(79,124,255,0.08) 0%, rgba(139,92,246,0.06) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            py: { xs: 3, md: 4 },
            px: { xs: 3, md: 6 },
          }}
        >
          <Stack maxWidth="1100px" width="100%" alignSelf="center" gap={0.5}>
            <Typography sx={{ color: "#64748B", fontSize: "13px", fontWeight: 600 }}>
              {item?.type ? `${item.type.toUpperCase()} ITEM` : "ITEM DETAILS"}
            </Typography>
            <Typography sx={{ color: "#F1F5F9", fontWeight: 800, fontSize: { xs: "22px", md: "28px" } }}>
              {item?.name || "Loading..."}
            </Typography>
          </Stack>
        </Stack>

        {/* Body */}
        <Stack alignItems="center" width="100%">
          {loading ? (
            <Stack alignItems="center" py={10} gap={2}>
              <Typography fontSize="40px">⏳</Typography>
              <Typography sx={{ color: "#64748B", fontSize: "16px" }}>Loading item details...</Typography>
            </Stack>
          ) : !item ? (
            <Stack alignItems="center" py={10} gap={2}>
              <Typography fontSize="40px">❌</Typography>
              <Typography sx={{ color: "#64748B", fontSize: "16px" }}>Item not found.</Typography>
            </Stack>
          ) : (
            <Stack
              width="100%"
              maxWidth="1100px"
              px={{ xs: 2, sm: 4, md: 6 }}
              py={{ xs: 3, md: 5 }}
              gap={4}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                gap={{ xs: 3, md: 4 }}
                alignItems={{ md: "flex-start" }}
              >
                {/* Image panel */}
                <Stack
                  sx={{
                    flex: "1 1 55%",
                    background: "rgba(17,24,39,0.8)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    height: "320px",
                  }}
                >
                  {slides.length > 0 ? (
                    <img
                      src={slides[0]}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Stack alignItems="center" justifyContent="center" height="320px" gap={2}>
                      <Typography fontSize="48px">🖼️</Typography>
                      <Typography sx={{ color: "#475569", fontSize: "14px" }}>No image available</Typography>
                    </Stack>
                  )}
                </Stack>

                {/* Info card */}
                <Stack
                  sx={{
                    flex: "1 1 40%",
                    background: "rgba(17,24,39,0.7)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "20px",
                    p: 3,
                    gap: 2.5,
                  }}
                >
                  {/* Status badge */}
                  <Stack
                    sx={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      background: `${accentColor}15`,
                      border: `1px solid ${accentColor}35`,
                      borderRadius: "10px",
                      px: 2,
                      py: 0.6,
                    }}
                  >
                    <Typography sx={{ color: accentColor, fontSize: "13px", fontWeight: 700 }}>
                      {isLost ? "😟 LOST ITEM" : "🎉 FOUND ITEM"}
                    </Typography>
                  </Stack>

                  {/* Item name */}
                  <Typography sx={{ color: "#F1F5F9", fontSize: { xs: "22px", md: "26px" }, fontWeight: 800, lineHeight: 1.2 }}>
                    {item.name}
                  </Typography>

                  {/* Posted by */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    sx={{
                      background: "rgba(79,124,255,0.06)",
                      border: "1px solid rgba(79,124,255,0.12)",
                      borderRadius: "12px",
                      p: 1.5,
                    }}
                  >
                    <Avatar
                      src={item?.userId?.img}
                      sx={{ width: 42, height: 42, border: "2px solid rgba(79,124,255,0.3)", fontSize: "16px" }}
                    >
                      {(item?.userId?.fullname || item?.userId?.nickname || "?")[0]}
                    </Avatar>
                    <Stack>
                      <Typography sx={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Posted by
                      </Typography>
                      <Typography sx={{ color: "#F1F5F9", fontWeight: 700, fontSize: "15px" }}>
                        {item?.userId?.fullname || item?.userId?.nickname || "Unknown"}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Date & Location */}
                  <Stack gap={1.5}>
                    <Stack direction="row" alignItems="center" gap={1.5}
                      sx={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", p: 1.5 }}
                    >
                      <CalendarTodayIcon sx={{ fontSize: "16px", color: "#8B5CF6" }} />
                      <Stack>
                        <Typography sx={{ color: "#475569", fontSize: "11px", fontWeight: 600 }}>DATE</Typography>
                        <Typography sx={{ color: "#CBD5E1", fontSize: "14px", fontWeight: 500 }}>
                          {item?.date || createdAt}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1.5}
                      sx={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", p: 1.5 }}
                    >
                      <LocationOnIcon sx={{ fontSize: "16px", color: "#4F7CFF" }} />
                      <Stack>
                        <Typography sx={{ color: "#475569", fontSize: "11px", fontWeight: 600 }}>LOCATION</Typography>
                        <Typography sx={{ color: "#CBD5E1", fontSize: "14px", fontWeight: 500 }}>
                          {item?.location || "Not specified"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Action button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    {current_user ? (
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: "rgba(239,68,68,0.35)",
                          color: "#EF4444",
                          borderRadius: "12px",
                          py: 1.2,
                          fontWeight: 600,
                          fontSize: "14px",
                          "&:hover": { borderColor: "#EF4444", background: "rgba(239,68,68,0.08)" },
                        }}
                        onClick={() => setShowDelete(true)}
                      >
                        Delete This Post
                      </Button>
                    ) : (
                      <Button
                        startIcon={<ContactsIcon />}
                        variant="contained"
                        fullWidth
                        sx={{ py: 1.2, borderRadius: "12px", fontWeight: 600, fontSize: "14px" }}
                        onClick={() => setShowContact(true)}
                      >
                        Contact Owner
                      </Button>
                    )}
                  </motion.div>
                </Stack>
              </Stack>

              {/* Description */}
              <Stack
                sx={{
                  background: "rgba(17,24,39,0.7)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "20px",
                  p: { xs: 3, md: 4 },
                  gap: 1.5,
                }}
              >
                <Typography sx={{ color: "#94A3B8", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em" }}>
                  DESCRIPTION
                </Typography>
                <Typography sx={{ color: "#CBD5E1", fontSize: "15px", lineHeight: 1.8 }}>
                  {item.description || "No description provided."}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* Delete Modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)}>
        <Stack
          alignItems="center"
          justifyContent="center"
          gap={2.5}
          sx={{
            borderRadius: "20px",
            background: "rgba(15,22,41,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(239,68,68,0.2)",
            width: { xs: "340px", sm: "420px" },
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
            p: { xs: 3, sm: 5 },
          }}
        >
          <Typography fontSize="40px">🗑️</Typography>
          <Typography sx={{ color: "#F1F5F9", fontSize: "18px", fontWeight: 700, textAlign: "center" }}>
            Delete this post?
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "14px", textAlign: "center" }}>
            This action cannot be undone. The post will be permanently removed.
          </Typography>
          <Stack direction="row" width="100%" gap={2} mt={1}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ borderColor: "rgba(255,255,255,0.12)", color: "#94A3B8", borderRadius: "12px", py: 1.2, "&:hover": { borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)" } }}
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", borderRadius: "12px", py: 1.2, fontWeight: 700, "&:hover": { boxShadow: "0 4px 15px rgba(239,68,68,0.4)" } }}
              onClick={delete_item}
            >
              Yes, Delete
            </Button>
          </Stack>
        </Stack>
      </Modal>

      {/* Contact Modal */}
      <Modal open={showContact} onClose={() => setShowContact(false)}>
        <Stack
          alignItems="center"
          justifyContent="center"
          gap={2.5}
          sx={{
            borderRadius: "20px",
            background: "rgba(15,22,41,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(79,124,255,0.2)",
            width: { xs: "340px", sm: "420px" },
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
            p: { xs: 3, sm: 5 },
          }}
        >
          <Typography fontSize="40px">📞</Typography>
          <Typography sx={{ color: "#F1F5F9", fontSize: "18px", fontWeight: 700, textAlign: "center" }}>
            Contact {item?.userId?.fullname || item?.userId?.nickname}
          </Typography>
          <Stack
            sx={{
              background: "rgba(79,124,255,0.08)",
              border: "1px solid rgba(79,124,255,0.2)",
              borderRadius: "12px",
              px: 3,
              py: 2,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "#94A3B8", fontSize: "12px", fontWeight: 600, mb: 0.5 }}>
              CONTACT NUMBER
            </Typography>
            <Typography sx={{ color: "#4F7CFF", fontSize: "22px", fontWeight: 800 }}>
              {item?.number || "Not provided"}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowContact(false)}
            sx={{ borderRadius: "12px", py: 1.2, fontWeight: 600 }}
          >
            Close
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default ItemPage;
