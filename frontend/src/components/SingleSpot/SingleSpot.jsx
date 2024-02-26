import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchSpot } from "../../store/spotReducer";
import { fetchAllReviews } from "../../store/reviewReducer";
// import { NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";
// import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

import "./SingleSpot.css";

const SingleSpot = () => {
  const { spotId } = useParams();
  const { closeModal } = useModal();
  const spot = useSelector((state) => state.spotState[spotId]);
  // console.log(spot, "here is my spot console log");
  // console.log(spot.ownerId);
  const review = useSelector((state) => state.reviewState);
  const sessionUser = useSelector((state) => state.session.user);

  const [deleteReview, setDeleteReview] = useState(false);
  const renderdelete = () => {
    setDeleteReview((arg) => !arg);
  };
  // console.log(sessionUser, "here is my session user");
  // console.log(sessionUser?.id, "here is id of session user");
  const ulRef = useRef();

  const handleFeature = (e) => {
    console.log("feature coming soon", e);
    alert("Feature Coming Soon");
  };

  // console.log(review, "here is the reviews");
  // console.log(review?.User);
  // console.log(review?.userId, "here is the user of the review");
  const reviewArr = Object.values(review);
  // console.log(reviewArr, "reviewArr");
  // console.log(reviewArr, "reviewArr");
  // console.log(
  //   reviewArr[0]?.User?.id,
  //   "here is the actual firstname of the review"
  // );

  let hasReview = reviewArr.filter(
    (review) => review?.User?.id === sessionUser?.id
  );
  // console.log(spot, "over here!");
  // console.log(spot?.SpotImages, "here is the spots");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpot(spotId));
    dispatch(fetchAllReviews(spotId));
  }, [dispatch, spotId, reviewArr.length, deleteReview]);

  if (!spot) return;
  // if (!spot.SpotImages[0] || !spot) return <div>information</div>;

  // const imageOne = spot?.SpotImages[0].url;
  // console.log(reviewArr[0].createdAt, "here is my date example");
  // let number = reviewArr[0].createdAt;
  // const date = new Date(number);
  // console.log(date, "here is the conversion");
  // console.log(reviewArr[0].id, "over here is where i am console logging");
  if (sessionUser && sessionUser.id !== spot.ownerId) {
    return (
      <div className=".single-spot-container">
        <div className="spot-text-container">
          <h1 className="single-spot-name">{spot?.name}</h1>
          <p>
            {spot?.city}, {spot?.state}, {spot?.country}
          </p>
        </div>
        <div className="single-image-container">
          <img
            className="image1"
            src={spot.SpotImages && spot.SpotImages[0].url}
            alt="image1"
          />
          <div className="small-images">
            {spot.SpotImages &&
              spot.SpotImages.slice(1).map((spot) => (
                <img key={spot?.id} className="image-small" src={spot?.url} />
              ))}
          </div>
        </div>
        <div className="single-description-container">
          <div className="single-owner-detail-container">
            <h1 className="hosted">
              Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
            </h1>
            <h1 className="single-description">{spot?.description}</h1>
          </div>

          <div className="single-rating-container">
            <div className="single-top-rating">
              <p>${spot?.price} night </p>
              <div className="single-star-box">
                <img
                  className="single-star"
                  src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
                  alt="star"
                />
                <p className="single-stars">
                  {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
                </p>
              </div>
              {spot.numReviews === 1 && <p>{spot.numReviews} review</p>}
              {spot.numReviews > 1 && <p>{spot.numReviews} review</p>}
              {spot.numReviews === 0 && <p>New</p>}
            </div>
            <div className="single-reserve-container">
              <button className="single-reserve" onClick={handleFeature}>
                Reserve
              </button>
            </div>
          </div>
        </div>
        <hr className="single-line" color="black" />
        <div className="single-review-header">
          <div className="single-star-box">
            <p className="single-stars">
              {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
            </p>
            <img
              className="single-star"
              src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
              alt="star"
            />
          </div>
          {spot.numReviews > 1 && (
            <p className="single-review-title">{spot.numReviews} reviews</p>
          )}
          {spot.numReviews === 1 && (
            <p className="single-review-title">{spot.numReviews} review</p>
          )}
          {spot.numReviews === 0 && (
            <p className="single-review-title">
              Be the first to post a review!
            </p>
          )}
        </div>
        <div className="single-review-container">
          <div className="post-here" ref={ulRef}>
            <div className="post-button">
              {hasReview.length === 0 && (
                <OpenModalButton
                  buttonText="Post Review"
                  onItemClick={closeModal}
                  modalComponent={<PostReviewModal spotId={spot.id} />}
                />
              )}
            </div>
          </div>
          {reviewArr.map((review) => (
            <h2 key={review?.id} className="single-review-stuff">
              <p className="single-review-username">{`${review?.User?.firstName} `}</p>
              <p className="single-date">
                {new Date(review.createdAt).toDateString()}
              </p>
              <p className="single-delete-modal">{`${review.review}`}</p>
              {hasReview.length > 0 && sessionUser.id === review.userId && (
                <OpenModalButton
                  buttonText="Delete Review"
                  onItemClick={closeModal}
                  modalComponent={
                    <DeleteReviewModal
                      reviewId={review.id}
                      renderdelete={renderdelete}
                    />
                  }
                />
              )}
            </h2>
          ))}
        </div>
      </div>
    );
  } else
    return (
      <div className="single-spot-container">
        <h1 className="single-spot-name">{spot?.name}</h1>
        <p>
          {spot?.city}, {spot?.state}, {spot?.country}
        </p>
        <div className="single-image-container">
          <img
            className="image1"
            src={spot?.SpotImages && spot?.SpotImages[0]?.url}
            alt="image1"
          />
          <div className="small-images">
            {spot.SpotImages &&
              spot.SpotImages.slice(1).map((spot) => (
                <img key={spot?.id} className="image-small" src={spot?.url} />
              ))}
          </div>
        </div>
        <div className="single-description-container">
          <div className="single-owner-detail-container">
            <h1>
              Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
            </h1>
            <h1 className="single-description">{spot?.description}</h1>
          </div>

          <div className="single-rating-container">
            <div className="single-top-rating">
              <p>${spot?.price} night </p>
              <div className="single-star-box">
                <img
                  className="single-star"
                  src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
                  alt="star"
                />
                <p className="single-stars">
                  {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
                </p>
              </div>
              {spot.numReviews === 1 && <p>{spot.numReviews} review</p>}
              {spot.numReviews > 1 && <p>{spot.numReviews} reviews</p>}
              {spot.numReviews === 0 && <p>New</p>}
            </div>
            <div className="single-reserve-container">
              <button className="single-reserve" onClick={handleFeature}>
                Reserve
              </button>
            </div>
          </div>
        </div>
        <hr className="single-line" color="black" />
        <div className="single-review-header">
          <div className="single-star-box">
            <img
              className="single-star"
              src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
              alt="star"
            />
            <p className="single-stars">
              {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
            </p>
          </div>
          {spot.numReviews > 1 && (
            <p className="single-review-title">
              {spot.numReviews}
              reviews
            </p>
          )}
          {spot.numReviews === 1 && (
            <p className="single-review-title">{spot.numReviews} review</p>
          )}
          {spot.numReviews === 0 && <p className="single-review-title">New</p>}
        </div>
        <div className="single-review-container">
          {reviewArr.map((review) => (
            <h2 key={spot?.id} className="single-review-stuff">
              <p className="single-review-username">{`${review?.User?.firstName} `}</p>
              <p className="single-date">
                {new Date(review.createdAt).toDateString()}
              </p>
              <p className="single-delete-modal">{`${review.review}`}</p>
              {hasReview.length > 0 && (
                <OpenModalButton
                  buttonText="Delete Review"
                  onItemClick={closeModal}
                  modalComponent={<DeleteReviewModal reviewId={review.id} />}
                />
              )}
            </h2>
          ))}
        </div>
      </div>
    );
};
export default SingleSpot;
