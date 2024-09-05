import { Alert, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../Context/ToastContext";
import { getErrorMessage } from "../../../Utils/error";
import { publicRequest } from "../../../Utils/request";
import forgetImg from "../../../assets/Images/forget-reset.png";

type Input = {
  email: string;
};
function ForgetPassword() {
  const { showToast } = useToast();

  const navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      const response = await publicRequest.post(
        "https://upskilling-egypt.com:3000/api/v0/admin/users/forgot-password",
        data
      );
      showToast("success", response.data.message);
      navigate("/auth/resetpass");
    } catch (error: any) {
      const err = getErrorMessage(error.response.data.message);
      showToast("error", err);
    }
  };
  return (
    <>
      <Grid container display="flex" justifyContent="center">
        <Grid item xs={12} md={6} sm={12} sx={{ ml: "50px" }}>
          <Typography sx={{ m: "15px", color: "#152C5B", fontWeight: 700 }}>
            <Typography
              sx={{
                display: "inline-block",
                color: "#3252DF",
                fontWeight: 700,
              }}
            >
              Stay
            </Typography>
            cation.
          </Typography>
          <Box sx={{ my: "25px" }}>
            <Typography variant="h5" sx={{ ml: "100px", fontWeight: 700 }}>
              Forgot password
            </Typography>
            <Typography sx={{ ml: "100px" }}>
              If you already have an account register
              <Typography>
                You can
                <Link
                  style={{
                    color: "#ff0000",
                    textDecoration: "none",
                    marginInline: "5px",
                  }}
                  to="/auth/login"
                >
                  Login here !
                </Link>
              </Typography>
            </Typography>
          </Box>
          <Box
            onSubmit={handleSubmit(onSubmit)}
            component={"form"}
            sx={{
              width: "60%",
              mx: "100px",
              my: "100px",
            }}
          >
            <label style={{ color: "#3252DF" }}>Email</label>
            <TextField
              focused={false}
              sx={{
                width: "100%",
                backgroundColor: "#F5F6F8",
                my: "7px",
              }}
              placeholder="Enter your Email"
              variant="filled"
              size="small"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <Alert variant="filled" severity="error">
                {errors.email.message}
              </Alert>
            )}
            <Button
              size="medium"
              color="primary"
              variant="contained"
              type="submit"
              sx={{ width: "100%", my: "20px" }}
            >
              Send mail
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          md={5}
          sm={12}
          xs={12}
          display={{sm:"none",xs:"none",md:"flex"}}
          sx={{
            position: "relative",
            zIndex: 0,
            padding: "25px",
          }}
        >
          <img src={forgetImg} style={{ width: "100%", height: "100%" }} />
          <Box
            sx={{
              position: "absolute",
              bottom: "80px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#FFFFFF",
                mx: "80px",
              }}
            >
              Forgot password
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                mx: "80px",
              }}
            >
              Homes as unique as you.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ForgetPassword;
