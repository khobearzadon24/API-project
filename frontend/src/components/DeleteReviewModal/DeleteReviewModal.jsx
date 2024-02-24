import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeReview } from "../../store/reviewReducer";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function DeleteReviewModal({ reviewId, renderdelete }) {
  console.log(reviewId, "here is the review id over herehrehrherehh");
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const deletedReview = async (e) => {
    e.preventDefault();
    await dispatch(removeReview(reviewId));
    renderdelete();
    closeModal();
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <button onClick={deletedReview}>Yes Delete Review</button>
      <button onClick={closeModal}>No Keep Review</button>
    </div>
  );
}

export default DeleteReviewModal;
