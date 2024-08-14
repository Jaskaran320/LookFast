import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";

import styles from "./style/Test.module.scss";
import uploadIcon from "./assets/upload.svg";

const Test = () => {
  const navigate = useNavigate();
  const [image, setImage] = createSignal("");

  const handleFileUpload = () => {
    document.getElementById("fileUpload").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        navigate("/Display");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    // <div className={styles.testPage}>
    <div className={styles.mainContent}>
      <div className={styles.uploadContainer}>
        <div className={styles.uploadArea} onClick={handleFileUpload}>
          <input
            id="fileUpload"
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => {
              //   const file = e.target.files[0];
              //   if (file) {
              //     console.log("File selected:", file.name);
              //   }
              handleFileChange(e);
            }}
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
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Test;
