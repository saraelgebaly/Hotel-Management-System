import { Box, Button, Rating, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import { userRequest } from "../../../Utils/request";

//@ts-ignore
function RatingComponent({ id }) {
  const { baseUrl } = useAuth();
  const { showToast } = useToast();

  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      roomId: id,
    },
  });

  //@ts-ignore
  const [rateValue, setRateValue] = useState<number | null>(2); //@ts-ignore

  const onSubmit = async (data) => {
    try {
      const response = await userRequest.post(
        `${baseUrl}/portal/room-reviews`,

        data
      );
      showToast("success", response.data.message);
    } catch (error: any) {
      showToast("error", error.response.data.message);
    } finally {
      //@ts-ignore
      setValue("review", "");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="roomId"
        control={control}
        render={({ field }) => <input type="hidden" {...field} />}
      />

      <Controller
        //@ts-ignore
        name="rating"
        control={control}
        defaultValue={rateValue}
        render={({ field: { onChange } }) => (
          <Rating name="rating" onChange={onChange} />
        )}
      ></Controller>

      <TextField
        placeholder="Type in here…"
        multiline
        rows={2}
        variant="outlined"
        fullWidth
        //@ts-ignore
        {...register("review")}
      />

      <Box style={{ marginTop: "1rem" }}>
        <Button variant="contained" type="submit">
          Rate
        </Button>
      </Box>
    </form>
  );
}
export default RatingComponent;
