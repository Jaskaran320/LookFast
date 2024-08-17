import { createSignal, Show, onMount } from "solid-js";
import imageCompression from "browser-image-compression";
import styles from "../stylesheets/Test.module.scss";
import uploadIcon from "../assets/upload.svg";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Test = () => {
  localStorage.clear();

  const [isUploading, setIsUploading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [image, setImage] = createSignal(null);
  const [coordinates, setCoordinates] = createSignal({ x: 0, y: 0 });

  onMount(() => {
    const storedImage = localStorage.getItem("uploadedImage");
    if (storedImage) {
      setImage(storedImage);
    }
  });

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
          setImage(base64data);
          console.log(
            "File size before compression: ",
            file.size / 1024 / 1024 + "MB"
          );
          console.log(
            "File size after compression: ",
            compressedFile.size / 1024 / 1024 + "MB"
          );

          setTimeout(() => {
            setIsUploading(false);
          }, 1000);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setErrorMessage("An error occurred during compression.");
        setIsUploading(false);
      }
    }
  };

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

  const handleReset = () => {
    localStorage.removeItem("uploadedImage");
    setImage(null);
    setCoordinates({ x: 0, y: 0 });
  };

  return (
    <div className={styles.mainContent}>
      <Show
        when={!isUploading() && !image()}
        fallback={
          <Show
            when={isUploading()}
            fallback={
              <div className={styles.displayPage}>
                <div className={styles.mainContentDisplay}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.imageContainer}>
                      <img
                        src={image()}
                        alt="Uploaded"
                        className={styles.image}
                        onClick={handleImageClick}
                      />
                    </div>
                    <button
                      className={styles.confirmButton}
                      onClick={handleConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      className={styles.resetButton}
                      onClick={handleReset}
                    >
                      Reset
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
            }
          >
            <div className={styles.uploadingContainer}>
              <p class={styles.uploadText}>Uploading...</p>
              <div className={styles.loader}></div>
            </div>
          </Show>
        }
      >
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
      </Show>
    </div>
  );
};

export default Test;
