import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/navigation";
import * as sessionActions from "./store/session";
// import SpotList from "./components/LandingPage/SpotContainer";
// import LandingPage from "./components/LandingPage/LandingPage";
import SingleSpot from "./components/SingleSpot/SingleSpot";
import AllSpots from "./components/AllSpots/AllSpots";
import SpotInput from "./components/SpotInput/SpotInput";
import ManageSpots from "./components/ManageSpots/ManageSpots";
import EditSpot from "./components/EditSpot/EditSpot";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />

      {isLoaded && <Outlet />}
      {/* <SpotInput /> */}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AllSpots />,
      },
      {
        path: "/spots/:spotId",
        element: <SingleSpot />,
      },
      {
        path: "/spot/new",
        element: <SpotInput />,
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <EditSpot />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
