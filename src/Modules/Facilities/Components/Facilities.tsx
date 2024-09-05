import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
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
import { FacilitiesProps, Facility } from "../../../Interfaces/interface";
import { getErrorMessage } from "../../../Utils/error";
import { userRequest } from "../../../Utils/request";
import deleteImg from "../../../assets/Images/deleteImg.png";

interface Column {
  id: "name" | "createdBy" | "createdAt" | "actions";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: string | Date) => string;
}
// Define table columns
const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 150 },
  { id: "createdBy", label: "Created By", minWidth: 150 },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 150,
    format: (value: string | Date) => new Date(value).toLocaleString(),
  },

  {
    id: "actions",
    label: "Actions",
    minWidth: 150,
    align: "right",
  },
];

// Style for modals
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Form data structure
interface FormData {
  name: string;
}
function Facilities() {
  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);
  //@ts-ignore

  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | boolean>(
    false
  );
  const [facilityId, setFacilityId] = useState("");

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingFacility(false);
    reset();
  };

  const handleDeleteOpenModal = (id: string) => {
    setFacilityId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const getFacilitiesList = async () => {
    try {
      const response = await userRequest.get("/admin/room-facilities");
      console.log("Response data:", response.data.data.facilities);
      setFacilitiesList(response.data.data.facilities);

      setTotalCount(response.data.totalCount);
      setLoading(false);
    } catch (error) {
      console.error("API call error:", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    getFacilitiesList();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (editingFacility) {
        await userRequest.put(`/admin/room-facilities/${facilityId}`, data, {});
        setValue("name", facilityname);
        showToast("success", "Facility Updated Successfully");
        handleClose();
      } else {
        await userRequest.post("/admin/room-facilities", data, {});
        handleClose();

        showToast("success", "Facility Added Successfully");
      }
      getFacilitiesList();
      handleClose();
    } catch (error: any) {
      showToast("error", error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      await userRequest.delete(`/admin/room-facilities/${facilityId}`);
      getFacilitiesList();
      showToast("success", "Room has been deleted!");
      handleCloseDeleteModal();
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    }
  };

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
  const [selectedFacility, setSelectedFacility] =
    React.useState<FacilitiesProps | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = (facility: FacilitiesProps) => {
    setSelectedFacility(facility);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).split("-").reverse().join("-");
  };
  // Function to handle different actions (Edit)
  const [facilityname, setFacilityname] = useState("");
  const handleAction = (action: string, name: string, id: string) => {
    if (action === "Edit") {
      setFacilityId(id);
      setEditingFacility(true);
      setFacilityname(name);

      setOpen(true);
    }
  };

  // Function to format table cell values
  const formatCellValue = (column: Column, facility: FacilitiesProps) => {
    let value: any = facility[column.id as keyof FacilitiesProps];
    if (column.id === "createdBy") {
      value = facility.createdBy.userName;
    }
    if (column.format) {
      return column.format(value);
    }
    return value;
  };

  return (
    <>
      <Box>
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
              Facilities Table Details
            </Typography>
            <Typography
              color="initial"
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              You can check all details
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleOpen}>
              Add New Facility
            </Button>
          </Grid>
        </Grid>

        <Paper sx={{ width: "100%", overflow: "hidde" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
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
                  : facilitiesList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((facility: any) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={facility._id}
                        >
                          {columns.map((column) => {
                            const value = formatCellValue(column, facility);
                            if (column.id === "actions") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <IconButton
                                    onClick={() => handleOpenModal(facility)}
                                  >
                                    <VisibilityIcon color="primary" />
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      handleAction(
                                        "Edit",
                                        facility.name,
                                        facility._id
                                      )
                                    }
                                  >
                                    <EditIcon color="warning" />
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      handleDeleteOpenModal(facility._id)
                                    }
                                  >
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
                      ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={facilitiesList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Add/Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editingFacility ? "Edit Facility" : "Add New Facility"}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name", { required: "Name is required" })}
              defaultValue={editingFacility ? facilityname : ""}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box sx={style}>
          <img
            src={deleteImg}
            alt=""
            style={{
              display: "block",
              margin: "0 auto",
              paddingBottom: "16px",
            }}
          />
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this facility?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              mt: 2,
            }}
          >
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="contained" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" color="initial" sx={{ marginBottom: 2 }}>
            Facilities Details
          </Typography>
          {selectedFacility && (
            <>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Name : </span>
                {selectedFacility.name}
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>Created by : </span>
                {selectedFacility.createdBy.userName}
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>Created at: </span>
                {formatDate(selectedFacility.createdAt)}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Updated at: </span>
                {formatDate(selectedFacility.updatedAt)}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Facilities;
