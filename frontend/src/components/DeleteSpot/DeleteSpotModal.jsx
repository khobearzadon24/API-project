import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spotReducer";
import "./DeleteSpotModal.css";

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
    <div className="delete-modal-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this spot from the listings?</p>
      <div className="yes-no">
        <button onClick={deleteSubmit}>Yes Delete Spot</button>
        <button onClick={closeModal}>No Keep Spot</button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
