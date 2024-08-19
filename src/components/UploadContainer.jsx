import styles from "../stylesheets/Test.module.scss";
import uploadIcon from "../assets/upload.svg";

const UploadContainer = ({
  handleFileUpload,
  handleDrop,
  handleFileChange,
  errorMessage,
}) => (
  <div className={styles.uploadContainer} ondrop={handleDrop}>
    <div className={styles.uploadArea} onClick={handleFileUpload}>
      <input
        id="fileUpload"
        type="file"
        accept=".jpg,.jpeg,.png"
        style={{ display: "none" }}
        onchange={(e) => handleFileChange(e)}
      />
      <div className={styles.uploadIcon}>
        <a href="/Test">
          <img src={uploadIcon} alt="UploadIcon" />
        </a>
      </div>
      <p className={styles.uploadText}>
        Drop your image here, or{" "}
        <span className={styles.browseText}>browse</span>
      </p>
      <p className={styles.supportedFormats}>
        Supports JPG, JPEG and PNG files.
      </p>
      {errorMessage() && <p className={styles.errorText}>{errorMessage()}</p>}
    </div>
  </div>
);

export default UploadContainer;
