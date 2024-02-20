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
  console.log(spot?.SpotImages[0].url, "heres the image url");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [dispatch, spotId]);

  return (
    <div className="spot-container">
      <h1 className="spot-name">{spot?.name}</h1>
      <p>
        {spot?.city}, {spot?.state}, {spot?.country}
      </p>
      <div className="image-container">
        <img className="image1" src={spot?.SpotImages[0].url} alt="image1" />
        <div className="small-images">
          <img
            className="image-small"
            src={spot?.SpotImages[1].url}
            alt="image2"
          />
          <img
            className="image-small"
            src={spot?.SpotImages[2].url}
            alt="image3"
          />
          <img
            className="image-small"
            src={spot?.SpotImages[3].url}
            alt="image4"
          />
          <img
            className="image-small"
            src={spot?.SpotImages[4].url}
            alt="image5"
          />
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
