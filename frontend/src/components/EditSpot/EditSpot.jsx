import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpot } from "../../store/spotReducer";
import { useParams } from "react-router-dom";
import SpotInput from "../SpotInput/SpotInput";

const EditSpot = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spotState[spotId]);
  console.log(spot, "OVER HERE");
  const dispatch = useDispatch();
  const formType = "edit";
  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [dispatch, spotId]);

  if (!spot) return;

  return (
    Object.keys(spot).length > 1 && (
      <SpotInput spot={spot} formType={formType} />
    )
  );
};

export default EditSpot;
