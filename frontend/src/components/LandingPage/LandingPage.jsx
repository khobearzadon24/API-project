import { useState, useEffect } from "react";
import SpotTile from "./SpotTile";
import "./LandingPage.css";
// import { useDispatch } from "react-redux";

const LandingPage = () => {
  const [spots, setSpots] = useState([]);
  //   const dispatch = useDispatch();

  useEffect(() => {
    const getSpots = async () => {
      const response = await fetch("/api/spots");
      const data = await response.json();
      if (data && data.Spots) {
        setSpots(data.Spots);
      }
      if (!spots) return;
    };
    getSpots();
  }, []);
  return (
    <div className="tile-container">
      {/* <h1>Over here</h1> */}
      {spots.map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </div>
  );
};

export default LandingPage;
