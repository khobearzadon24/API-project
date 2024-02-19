import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpot } from "../../store/spotReducer";

const SingleSpot = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spotState[spotId]);

  console.log(spot, "over here!");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [dispatch, spotId]);

  return (
    <div>
      <h1>{spot?.name}</h1>
    </div>
  );
};
export default SingleSpot;
