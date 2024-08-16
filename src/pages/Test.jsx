import imageCompression from 'browser-image-compression';
import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";

import styles from "../stylesheets/Test.module.scss";
import uploadIcon from "../assets/upload.svg";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Test = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");

  const handleFileUpload = () => {
    document.getElementById("fileUpload").click();
  };
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage("File size exceeds the 5MB limit.");
        return;
      }
      setIsUploading(true);
      setErrorMessage("");

      try {
        const options = {
          maxSizeMB: 3,
          maxWidthOrHeight: 400,
          useWebWorker: true,
        };
  
        const compressedFile = await imageCompression(file, options);
  
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          localStorage.setItem("uploadedImage", base64data);
          console.log("File size before compression: ", file.size / 1024 / 1024 + "MB");
          console.log("File size after compression: ", compressedFile.size / 1024 / 1024 + "MB");
  
          setTimeout(() => {
            setIsUploading(false);
            navigate("/Display");
          }, 1000);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setErrorMessage("An error occurred during compression.");
        setIsUploading(false);
      }
    }
  };

  return (
    <div className={styles.mainContent}>
      {isUploading() ? (
        <div className={styles.uploadingContainer}>
          <p class={styles.uploadText}>Uploading...</p>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <div className={styles.uploadContainer}>
          <div className={styles.uploadArea} onClick={handleFileUpload}>
            <input
              id="fileUpload"
              type="file"
              accept=".jpg,.jpeg,.png"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e)}
            />
            <div className={styles.uploadIcon}>
              <a href="/Test">
                <img src={uploadIcon} alt="Upload" />
              </a>
            </div>
            <p className={styles.uploadText}>
              Drop your image here, or{" "}
              <span className={styles.browseText}>browse</span>
            </p>
            <p className={styles.supportedFormats}>
              Supports JPG, JPEG and PNG files
            </p>
            {errorMessage() && (
              <p className={styles.errorText}>{errorMessage()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
