import Ads from "./Modules/Ads/Components/Ads";
import ForgetPassword from "./Modules/Authentication/Components/ForgetPassword";
import Login from "./Modules/Authentication/Components/Login";
import Register from "./Modules/Authentication/Components/Register";
import ResetPassword from "./Modules/Authentication/Components/ResetPassword";
import Booking from "./Modules/Booking/Components/Booking";
import Dashboard from "./Modules/Dashboard/Components/Dashboard";
import Facilities from "./Modules/Facilities/Components/Facilities";
import Details from "./Modules/LandingPage/Components/Details";
import Explore from "./Modules/LandingPage/Components/Explore";
import Favourites from "./Modules/LandingPage/Components/Favourites";
import Home from "./Modules/LandingPage/Components/Home";
import LandingPage from "./Modules/LandingPage/Components/LandingPage";
import Payment from "./Modules/LandingPage/Components/Payment";
import Rooms from "./Modules/Rooms/Components/Rooms";
import RoomsData from "./Modules/Rooms/Components/RoomsData";
import AdminProtectedRoute from "./Modules/Shared/AdminProtectedRoute";
import AuthLayout from "./Modules/Shared/AuthLayout";
import MasterLayout from "./Modules/Shared/MasterLayout";
import NotFound from "./Modules/Shared/NotFound";
import ProtectedRoute from "./Modules/Shared/ProtectedRoute";
import UserProtectedRoute from "./Modules/Shared/UserProtectedRoute";
import Users from "./Modules/Users/Components/Users";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
function App() {
  // const { loginData }: any = useAuth();

  const routes = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { path: "", element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgetpass", element: <ForgetPassword /> },
        { path: "resetpass", element: <ResetPassword /> },
      ],
    },

    {
      path: "dashboard",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          path: "",
          element: (
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "rooms",
          element: (
            <AdminProtectedRoute>
              <Rooms />{" "}
            </AdminProtectedRoute>
          ),
        },
        {
          path: "roomsdata",
          element: (
            <AdminProtectedRoute>
              <RoomsData />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "roomsedit/:id",
          element: (
            <AdminProtectedRoute>
              <RoomsData />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "facilities",
          element: (
            <AdminProtectedRoute>
              <Facilities />{" "}
            </AdminProtectedRoute>
          ),
        },
        {
          path: "adslist",
          element: (
            <AdminProtectedRoute>
              <Ads />{" "}
            </AdminProtectedRoute>
          ),
        },
        {
          path: "users",
          element: (
            <AdminProtectedRoute>
              <Users />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "booking",
          element: (
            <AdminProtectedRoute>
              <Booking />
            </AdminProtectedRoute>
          ),
        },
      ],
    },
    ///user Path
    {
      path: "/",
      element: <LandingPage />,
      errorElement: <NotFound />,
      children: [
        { path: "", element: <Home /> },
        { path: "home", element: <Home /> },
        {
          path: "details",
          element: <Details />,
        },
        { path: "explore", element: <Explore /> },
        {
          path: "favorites",
          element: (
            <UserProtectedRoute>
              <Favourites />{" "}
            </UserProtectedRoute>
          ),
        },
        {
          path: "payment/:id",
          element: (
            <UserProtectedRoute>
              <Payment />
            </UserProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <div className="App">
        <ToastContainer />
        <RouterProvider router={routes} />
      </div>
    </>
  );
}

export default App;
