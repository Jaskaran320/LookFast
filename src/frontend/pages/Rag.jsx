import { createSignal, createEffect, Show } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import Dexie from "dexie";
import Chatbot from "../components/Chatbot";
import UploadContainer from "../components/UploadContainer";
import UploadingContainer from "../components/UploadingContainer";
import styles from "../stylesheets/Rag.module.scss";
import { vectorizeData } from "../utils/rag";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB

const Rag = () => {
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

  const [db, setDb] = createSignal(null);
  const [isUploading, setIsUploading] = createSignal(false);
  const [fileUploaded, setFileUploaded] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [showChatbot, setShowChatbot] = createSignal(false);
  // const [loading, setLoading] = createSignal(false);

  onMount(() => {
    const database = new Dexie("RAGDatabase");
    database.version(1).stores({
      files: "++id, name, content",
      vectors: "++id, name, vector",
    });
    setDb(database);
  });

  // onCleanup(() => {
  //   if (db()) {
  //     db().files.clear();
  //     db().vectors.clear();
  //     db().close();
  //   }
  // });

  const handleFileUploadStart = () => {
    setIsUploading(true);
  };

  const handleFileUploadComplete = () => {
    setIsUploading(false);
    setFileUploaded(true);
  };

  const handleFileUpload = () => {
    document.getElementById("fileUpload").click();
  };

  const handleDrop = (e) => {
    let dataTransfer = e.dataTransfer;
    let file = dataTransfer.files;
    document.getElementById("fileUpload").files = file;
    document.getElementById("fileUpload").dispatchEvent(new Event("change"));
  };

  const handleButtonClick = () => {
    setShowChatbot(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage("File size exceeds the 100MB limit.");
        return;
      }
      handleFileUploadStart();
      setErrorMessage("");

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const content = reader.result;
          const vectors = await vectorizeData(content);
          // check if that file already exists in the database
          // if it does, then do not add it again

          if (db().files.where({ name: file.name }).count() > 0) {
            setErrorMessage("This file has already been uploaded.");
            handleFileUploadComplete();
            return;
          }

          await db().transaction("rw", db().files, db().vectors, async () => {
            // await db().files.clear();
            // await db().vectors.clear();
            await db().files.add({ name: file.name, content: content });
            // for (let i = 0; i < vectors.length; i++) {
            //   await db().vectors.add({ vector: vectors[i] });
            // }
            await db().vectors.add({ name: file.name, vector: vectors });
          });
          handleFileUploadComplete();
        };
        reader.readAsText(file);
      } catch (err) {
        setErrorMessage("An error occurred during file processing.");
        handleFileUploadComplete();
      }
    }
  };

  return (
    <div className={`${styles.mainContent} test-window`}>
      <Show
        when={!isUploading() && !showChatbot()}
        fallback={
          <Show
            when={isUploading()}
            fallback={showChatbot() ? <Chatbot db={db()} /> : null}
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
          context="rag"
        />
        <button className={styles.chatbotButton} onClick={handleButtonClick}>
          Chat with the AI
        </button>
      </Show>
    </div>
  );
};

export default Rag;
