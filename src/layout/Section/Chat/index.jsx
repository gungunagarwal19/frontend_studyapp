import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chat } from "../../../../store/Chat/ChatAction";
import { addMessage, clearError, clearSuccess, clearMessages } from "../../../../store/Chat/ChatReducer";
import { useParams, useNavigate } from "react-router-dom";
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

    const section = sections && sections.find(s => s._id === sectionId);
    const sectionTitle = section ? section.title : 'Section';

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        dispatch(addMessage({ type: "user", text: input }));
        dispatch(Chat({ question: input, sectionId }));
        setInput("");
    };

    return (
        <div className="chat-page-grid">
            <div className="chat-back-link" onClick={() => navigate(`/section/${sectionId}`)}>&larr; Back to {sectionTitle}</div>
            <div className="chat-container">
                <div className="chat-header">
                    <span className="chat-title-center">
                        <span style={{ fontSize: 24, marginRight: 8 }}>💬</span>
                        Ask Questions
                    </span>
                </div>
                {/* Chat area */}
                <div className="chat-area">
                    {chatMessages.length === 0 && <div className="chat-empty">No messages yet. Start the conversation!</div>}
                    {chatMessages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`chat-message-row ${msg.type === "user" ? "user" : "bot"}`}
                        >
                            <div className="chat-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && <div className="chat-loading">Thinking...</div>}
                    {error && <div className="chat-error">{message || "Error occurred."}</div>}
                    <div ref={chatEndRef} />
                </div>
                {/* Input area */}
                <form className="chat-input-area" onSubmit={handleSend}>
                    <input
                        className="chat-input"
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your question..."
                        disabled={loading}
                        ref={inputRef}
                    />
                    <button
                        className="chat-send-btn"
                        type="submit"
                        disabled={loading || !input.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;
