import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchOwnerSpots, deleteSpot } from "../../store/spotReducer";

function DeleteSpotModal({ spot, renderSpot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // console.log(spot, "here is the spot over hererere");

  const deleteSubmit = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spot.id));
    renderSpot();
    closeModal();
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this spot from the listings?</p>
      <button onClick={deleteSubmit}>Yes Delete Spot</button>
      <button onClick={closeModal}>No Keep Spot</button>
    </div>
  );
}

export default DeleteSpotModal;
