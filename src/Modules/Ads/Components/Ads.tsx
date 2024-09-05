import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "../../../Context/ToastContext";
import { ADS, Form, Rooms } from "../../../Interfaces/interface";
import { getErrorMessage } from "../../../Utils/error";
import { userRequest } from "../../../Utils/request";
import deleteImg from "../../../assets/Images/deleteImg.png";

interface Column {
  id:
    | "capacity"
    | "discount"
    | "createdBy"
    | "isActive"
    | "price"
    | "roomNumber"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: readonly Column[] = [
  {
    id: "roomNumber",
    label: "Room Number",
    minWidth: 70,
  },
  { id: "capacity", label: "Capacity", minWidth: 70 },
  { id: "discount", label: "Discount", minWidth: 70 },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 70,
    align: "right",
  },
  {
    id: "isActive",
    label: "Active",
    minWidth: 70,
    align: "right",
  },
  {
    id: "price",
    label: "Price",
    minWidth: 70,
    align: "right",
  },

  {
    id: "action",
    label: "Action",
    minWidth: 75,
    align: "right",
  },
];
function Ads() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [adsList, setAdsList] = useState<ADS[]>([]);
  const [roomsList, setRoomsList] = useState<Rooms[]>([]);

  const { showToast } = useToast();
//@ts-ignore
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [adsId, setAdsId] = useState<string>("");
  const [adsDiscount, setAdsDiscout] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleEdit = (_id: string, discount: number, active: boolean) => {
    setAdsId(_id);
    setAdsDiscout(discount);
    setIsActive(active);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const [openDelete, setDeleteOpen] = React.useState(false);
  const handleDeleteOpen = (_id: string) => {
    setAdsId(_id);

    setDeleteOpen(true);
  };

  const handleAction = (action: string) => {
    if (action === "Edit") {
      setOpenEdit(true);
    } else if (action === "Delete") {
      setDeleteOpen(true);
    }
  };

  const handleDeleteClose = () => setDeleteOpen(false);
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const getAdsList = async () => {
    try {
      const response = await userRequest.get("/admin/ads", {});
      setAdsList(response.data.data.ads);
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };
  const getRoomsList = async () => {
    try {
      const response = await userRequest.get("/admin/rooms", {});
      setRoomsList(response.data.data.rooms);
      setLoading(false);
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };
  const formatCellValue = (column: Column, ads: ADS) => {
    let value: any = ads[column.id as keyof ADS];
    if (column.id === "capacity") {
      value = ads.room.capacity;
    }
    if (column.id === "price") {
      value = ads.room.price;
    }
    if (column.id === "discount") {
      value = ads.room.discount;
    }
    if (column.id === "createdBy") {
      value = ads.createdBy.userName;
    }
    if (column.id === "isActive") {
      value = ads?.isActive.toString();
    }

    if (column.id === "roomNumber") {
      value = ads.room.roomNumber;
    }

    return value;
  };

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      const response = await userRequest.post(`/admin/ads`, data, {});
      showToast("success", response.data.message);
      handleClose();
      getAdsList();
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };

  const onDeleteSubmit = async () => {
    try {
      const response = await userRequest.delete(`/admin/ads/${adsId}`, {});

      showToast("success", response.data.message);
      handleDeleteClose();
      getAdsList();
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };
  const [selectedAds, setSelectedAds] = React.useState<ADS | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = (ads: ADS) => {
    setSelectedAds(ads);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).split("-").reverse().join("-");
  };
  useEffect(() => {
    getAdsList();
    getRoomsList();
  }, []);
  return (
    <>
      <Grid
        container
        sx={{
          mt: 3,
          mb: 5,
          p: 2.5,
          backgroundColor: "#E2E5EB",
          borderRadius: 2,
          display: "flex",
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: "center",
          gap: 2,
          boxShadow:
            "0px 2px 1px -3px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
      >
        <Grid item>
          <Typography variant="h5" color="initial" sx={{ fontWeight: 500 }}>
            Ads. Table Details
          </Typography>
          <Typography
            color="initial"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            You can check all details
          </Typography>
        </Grid>

        <Grid item>
          <Button onClick={() => handleOpen()} variant="contained">
            Add New Ads
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead >
              <TableRow >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ backgroundColor: "#E2E5EB" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? [...Array(rowsPerPage)].map((_, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell colSpan={columns.length}>
                        <Skeleton
                          variant="rectangular"
                          height={30}
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : adsList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ads) => {
                      return (
                        <TableRow role="checkbox" tabIndex={-1} key={ads._id}>
                          {columns.map((column) => {
                            const value = formatCellValue(column, ads);
                            if (column.id === "action") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <IconButton
                                    onClick={() => handleOpenModal(ads)}
                                  >
                                    <VisibilityIcon color="primary" />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => [
                                      handleEdit(
                                        ads._id,
                                        ads.room.discount,
                                        ads.isActive
                                      ),
                                      handleAction("Edit"),
                                    ]}
                                  >
                                    {" "}
                                    <EditIcon color="warning" />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => [
                                      handleDeleteOpen(ads._id),
                                      handleAction("Delete"),
                                    ]}
                                  >
                                    {" "}
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={adsList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: "#E2E5EB",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            marginBlock={2}
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            Add Ads
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputLabel id="demo-simple-select-label">Room Name</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              sx={{ width: "100%", backgroundColor: "#F7F7F7", my: 1 }}
              {...register("room", { required: "Room is required" })}
              error={!!errors.room}
            >
              {roomsList.map((room) => (
                <MenuItem value={room._id}>{room.roomNumber}</MenuItem>
              ))}
            </Select>

            {errors.room && (
              <Alert sx={{ my: 1 }} variant="filled" severity="error">
                {errors.room.message}
              </Alert>
            )}
            <InputLabel id="demo-simple-select-label">Discount</InputLabel>

            <TextField
              type="number"
              sx={{ width: "100%", backgroundColor: "#F7F7F7", my: 1 }}
              {...register("discount", { required: "Discount is required" })}
            />
            {errors.discount && (
              <Alert sx={{ my: 1 }} variant="filled" severity="error">
                {errors.discount.message}
              </Alert>
            )}
            <InputLabel id="demo-simple-select-label">Active?</InputLabel>

            <Select
              sx={{ width: "100%", backgroundColor: "#F7F7F7", my: 1 }}
              {...register("isActive", { required: "Active is required" })}
            >
              <MenuItem value="true">true</MenuItem>

              <MenuItem value="false">false</MenuItem>
            </Select>
            {errors.isActive && (
              <Alert sx={{ my: 1 }} variant="filled" severity="error">
                {errors.isActive.message}
              </Alert>
            )}
            <Box display="flex" justifyContent="end" gap={2} padding={2}>
              <Button
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            marginBlock={2}
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            Edit Ads
          </Typography>
          <UpdateForm
            isActiveUpdate={isActive}
            discountUpdate={adsDiscount}
            adsId={adsId}
            getAdsList={getAdsList}
            handleEditClose={handleEditClose}
          />
        </Box>
      </Modal>
      <Modal
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            src={deleteImg}
            alt="deleteImg"
            style={{
              display: "block",
              margin: "0 auto",
              padding: "16px",
            }}
          />
          <Typography
            fontWeight={600}
            textAlign="center"
            variant="h6"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            Delete This Ads Room ?
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} padding={2}>
            <Button
              onClick={() => {
                handleDeleteClose();
              }}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onDeleteSubmit();
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" color="initial" sx={{ marginBottom: 2 }}>
            Ads Details
          </Typography>
          {selectedAds && (
            <>
              <img
                style={{ width: "200px", height: "150px" }}
                src={selectedAds.room.images[0]}
                alt="Room-Image"
              />
              <Typography>
                <span style={{ fontWeight: "bold" }}>Name: </span>
                {selectedAds.room.roomNumber}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Capacity: </span>
                {selectedAds.room.capacity}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Price: </span>
                {selectedAds.room.price}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Active: </span>
                {selectedAds.isActive.toString()}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Discount: </span>
                {selectedAds.room.discount}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Created by: </span>
                {selectedAds.createdBy.userName}
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>Created at: </span>
                {formatDate(selectedAds.createdAt)}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Updated at: </span>
                {formatDate(selectedAds.updatedAt)}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Ads;
interface FormProbs {
  isActiveUpdate: boolean;
  discountUpdate: number;
  adsId: string;
  getAdsList: () => void;
  handleEditClose: () => void;
}
function UpdateForm({
  isActiveUpdate,
  discountUpdate,
  adsId,
  getAdsList,
  handleEditClose,
}: FormProbs) {
  const { showToast } = useToast();
  const onEditSubmit: SubmitHandler<Form> = async (data) => {
    try {
      const response = await userRequest.put(`/admin/ads/${adsId}`, data, {});

      showToast("success", response.data.message);
      handleEditClose();
      getAdsList();
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    }
  };
  let {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<Form>();

  return (
    <>
      <form onSubmit={handleSubmit(onEditSubmit)}>
        <InputLabel id="demo-simple-select-label">Discount</InputLabel>

        <TextField
          type="number"
          sx={{ width: "100%", backgroundColor: "#F7F7F7", my: 1 }}
          {...register("discount", { required: "Discount is required" })}
          defaultValue={discountUpdate}
        />
        {errors.discount && (
          <Alert sx={{ my: 1 }} variant="filled" severity="error">
            {errors.discount.message}
          </Alert>
        )}
        <InputLabel id="demo-simple-select-label">Active?</InputLabel>

        <Select
          sx={{ width: "100%", backgroundColor: "#F7F7F7", my: 1 }}
          {...register("isActive", { required: "Active is required" })}
          defaultValue={isActiveUpdate}
        >
          <MenuItem value="true">true</MenuItem>

          <MenuItem value="false">false</MenuItem>
        </Select>
        {errors.isActive && (
          <Alert sx={{ my: 1 }} variant="filled" severity="error">
            {errors.isActive.message}
          </Alert>
        )}
        <Box display="flex" justifyContent="end" gap={2} padding={2}>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </form>
    </>
  );
}
