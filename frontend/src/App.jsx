import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
// import SpotList from "./components/LandingPage/SpotContainer";
// import LandingPage from "./components/LandingPage/LandingPage";
import SingleSpot from "./components/SingleSpot/SingleSpot";
import AllSpots from "./components/AllSpots/AllSpots";
import SpotInput from "./components/SpotInput/SpotInput";

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
        // element: <LandingPage />,
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
