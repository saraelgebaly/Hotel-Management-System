import {
  Box,
  Button,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import header from "../../../assets/Images/landing.png";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { enGB } from "date-fns/locale";
import axios from "axios";
import { ADS } from "../../../Interfaces/interface";
import photo from "../../../assets/Images/photo.jpg";
import formatCurrency from "../../../Utils/formatCurrency";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import { getErrorMessage } from "../../../Utils/error";
//@ts-ignore
import dayjs, { Dayjs, Range } from "dayjs";

function Home() {
  const { baseUrl, requestHeaders } = useAuth();
  const { showToast } = useToast();
  const [ads, setAds] = useState([]);
  

  const getAds = async () => {
    try {
      const response = await axios.get(`${baseUrl}/portal/ads`);

      const sortAdsByDate = response.data.data.ads
        .sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .slice(0, 5);

      setAds(sortAdsByDate);
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    }
  };
  const handleFavorite = async (roomId: string) => {
    try {
      const response = await axios.post(
        `${baseUrl}/portal/favorite-rooms`,
        { roomId },
        {
          headers: requestHeaders,
        }
      );
      showToast("success", response.data.message);
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    }
  };


  const [capacity, setCapacity] = useState(1);

  const [count, setCount] = useState(1);
  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
    setCapacity(count + 1);
  };
  const handleDecrement = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
      setCapacity(count - 1);
    }
  };
  const today = dayjs();

  const nextDate = dayjs().add(1, "day");
  const [selectedDateRange, setSelectedDateRange] = useState<Range<Dayjs>>([
    today,
    nextDate,
  ]);
  const startDate = dayjs(selectedDateRange[0]).format("YYYY-MM-DD");
  const endDate = dayjs(selectedDateRange[1]).format("YYYY-MM-DD");
  const handleChange = (e: Range<Dayjs>) => {
   
    setSelectedDateRange(e);
  };
  const navigate = useNavigate();
  const goToExplorePage = () => {
    navigate("/explore", {
      state: { capacity: capacity, date: [startDate, endDate] , count: count},
    });
  };
  useEffect(() => {
    getAds();
  }, []);
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mt: 2, color: "#152C5B" }}
          >
            Forget Busy Work, Start Next Vacation
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#B0B0B0", mt: 1, fontSize: "15px" }}
          >
            We provide what you need to enjoy your holiday with family. Time to
            make another memorable moments.
          </Typography>

          <Box mt={4}>
            <Typography variant="subtitle1" fontWeight={600}>
              Start Booking
            </Typography>
            <Typography variant="subtitle2">Pick a Date</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#152C5B",
                  color: "white",
                  borderRadius: "5px",
                  p: 1.7,
                  mt: "5px",
                }}
              >
                <CalendarMonthIcon />
              </Box>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={enGB}
              >
                <DemoContainer components={["SingleInputDateRangeField"]}>
                  <DateRangePicker
                    slots={{ field: SingleInputDateRangeField }}
                    name="allowedRange"
                    label="Start - End"
                    onChange={handleChange}
                    format={"yyyy/MM/dd"}
                    value={selectedDateRange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
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
                // width="50%"
                py={1}
              >
                {count} person
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

            <Box>
              <Button
                onClick={() => goToExplorePage()}
                variant="contained"
                sx={{ marginBlock: 4, px: 12 }}
              >
                Explore
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ order: { xs: 1, md: 2 }, mb: { xs: 2 } }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={header}
              style={{
                width: "70%",
                marginTop: "20px",
                borderTopLeftRadius: "5rem",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "10px",
              }}
              alt=""
            />
          </Box>
        </Grid>
      </Grid>

      {/* Ads List */}
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            "div:nth-child(1)": { gridRowStart: 1, gridRowEnd: 3 },
          }}
        >
          {ads?.map((ad: ADS) => (
            <Box
              key={ad._id}
              component="div"
              sx={{
                position: "relative",
                borderRadius: "15px",
                overflow: "hidden",
                "&:hover > div": { opacity: "1" },
              }}
            >
              <img
                src={ad.room.images[0]}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                {formatCurrency(ad.room.price)} per night
              </Box>
              <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 2 }}>
                <Typography
                  variant="caption"
                  color="white"
                  sx={{ fontSize: "17px" }}
                >
                  {ad.room.roomNumber}
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
                  onClick={() => handleFavorite(ad.room._id)}
                  sx={{ color: "white", cursor: "pointer", mx: 1 }}
                />

                <Link
                  to={`/details`}
                  state={{
                    roomId: ad.room._id,
                   
                  }}
                >
                  <VisibilityIcon sx={{ color: "white", cursor: "pointer" }} />
                </Link>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="section" className="reviewSec">
        <Box className="reviewImg">
          <img src={photo} className="imgReview" alt="user review" />
        </Box>

        <Box className="reviewCon">
          <Typography className="reviewTitle">HappyFamily</Typography>
          <Typography>
            <Rating className="stars" name="read-only" value={5} readOnly />
          </Typography>
          <Typography className="reviewDis">HappyFamilyDes</Typography>
          <Typography color={"gray"} className="reviewCap" variant="caption">
            HappyFamilyAuth
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
