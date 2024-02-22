import { useState } from "react";
// import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { editSpot, writeImage, writeSpot } from "../../store/spotReducer";
import { useNavigate } from "react-router-dom";
import "./SpotInput.css";

const SpotInput = ({ spot, formType }) => {
  const [ownerId, setOwnerId] = useState(spot.ownerId || "");
  const [address, setAddress] = useState(spot.address || "");
  const [city, setCity] = useState(spot.city || "");
  const [state, setState] = useState(spot.state || "");
  const [country, setCountry] = useState(spot.country || "");
  const [name, setName] = useState(spot.name || "");
  const [description, setDescription] = useState(spot.description || "");
  const [price, setPrice] = useState(spot.price || "");
  const [previewImage, setPreviewImage] = useState(spot.previewImage || "");
  const [imageOne, setImageOne] = useState(spot.imageOne || "");
  const [imageTwo, setImageTwo] = useState(spot.imageTwo || "");
  const [imageThree, setImageThree] = useState(spot.imageThree || "");
  const [imageFour, setImageFour] = useState(spot.imageFour || "");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validationObj = {};
  const handleSubmit = async (e) => {
    setSubmitted(true);
    e.preventDefault();
    const newSpot = {
      ownerId,
      address,
      city,
      state,
      country,
      name,
      description,
      price,
      previewImage,
      imageOne,
      imageTwo,
      imageThree,
      imageFour,
    };

    setErrors({});
    // console.log(errors);
    let madeSpot;
    if (formType === "edit") {
      await dispatch(editSpot(spot.id, newSpot));
    } else {
      madeSpot = await dispatch(writeSpot(newSpot));
    }

    const validImg = (url) => {
      const fileType = [".png", ".jpg", ".jpeg"];
      const newUrl = url.toLowerCase();
      return fileType.some((type) => newUrl.endsWith(type));
    };

    if (!previewImage || !validImg(previewImage)) {
      validationObj.previewImage =
        "Atleast 1 image is required and must end with .png, .jpg, or .jpeg";
    }

    if (imageOne && !validImg(imageOne)) {
      validationObj.imageOne = "Image URL must end with .png, .jpg, or .jpeg";
    }

    if (imageTwo && !validImg(imageTwo)) {
      validationObj.imageTwo = "Image URL must end with .png, .jpg, or .jpeg";
    }

    if (imageThree && !validImg(imageThree)) {
      validationObj.imageThree = "Image URL must end with .png, .jpg, or .jpeg";
    }
    if (imageFour && !validImg(imageFour)) {
      validationObj.imageFour = "Image URL must end with .png, .jpg, or .jpeg";
    }

    if (madeSpot && madeSpot.errors) {
      setErrors(madeSpot.errors);
    }

    if (formType === "edit") return navigate(`/spots/${spot.id}`);
    const imgArr = [previewImage, imageOne, imageThree, imageFour];
    dispatch(writeImage(imgArr, madeSpot.id));
    navigate(`/spots/${madeSpot.id}`);
    reset();
  };
  const reset = () => {
    setOwnerId("");
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setName("");
    setDescription("");
    setPrice("");
    setPreviewImage("");
    setImageOne("");
    setImageTwo("");
    setImageThree("");
    setImageFour("");
  };

  return (
    <div className="inputBox">
      <div className="form-heading">
        <h1 className="form-title">Create a new Spot</h1>
        <h2 className="where-location">Where &apos;s your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a reservation
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <p>Country</p>
        {errors.country && <p className="errors">{errors.country}</p>}
        <input
          className="country"
          type="text"
          onChange={(e) => setCountry(e.target.value)}
          value={country}
          placeholder="Country"
          name="country"
        />
        <p>Street Address</p>
        {errors.address && <p className="errors">{errors.address}</p>}
        <input
          className="address"
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          placeholder="Address"
          name="address"
        />
        <p>City</p>
        {errors.city && <p className="errors">{errors.city}</p>}
        <input
          className="city"
          type="text"
          onChange={(e) => setCity(e.target.value)}
          value={city}
          placeholder="City"
          name="city"
        />
        <p>State</p>
        {errors.state && <p className="errors">{errors.state}</p>}
        <input
          className="state"
          type="text"
          onChange={(e) => setState(e.target.value)}
          value={state}
          placeholder="State"
          name="state"
        />
        <p>Describe your place to guests</p>
        {errors.description && <p className="errors">{errors.description}</p>}
        <textarea
          className="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          placeholder="Please write at least 30 characters"
          rows="10"
        ></textarea>
        <p>Create a title for your spot</p>
        {errors.name && <p className="errors">{errors.name}</p>}
        <input
          className="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Name of your spot"
          name="name"
        />
        <p>Set a base price for your spot</p>
        {errors.price && <p className="errors">{errors.price}</p>}
        <div className="price-box">
          <p>$</p>
          <input
            className="price"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            placeholder="Price per night(USD)"
            name="price"
          />
        </div>
        <p>Liven up your spot with photos</p>
        <p>Submit a link to at least one photo to publish your spot</p>
        <div className="image-inputs">
          <input
            type="text"
            name="previewImage"
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          ></input>
          {submitted && "previewImage" in validationObj && (
            <p>{validationObj.previewImage}</p>
          )}
          <input
            type="text"
            name="imageOne"
            placeholder="Image URL"
            value={imageOne}
            onChange={(e) => setImageOne(e.target.value)}
          ></input>
          {submitted && "imageOne" in validationObj && (
            <p>{validationObj.imageOne}</p>
          )}
          <input
            type="text"
            name="imageTwo"
            placeholder="Image URL"
            value={imageTwo}
            onChange={(e) => setImageTwo(e.target.value)}
          ></input>
          {submitted && "imageTwo" in validationObj && (
            <p>{validationObj.imageTwo}</p>
          )}
          <input
            type="text"
            name="imageThree"
            placeholder="Image URL"
            value={imageThree}
            onChange={(e) => setImageThree(e.target.value)}
          ></input>
          {submitted && "imageThree" in validationObj && (
            <p>{validationObj.imageThree}</p>
          )}

          <input
            type="text"
            name="imageFour"
            placeholder="Image URL"
            value={imageFour}
            onChange={(e) => setImageFour(e.target.value)}
          ></input>
          {submitted && "imageFour" in validationObj && (
            <p>{validationObj.imageFour}</p>
          )}
        </div>

        <button className="button">Create Spot</button>
      </form>
    </div>
  );
};

export default SpotInput;
