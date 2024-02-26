import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchOwnerSpots } from "../../store/spotReducer";
import { NavLink } from "react-router-dom";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpot/DeleteSpotModal";

import "./ManageSpots.css";

const ManageSpots = () => {
  const spot = useSelector((state) => state.spotState);
  const [postSpot, setPostSpot] = useState(false);

  const renderSpot = () => {
    setPostSpot((arg) => !arg);
  };
  // console.log(spot, "SPOTS");

  const spotArr = Object.values(spot);

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  // const toggleMenu = (e) => {
  //   e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
  //   setShowMenu(!showMenu);
  // };

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
  }, [dispatch, postSpot]);

  return (
    <div className="manage-page-container">
      <h1>Manage Your Spots</h1>
      <NavLink className="create-button" to="/spot/new">
        Create a New Spot
      </NavLink>
      <div className="manage-all-container">
        {spotArr.map((spot) => (
          <div key={spot?.id} className="manage-container">
            <NavLink className="spot-container" to={`/spots/${spot.id}`}>
              <img
                className="spot-img"
                src={`${spot.previewImage}`}
                alt={`${spot.name}`}
              />
              <div className="spot-location-rating">
                <p className="spot-location">{`${spot.city}, ${spot.state}`}</p>
                <div className="single-rating-container">
                  <p className="spot-rating">
                    {`${spot.avgRating.toFixed(1)}` || `New`}{" "}
                  </p>
                  <img
                    className="star"
                    src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
                    alt="star"
                  />
                </div>
                <p className="spot-price">{`$${spot.price}`} per night </p>
              </div>
            </NavLink>
            <div className="update-delete">
              <NavLink className="update-button" to={`/spots/${spot.id}/edit`}>
                Update
              </NavLink>
              <div className="delete-button">
                <OpenModalButton
                  buttonText="Delete Spot"
                  onItemClick={closeMenu}
                  modalComponent={
                    <DeleteSpotModal spot={spot} renderSpot={renderSpot} />
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSpots;
