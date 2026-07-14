import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dashboard.css';

const DashboardCards = () => {
    const { sectionId } = useParams();
    const navigate = useNavigate();

    const handleUpload = async () => {
        navigate(`/section/${sectionId}/upload`)
    }

    const handleChat = async () => {
        navigate(`/section/${sectionId}/chat`)
    }

    const handleFlashCards = async () => {
        navigate(`/section/${sectionId}/flashcard`)
    }

    const handleBack = () => {
        navigate(`/`);
    };

    return (
        <div>
        <div className="dashboard-back-link" onClick={handleBack} style={{cursor: 'pointer'}}>&larr; Back to Home Page</div>
        <div className="dashboard-center-wrapper">
        <div className="dashboard-grid">
        {/* View Flashcards */}
        <div className="dashboard-card card-blue" onClick={handleFlashCards}>
            <div className="dashboard-card-icon">
            <span role="img" aria-label="flashcards" style={{fontSize: '2.5rem'}}>📑</span>
            </div>
            <div className="dashboard-card-title">View Flashcards</div>
            <div className="dashboard-card-subtitle">Browse and study your flashcards</div>
            <div className="dashboard-card-pill">Ready to study!</div>
        </div>
        {/* Ask Questions */}
        <div className="dashboard-card card-purple" onClick={handleChat}>
            <div className="dashboard-card-icon">
            <span role="img" aria-label="question" style={{fontSize: '2.5rem'}}>❓</span>
            </div>
            <div className="dashboard-card-title">Ask Questions</div>
            <div className="dashboard-card-subtitle">Get AI help with difficult concepts</div>
            <div className="dashboard-card-pill">AI Assistant</div>
        </div>
        </div>
        <div className="dashboard-upload-row">
            <div className="dashboard-card card-green center-card" onClick={handleUpload}>
                <div className="dashboard-card-icon">
                <span role="img" aria-label="upload" style={{fontSize: '2.5rem'}}>⤴️</span>
                </div>
                <div className="dashboard-card-title">Upload Material</div>
                <div className="dashboard-card-subtitle">Add new study content and documents</div>
                <div className="dashboard-card-pill">PDF Documents</div>
            </div>
        </div>
        </div>
        </div>
    );
    };

export default DashboardCards;
