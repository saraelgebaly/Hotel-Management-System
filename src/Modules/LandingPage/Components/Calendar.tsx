import { CalendarMonth } from "@mui/icons-material";
import { Box, Button, Popover, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
    DateRangeCalendar
} from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useState } from "react";
//@ts-ignore
import dayjs, { Dayjs, Range } from "dayjs";
interface IProps {
  selectedDateRange?: any;
  setSelectedDateRange?: any;
}
const Calendar = ({ selectedDateRange, setSelectedDateRange }: IProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCalendarChange = (newDateRange: Range<Dayjs>) => {
    setSelectedDateRange(newDateRange);
    
  };

  const handleButtonClick = (event: any) => {
    setAnchorEl(event?.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelected = () => {
    handlePopoverClose();
  };

  const openDate = Boolean(anchorEl);
  return (
    <Box  >
      <Button
        sx={{
          fontSize: { xs: "1px", sm: "1px", md: "1px" },
           padding: {
            xs: "8px 16px",
            sm: "10px 0px",
            md: "12px 24px",
           },

          width: { xs: "80px", sm: "20px" },
          height: { xs: "50px", sm: "50px" },
          borderRadius: "12px",
          p: "8px",
          
          backgroundColor:"#152C5B"
        }}
        onClick={handleButtonClick}
        variant="contained"
      >
        <CalendarMonth />
      </Button>

      <Popover
        open={openDate}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DemoContainer components={["DateRangeCalendar"]}>
            <DateRangeCalendar
              value={selectedDateRange}
              onChange={handleCalendarChange}
              //@ts-ignore
              onAccept={handleDateSelected}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Popover>

      <TextField
        label="Selected Date Range"
        value={`${dayjs(selectedDateRange[0])?.format("YYYY-MM-DD")} - ${dayjs(
          selectedDateRange[1]
        )?.format("YYYY-MM-DD")}`}
      />
    </Box>
  );
};

export default Calendar;
