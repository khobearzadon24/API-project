import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllSpots, fetchOwnerSpots } from "../../store/spotReducer";
import { NavLink, useParams } from "react-router-dom";

const ManageSpots = () => {
  const spot = useSelector((state) => state.spotState);
  // console.log(spot, "SPOTS");

  const spotArr = Object.values(spot);

  const dispatch = useDispatch();
  console.log(spotArr, "spotArray");

  // useEffect(() => {
  //   dispatch(fetchAllSpots());
  // }, [dispatch]);
  useEffect(() => {
    console.log("whatever");
    dispatch(fetchOwnerSpots());
    console.log("below here");
  }, [dispatch]);
  return (
    <div className="container">
      {spotArr.map((spot) => (
        <>
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
                  <p className="spot-rating">{`${spot.avgRating}` || `New`} </p>
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
          <NavLink to={`/spots/${spot.id}/edit`}>Update</NavLink>
        </>
      ))}
    </div>
  );
};

export default ManageSpots;
