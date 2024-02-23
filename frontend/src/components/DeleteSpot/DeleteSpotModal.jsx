import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchOwnerSpots, removeSpot } from "../../store/spotReducer";

function DeleteSpotModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteSubmit = async (e, spot) => {
    e.preventDefault();
    await dispatch(removeSpot(spot.id));
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
