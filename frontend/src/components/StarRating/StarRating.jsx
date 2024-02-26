// import { FaStar } from "react-icons/fa";
// import { useState } from "react";
// import "./StarRating.css";

// const StarRating = ({ rating, starClick }) => {
//   const [hover, setHover] = useState(0);

//   const starHover = (star) => {
//     setHover(star);
//   };

//   let stars = [1, 2, 3, 4, 5];
//   return (
//     <div>
//       {stars.map((star) => (
//         <span
//           key={star}
//           className={(hover || star) =rating ? "filled" : "empty"}
//           onMouseEnter={() => starHover(star)}
//           onMouseLeave={() => starHover(0)}
//           onClick={() => starClick(star)}
//         >
//           <FaStar />
//         </span>
//       ))}
//     </div>
//   );
// };

// export default StarRating;

import { PiStarDuotone } from "react-icons/pi";
import { useState } from "react";
import "./StarRating.css";

const StarRating = ({ rating, starClick }) => {
  const [onhover, setonHover] = useState(0);

  const starHover = (star) => {
    setonHover(star);
  };

  let stars = [1, 2, 3, 4, 5];
  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={star <= rating || star <= onhover ? "filled" : "empty"}
          onMouseEnter={() => starHover(star)}
          onMouseLeave={() => starHover(0)}
          onClick={() => starClick(star)}
        >
          <PiStarDuotone />
        </span>
      ))}
      <span className="star-text">Stars</span>
    </div>
  );
};

export default StarRating;
