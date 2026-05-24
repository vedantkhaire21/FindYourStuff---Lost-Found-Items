import React, { useState } from "react";
import { setConstraint } from "./constraints";
import { BsFillCaretDownFill } from "react-icons/bs";
import {
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const token = window.localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const navLinkStyle = {
    fontSize: "15px",
    fontWeight: 500,
    textTransform: "none",
    color: "#94A3B8",
    borderRadius: "8px",
    px: 1.5,
    py: 0.8,
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#F1F5F9",
      backgroundColor: "rgba(255,255,255,0.06)",
    },
    "&:focus": {
      color: "#4F7CFF",
      backgroundColor: "rgba(79,124,255,0.08)",
    },
  };

  const signout = () => {
    setConstraint(false);
    localStorage.clear();
    window.location.href = "/log-in";
  };

  return (
    <>
      <Stack
        width="100%"
        direction="row"
        justifyContent="center"
        sx={{
          background: "rgba(11, 16, 32, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Stack
          width="100%"
          maxWidth="1440px"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={{ xs: 2, sm: 4, md: 5 }}
          py={1.2}
          gap={1}
        >
          {/* Logo */}
          <Link to="/home" style={{ textDecoration: "none" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Stack
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  boxShadow: "0 4px 15px rgba(79, 124, 255, 0.4)",
                }}
              >
                🔍
              </Stack>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #4F7CFF, #8B5CF6)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.01em",
                }}
              >
                FindYourStuff
              </Typography>
            </Stack>
          </Link>

          {/* Desktop Nav */}
          <Stack
            direction="row"
            gap={0.5}
            display={{ xs: "none", md: "flex" }}
            alignItems="center"
          >
            {token ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    component={Link}
                    to="/home"
                    sx={navLinkStyle}
                    disableRipple
                  >
                    Home
                  </Button>
                </motion.div>

                <Stack>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      sx={navLinkStyle}
                      endIcon={
                        <BsFillCaretDownFill
                          size="10px"
                          style={{
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
                        />
                      }
                      disableRipple
                    >
                      Browse Items
                    </Button>
                  </motion.div>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": "basic-button" }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        background: "#1A2235",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        minWidth: 160,
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/lostitems"
                      onClick={handleClose}
                      sx={{
                        borderRadius: "8px",
                        mx: 0.5,
                        gap: 1,
                        fontSize: "14px",
                      }}
                    >
                      <span>😟</span> Lost Items
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/founditems"
                      onClick={handleClose}
                      sx={{
                        borderRadius: "8px",
                        mx: 0.5,
                        gap: 1,
                        fontSize: "14px",
                      }}
                    >
                      <span>🎉</span> Found Items
                    </MenuItem>
                  </Menu>
                </Stack>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    component={Link}
                    to="/postitem"
                    sx={navLinkStyle}
                    disableRipple
                  >
                    Post Item
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    component={Link}
                    to="/mylistings"
                    sx={navLinkStyle}
                    disableRipple
                  >
                    My Listings
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    component={Link}
                    to="/home"
                    sx={navLinkStyle}
                    disableRipple
                  >
                    Home
                  </Button>
                </motion.div>

                <Stack>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                      sx={navLinkStyle}
                      endIcon={<BsFillCaretDownFill size="10px" />}
                      disableRipple
                    >
                      Browse Items
                    </Button>
                  </motion.div>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        background: "#1A2235",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        minWidth: 160,
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/log-in"
                      onClick={handleClose}
                      sx={{
                        borderRadius: "8px",
                        mx: 0.5,
                        gap: 1,
                        fontSize: "14px",
                      }}
                    >
                      <span>😟</span> Lost Items
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/log-in"
                      onClick={handleClose}
                      sx={{
                        borderRadius: "8px",
                        mx: 0.5,
                        gap: 1,
                        fontSize: "14px",
                      }}
                    >
                      <span>🎉</span> Found Items
                    </MenuItem>
                  </Menu>
                </Stack>
              </>
            )}
          </Stack>

          {/* Desktop Auth Buttons */}
          <Stack
            direction="row"
            gap={1.5}
            display={{ xs: "none", md: "flex" }}
            alignItems="center"
          >
            {token ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outlined"
                  onClick={signout}
                  size="small"
                  sx={{
                    borderColor: "rgba(255,255,255,0.15)",
                    color: "#94A3B8",
                    borderRadius: "10px",
                    px: 2.5,
                    fontSize: "14px",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "rgba(239,68,68,0.5)",
                      color: "#EF4444",
                      backgroundColor: "rgba(239,68,68,0.06)",
                    },
                  }}
                >
                  Sign Out
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    component={Link}
                    to="/log-in"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "rgba(79,124,255,0.4)",
                      color: "#4F7CFF",
                      borderRadius: "10px",
                      px: 2.5,
                      fontSize: "14px",
                      fontWeight: 500,
                      "&:hover": {
                        borderColor: "#4F7CFF",
                        backgroundColor: "rgba(79,124,255,0.08)",
                      },
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    component={Link}
                    to="/sign-up"
                    variant="contained"
                    size="small"
                    sx={{ px: 2.5, fontSize: "14px" }}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </>
            )}
          </Stack>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={toggleMobile}
            sx={{ display: { xs: "flex", md: "none" }, color: "#94A3B8" }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobile}
        PaperProps={{
          sx: {
            width: 260,
            background: "#0F1629",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      >
        <Stack p={2} gap={0.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              fontWeight={700}
              sx={{ color: "#4F7CFF", fontSize: "16px" }}
            >
              FindYourStuff
            </Typography>
            <IconButton onClick={toggleMobile} sx={{ color: "#94A3B8" }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {[
            { label: "🏠 Home", to: "/" },
            token && { label: "😟 Lost Items", to: "/LostItems" },
            token && { label: "🎉 Found Items", to: "/FoundItems" },
            token && { label: "➕ Post Item", to: "/postitem" },
            token && { label: "📋 My Listings", to: "/mylistings" },
          ]
            .filter(Boolean)
            .map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                onClick={toggleMobile}
                sx={{
                  justifyContent: "flex-start",
                  color: "#CBD5E1",
                  fontSize: "15px",
                  fontWeight: 500,
                  borderRadius: "10px",
                  py: 1.2,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color: "#F1F5F9",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

          <Stack mt={2} gap={1}>
            {token ? (
              <Button
                variant="outlined"
                onClick={() => {
                  signout();
                  toggleMobile();
                }}
                fullWidth
                sx={{
                  borderColor: "rgba(239,68,68,0.4)",
                  color: "#EF4444",
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "rgba(239,68,68,0.08)" },
                }}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/log-in"
                  onClick={toggleMobile}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "rgba(79,124,255,0.4)",
                    color: "#4F7CFF",
                    borderRadius: "10px",
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/sign-up"
                  onClick={toggleMobile}
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: "10px" }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}

export default Navbar;
