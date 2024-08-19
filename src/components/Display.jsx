import styles from "../stylesheets/Test.module.scss";
import { IoInformationCircleSharp } from "solid-icons/io";

const Display = ({
  image,
  handleConfirm,
  handleImageClick,
  handleReset,
  coordinates,
}) => (
  <div className={styles.displayPage}>
    <div className={styles.mainContentDisplay}>
      <div className={styles.imageWrapper}>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
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
      {" "}
      <IoInformationCircleSharp size={24} /> Select point and press confirm.
    </div>
  </div>
);

export default Display;
