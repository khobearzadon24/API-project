import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/reviewReducer";
import StarRating from "../StarRating/StarRating";
// import { Alert } from "react-alert";
// import { useNavigate } from "react-router-dom";
import "./PostReviewModal.css";

function PostReviewModal({ spotId }) {
  const dispatch = useDispatch();

  const { closeModal } = useModal();
  // const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  // const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(null);
  // const [validate, setValidate] = useState({});

  const starClick = (star) => {
    setRating(star);
  };

  //   useEffect(()=> {
  //     let valObj = {};
  //     if(review.length < 10){
  //         valObj.review = 'Your review must be at least 10 characters long'
  //     }
  //     setValidate(valObj)
  // },[review])

  const handleSubmit = async (e) => {
    // setSubmitted(true);
    e.preventDefault();

    const newReview = {
      review,
      stars: rating,
    };
    setErrors({});

    const madeReview = await dispatch(createReview(newReview, spotId));

    if (madeReview && madeReview.errors) {
      console.log(madeReview.errors, "errors here");
      return setErrors(madeReview.errors);
    }

    reset();
    closeModal();
  };
  const reset = () => {
    setReview("");
    setRating("");
  };
  return (
    <div className="post-a-review">
      <form className="form-review" onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        {errors.review && <p className="errors">{errors.review}</p>}
        {errors.stars && <p className="errors">{errors.stars}</p>}
        <textarea
          className="review-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          name="review"
          placeholder="Just a quick review"
          rows="10"
        ></textarea>
        <div className="star-container">
          <StarRating rating={rating} starClick={starClick} />
        </div>
        <button className="button">Submit Your Review</button>
      </form>
    </div>
  );
}
export default PostReviewModal;
