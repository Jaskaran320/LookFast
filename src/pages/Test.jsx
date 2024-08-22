import { createSignal, Show, onMount } from "solid-js";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { createEffect } from "solid-js";

import UploadContainer from "../components/UploadContainer";
import UploadingContainer from "../components/UploadingContainer";
import DisplayImage from "../components/DisplayImage";
import styles from "../stylesheets/Test.module.scss";
import LoadingOverlay from "../components/LoadingOverlay";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Test = () => {
  createEffect(() => {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      document
        .querySelector(".test-window")
        .addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
    });
  });

  localStorage.clear();

  const [isUploading, setIsUploading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [image, setImage] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
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

  const handleDrop = (e) => {
    let dataTransfer = e.dataTransfer;
    let image = dataTransfer.files;
    document.getElementById("fileUpload").files = image;
    console.log(document.getElementById("fileUpload").files);
    document.getElementById("fileUpload").dispatchEvent(new Event("change"));
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

  const handleConfirm = async () => {
    if (!coordinates().x || !coordinates().y) {
      alert("Please select a point on the image.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://5f15-35-197-88-4.ngrok-free.app/process_image",
        {
          image: image(),
          coordinates: coordinates(),
        }
      );
      console.log("Response from server: ", response.data.message);

      setImage(response.data.masked_image);
    } catch (error) {
      console.error("Error sending data to server:", error);
      alert("An error occurred while processing the image");
    } finally {
      setLoading(false);
    }

    setCoordinates({ x: 0, y: 0 });
  };

  const handleReset = () => {
    localStorage.removeItem("uploadedImage");
    setImage(null);
    setCoordinates({ x: 0, y: 0 });
  };

  return (
    <div className={`${styles.mainContent} test-window`}>
      <Show when={loading()}>
        <LoadingOverlay />
      </Show>
      <Show
        when={!isUploading() && !image()}
        fallback={
          <Show
            when={isUploading()}
            fallback={
              <DisplayImage
                image={image}
                handleConfirm={handleConfirm}
                handleImageClick={handleImageClick}
                handleReset={handleReset}
                coordinates={coordinates}
              />
            }
          >
            <UploadingContainer />
          </Show>
        }
      >
        <UploadContainer
          handleFileUpload={handleFileUpload}
          handleFileChange={handleFileChange}
          handleDrop={handleDrop}
          errorMessage={errorMessage}
        />
      </Show>
    </div>
  );
};

export default Test;
