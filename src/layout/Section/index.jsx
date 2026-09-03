import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Dashboard.css';

const DashboardCards = () => {
    const { sectionId } = useParams();
    const navigate = useNavigate();
    const sections = useSelector(state => state.section.sections);

    const currentSection = sections?.find(s => (s._id || s.id) === sectionId);
    const sectionTitle = currentSection?.title || "Study Workspace";
    const sectionDescription = currentSection?.description || "Select a tool below to review flashcards, ask questions, or upload study notes.";

    const handleUpload = () => {
        navigate(`/section/${sectionId}/upload`);
    };

    const handleChat = () => {
        navigate(`/section/${sectionId}/chat`);
    };

    const handleFlashCards = () => {
        navigate(`/section/${sectionId}/flashcard`);
    };

    return (
        <div className="section-workspace-root">
            {/* Breadcrumb / Back Link */}
            <div className="workspace-header-nav">
                <Link to="/" className="workspace-back-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back to Sections</span>
                </Link>
            </div>

            {/* Workspace Title & Info */}
            <div className="workspace-hero">
                <div className="workspace-badge">
                    <span className="badge-dot"></span>
                    <span>Active Section</span>
                </div>
                <h1 className="workspace-title">{sectionTitle}</h1>
                <p className="workspace-description">{sectionDescription}</p>
            </div>

            {/* Feature Cards Grid */}
            <div className="workspace-cards-grid">
                {/* 1. Flashcards Card */}
                <div 
                    className="workspace-feature-card feature-flashcards"
                    onClick={handleFlashCards}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleFlashCards(); }}
                >
                    <div className="feature-card-badge">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                    </div>
                    <div className="feature-pill pill-indigo">Spaced Repetition</div>
                    <h2 className="feature-title">Review Flashcards</h2>
                    <p className="feature-desc">
                        Strengthen your retention with 3D flip study cards and spaced repetition algorithms.
                    </p>
                    <div className="feature-action-link">
                        <span>Start Review</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>

                {/* 2. AI Chat Card */}
                <div 
                    className="workspace-feature-card feature-chat"
                    onClick={handleChat}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleChat(); }}
                >
                    <div className="feature-card-badge">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <div className="feature-pill pill-purple">AI Study Assistant</div>
                    <h2 className="feature-title">Ask Questions</h2>
                    <p className="feature-desc">
                        Get instant conceptual explanations and step-by-step solutions powered by AI.
                    </p>
                    <div className="feature-action-link">
                        <span>Chat with Assistant</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>

                {/* 3. Upload Material Card */}
                <div 
                    className="workspace-feature-card feature-upload"
                    onClick={handleUpload}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUpload(); }}
                >
                    <div className="feature-card-badge">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                    </div>
                    <div className="feature-pill pill-emerald">PDF Notes & Docs</div>
                    <h2 className="feature-title">Upload Material</h2>
                    <p className="feature-desc">
                        Add new PDF textbooks, slide decks, and lecture notes to this study section.
                    </p>
                    <div className="feature-action-link">
                        <span>Upload Files</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
