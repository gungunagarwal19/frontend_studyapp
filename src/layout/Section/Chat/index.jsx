import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chat } from "../../../../store/Chat/ChatAction";
import { addMessage, clearMessages } from "../../../../store/Chat/ChatReducer";
import { useParams, Link } from "react-router-dom";
import { getSections } from "../../../../store/Section/SectionAction";
import {
  LightbulbIcon,
  ListChecksIcon,
  HelpCircleIcon,
  MessageSquareIcon,
  RotateCcwIcon,
  CheckIcon,
} from "../../../components/Icons";
import MarkdownRenderer from "./MarkdownRenderer";
import "./Chat.css";

const ChatComponent = () => {
    const dispatch = useDispatch();
    const { chatMessages, loading, error, message } = useSelector(state => state.chat);
    const sections = useSelector(state => state.section.sections);
    const inputRef = useRef(null);
    const chatEndRef = useRef(null);
    const { sectionId } = useParams();
    const [input, setInput] = useState("");
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        if (!sections || sections.length === 0) {
            dispatch(getSections());
        }
    }, [dispatch, sections]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages, loading]);

    useEffect(() => {
        if (input === "" && inputRef.current && !loading) {
            inputRef.current.focus();
        }
    }, [input, loading]);

    useEffect(() => {
        dispatch(clearMessages());
    }, [sectionId, dispatch]);

    const section = sections && sections.find(s => (s._id || s.id) === sectionId);
    const sectionTitle = section ? section.title : "Study Section";

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        const queryText = input.trim();
        dispatch(addMessage({ type: "user", text: queryText }));
        dispatch(Chat({ question: queryText, sectionId }));
        setInput("");
    };

    const handlePromptClick = (sampleQuery) => {
        dispatch(addMessage({ type: "user", text: sampleQuery }));
        dispatch(Chat({ question: sampleQuery, sectionId }));
    };

    const handleCopyResponse = async (text, idx) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(idx);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy response:", err);
        }
    };

    const handleRegenerate = (questionText) => {
        if (!questionText || loading) return;
        dispatch(Chat({ question: questionText, sectionId }));
    };

    return (
        <div className="chat-layout-root">
            {/* Header Navigation */}
            <div className="chat-nav-header">
                <Link to={`/section/${sectionId}`} className="workspace-back-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back to {sectionTitle}</span>
                </Link>
            </div>

            {/* Main Chat Box */}
            <div className="chat-card-panel">
                {/* Chat Panel Header */}
                <div className="chat-panel-top">
                    <div className="chat-bot-avatar">
                        <MessageSquareIcon size={20} />
                    </div>
                    <div className="chat-top-info">
                        <h2 className="chat-top-title">AI Study Assistant</h2>
                        <span className="chat-top-subtitle">Trained on {sectionTitle} study materials</span>
                    </div>
                    <div className="chat-online-indicator">
                        <span className="online-dot"></span>
                        <span>Active</span>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="chat-messages-stream">
                    {chatMessages.length === 0 && (
                        <div className="chat-starter-container">
                            <div className="starter-icon-bubble">
                                <MessageSquareIcon size={32} />
                            </div>
                            <h3 className="starter-title">How can I help you study today?</h3>
                            <p className="starter-desc">
                                Ask questions about your notes, request summaries, or quiz yourself on key concepts.
                            </p>

                            <div className="starter-prompts-grid">
                                <button
                                    type="button"
                                    className="prompt-chip"
                                    onClick={() => handlePromptClick("Summarize the key concepts in this section.")}
                                >
                                    <div className="prompt-chip-icon icon-bulb">
                                        <LightbulbIcon size={16} />
                                    </div>
                                    <span className="prompt-chip-text">Summarize key concepts</span>
                                </button>
                                <button
                                    type="button"
                                    className="prompt-chip"
                                    onClick={() => handlePromptClick("Give me 3 practice quiz questions on this topic.")}
                                >
                                    <div className="prompt-chip-icon icon-quiz">
                                        <ListChecksIcon size={16} />
                                    </div>
                                    <span className="prompt-chip-text">Generate practice quiz questions</span>
                                </button>
                                <button
                                    type="button"
                                    className="prompt-chip"
                                    onClick={() => handlePromptClick("Explain the most difficult concept in simple terms.")}
                                >
                                    <div className="prompt-chip-icon icon-explain">
                                        <HelpCircleIcon size={16} />
                                    </div>
                                    <span className="prompt-chip-text">Explain difficult concept simply</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {chatMessages.map((msg, idx) => {
                        const isUser = msg.type === "user";

                        // Find the corresponding user question for this bot response
                        let userPromptForThis = null;
                        if (!isUser) {
                            for (let i = idx - 1; i >= 0; i--) {
                                if (chatMessages[i].type === "user") {
                                    userPromptForThis = chatMessages[i].text;
                                    break;
                                }
                            }
                        }

                        return (
                            <div
                                key={idx}
                                className={`chat-message-row ${isUser ? "row-user" : "row-bot"}`}
                            >
                                {!isUser && (
                                    <div className="message-avatar bot-avatar">
                                        <MessageSquareIcon size={16} />
                                    </div>
                                )}

                                <div className={`chat-bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
                                    {isUser ? (
                                        <div className="bubble-text">{msg.text}</div>
                                    ) : (
                                        <>
                                            <MarkdownRenderer content={msg.text} />
                                            <div className="bot-message-actions">
                                                <button
                                                    type="button"
                                                    className="msg-action-btn"
                                                    onClick={() => handleCopyResponse(msg.text, idx)}
                                                    title="Copy response"
                                                >
                                                    {copiedIndex === idx ? (
                                                        <>
                                                            <CheckIcon size={13} />
                                                            <span className="action-text-active">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                            </svg>
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                                {userPromptForThis && (
                                                    <button
                                                        type="button"
                                                        className="msg-action-btn"
                                                        onClick={() => handleRegenerate(userPromptForThis)}
                                                        disabled={loading}
                                                        title="Regenerate response"
                                                    >
                                                        <RotateCcwIcon size={13} />
                                                        <span>Regenerate</span>
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="chat-message-row row-bot">
                            <div className="message-avatar bot-avatar">
                                <MessageSquareIcon size={16} />
                            </div>
                            <div className="chat-bubble bot-bubble loading-bubble">
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="loading-label">Generating answer...</span>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="chat-error-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span>{message || "An error occurred while generating a response."}</span>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Input Toolbar */}
                <form className="chat-input-toolbar" onSubmit={handleSend}>
                    <input
                        className="chat-text-input"
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask a question about this study section..."
                        disabled={loading}
                        ref={inputRef}
                        aria-label="Ask a question"
                    />
                    <button
                        className="btn btn-primary chat-send-action-btn"
                        type="submit"
                        disabled={loading || !input.trim()}
                        aria-label="Send question"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;
