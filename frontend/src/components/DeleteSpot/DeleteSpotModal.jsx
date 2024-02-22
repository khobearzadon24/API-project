import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchOwnerSpots, removeSpot } from "../../store/spotReducer";

function DeleteSpotModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    await dispatch(removeSpot(spot.id))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  // const keepSubmit = async (e) => {
  //   e.preventDefault();
  //   await dispatch(fetchOwnerSpots())
  //     .then(closeModal)
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) {
  //         setErrors(data.errors);
  //       }
  //     });
  // };
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
