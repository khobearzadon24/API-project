import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllSpots } from "../../store/spotReducer";
import { NavLink } from "react-router-dom";
import "./AllSpots.css";

const AllSpots = () => {
  const spot = useSelector((state) => state.spotState);
  //spot will be an object of object
  const spotArr = Object.values(spot);
  const dispatch = useDispatch();
  console.log(spotArr, "spotArray");
  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);
  let rating = parseInt(spot.avgRating).toFixed(1);
  if (isNaN(rating)) {
    rating = "New Spot";
  }
  return (
    <div className="container">
      {spotArr.map((spot) => (
        <NavLink className="spot-container" to={`/spots/${spot.id}`}>
          <img
            className="spot-img"
            src={`${spot.previewImage}`}
            alt={`${spot.name}`}
          />
          <div className="spot-text">
            <div className="spot-location-rating">
              <p className="spot-location">{`${spot.city}, ${spot.state}`}</p>
              <p className="spot-rating">{`${rating}`} stars</p>
            </div>
            <p className="spot-price">{`$${spot.price}`} per night </p>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default AllSpots;
