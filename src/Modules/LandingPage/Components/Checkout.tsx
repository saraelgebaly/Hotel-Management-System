import {
    Box,
    Button,
    Container,
    Step,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";
import {
    AddressElement,
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../Context/AuthContext";
import { useToast } from "../../../Context/ToastContext";
import { getErrorMessage } from "../../../Utils/error";
import { userRequest } from "../../../Utils/request";
import creditCard from "../../../assets/Images/creditCard.png";
import paymentDone from "../../../assets/Images/paymentDone.png";
function Checkout() {
  const { baseUrl } = useAuth();
  const { showToast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { id } = useParams();

  const payBooking = async (tokenId: string) => {
    try {
      const response = await userRequest.post(
        `${baseUrl}/portal/booking/${id}/pay`,
        {
          token: tokenId,
        }
      );
      showToast("success", response.data.message);

      return response.data;
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    }
  };
  const handlePayment = async (tokenId: string) => {
    try {
      const response = await payBooking(tokenId);
      showToast("success", response.data.message);
      setActiveStep((currentStep) => currentStep + 1);
    } catch (error: any) {
      showToast("error", getErrorMessage(error.response.data.message));
    }
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      toast.error(error?.message, {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    } else {
      const tokenId = token?.id;
      handlePayment(tokenId);
    }
  };

  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <>
      <Box textAlign="center">
        <Container component={"main"}>
          <Box className="Stepper">
            <Stepper activeStep={activeStep}>
              <Step className="circle">
                <StepLabel>MakePayment </StepLabel>
              </Step>
              <Step>
                <StepLabel> CompleteTheApplication </StepLabel>
              </Step>
            </Stepper>
          </Box>

          <Box>
            {activeStep === 0 ? (
              <>
                <Box className="headerPay">
                  <Typography variant="h3" className="headerTitle">
                    Payment
                  </Typography>
                  <Typography color="#b0b0b0" fontSize="18px" fontWeight="300">
                    Kindly follow the instructions below
                  </Typography>
                </Box>

                <Box className="paymentCon">
                  <Box className="leftCon">
                    <img src={creditCard} alt="creditCardImage" />
                  </Box>

                  <Box
                    component={"form"}
                    className="paymentForm"
                    onSubmit={handleSubmit}
                  >
                    <AddressElement
                      className="AddressElement"
                      options={{ mode: "billing" }}
                    ></AddressElement>
                    <CardElement className="cardElement" />
                   
                    <Box className="paymentBtnCon">
                   

                      <Button
                        disabled={!stripe}
                        type="submit"
                        variant="contained"
                        className="paymentBtn"
                      >
                        Pay
                      </Button>
                      <Button
                        variant="contained"
                        className="paymentBtn"
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box className="headerPay">
                  <Typography variant="h3" className="headerTitle">
                    Completed
                  </Typography>
                  <img src={paymentDone} alt="" />
                  <Typography color="#b0b0b0" fontSize="18px" fontWeight="300">
                    We will inform you via email later once the transaction has
                    been accepted
                  </Typography>
                  <Button className="backBtn" onClick={() => handleNavigate()}>
                    BackToHome
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Checkout;
