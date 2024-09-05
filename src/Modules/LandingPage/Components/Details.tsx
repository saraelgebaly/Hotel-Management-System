import {
  Box,
  Button,
  Container,
  Grid,
  Modal
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
//@ts-ignore
import { Dayjs, Range } from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import { RoomsListProps } from "../../../Interfaces/interface";
import { getErrorMessage } from "../../../Utils/error";
import formatCurrency from "../../../Utils/formatCurrency";
import { userRequest } from "../../../Utils/request";
import ac from "../../../assets/Images/ic_ac 1.png";
import bathroom from "../../../assets/Images/ic_bedroom (1).png";
import bedroom from "../../../assets/Images/ic_bedroom.png";
import diningroom from "../../../assets/Images/ic_diningroom 1.png";
import kulkas from "../../../assets/Images/ic_kulkas.png";
import livingroom from "../../../assets/Images/ic_livingroom.png";
import tv from "../../../assets/Images/ic_tv.png";
import wifi from "../../../assets/Images/ic_wifi 1.png";
import Calendar from "./Calendar";
import ComentFeedback from "./ComentFeedback";
import RatingComponent from "./Rating";

function Details() {
  const [roomDetails, setRoomDetails] = useState<RoomsListProps>({
    _id: "",
    capacity: 0,
    price: 0,
    roomNumber: "",
    facilities: [],
    discount: 0,
    images: [],
    createdAt: "",
    updatedAt: "",
    createdBy: { _id: "", userName: "" },
  });
  const location = useLocation();

  let { date, capacity, roomId } = location.state || {};

  const { baseUrl } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showToast } = useToast();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate("/home");
  };

  const getRoomDetails = async () => {
    try {
      const { data } = await userRequest(`/portal/rooms/${state.roomId}`);
      setRoomDetails(data.data.room);
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };
  const startDate = date && date[0];
  const endDate = date && date[1];
  const [selectedDateRange, setSelectedDateRange] = useState<Range<Dayjs>>([
    startDate,
    endDate,
  ]);

  const [count, setCount] = useState(1);
  const [newCapacity, setCapacity] = useState(capacity);

  const handleIncrement = () => {
    setCapacity((prev: number) => prev + 1);
    setCount((prev) => prev + 1);
  };
  const handleDecrement = () => {
    if (newCapacity > 1) {
      setCapacity((prev: number) => prev - 1);

      setCount((prev) => prev - 1);
    }
  };
  const createBooking = async () => {
    try {
      const response = await userRequest.post(`${baseUrl}/portal/booking`, {
        startDate: selectedDateRange[0],
        endDate: selectedDateRange[1],
        room: roomDetails._id,
        totalPrice: roomDetails.price,
      });

      return response.data;
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    }
  };
  const handleBooking = async (e: any) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      return handleOpen();
    } else if (localStorage.getItem("userRole") !== "user") {
      showToast(
        "error",
        "please ensure you are logged in to your user account"
      );
    } else {
      try {
        const response = await createBooking();
        console.log(response.data?.booking?._id);
        navigate(`/payment/${response.data?.booking?._id}`);
      } catch (error: any) {
        showToast("error", getErrorMessage(error.response.data.message));
      }
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  const facilitiesDetails = [
    { Icon: bedroom, main: 5, sub: "bedroom" },
    { Icon: livingroom, main: 1, sub: "livingRoom" },
    { Icon: bathroom, main: 3, sub: "bathroom" },
    { Icon: diningroom, main: 1, sub: "diningRoom" },
    { Icon: wifi, main: 10, sub: "mbp/s" },
    { Icon: ac, main: 7, sub: "unitReady" },
    { Icon: kulkas, main: 2, sub: "refigrator" },
    { Icon: tv, main: 4, sub: "television" },
  ];

  return (
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
          Home
        </Link>
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          color="text.primary"
          variant="body1"
          fontWeight={600}
        >
          Room Details
        </Typography>
      </Breadcrumbs>
      <Box>
        <Typography
          variant="h5"
          sx={{ display: "flex", justifyContent: "center", mb: 2 }}
        >
          {roomDetails.roomNumber}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            "div:nth-child(1)": { gridRowStart: 1, gridRowEnd: 3 },
          }}
        >
          {roomDetails.images.slice(0, 3).map((image) => (
            <Box
              component="div"
              sx={{
                position: "relative",
                borderRadius: "15px",
                overflow: "hidden",
                "&:hover > div": { opacity: "1" },
              }}
            >
              <img
                src={image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt=""
              />
            </Box>
          ))}
        </Box>

        <Grid container mt={6}>
          <Grid item md={6} color="#B0B0B0">
            <Typography variant="body1" fontSize="15px">
              Minimal techno is a minimalist subgenre of techno music. It is
              characterized by a stripped-down aesthetic that exploits the use
              of repetition and understated development. Minimal techno is
              thought to have been originally developed in the early 1990s by
              Detroit-based producers Robert Hood and Daniel Bell.
            </Typography>
            <Typography variant="body1" py={1} fontSize="15px">
              Such trends saw the demise of the soul-infused techno that
              typified the original Detroit sound. Robert Hood has noted that he
              and Daniel Bell both realized something was missing from techno in
              the post-rave era.
            </Typography>
            <Typography variant="body1" fontSize="15px">
              Design is a plan or specification for the construction of an
              object or system or for the implementation of an activity or
              process, or the result of that plan or specification in the form
              of a prototype, product or process. The national agency for
              design: enabling Singapore to use design for economic growth and
              to make lives better.
            </Typography>
            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}>
              {facilitiesDetails.map((facility, index) => (
                <Box key={index} sx={{ flexBasis: "25%" }}>
                  <img src={facility.Icon} width={36} height={36} alt="Icons" />
                  <Typography>
                    {facility.main}
                    <Typography variant="caption">{facility.sub}</Typography>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box sx={{ p: 3, pl: { xs: 0, md: 5 } }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Start Booking
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h4" color="#1ABC9C">
                  {formatCurrency(roomDetails.price)}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight="100"
                  sx={{ color: "#B0B0B0", fontSize: "30px" }}
                >
                  per night
                </Typography>
              </Box>
              <Typography variant="caption" color="#FF1612">
                Discount
                {((roomDetails.discount / roomDetails.price) * 100).toFixed(2)}
                Off
              </Typography>

              <Box mt={4}>
                <Typography variant="caption">Pick a Date</Typography>

                <Calendar {...{ setSelectedDateRange, selectedDateRange }} />

                <Typography variant="body1" sx={{ color: "#B0B0B0", mt: 2 }}>
                  You will pay{"  "}
                  <span style={{ color: "#152C5B", fontWeight: "bold" }}>
                    {formatCurrency(
                      roomDetails.price * newCapacity
                        ? roomDetails.price * newCapacity
                        : roomDetails.price * count
                    )}{" "}
                    USD
                  </span>
                  <span
                    style={{
                      color: "#152C5B",
                      fontWeight: "bold",
                      paddingLeft: 5,
                    }}
                  >
                    per {newCapacity ? newCapacity : count} Person
                  </span>
                </Typography>
                <Typography color="#152C5B" fontWeight={500} sx={{ mt: 2 }}>
                  Capacity
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    onClick={() => {
                      handleDecrement();
                    }}
                    color="error"
                    variant="contained"
                  >
                    -
                  </Button>

                  <Typography
                    bgcolor="#F5F6F8"
                    paddingInline={{ xs: 8, lg: 10 }}
                    borderRadius={1}
                    textAlign="center"
                    py={1}
                  >
                    {newCapacity ? newCapacity : count}
                  </Typography>

                  <Button
                    onClick={() => {
                      handleIncrement();
                    }}
                    color="success"
                    variant="contained"
                  >
                    +
                  </Button>
                </Box>
                <Button
                  onClick={handleBooking}
                  variant="contained"
                  sx={{ ml: 10, mt: 2 }}
                >
                  Continue Book
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {localStorage.getItem("token") &&
      localStorage.getItem("userRole") === "user" ? (
        <>
          <Box className="review">
            <Box className="roomfeedback">
              <Typography color="#152C5B" fontSize="40px">
                Rating
              </Typography>
              <RatingComponent id={roomId} />
           
            </Box>
            <Box className="reviewLine"></Box>
            <Box className="comments">
              <Typography color="#152C5B" fontSize="40px">
                Comment
              </Typography>
              <ComentFeedback id={roomId} />
            </Box>
          </Box>
        </>
      ) : (
        ""
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            textAlign="center"
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            You should login first!
          </Typography>
          <Box display="flex" justifyContent="space-between" my={3}>
            <Button variant="contained">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/auth/login"
              >
                Login
              </Link>
            </Button>
            <Button variant="contained" color="success">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/auth/register"
              >
                Register
              </Link>
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
export default Details;
