import { createSignal, on, onCleanup, onMount } from "solid-js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {Motion} from "solid-motionone"
import TextBubble from "./TextBubble";
import { performRAG } from "../utils/rag";
import arrow from "../assets/arrow.svg";
import square from "../assets/square.svg";
import styles from "../stylesheets/Rag.module.scss";

const Chatbot = ({ db }) => {
  const TYPING_SPEED = 10;
  const [queryText, setQueryText] = createSignal("");
  const [isTyping, setIsTyping] = createSignal(true);
  const [chatHistory, setChatHistory] = createSignal([]);
  let chatContainerRef;
  let inputRef;

  const initialGreetings = "Hi there! Please ask me any questions about the uploaded content and I will try my best to help you out. 😊";
  
  const simulateTypingEffect = (reply, isInitialGreeting = false) => {
    let index = 0;
    let currentText = "";

    const typeCharacter = () => {
      if (index < reply.length) {
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
      }
    };

    if (!isInitialGreeting) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "bot", markdown: "" },
      ]);
    }
    
    setIsTyping(true);
    setTimeout(() => {
      typeCharacter();
      scrollToBottom();
    }, TYPING_SPEED);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  onMount(() => {
    simulateTypingEffect(initialGreetings, true);
  });

  onMount(() => {
    scrollToBottom();
  }, [chatHistory()]);

  const handleClick = async (queryText) => {
    if (!queryText.trim() || isTyping()) return;

    let newChatHistory = [
      ...chatHistory(),
      { type: "user", markdown: queryText },
    ];
    setChatHistory(newChatHistory);
    scrollToBottom();
    setQueryText("");

    try {
      const formattedChatHistory = newChatHistory
        .slice(1)
        .map((msg) =>
          msg.type === "user"
            ? new HumanMessage(msg.markdown)
            : new AIMessage(msg.markdown)
        );

      const response = await performRAG(queryText, formattedChatHistory, db);
      let finalResponse =
        response === "Unknown"
          ? "I'm sorry, I don't know the answer to that question."
          : response;

      simulateTypingEffect(finalResponse);
    } catch (error) {
      simulateTypingEffect(
        "I'm sorry, I encountered an error while processing your request."
      );
    }
  };

  onMount(() => {
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
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={styles.motionUserText}
              >
                <TextBubble markdown={textitem.markdown} type="user" />
              </Motion.div>
            ) : index === chatHistory().length - 1 ? (
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={styles.motionBotText}
              >
                <TextBubble markdown={textitem.markdown} type="bot" />
              </Motion.div>
            ) : (
              <div className={styles.motionBotText}>
                <TextBubble markdown={textitem.markdown} type="bot" />
              </div>
            )
            // <div key={index} 
            //   className={textitem.type === "user" ? styles.userText : styles.botText}>
            //   <TextBubble markdown={textitem.markdown} type={textitem.type} />
            // </div>
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
              onInput={(e) => {
                setQueryText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick(queryText());
                }
              }}
            />
            <button type="button" onClick={handleClick} className={styles.submitButton}>
              <img
                src={arrow}
                alt="arrow"
                className={styles.arrowIcon}
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