import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../../Context/ToastContext";
import { Facility, Inputs } from "../../../Interfaces/interface";
import { getErrorMessage } from "../../../Utils/error";
import { userRequest } from "../../../Utils/request";

function RoomsData() {
  const [facilitiesList, setFacilitiesList] = useState([]);
  const [images, setImages] = useState([]);


  const location = useLocation();
  const roomId = location.pathname.split("/")[3];
  const roomData = location.state?.roomData;
  const state = location.state?.state;
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const handleImageUpload = (e: any) => {
    e.preventDefault();
    setImages(e.target.files);
  };

  const getFacilitiesList = async () => {
    try {
      const response = await userRequest.get(`/admin/room-facilities`);
      setFacilitiesList(response.data.data.facilities);
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };
  const appendToFormData = (data: Inputs) => {
    console.log(data);
    const formData = new FormData();
    formData.append("roomNumber", data?.roomNumber);
    formData.append("price", data?.price);
    formData.append("capacity", data?.capacity);
    formData.append("discount", data?.discount);
    if (Array.isArray(data.facilities)) {
      data.facilities.map((facility: string) =>
        formData.append("facilities[]", facility)
      );
    }

    for (let i = 0; i < images.length; i++) {
      formData.append("imgs", images[i]);
    }
    return formData;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const addFormData = appendToFormData(data);
    console.log(data);

    try {
      const res = await userRequest({
        method: state === "edit" ? "put" : "post",
        url: state === "edit" ? `/admin/rooms/${roomId}` : `/admin/rooms`,
        data: addFormData,
      });
      console.log(res);

      showToast("success", res.data.message);
      navigate("/dashboard/rooms");
    } catch (error: any) {
      console.log(error);

      showToast("error", getErrorMessage(error.response.data.message));
    }
  };

  useEffect(() => {
    getFacilitiesList();

    if (state === "edit" && roomData) {
      setValue("roomNumber", roomData.roomNumber);
      setValue("price", roomData.price);
      setValue("capacity", roomData.capacity);
      setValue("discount", roomData.discount);
      setValue(
        "facilities",
        roomData.facilities.map((item: { _id: string }) => item?._id)
      );
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [roomData, setValue]);
  return (
    <Container sx={{ marginTop: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid
          lg={9}
          container
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Grid item md={12}>
            <TextField
              size="small"
              label="Room Number"
              variant="filled"
              {...register("roomNumber", {
                required: "Room Number is required",
              })}
              fullWidth
            />
            {errors.roomNumber && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.roomNumber.message}
              </Alert>
            )}
          </Grid>

          <Grid
            item
            sm={12}
            sx={{ display: "flex", gap: 2, backgroundColor: "gol" }}
          >
            <Grid item sm={12}>
              <TextField
                size="small"
                label="Price"
                variant="filled"
                {...register("price", {
                  required: "Price is required",
                })}
                defaultValue={roomData?.price}
                fullWidth
              />
              {errors.price && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.price.message}
                </Alert>
              )}
            </Grid>

            <Grid item sm={12}>
              <TextField
                size="small"
                label="Capacity"
                variant="filled"
                {...register("capacity", {
                  required: "capacity is required",
                })}
                defaultValue={roomData?.capacity}
                fullWidth
              />
              {errors.capacity && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.capacity.message}
                </Alert>
              )}
            </Grid>
          </Grid>

          <Grid
            item
            sm={12}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Grid item sm={12}>
              <TextField
                size="small"
                label="Discount"
                variant="filled"
                {...register("discount", {
                  required: "discount is required",
                })}
                defaultValue={roomData?.discount}
                fullWidth
              />
              {errors.discount && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.discount.message}
                </Alert>
              )}
            </Grid>
            <Grid item sm={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel id="demo-multiple-checkbox-label">
                  Facilities
                </InputLabel>
                <Select
                  size="small"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  //@ts-ignore
                  value={watch("facilities") || []}
                  {...register("facilities", {
                    required: "facilities is required",
                  })}
                  label="Facilities"
                  renderValue={(selected: Facility) => (
                    <div>
                      {
                        //@ts-ignore
                        selected.map((id: string) => (
                          <span style={{ margin: "8px" }} key={id}>
                            {
                              facilitiesList.find(
                                (facility: Facility) => facility._id === id
                                //@ts-ignore
                              )?.name
                            }
                          </span>
                        ))
                      }
                    </div>
                  )}
                >
                  {facilitiesList.map((item: Facility) => (
                    <MenuItem key={item._id} value={item._id}>
                      <Checkbox
                        checked={watch("facilities")?.includes(item._id)}
                      />
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.facilities && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.facilities.message}
                </Alert>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ width: "100%" }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <input
                type="file"
                style={{ display: "none" }}
                multiple
                onChange={handleImageUpload}
              />
            </Button>
          </Grid>

          <Box sx={{ mt: 2, alignSelf: "end" }}>
            <Button
              onClick={() => navigate("/dashboard/rooms")}
              variant="outlined"
              size="large"
              sx={{ mr: 3 }}
            >
              Cancle
            </Button>
            <Button variant="contained" size="large" type="submit">
              Save
            </Button>
          </Box>
        </Grid>
        <Grid container mt={2} spacing={0}></Grid>
      </Box>
    </Container>
  );
}

export default RoomsData;
