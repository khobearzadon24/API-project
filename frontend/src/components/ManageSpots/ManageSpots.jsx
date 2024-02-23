import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteSpot, fetchOwnerSpots } from "../../store/spotReducer";
import { NavLink, useParams } from "react-router-dom";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpot/DeleteSpotModal";

const ManageSpots = () => {
  const spot = useSelector((state) => state.spotState);
  // console.log(spot, "SPOTS");

  const spotArr = Object.values(spot);

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  console.log(spotArr, "spotArray");

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
          <NavLink to={`/spots/${spot.id}/edit`}>Update</NavLink>
          <div className="delete-button">
            <OpenModalButton
              buttonText="Delete Spot"
              onItemClick={closeMenu}
              modalComponent={<DeleteSpotModal />}
            />
          </div>
        </>
      ))}
    </div>
  );
};

export default ManageSpots;
