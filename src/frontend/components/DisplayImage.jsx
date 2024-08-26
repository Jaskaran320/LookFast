import styles from "../stylesheets/Segment.module.scss";
import { IoInformationCircleSharp } from "solid-icons/io";

const DisplayImage = ({
  image,
  handleConfirm,
  handleImageClick,
  handleReset,
  handleResetImage,
  coordinates,
}) => (
  <div className={styles.displayPage}>
    <div className={styles.contentWrapper}>
      <div className={styles.leftButton}>
        <button className={styles.resetImageButton} onClick={handleResetImage}>
          Reset Image
        </button>
      </div>
      <div className={styles.mainContentDisplay}>
        {/* <div className={styles.imageWrapper}> */}
          <div className={styles.imageContainer}>
            <img
              src={image()}
              alt="Uploaded"
              className={styles.image}
              onClick={handleImageClick}
            />
          </div>
        {/* </div> */}
        <div className={styles.coordinates}>
          <span>X: {coordinates().x}</span>
          <span>Y: {coordinates().y}</span>
        </div>
        <div className={styles.instructions}>
          <IoInformationCircleSharp size={24} /> Select point and press confirm.
        </div>
      </div>
      <div className={styles.rightButtons}>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          Confirm
        </button>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  </div>
);

export default DisplayImage;
