import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import { userRequest } from "../../../Utils/request";


//@ts-ignore
function ComentFeedback( {id} ) {
  const { baseUrl } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit, control,setValue } = useForm({
    defaultValues: {
      roomId: id,
    },
  });
  const onSubmit = async (data: any) => {
    try {
      const response = await userRequest.post(
        `${baseUrl}/portal/room-comments`,

        data
      );
      showToast("success", response.data.message);
     
    } catch (error: any) {
      showToast("error", error.response.data.message);
    }finally{
      //@ts-ignore
      setValue("comment","")
    }
    
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="roomId"
        control={control}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <TextField
        placeholder="Type in here…"
        multiline
        rows={2}
        variant="outlined"
        fullWidth
        //@ts-ignore
        {...register("comment")}
      />

      <Box style={{ marginTop: "1rem" }}>
        <Button
          variant="contained"
          style={{ textAlign: "end" }}
          color="primary"
          type="submit"
        >
          Send
        </Button>
      </Box>
    </form>
  );
}

export default ComentFeedback;
