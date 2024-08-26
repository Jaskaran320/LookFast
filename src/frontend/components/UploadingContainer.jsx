import styles from "../stylesheets/Segment.module.scss";

const UploadingContainer = () => (
  <div className={styles.uploadingContainer}>
    <p className={styles.uploadingText}>Uploading...</p>
    <div className={styles.loader}></div>
  </div>
);

export default UploadingContainer;
