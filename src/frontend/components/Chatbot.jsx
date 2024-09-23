import { createSignal, onCleanup, onMount, createEffect } from "solid-js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { Motion } from "solid-motionone";
import TextBubble from "./TextBubble";
import { performRAG } from "../utils/rag";
import arrow from "../assets/arrow.svg";
import square from "../assets/square.svg";
import styles from "../stylesheets/Rag.module.scss";

const Chatbot = ({ db }) => {
  const TYPING_SPEED = 15;
  const [queryText, setQueryText] = createSignal("");
  const [isTyping, setIsTyping] = createSignal(true);
  const [chatHistory, setChatHistory] = createSignal([]);
  const [abortControllerRef, setAbortControllerRef] = createSignal(null);
  let chatContainerRef;
  let inputRef;

  const initialGreeting = "Hi there! Please ask me any questions about the uploaded content and I will try my best to help you out. 😊";

  const simulateTypingEffect = (reply, isInitialGreeting = false) => {
    let index = 0;
    let currentText = "";

    const typeCharacter = () => {
      if (index < reply.length && !abortControllerRef()?.signal.aborted) {
        currentText += reply.charAt(index);

        setChatHistory((prevHistory) => {
          if (
            isInitialGreeting ||
            (prevHistory.length > 0 &&
              prevHistory[prevHistory.length - 1].type === "bot")
          ) {
            const updatedMessage = {
              type: "bot",
              markdown: currentText,
            };
            return isInitialGreeting
              ? [updatedMessage]
              : [...prevHistory.slice(0, -1), updatedMessage];
          } else {
            return [...prevHistory, { type: "bot", markdown: currentText }];
          }
        });
        index++;
        setTimeout(() => {
          typeCharacter();
          scrollToBottom();
        }, TYPING_SPEED);
      } else {
        setIsTyping(false);
        scrollToBottom();
        setAbortControllerRef(null);
      }
    };

    if (!isInitialGreeting) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "bot", markdown: "" },
      ]);
    }
    
    setIsTyping(true);
    setAbortControllerRef(new AbortController());
    setTimeout(() => {
      typeCharacter();
      scrollToBottom();
    }, TYPING_SPEED);
  };

  const scrollToBottom = () => {
    if (chatContainerRef) {
      const scrollHeight = chatContainerRef.scrollHeight;
      const height = chatContainerRef.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  onMount(() => {
    simulateTypingEffect(initialGreeting, true);
  });

  createEffect(() => {
    chatHistory();
    scrollToBottom();
  });

  const handleClick = async () => {
    const currentQueryText = queryText();
    if (!currentQueryText.trim() || isTyping()) return;

    let newChatHistory = [
      ...chatHistory(),
      { type: "user", markdown: currentQueryText },
    ];
    setChatHistory(newChatHistory);
    scrollToBottom();
    setQueryText("");
    setIsTyping(true);

    try {
      const formattedChatHistory = newChatHistory
        .slice(1)
        .map((msg) =>
          msg.type === "user"
            ? new HumanMessage(msg.markdown)
            : new AIMessage(msg.markdown)
        );

      const response = await performRAG(currentQueryText, formattedChatHistory, db);
      let finalResponse =
        response === "Unknown"
          ? "I'm sorry, I don't know the answer to that question."
          : response;

      simulateTypingEffect(finalResponse);
    } catch (error) {
      if (error.name === 'AbortError') {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: "bot", markdown: "Response generation was stopped." },
        ]);
        setIsTyping(false);
      } else {
        simulateTypingEffect(
          "I'm sorry, I encountered an error while processing your request."
        );
      }
    }
  };

  const handleStopGeneration = () => {
    const currentAbortController = abortControllerRef();
    if (currentAbortController) {
      currentAbortController.abort();
    }
  };

  createEffect(() => {
    if (chatContainerRef) {
      chatContainerRef.classList.add(styles.smoothScroll);
    }
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    const handleKeyPress = (event) => {
      if (event.key === "/" && document.activeElement !== inputRef) {
        event.preventDefault();
        inputRef.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyPress);
    });
  });

  return (
    <div className={styles.chatIsland}>
      <div className={styles.chat}>
        <div
          ref={chatContainerRef}
          className={styles.chatContainer}
        >
          {chatHistory().map((textitem, index) =>
            textitem.type === "user" ? (
              <Motion
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={styles.motionUserText}
              >
                <TextBubble markdown={textitem.markdown} type="user" />
              </Motion>
            ) : index === chatHistory().length - 1 ? (
              <Motion
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={styles.motionBotText}
              >
                <TextBubble markdown={textitem.markdown} type="bot" />
              </Motion>
            ) : (
              <div className={styles.motionBotText}>
                <TextBubble markdown={textitem.markdown} type="bot" />
              </div>
            )
          )}
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder={
                isTyping() ? "Gemini is typing..." : "Enter Prompt Here..."
              }
              value={queryText()}
              onInput={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isTyping()) {
                  handleClick();
                }
              }}
            />
            <button 
              type="button" 
              onClick={isTyping() ? handleStopGeneration : handleClick} 
              className={styles.submitButton}
            >
              <img
                src={isTyping() ? square : arrow}
                alt={isTyping() ? "Stop" : "Send"}
                className={isTyping() ? styles.stopIcon : styles.arrowIcon}
              />
            </button>
          </div>
        </div>
        <div className={styles.note}>
          NOTE: This chatbot is powered by Google Gemini and LangChain. Please excuse any mistakes 😀.
        </div>
      </div>
    </div>
  );
};

export default Chatbot;