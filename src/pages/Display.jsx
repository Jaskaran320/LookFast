import { createSignal } from "solid-js";
import styles from "../stylesheets/Display.module.scss";

const Display = () => {
  const [image, setImage] = createSignal(localStorage.getItem("uploadedImage"));
  const [coordinates, setCoordinates] = createSignal({ x: 0, y: 0 });

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoordinates({ x: Math.round(x), y: Math.round(y) });
  };

  const handleConfirm = () => {
    setCoordinates({ x: 0, y: 0 });
    console.log("Coordinates confirmed:", coordinates());
  };

  return (
    <div className={styles.displayPage}>
      <div className={styles.mainContent}>
        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <img
              src={image()}
              alt="Uploaded"
              className={styles.image}
              onClick={handleImageClick}
            />
          </div>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm
          </button>
        </div>
        <div className={styles.coordinates}>
          <span>X: {coordinates().x}</span>
          <span>Y: {coordinates().y}</span>
        </div>
      </div>
      <div className={styles.instructions}>
        <p>Select point and press confirm</p>
      </div>
    </div>
  );
};

export default Display;
