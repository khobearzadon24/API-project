import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
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
  // console.log(sessionUser, "here is my session user");
  // console.log(sessionUser.id);
  const ulRef = useRef();

  // console.log(review, "here is the reviews");
  console.log(review?.user, "here is the user of the review");
  const reviewArr = Object.values(review);
  // console.log(reviewArr, "reviewArr");
  // console.log(
  //   reviewArr[0].User.id,
  //   "here is the actual firstname of the review"
  // );

  let hasReview = reviewArr.filter(
    (review) => review.User.id === sessionUser.id
  );
  // console.log(spot, "over here!");
  // console.log(spot?.SpotImages, "here is the spots");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpot(spotId));
    dispatch(fetchAllReviews(spotId));
  }, [dispatch, spotId, reviewArr.length]);

  if (!spot) return;
  // if (!spot.SpotImages[0] || !spot) return <div>information</div>;

  // const imageOne = spot?.SpotImages[0].url;
  // console.log(reviewArr[0].createdAt, "here is my date example");
  // let number = reviewArr[0].createdAt;
  // const date = new Date(number);
  // console.log(date, "here is the conversion");
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
            <p className="hosted">
              Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
            </p>
            <h1>{spot?.description}</h1>
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
                  {`${spot.avgRating.toFixed(1)}` || `New`}{" "}
                </p>
              </div>
              <p>{spot.numReviews} review(s)</p>
            </div>
            <div className="reverse-container">
              <button className="reserve">Reserve</button>
            </div>
          </div>
        </div>
        <div className="review-header">
          <div className="star-box">
            <p className="stars">{`${spot.avgRating.toFixed(1)}` || `New`} </p>
            <img
              className="star"
              src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
              alt="star"
            />
          </div>
          <p className="review-title">{spot.numReviews} reviews</p>
        </div>
        <div className="review-container">
          <div className="post-here" ref={ulRef}>
            <div className="post-button">
              <OpenModalButton
                buttonText="Post A Review"
                onItemClick={closeModal}
                modalComponent={<PostReviewModal spotId={spotId} />}
              />
            </div>
          </div>
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
            <p>
              Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
            </p>
            <p>{spot?.description}</p>
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
                  {`${spot.avgRating.toFixed(1)}` || `New`}{" "}
                </p>
              </div>
              <p>{spot.numReviews} review(s)</p>
            </div>
            <button className="reserve">Reserve</button>
          </div>
        </div>
        <div className="review-header">
          <div className="star-box">
            <p className="stars">{`${spot.avgRating.toFixed(1)}` || `New`} </p>
            <img
              className="star"
              src="https://i.postimg.cc/QxSC3byV/stars-removebg-preview.png"
              alt="star"
            />
          </div>
          <p className="review-title">{spot.numReviews} reviews</p>
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
