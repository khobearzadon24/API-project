import { useState } from "react";
// import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { writeSpot } from "../../store/spotReducer";
import "./SpotInput.css";

const SpotInput = () => {
  const [ownerId, setOwnerId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
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
    const madeSpot = await dispatch(writeSpot(newSpot));
    if (madeSpot && madeSpot.errors) {
      console.log(madeSpot.errors);
      return setErrors(madeSpot.errors);
    }
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
        <h2 className="where-location">Where's your place located?</h2>
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
            onChange={(e) => setPreviewImage(e.target.value)}
            value={previewImage}
            placeholder="Preview Image URL"
            name="previewImage"
          />
          <input
            type="text"
            onChange={(e) => setImageOne(e.target.value)}
            value={imageOne}
            placeholder=" Image URL"
            name="imageOne"
          />
          <input
            type="text"
            onChange={(e) => setImageTwo(e.target.value)}
            value={imageTwo}
            placeholder=" Image URL"
            name="imageTwo"
          />

          <input
            type="text"
            onChange={(e) => setImageThree(e.target.value)}
            value={imageThree}
            placeholder=" Image URL"
            name="imageThree"
          />
          <input
            type="text"
            onChange={(e) => setImageFour(e.target.value)}
            value={imageFour}
            placeholder=" Image URL"
            name="imageFour"
          />
        </div>

        <button className="button" type="submit">
          Create Spot
        </button>
      </form>
    </div>
  );
};

export default SpotInput;
