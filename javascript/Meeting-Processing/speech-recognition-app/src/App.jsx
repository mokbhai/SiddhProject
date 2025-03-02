// import { useState } from 'react'
import styles from "./app.module.css";
import { useState } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { BiSolidCopyAlt } from "react-icons/bi";
import { BsFillMicFill } from "react-icons/bs";
import { BsFillMicMuteFill } from "react-icons/bs";
import { SiConvertio } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import { MdEmail } from "react-icons/md";

const App = () => {
  const [copyTxt, setCopyTxt] = useState();
  const [isCopied, setCopied] = useClipboard(copyTxt);
  const [summary, setSummary] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableSummary, setEditableSummary] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Separate loading states
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const startListening = () => {
    setTranscriptText("");
    SpeechRecognition.startListening({ continuous: true, language: "en-In" });
  };
  const stopListening = () => SpeechRecognition.stopListening();

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition({
      transcribing: !transcriptText,
    });

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  const handleTranscriptChange = (e) => {
    resetTranscript();
    setTranscriptText(e.target.value);
  };

  const displayText = transcriptText || transcript;

  const handleSummary = async () => {
    try {
      setIsSummarizing(true);
      const response = await fetch("http://localhost:3000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: displayText }),
      });
      const data = await response.json();
      setSummary(data.summary);
      setEditableSummary(data.summary);
    } catch (error) {
      console.error("Error getting summary:", error);
      setSummary("Failed to generate summary. Please try again.");
      setEditableSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSummaryEdit = () => {
    setIsEditing(true);
  };

  const handleSummaryChange = (e) => {
    setEditableSummary(e.target.value);
  };

  const handleSummarySave = () => {
    setSummary(editableSummary);
    setIsEditing(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      const response = await fetch("http://localhost:3000/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          summary,
        }),
      });
      const data = await response.json();
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSendingEmail(false);
      setEmail("");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>
          Speech to Text Converter <SiConvertio className={styles.headIcon} />
        </h1>
        <p>
          Note: You can either speak or type your text. Click on the text area
          to edit.
        </p>
        {(isSummarizing || !summary) && (
          <textarea
            className={styles.mainContent}
            value={displayText}
            onChange={handleTranscriptChange}
            placeholder="Start speaking or type here..."
            onClick={() => setCopyTxt(displayText)}
          />
        )}
        {/* Summary Section */}
        {(isSummarizing || summary) && (
          <div className={styles.summarySection}>
            <h2>Summary</h2>
            <div className={styles.summaryContainer}>
              {isSummarizing ? (
                <div className={styles.loadingState}>Generating summary...</div>
              ) : isEditing ? (
                <>
                  <textarea
                    className={styles.summaryEdit}
                    value={editableSummary}
                    onChange={handleSummaryChange}
                  />
                  <button
                    className={styles.editButton}
                    onClick={handleSummarySave}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.summaryContent}>
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  </div>
                  <button
                    className={styles.editButton}
                    onClick={handleSummaryEdit}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className={styles.btn}>
          {!summary ? (
            <>
              <button onClick={startListening}>
                <BsFillMicFill />
                Start
              </button>
              <button onClick={stopListening}>
                <BsFillMicMuteFill />
                Stop
              </button>
              <button onClick={setCopied}>
                <BiSolidCopyAlt />
                {isCopied ? " Copied" : " Copy to clipboard"}
              </button>
              <button
                onClick={handleSummary}
                disabled={!displayText || isSummarizing}
              >
                {isSummarizing ? "Summarizing..." : "Summarize"}
              </button>
            </>
          ) : (
            <div className={styles.emailSection}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className={styles.emailInput}
                disabled={isSendingEmail}
              />
              <button
                onClick={handleSendEmail}
                disabled={!email || isSendingEmail}
                className={styles.emailButton}
              >
                <MdEmail />
                {isSendingEmail
                  ? "Sending..."
                  : emailSent
                  ? "Sent!"
                  : "Send via Email"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
