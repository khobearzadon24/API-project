import { NavLink } from "react-router-dom";

const SpotTile = ({ spot }) => {
  console.log(spot, "SPOT");
  if (!spot) return;
  console.log(spot.id, "spotID!!");
  let rating = parseInt(spot.avgRating).toFixed(1);
  if (isNaN(rating)) {
    rating = "New";
  }
  return (
    <div className="tile">
      <NavLink className="spot-tile" to={`/spots/${spot.id}`}>
        <img
          className="spot-img"
          src={`${spot.previewImage}`}
          alt={`${spot.name}`}
        />
        <div className="spot-text">
          <div className="spot-location-rating">
            <p className="spot-location">{`${spot.city}, ${spot.state}`}</p>
            <p className="spot-rating">{`${rating}`}</p>
          </div>
          <p className="spot-price">{`$${spot.price}`} night </p>
        </div>
      </NavLink>
    </div>
  );
};

export default SpotTile;
