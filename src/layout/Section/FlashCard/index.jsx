import React, { useState, useEffect } from 'react';
import './FlashCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchReviewCards, swipeFlashCard } from '../../../../store/FlashCard/FlashCardAction';
import { getSections } from '../../../../store/Section/SectionAction';
import Loading from '../../../components/Loading';

const FlashCard = () => {
    const dispatch = useDispatch();
    const { sectionId } = useParams();
    const { reviewCards = [], loading, error } = useSelector(state => state.flashcard || {});
    const currentCard = reviewCards.length > 0 ? reviewCards[0] : null;
    const [isFlipped, setIsFlipped] = useState(false);
    const [slideDirection, setSlideDirection] = useState('current');
    const sections = useSelector(state => state.section.sections);
    const navigate = useNavigate();

    useEffect(() => {
      if (sectionId) {
        dispatch(fetchReviewCards({ sectionId }));
      }
    }, [dispatch, sectionId]);

    useEffect(() => {
      if (!sections || sections.length === 0) {
        dispatch(getSections());
      }
    }, [dispatch, sections]);

    const section = sections && sections.find(s => (s._id || s.id) === sectionId);
    const sectionTitle = section ? section.title : 'Section';

    const changeCard = (direction, swipeDirection) => {
      if (loading || !currentCard) return;
      setSlideDirection(direction);
      setTimeout(() => {
        dispatch(swipeFlashCard({
          currentCardId: currentCard._id,
          swipe: swipeDirection,
          sectionId: currentCard.sectionId,
        }));
        setIsFlipped(false);
        setSlideDirection('current');
      }, 500); 
    };

    useEffect(() => {
      const handleKeyPress = (event) => {
        if (event.code === 'Space') {
          event.preventDefault();
        }
        switch (event.code) {
          case 'Space':
            setIsFlipped(prev => !prev);
            break;
          case 'ArrowRight':
            if (slideDirection === 'current' && currentCard) {
              changeCard('exit-right', 'right');
            }
            break;
          case 'ArrowLeft':
            if (slideDirection === 'current' && currentCard) {
              changeCard('exit-left', 'left');
            }
            break;
          case 'ArrowUp':
            if (slideDirection === 'current' && currentCard) {
              changeCard('exit-up', 'up');
            }
            break;
          case 'ArrowDown':
            if (slideDirection === 'current' && currentCard) {
              changeCard('exit-down', 'down');
            }
            break;
          default:
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, [slideDirection, currentCard, loading]);

    return (
      <div className="flashcard-workspace-root">
        {/* Navigation Back Link */}
        <div className="flashcard-nav-header">
          <Link to={`/section/${sectionId}`} className="workspace-back-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to {sectionTitle}</span>
          </Link>
        </div>

        <div className="flashcard-hero-header">
          <div className="workspace-badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <span className="badge-dot" style={{ backgroundColor: '#6366f1', boxShadow: '0 0 8px #6366f1' }}></span>
            <span>Spaced Repetition</span>
          </div>
          <h1 className="flashcard-page-title">Interactive Flashcards</h1>
          <p className="flashcard-page-desc">
            Flip cards to review concepts and rate your recall using keyboard shortcuts.
          </p>
        </div>

        {/* Flashcard Area */}
        <div className="flashcard-stage-container">
          {loading && <Loading />}

          {error && (
            <div className="alert-error-box" style={{ maxWidth: 440, margin: '2rem auto' }}>
              <span>{error}</span>
            </div>
          )}

          {!loading && !currentCard ? (
            <div className="flashcard-complete-card">
              <div className="complete-icon-bubble">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="complete-title">Session Complete! 🎉</h2>
              <p className="complete-desc">
                Great job! You have reviewed all available flashcards in this study section.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/section/${sectionId}`)}
              >
                Back to Section Workspace
              </button>
            </div>
          ) : !loading && currentCard && (
            <div className="flashcard-interactive-wrapper">
              {/* 3D Flip Card */}
              <div 
                className={`modern-flashcard ${slideDirection} ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
                role="button"
                tabIndex={0}
                aria-label="Flashcard. Click or press space to flip."
              >
                {/* Front Side (Question) */}
                <div className="flashcard-face flashcard-front">
                  <div className="face-tag-row">
                    <span className="face-pill face-pill-question">QUESTION</span>
                    <span className="face-flip-hint">Click or press SPACE to flip ⟳</span>
                  </div>
                  <div className="face-text-content">
                    <p>{currentCard?.question}</p>
                  </div>
                </div>

                {/* Back Side (Answer) */}
                <div className="flashcard-face flashcard-back">
                  <div className="face-tag-row">
                    <span className="face-pill face-pill-answer">ANSWER</span>
                    <span className="face-flip-hint">Click or press SPACE to flip ⟳</span>
                  </div>
                  <div className="face-text-content">
                    <p>{currentCard?.answer}</p>
                  </div>
                </div>
              </div>

              {/* On-screen quick rating buttons */}
              <div className="card-rating-actions">
                <button 
                  type="button" 
                  className="rating-action-btn btn-forgot"
                  onClick={() => changeCard('exit-right', 'right')}
                  title="Press Right Arrow"
                >
                  <span className="key-kbd">→</span>
                  <span>Didn’t Remember</span>
                </button>

                <button 
                  type="button" 
                  className="rating-action-btn btn-hard"
                  onClick={() => changeCard('exit-left', 'left')}
                  title="Press Left Arrow"
                >
                  <span className="key-kbd">←</span>
                  <span>Difficult</span>
                </button>

                <button 
                  type="button" 
                  className="rating-action-btn btn-good"
                  onClick={() => changeCard('exit-up', 'up')}
                  title="Press Up Arrow"
                >
                  <span className="key-kbd">↑</span>
                  <span>Almost Got It</span>
                </button>

                <button 
                  type="button" 
                  className="rating-action-btn btn-perfect"
                  onClick={() => changeCard('exit-down', 'down')}
                  title="Press Down Arrow"
                >
                  <span className="key-kbd">↓</span>
                  <span>Perfect Recall</span>
                </button>
              </div>

              {/* Keyboard Instructions Bar */}
              <div className="keyboard-instructions-legend">
                <span className="legend-title">Keyboard Shortcuts:</span>
                <div className="legend-keys-list">
                  <span className="legend-item"><kbd className="key-badge">SPACE</kbd> Flip card</span>
                  <span className="legend-item"><kbd className="key-badge">→</kbd> Didn’t remember</span>
                  <span className="legend-item"><kbd className="key-badge">←</kbd> Difficult</span>
                  <span className="legend-item"><kbd className="key-badge">↑</kbd> Almost</span>
                  <span className="legend-item"><kbd className="key-badge">↓</kbd> Perfect</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );    
};

export default FlashCard;