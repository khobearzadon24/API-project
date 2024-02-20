// action type creator
const LOAD_SPOT = "spot/loadSpot";
const LOAD_ALLSPOTS = "spot/loadAllSpots";

//action creator
export const loadSpot = (spot) => {
  return {
    type: LOAD_SPOT,
    spot,
  };
};

export const loadAllSpots = (spots) => {
  return {
    type: LOAD_ALLSPOTS,
    spots,
    //payload
  };
};

//thunk action creators
export const fetchSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);
  const spot = await response.json();
  console.log(response, "response");
  console.log(spot, "spot");
  dispatch(loadSpot(spot));
};

export const fetchAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  const spots = await response.json();
  dispatch(loadAllSpots(spots));
};

//selectors if needed

//reducer
const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case LOAD_ALLSPOTS: {
      const spotsState = {};
      action.spots.Spots.forEach((spot) => {
        spotsState[spot.id] = spot;
      });
      return spotsState;
    }
    default:
      return state;
  }
};

export default spotReducer;
