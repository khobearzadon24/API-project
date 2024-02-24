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
      <div className="spot-container">
        <div className="spot-text-container">
          <h1 className="spot-name">{spot?.name}</h1>
          <p>
            {spot?.city}, {spot?.state}, {spot?.country}
          </p>
        </div>
        <div className="image-container">
          <img
            className="image1"
            src={spot.SpotImages && spot.SpotImages[0].url}
            alt="image1"
          />
          <div className="small-images">
            {spot.SpotImages &&
              spot.SpotImages.slice(1).map((spot) => (
                <img className="image-small" src={spot?.url} />
              ))}
          </div>
        </div>
        <div className="description-container">
          <div className="owner-detail-container">
            <h1 className="hosted">
              Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
            </h1>
            <h1 className="description">{spot?.description}</h1>
          </div>

          <div className="rating-container">
            <div className="top-rating">
              <p>${spot?.price} night </p>
              <div className="star-box">
                <img
                  className="star"
                  src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
                  alt="star"
                />
                <p className="stars">
                  {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
                </p>
              </div>
              {spot.numReviews === 1 && <p>{spot.numReviews} review</p>}
              {spot.numReviews > 1 && <p>{spot.numReviews} review</p>}
              {spot.numReviews === 0 && <p>New</p>}
            </div>
            <div className="reserve-container">
              <button className="reserve" onClick={handleFeature}>
                Reserve
              </button>
            </div>
          </div>
        </div>
        <div className="review-header">
          <div className="star-box">
            <p className="stars">
              {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
            </p>
            <img
              className="star"
              src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
              alt="star"
            />
          </div>
          {spot.numReviews > 1 && (
            <p className="review-title">{spot.numReviews} reviews</p>
          )}
          {spot.numReviews === 1 && (
            <p className="review-title">{spot.numReviews} review</p>
          )}
          {spot.numReviews === 0 && (
            <p className="review-title">Be the first to post a review!</p>
          )}
        </div>
        <div className="review-container">
          <div className="post-here" ref={ulRef}>
            <div className="post-button">
              {hasReview.length === 0 && (
                <button>
                  <OpenModalButton
                    buttonText="Post Review"
                    onItemClick={closeModal}
                    modalComponent={<PostReviewModal spotId={spot.id} />}
                  />
                </button>
              )}
            </div>
          </div>
          {reviewArr.map((review) => (
            <h2 className="review-stuff">
              {console.log(review.id, "inside the mapping")}
              <p>{`${review?.User?.firstName} `}</p>
              <p>{new Date(review.createdAt).toDateString()}</p>
              <p>{`${review.review}`}</p>
              {hasReview.length > 0 && sessionUser.id === review.userId && (
                <button>
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
                </button>
              )}
            </h2>
          ))}
        </div>
      </div>
    );
  } else
    return (
      <div className="spot-container">
        <h1 className="spot-name">{spot?.name}</h1>
        <p>
          {spot?.city}, {spot?.state}, {spot?.country}
        </p>
        <div className="image-container">
          <img
            className="image1"
            src={spot?.SpotImages && spot?.SpotImages[0]?.url}
            alt="image1"
          />
          <div className="small-images">
            {spot.SpotImages &&
              spot.SpotImages.slice(1).map((spot) => (
                <img className="image-small" src={spot?.url} />
              ))}
          </div>
        </div>
        <div className="description-container">
          <div className="owner-detail-container">
            <h1>
              Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
            </h1>
            <h1 className="description">{spot?.description}</h1>
          </div>

          <div className="rating-container">
            <div className="top-rating">
              <p>${spot?.price} night </p>
              <div className="star-box">
                <img
                  className="star"
                  src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
                  alt="star"
                />
                <p className="stars">
                  {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
                </p>
              </div>
              {spot.numReviews === 1 && <p>{spot.numReviews} review</p>}
              {spot.numReviews > 1 && <p>{spot.numReviews} reviews</p>}
              {spot.numReviews === 0 && <p>New</p>}
            </div>
            <div className="reserve-container">
              <button className="reserve" onClick={handleFeature}>
                Reserve
              </button>
            </div>
          </div>
        </div>
        <div className="review-header">
          <div className="star-box">
            <img
              className="star"
              src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
              alt="star"
            />
            <p className="stars">
              {`${spot?.avgRating?.toFixed(1)}` || `New`}{" "}
            </p>
          </div>
          {spot.numReviews > 1 && (
            <p className="review-title">
              {spot.numReviews}
              reviews
            </p>
          )}
          {spot.numReviews === 1 && (
            <p className="review-title">{spot.numReviews} review</p>
          )}
          {spot.numReviews === 0 && <p className="review-title">New</p>}
        </div>
        <div className="review-container">
          {reviewArr.map((review) => (
            <h2 className="review-stuff">
              <p>{`${review?.User?.firstName} `}</p>
              <p>{new Date(review.createdAt).toDateString()}</p>
              <p>{`${review.review}`}</p>
              {hasReview.length > 0 && (
                <button>
                  <OpenModalButton
                    buttonText="Delete Review"
                    onItemClick={closeModal}
                    modalComponent={<DeleteReviewModal reviewId={review.id} />}
                  />
                </button>
              )}
            </h2>
          ))}
        </div>
      </div>
    );
};
export default SingleSpot;
