import { csrfFetch } from "./csrf";

// action type creator
const LOAD_SPOT = "spot/loadSpot";
const LOAD_ALLSPOTS = "spot/loadAllSpots";
const ADD_SPOT = "spot/addSpot";

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

export const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot,
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

export const writeSpot = (payload) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log(response);
  const spot = await response.json();
  if (response.status !== 201) {
    console.log(spot);
    return spot;
  }
  if (response.ok) {
    dispatch(addSpot(spot));
    console.log(spot);
    return spot;
  }
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
    case ADD_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    default:
      return state;
  }
};

export default spotReducer;
