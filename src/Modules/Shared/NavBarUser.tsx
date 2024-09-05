import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Modal,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";
import { userRequest } from "../../Utils/request";
import ChangePassword from "../Authentication/Components/ChangePassword";

function NavBarUser() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { showToast } = useToast();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const logout = () => {
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      showToast("success", "Logged out successfully");
      window.location.reload();
    }, 1000);
  };
  const userId = localStorage.getItem("userId");
  const [profileData, setProfileData] = useState<any>({});
  const getUserProfile = async () => {
    const response = await userRequest.get(`/portal/users/${userId}`);
    setProfileData(response.data?.data?.user);
    console.log(response);
  };
  const navigate = useNavigate();
  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            px: 3,
            py: 5,
            borderRadius: 2,
          }}
        >
          <ChangePassword />
        </Box>
      </Modal>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          outline: "2px solid #E5E5E5 ",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              paddingInline: { md: 17 },
            }}
          >
            <Box
              sx={{
                backgroundColor: "greenyello",
                display: { xs: "none", md: "flex" },
                mr: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: { sm: 24 },
                  fontWeight: 500,
                  display: "inline",
                  color: "#3252df",
                }}
              >
                Stay
              </Typography>
              <Typography
                sx={{
                  fontSize: { sm: 24 },
                  fontWeight: 500,
                  display: "inline",
                  color: "#152c5b",
                }}
              >
                cation.
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* {pages.map((page) => ( */}

                <MenuItem onClick={() => navigate("/")}>
                  <Link
                    textAlign="center"
                    sx={{ textDecoration: "none", color: "#3f50b5" }}
                  >
                    Home
                  </Link>
                </MenuItem>

                <MenuItem onClick={() => navigate("explore")}>
                  <Link
                    textAlign="center"
                    sx={{ textDecoration: "none", color: "#3f50b5" }}
                  >
                    Explore
                  </Link>
                </MenuItem>

                <MenuItem onClick={() => navigate("favorites")}>
                  <Link
                    textAlign="center"
                    sx={{ textDecoration: "none", color: "#3f50b5" }}
                  >
                    Favorites
                  </Link>
                </MenuItem>

                {!localStorage.getItem("token") ? (
                  <>
                    <MenuItem
                      sx={{ textAlign: "center", color: "#3f50b5" }}
                      onClick={() => navigate("/auth/login")}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      sx={{ textAlign: "center", color: "#3f50b5" }}
                      onClick={() => navigate("/auth/register")}
                    >
                      Register
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    sx={{ textAlign: "center", color: "#3f50b5" }}
                    onClick={logout}
                  >
                    Logout
                  </MenuItem>
                )}
              </Menu>
            </Box>

            <Box
              sx={{
                mr: 2,
                backgroundColor: "gol",
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 22 },
                  fontWeight: 500,
                  display: "inline",
                  color: "#3252df",
                }}
              >
                Stay
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 22 },
                  fontWeight: 500,
                  display: "inline",
                  color: "#152c5b",
                }}
              >
                cation
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: "greenyello",
                display: { xs: "none", md: "flex" },
                justifyContent: "end",
                gap: 4,
                fontSize: "14px",
              }}
            >
              <Link
                onClick={() => navigate("")}
                sx={{
                  color: "#152c5b",
                  textDecoration: "none",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                Home
              </Link>
              <Link
                onClick={() => navigate("explore")}
                sx={{
                  color: "#152c5b",
                  textDecoration: "none",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                Explore
              </Link>
              <Link
                onClick={() => navigate("favorites")}
                sx={{
                  color: "#152c5b",
                  textDecoration: "none",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                Favorites
              </Link>

              {localStorage.getItem("token") ? (
                <>
                  <Button variant="contained" color="primary" onClick={logout}>
                    Logout
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                  >
                    Change Password
                  </Button>
                  <Box display="flex">
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                      src={profileData?.profileImage}
                      alt="Profile-Image"
                    />
                    <Typography mx={1} fontWeight={700} fontSize="20px">
                      {profileData?.userName}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Link onClick={() => navigate("/auth/login")}>
                    <Button variant="contained">Login</Button>
                  </Link>
                  <Link onClick={() => navigate("/auth/register")}>
                    <Button variant="contained">Register</Button>
                  </Link>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavBarUser;
