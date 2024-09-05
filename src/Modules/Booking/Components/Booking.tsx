import React from "react";
import { IBooking } from "../../../Interfaces/interface";

import { userRequest } from "../../../Utils/request";
import {
  Box,
  Grid,
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
import { useToast } from "../../../Context/ToastContext";
import { getErrorMessage } from "../../../Utils/error";
interface Column {
  id:
    | "room"
    | "totalPrice"
    | "status"
    | "startDate"
    | "endDate"
    | "user"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: string | Date) => string;
}

const columns: readonly Column[] = [
  { id: "room", label: "Room", minWidth: 120 },
  { id: "totalPrice", label: "Total Price", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 140 },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 140,
    format: (value: string | Date) => new Date(value).toLocaleString(),
  },
  {
    id: "endDate",
    label: "End Date",
    minWidth: 140,
    format: (value: string | Date) => new Date(value).toLocaleString(),
  },
  { id: "user", label: "User", minWidth: 120 },
  { id: "action", label: "Actions", minWidth: 120 },
];

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, lg: 400 },
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: { xs: 3 },
};

function Booking() {
  const { showToast } = useToast();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [bookingsList, setBookingsList] = React.useState<IBooking[]>([]);
  const [loading, setLoading] = React.useState(true); // Loading state
  const [selectedBooking, setSelectedBooking] = React.useState<IBooking | null>(
    null
  );
  const [openModal, setOpenModal] = React.useState(false);
//@ts-ignore

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Fetch booking data
  const getBookingsList = async () => {
    try {
      const response = await userRequest.get("/admin/booking");

      setBookingsList(response.data.data.booking);
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    } finally {
      setLoading(false);
    }
  };
  const formatCellValue = (column: Column, booking: IBooking) => {
    let value: any = booking[column.id as keyof IBooking];
    if (column.id === "room") {
      value = booking.room.roomNumber;
    }
    if (column.id === "totalPrice") {
      value = booking.totalPrice;
    }
    if (column.id === "status") {
      value = booking.status;
    }
    if (column.id === "startDate") {
      value = booking.startDate;
    }
    if (column.id === "endDate") {
      value = booking.endDate;
    }

    if (column.id === "user") {
      value = booking.user.userName;
    }
    if (column.format) {
      return column.format(value);
    }
    console.log(value);

    return value;
  };
  
  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).split("-").reverse().join("-");
  };

  React.useEffect(() => {
    getBookingsList();
  }, []);

  const handleOpenModal = (booking: IBooking) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
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
          alignItems: "center",
          justifyContent: { xs: "center", sm: "space-between" },
          gap: 2,
        }}
      >
        <Grid item>
          <Typography variant="h5" color="initial" sx={{ fontWeight: 500 }}>
            Bookings Table Details
          </Typography>
          <Typography
            color="initial"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            You can check all details
          </Typography>
        </Grid>
        
      </Grid>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
     
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                      sx={{ backgroundColor: "#E2E5EB" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
              {loading ? (
            [...Array(rowsPerPage)].map((_, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell colSpan={columns.length}>
                  <Skeleton variant="rectangular" height={30} sx={{borderRadius:1}} />
                </TableCell>
              </TableRow>
            ))
          ) : (
                bookingsList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => {
                    return (
                      <TableRow role="checkbox" tabIndex={-1} key={booking._id}>
                        {columns.map((column) => {
                          const value = formatCellValue(column, booking);
                          if (column.id === "action") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <VisibilityIcon
                                  onClick={() => handleOpenModal(booking)}
                                  color="primary"
                                  sx={{ cursor: "pointer" }}
                                />
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
                  }))}
              </TableBody>
              </Table>
            </TableContainer>
        
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={bookingsList.length}
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

     
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" color="initial" sx={{ marginBottom: 2 }}>
            Booking Details
          </Typography>
          {selectedBooking && (
            <>
              <Typography>
                <span style={{ fontWeight: "bold" }}>Start Date : </span>
                {formatDate(selectedBooking.startDate)}
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>End Date : </span>
                {formatDate(selectedBooking.endDate)}
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>Total Price : </span>
                {selectedBooking.totalPrice}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Booking;
