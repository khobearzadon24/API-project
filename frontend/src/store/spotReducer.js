import { csrfFetch } from "./csrf";

// action type creator
const LOAD_SPOT = "spot/loadSpot";
const LOAD_ALLSPOTS = "spot/loadAllSpots";
const LOAD_OWNERSPOTS = "spot/ownerSpots";
const ADD_SPOT = "spot/addSpot";
const ADD_SPOTIMAGE = "spot/addImage";
const REMOVE_SPOT = "spot/removeSpot";
const UPDATE_SPOT = "spot/updateSpot";

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

export const loadOwnerSpots = (spots) => {
  return {
    type: LOAD_OWNERSPOTS,
    spots,
  };
};

export const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot,
  };
};

export const addImage = (image) => {
  return {
    type: ADD_SPOTIMAGE,
    image,
  };
};

export const removeSpot = (spot) => {
  return {
    type: REMOVE_SPOT,
    spot,
  };
};

export const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
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

export const fetchOwnerSpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);
  console.log(response, "response");
  const spots = await response.json();
  console.log("spots", spots);
  dispatch(loadOwnerSpots(spots));
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

export const writeImage = (imgArr, spotId) => (dispatch) => {
  imgArr.map(async (image) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: image, preview: true }),
    });
    console.log(response);
    const spotImage = await response.json();
    if (response.status !== 200) {
      console.log(spotImage);
      return spotImage;
    }
    if (response.ok) {
      dispatch(addImage(spotImage));
      console.log(spotImage);
    }
  });
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Successfully deleted",
    }),
  });
  if (response.ok) {
    const spot = await response.json();
    dispatch(removeSpot(spotId));
    return spot;
  }
};

export const editSpot = (spotId, payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    header: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const spot = await response.json();
    dispatch(updateSpot(payload));
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
    case LOAD_OWNERSPOTS: {
      const spotState = {};
      action.spots.Spots.forEach((spot) => {
        spotState[spot.id] = spot;
      });
      return spotState;
    }
    case ADD_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case ADD_SPOTIMAGE:
      return { ...state, [action.image.id]: action.image };
    case REMOVE_SPOT:
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    case UPDATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };

    default:
      return state;
  }
};

export default spotReducer;
