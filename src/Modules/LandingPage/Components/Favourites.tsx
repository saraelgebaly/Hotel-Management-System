import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import { getErrorMessage } from "../../../Utils/error";
import formatCurrency from "../../../Utils/formatCurrency";
function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const { baseUrl, requestHeaders } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate("/home");
  };
  const getFavourtes = async () => {
    try {
      const response = await axios.get(`${baseUrl}/portal/favorite-rooms`, {
        headers: requestHeaders,
      });
      setFavourites(response.data.data.favoriteRooms[0]?.rooms);
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteFavourite = async (roomId: string) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/portal/favorite-rooms/${roomId}`,

        {
          headers: requestHeaders,

          data: { roomId },
        }
      );
      showToast("success", response.data.message);
      getFavourtes();
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    }
  };
  useEffect(() => {
    getFavourtes();
  }, []);
  return (
    <>
      <Container>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
            color="inherit"
            to="/dashuser"
            onClick={handleClick}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="large" color="primary" />
            Home
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <FavoriteBorderIcon sx={{ mr: 0.5 }} fontSize="large" />
            Favourites
          </Typography>
        </Breadcrumbs>
        <Typography
          textAlign="center"
          variant="h3"
          fontWeight="600"
          color="#152C5B"
        >
          Your Favourite Rooms
        </Typography>
        <Grid
          container
          sx={{ display: "flex", gap: 5, justifyContent: "center", my: 2 }}
        >
          {loading ? (
            Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={11} sm={5} md={4} lg={3} key={index}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={220}
                  sx={{ borderRadius: "15px" }}
                />
              </Grid>
            ))
          ) : favourites.length > 0 ? (
            favourites?.map((favourite: any | void) => (
              <Grid
                item
                xs={12}
                md={3}
                key={favourite._id}
                component="div"
                sx={{
                  position: "relative ",
                  overflow: "hidden",
                  "&:hover > div": { opacity: "1" },
                  height: "250px",
                }}
              >
                <img
                  src={favourite.images[0]}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "15px",
                  }}
                  alt=""
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "red",
                    p: 1.5,
                    borderRadius: "0 0 0 15px",
                    backgroundColor: "#FF498B",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {formatCurrency(favourite.price)} per night
                </Box>
                <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 2 }}>
                  <Typography
                    variant="caption"
                    color="white"
                    sx={{ fontSize: "17px" }}
                  >
                    {favourite.roomNumber}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(32, 63, 199, 0.3)",
                    opacity: 0,
                    zIndex: 1,
                    transition: "all .3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <FavoriteIcon
                    onClick={() => handleDeleteFavourite(favourite._id)}
                    sx={{ color: "red", cursor: "pointer", mx: 1 }}
                  />

                  <Link to={`/details`} state={{ roomId: favourite._id }}>
                    <VisibilityIcon
                      sx={{ color: "white", cursor: "pointer" }}
                    />
                  </Link>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography textAlign="center" variant="h4" color="#B0B0B0">
              No Favourite Rooms Add Some!
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Favourites;
