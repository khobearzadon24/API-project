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
  // console.log(spotArr[1].avgRating, "Spots");
  // console.log(spotArr.avgRating, "avgrating");

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  // console.log(rating, "rating");
  let rating = parseInt(spotArr.avgRating).toFixed(1);
  if (isNaN(rating)) {
    rating = "New";
  }

  return (
    <div className="container">
      {spotArr.map((spot) => (
        <NavLink
          key={spot.id}
          className="spot-container"
          to={`/spots/${spot.id}`}
        >
          <img
            className="spot-img"
            src={`${spot.previewImage}`}
            alt={`${spot.name}`}
          />
          <div className="spot-text">
            <div className="spot-location-rating">
              <p className="spot-location">{`${spot.city}, ${spot.state}`}</p>
              <div className="rating-container">
                <p className="spot-rating">
                  {`${spot.avgRating.toFixed(1)}` || `New`}{" "}
                </p>
                <img
                  className="star"
                  src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
                  alt="star"
                />
              </div>
            </div>
            <p className="spot-price">{`$${spot.price}`} per night </p>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default AllSpots;
