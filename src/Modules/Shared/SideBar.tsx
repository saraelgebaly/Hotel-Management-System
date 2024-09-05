import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useToast } from "../../Context/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useSidebar } from "../../Context/SideBarContext";
import ChangePassword from "../../Modules/Authentication/Components/ChangePassword";
import { Bookmark, Star, VerifiedUser } from "@mui/icons-material";
function SideBar() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { toggled, collapsed, setCollapsed, toggleSidebar } = useSidebar();

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const logout = () => {
    setLoading(true);

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/auth/login");
    showToast("success", "Logged out successfully");
    setLoading(false);
  };

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

      <div className="sidebar-container sticky-top">
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          breakPoint="sm"
          onBackdropClick={toggleSidebar}
        >
          <Menu style={{ backgroundColor: "orang", marginTop: 50 }}>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <MenuItem
                onClick={handleCollapse}
                style={{ textAlign: "center", marginBottom: 15 }}
              >
                <button>
                  <MenuIcon
                    sx={{ marginTop: 1, marginRight: { xs: 2, sm: 0 } }}
                  />
                </button>
              </MenuItem>
            </Box>

            <Box
              sx={{
                display: { sm: "none", xs: "none" },
                backgroundColor: "gree",
              }}
            >
              <MenuItem
                component={<Link to="" />}
                style={{ backgroundColor: "orang", marginBottom: "15px" }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 22 },
                    fontWeight: 600,
                    display: "inline",
                    color: "#fff",
                  }}
                >
                  Stay
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 22 },
                    fontWeight: 600,
                    display: "inline",
                    color: "#fff",
                  }}
                >
                  cation.
                </Typography>
              </MenuItem>
            </Box>

            <MenuItem
              component={<Link to="" />}
              icon={
                <HomeIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Home</button>
            </MenuItem>

            <MenuItem
              component={<Link to="users" />}
              icon={
                <GroupIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Users</button>
            </MenuItem>

            <MenuItem
              component={<Link to="rooms" />}
              icon={
                <MeetingRoomIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Rooms</button>
            </MenuItem>

            <MenuItem
              component={<Link to="adslist" />}
              icon={
                <Bookmark
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>ADS</button>
            </MenuItem>

            <MenuItem
              component={<Link to="facilities" />}
              icon={
                <Star sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }} />
              }
            >
              <button>Facilities</button>
            </MenuItem>

            <MenuItem
              component={<Link to="booking" />}
              icon={
                <VerifiedUser
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Booking</button>
            </MenuItem>

            <MenuItem
              onClick={handleOpen}
              icon={
                <LockOpenIcon
                  sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                />
              }
            >
              <button>Change Password</button>
            </MenuItem>

            <MenuItem
              onClick={logout}
              icon={
                loading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <ExitToAppIcon
                    sx={{ color: "white", marginRight: { xs: 0, sm: 0 } }}
                  />
                )
              }
            >
              <button disabled={loading}>Logout</button>
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </>
  );
}

export default SideBar;
