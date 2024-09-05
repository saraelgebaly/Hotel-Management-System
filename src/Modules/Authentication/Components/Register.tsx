import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../Context/ToastContext";
import { getErrorMessage } from "../../../Utils/error";
import { publicRequest } from "../../../Utils/request";
import imageRegister from "../../../assets/Images/sign-up.png";

// type FormValue = {
//   userName: string;
//   email: string;
//   country: string;
//   phoneNumber: string;
//   profileImage: FileList;
//   password: string;
//   confirmPassword: string;
// };
interface UserData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  role: string;
  profileImage: FileList;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function Register() {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<UserData>();
  // const form = useForm<FormValue>({
  //   defaultValues: {
  //     userName: "",
  //     email: "",
  //     country: "",
  //     phoneNumber: "",
  //     // profileImage:[0],
  //     password: "",
  //     confirmPassword: "",
  //   },
  // });

  // const { register, handleSubmit, formState } = form;
  // const { errors } = formState;
  const navigate = useNavigate();
  const appendToFormData = (data: UserData) => {
    data.role = "user";

    console.log(data);

    const addFormData = new FormData();

    addFormData.append("userName", data?.userName);
    addFormData.append("email", data?.email);
    addFormData.append("password", data?.password);
    addFormData.append("confirmPassword", data?.confirmPassword);
    addFormData.append("phoneNumber", data?.phoneNumber);
    addFormData.append("country", data?.country);
    addFormData.append("role", data?.role);
    addFormData.append("profileImage", data?.profileImage[0]);
    return addFormData;
  };

  const onSubmit = async (data: UserData) => {
    const addFormData = appendToFormData(data);
    try {
      const response = await publicRequest.post(
        "https://upskilling-egypt.com:3000/api/v0/admin/users",
        addFormData
      );
      console.log(response);

      showToast("success", response.data.message);
      navigate("/auth/login");
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
      console.log(error);
      
    }
  };

  return (
  
    <>
      <Grid
        container
        sx={{
          backgroundColor: "gra",
          padding: { xs: 1, sm: 2 },
          justifyContent: { xs: "center" },
          alignItems: { sm: "center", md: "start" },
          gap: { md: 0, lg: 1 },
        }}
      >
        <Grid
          item
          xs={12}
          sm={10}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingInline: { md: 4, lg: 0 },
            gap: { md: 0, xl: 4 },
          }}
        >
          {" "}
          <Box
            sx={{
              textAlign: "start",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 26, sm: 30 },
                fontWeight: 500,
                display: "inline",
                color: "#3252df",
              }}
            >
              Stay
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 26, sm: 30 },
                fontWeight: 500,
                display: "inline",
                color: "#152c5b",
              }}
            >
              cation.
            </Typography>
          </Box>
          
          <Box
            component="main"
            sx={{
              padding: { xs: "20px", md: "" },
            }}
          >
            <Box component="div">
              <Typography variant="h4" component="h4">
                Sign up
              </Typography>
              <Typography>
                If you already have an account register
                <br /> You can
                <Link
                  to="/auth/login"
                  style={{
                    textDecoration: "none",
                    fontWeight: "bold",
                    marginInline: "5px",
                  }}
                >
                  Login here !
                </Link>
              </Typography>
            </Box>
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
              <TextField
                variant="outlined"
                type="text"
                className="auth-input"
                label="User Name"
                color="primary"
                {...register("userName", {
                  required: "User Name is required",
                })}
                error={!!errors.userName}
                helperText={
                  !!errors.userName
                    ? errors?.userName?.message?.toString()
                    : null
                }
              />

              <Box className="inputsContainer">
                <TextField
                  variant="outlined"
                  type="tel"
                  className="auth-input"
                  label="Phone Number"
                  color="primary"
                  {...register("phoneNumber", {
                    required: "Phone Number is required",
                    pattern: {
                      value: /^01[0125][0-9]{8}$/,
                      message:
                        "Phone number must start with 01 and be 11 digits in total",
                    },
                  })}
                  error={!!errors.phoneNumber}
                  helperText={
                    !!errors.phoneNumber
                      ? errors?.phoneNumber?.message?.toString()
                      : null
                  }
                />

                <TextField
                  variant="outlined"
                  type="text"
                  className="auth-input"
                  label="Country"
                  color="primary"
                  {...register("country", {
                    required: "Country is required",
                  })}
                  error={!!errors.country}
                  helperText={
                    !!errors.country
                      ? errors?.country?.message?.toString()
                      : null
                  }
                />
              </Box>

              <TextField
                variant="outlined"
                type="email"
                className="auth-input"
                label="Email"
                color="primary"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Email is InValid",
                  },
                })}
                error={!!errors.email}
                helperText={
                  !!errors.email ? errors?.email?.message?.toString() : null
                }
              />

              <TextField
                variant="outlined"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                label="Password"
                color="primary"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("password", {
                  required: "Password is required",
                })}
                error={!!errors.password}
                helperText={
                  !!errors.password
                    ? errors?.password?.message?.toString()
                    : null
                }
              />
              <TextField
                variant="outlined"
                type={showConfirmPassword ? "text" : "password"}
                className="auth-input"
                label="Confirm password"
                color="primary"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === getValues("password") ||
                    "password is don't match",
                })}
                error={!!errors.confirmPassword}
                helperText={
                  !!errors.confirmPassword
                    ? errors?.confirmPassword?.message?.toString()
                    : null
                }
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  width: "100%",
                  mt: 2,
                  fontSize: {
                    xs: "0.8rem",
                    sm: "1rem",
                    md: "1rem",
                  },
                }}
              >
                Upload Profile Image
                <VisuallyHiddenInput
                  type="file"
                  {...register("profileImage")}
                  //@ts-ignore
                  error={!!errors.profileImage}
                  helperText={
                    !!errors.profileImage
                      ? errors?.profileImage?.message?.toString()
                      : null
                  }
                />
              </Button>

              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  mt: 2,
                  padding: { lg: ".5em" },
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1rem",
                    md: "1rem",
                  },
                }}
                type="submit"
                size="large"
              >
                Sign up
              </Button>
            </Box>
          </Box>
          {/* </Box> */}
        </Grid>
        <Grid
          item
          sm={6}
          md={6}
          lg={5}
          sx={{
            backgroundColor: "re",
            alignSelf: { md: "center" },
            display: {
              xs: "none",
              sm: "none",
              md: "flex",
              justifyContent: "center",
            },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "100%" },
              paddingTop: 0.5,
            }}
          >
            <img src={imageRegister} style={{ width: "100%" }} alt="Register" />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Register;
