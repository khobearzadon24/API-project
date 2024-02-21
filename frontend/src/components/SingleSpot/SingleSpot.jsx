import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpot } from "../../store/spotReducer";
import "./SingleSpot.css";

const SingleSpot = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spotState[spotId]);

  console.log(spot, "over here!");
  // console.log(spot?.SpotImages[0].url, "heres the image url");
  console.log(spot?.SpotImages, "here is the spots");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [dispatch, spotId]);

  if (!spot) return;
  // if (!spot.SpotImages[0] || !spot) return <div>information</div>;

  // const imageOne = spot?.SpotImages[0].url;
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

      <p>
        Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
      </p>
      <p>{spot?.description}</p>
    </div>
  );
};
export default SingleSpot;
