import {
  Box,
  Button,
  CircularProgress,
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
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useToast } from "../../../Context/ToastContext";
import { getErrorMessage } from "../../../Utils/error";
import { userRequest } from "../../../Utils/request";
import { RoomsListProps } from "../../../Interfaces/interface";
import deleteImg from "../../../assets/Images/deleteImg.png";
import { Link } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
interface Column {
  id: "roomNumber" | "images" | "price" | "discount" | "capacity" | "actions";
  label: string;
  minWidth?: number;
  align?: "right";
}
const columns: readonly Column[] = [
  { id: "roomNumber", label: "Room Number", minWidth: 140 },
  { id: "images", label: "Images", minWidth: 140 },
  { id: "price", label: "Price", minWidth: 170 },
  { id: "discount", label: "Discount", minWidth: 170 },
  { id: "capacity", label: "Capacity", minWidth: 100 },

  { id: "actions", label: "Actions", minWidth: 170 },
];
function Rooms() {
  const [roomId, setRoomId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [roomsList, setRoomsList] = useState<RoomsListProps[]>([]);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
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

  const { showToast } = useToast();

  const handleDeleteOpen = (id: string) => {
    setRoomId(id);
    setOpenDelete(true);
  };
  const handleDeleteClose = () => setOpenDelete(false);

  const getAllRooms = async () => {
    setLoading(true);
    try {
      const { data } = await userRequest.get(`/admin/rooms`);
      setRoomsList(data.data.rooms);
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    } finally {
      setLoading(false);
    }
  };
  const [selectedRooms, setSelectedRooms] = useState<RoomsListProps | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = (room: RoomsListProps) => {
    setSelectedRooms(room);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).split("-").reverse().join("-");
  };
  useEffect(() => {
    getAllRooms();
  }, []);

  const handleDelete = async () => {
    setSpinner(true);
    try {
      await userRequest.delete(`/admin/rooms/${roomId}`);
      getAllRooms();
      showToast("success", "Room has been deleted!");
      handleDeleteClose();
    } catch (error) {
      const err = getErrorMessage(error);
      showToast("error", err);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <>
      <Modal
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{ display: "flex", justifyContent: "end" }}
            onClick={handleDeleteClose}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                border: "2px solid red",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <CloseIcon sx={{ color: "red", fontSize: "17px" }} />
            </Box>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <img src={deleteImg} alt="" />

            <h4>Delete This Room ?</h4>
            <p>
              are you sure you want to delete this item ? if you are sure just
              click on delete it
            </p>
          </Box>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
            >
              {spinner ? (
                <CircularProgress sx={{ color: "white" }} size={20} />
              ) : (
                "Delete"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>

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
              Rooms Table Details
            </Typography>
            <Typography
              color="initial"
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              You can check all details
            </Typography>
          </Grid>
          <Grid item textAlign="end">
            <Link to="/dashboard/roomsdata">
              <Button variant="contained">Add New Room</Button>
            </Link>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ bgcolor: "#E2E5EB" }}>
                <TableCell>room Number</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="center">Capacity</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, index) => (
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
              ) : roomsList.length > 0 ? (
                roomsList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((room: RoomsListProps, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {room.roomNumber}
                      </TableCell>

                      <TableCell align="center">
                        <img
                          src={room.images[0]}
                          alt=""
                          style={{ width: 50, height: 50, borderRadius: 5 }}
                        />
                      </TableCell>

                      <TableCell align="center">{room.price}</TableCell>
                      <TableCell align="center">{room.discount}</TableCell>
                      <TableCell align="center">{room.capacity}</TableCell>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>
                          <IconButton
                            onClick={() => handleDeleteOpen(room._id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>

                          <IconButton
                            component={Link}
                            to={`/dashboard/roomsedit/${room._id}`}
                            state={{ roomData: room, state: "edit" }}
                          >
                            <EditIcon color="warning" />
                          </IconButton>

                          <IconButton onClick={() => handleOpenModal(room)}>
                            <VisibilityIcon color="primary" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h3" mt={10} textAlign="center">
                    No Rooms Found
                  </Typography>
                </Box>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={roomsList.length}
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
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" color="initial" sx={{ marginBottom: 2 }}>
            Rooms Details
          </Typography>
          {selectedRooms && (
            <>
              <img
                style={{ width: "200px", height: "150px" }}
                src={selectedRooms.images[0]}
                alt="Room-Image"
              />
              <Typography>
                <span style={{ fontWeight: "bold" }}>Name: </span>
                {selectedRooms.roomNumber}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Capacity: </span>
                {selectedRooms.capacity}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Price: </span>
                {selectedRooms.price}
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>Discount: </span>
                {selectedRooms.discount}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Created by: </span>
                {selectedRooms.createdBy.userName}
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>Created at: </span>
                {formatDate(selectedRooms.createdAt)}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Updated at: </span>
                {formatDate(selectedRooms.updatedAt)}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Rooms;
