import MenuIcon from "@mui/icons-material/Menu";
import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useEffect, useState } from "react";
import { useSidebar } from "../../Context/SideBarContext";
import { userRequest } from "../../Utils/request";

function NavBar() {
  const { toggleSidebar } = useSidebar();

  const userId = localStorage.getItem("userId");
  const [profileData, setProfileData] = useState<any>({});
  const getAdminProfile = async () => {
    const response = await userRequest.get(`/admin/users/${userId}`);
    setProfileData(response.data?.data?.user);
  };

  useEffect(() => {
    getAdminProfile();
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#f5f5f5",
          paddingInline: { xs: 0, md: 2 },
          borderRadius: "10px",
          color: "black",
          boxShadow: "none",
          mt: "10px",
        }}
      >
        <Toolbar variant="dense" sx={{ padding: { xs: 1, lg: 0.5 } }}>
          <IconButton
            sx={{ p: "10px", display: { md: "none", sm: "none" } }}
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>

          <img
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            src={profileData?.profileImage}
            alt="Profile-Image"
          />
          <Typography mx={1} fontWeight={700} fontSize="20px">
            {profileData?.userName}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
