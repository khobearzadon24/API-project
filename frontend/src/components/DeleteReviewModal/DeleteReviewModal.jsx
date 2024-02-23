import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviewReducer";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function DeleteReviewModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const removeReview = async (e, review) => {
    e.preventDefault();
    await dispatch(deleteReview(review.id));
    closeModal();
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <button onClick={removeReview}>Yes Delete Review</button>
      <button onClick={closeModal}>No Keep Review</button>
    </div>
  );
}

export default DeleteReviewModal;
