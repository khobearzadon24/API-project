const LOAD_SPOT = "spot/loadSpot";

export const loadSpot = (spot) => {
  return {
    type: LOAD_SPOT,
    spot,
  };
};

export const fetchSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);
  const spot = await response.json();
  console.log(response, "response");
  console.log(spot, "spot");
  dispatch(loadSpot(spot));
};

const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    default:
      return state;
  }
};

export default spotReducer;
