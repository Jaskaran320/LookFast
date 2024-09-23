import styles from "../stylesheets/Segment.module.scss";
import uploadIcon from "../assets/upload.svg";

const UploadContainer = ({
  handleFileUpload,
  handleDrop,
  handleFileChange,
  errorMessage,
  context,
}) => (
  <div className={styles.uploadContainer} ondrop={handleDrop}>
    <div className={styles.uploadArea} onClick={handleFileUpload}>
      <input
        id="fileUpload"
        type="file"
        accept={context === "segment" ? ".jpg,.jpeg,.png" : ".txt,.json,.md"}
        style={{ display: "none" }}
        onchange={(e) => handleFileChange(e)}
      />
      <div className={styles.uploadIcon}>
        <a href={context === "segment" ? "/segment" : "/rag"}>
          <img src={uploadIcon} alt="UploadIcon" />
        </a>
      </div>
      <p className={styles.uploadText}>
        {context === "segment"
          ? "Drop your image here, or "
          : "Drop your file here, or "}
        <span className={styles.browseText}>browse</span>
      </p>
      <p className={styles.supportedFormats}>
        {context === "segment"
          ? "Supports JPG, JPEG and PNG files."
          : "Supports TXT, JSON, and MD files."}
      </p>
      {errorMessage() && <p className={styles.errorText}>{errorMessage()}</p>}
    </div>
  </div>
);

export default UploadContainer;
