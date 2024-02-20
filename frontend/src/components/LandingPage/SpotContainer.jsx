import { NavLink } from "react-router-dom";
import "./SpotContainer.css";

const SpotContainer = ({ spot }) => {
  // console.log(spot, "SPOT");
  // console.log(spot.previewImage);
  if (!spot) return;
  // console.log(spot.id, "spotID!!");
  let rating = parseInt(spot.avgRating).toFixed(1);
  if (isNaN(rating)) {
    rating = "New Spot";
  }
  return (
    <div className="container">
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
    </div>
  );
};

export default SpotContainer;
