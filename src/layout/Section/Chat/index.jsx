import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chat } from "../../../../store/Chat/ChatAction";
import { addMessage, clearMessages } from "../../../../store/Chat/ChatReducer";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSections } from "../../../../store/Section/SectionAction";
import './Chat.css';

const ChatComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { chatMessages, loading, error, message } = useSelector(state => state.chat);
    const sections = useSelector(state => state.section.sections);
    const inputRef = useRef(null);
    const chatEndRef = useRef(null);
    const { sectionId } = useParams();
    const [input, setInput] = useState("");

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
    const sectionTitle = section ? section.title : 'Study Section';

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
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 8V4H8"/>
                            <rect width="16" height="12" x="4" y="8" rx="2"/>
                            <path d="M2 14h2"/>
                            <path d="M20 14h2"/>
                            <path d="M15 13v2"/>
                            <path d="M9 13v2"/>
                        </svg>
                    </div>
                    <div className="chat-top-info">
                        <h2 className="chat-top-title">AI Study Assistant</h2>
                        <span className="chat-top-subtitle">Trained on {sectionTitle} materials</span>
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
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
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
                                    💡 Summarize key concepts
                                </button>
                                <button
                                    type="button"
                                    className="prompt-chip"
                                    onClick={() => handlePromptClick("Give me 3 practice quiz questions on this topic.")}
                                >
                                    📝 Generate practice quiz questions
                                </button>
                                <button
                                    type="button"
                                    className="prompt-chip"
                                    onClick={() => handlePromptClick("Explain the most difficult concept in simple terms.")}
                                >
                                    🎯 Explain difficult concept simply
                                </button>
                            </div>
                        </div>
                    )}

                    {chatMessages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`chat-message-row ${msg.type === "user" ? "row-user" : "row-bot"}`}
                        >
                            {msg.type !== "user" && (
                                <div className="message-avatar bot-avatar">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect width="16" height="12" x="4" y="8" rx="2"/>
                                        <path d="M12 8V4H8"/>
                                        <circle cx="9" cy="13" r="1"/>
                                        <circle cx="15" cy="13" r="1"/>
                                    </svg>
                                </div>
                            )}

                            <div className={`chat-bubble ${msg.type === "user" ? "user-bubble" : "bot-bubble"}`}>
                                <div className="bubble-text">{msg.text}</div>
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="chat-message-row row-bot">
                            <div className="message-avatar bot-avatar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                                    <path d="M12 8V4H8"/>
                                </svg>
                            </div>
                            <div className="chat-bubble bot-bubble loading-bubble">
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
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
