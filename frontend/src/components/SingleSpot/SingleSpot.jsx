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
      <img src={spot?.SpotImages[0].url} alt="image" />
      <p>
        Hosted By {spot?.Owner?.firstName} {spot?.Owner?.lastName}
      </p>
      <p>{spot?.description}</p>
    </div>
  );
};
export default SingleSpot;
