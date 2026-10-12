import React, { useState, useEffect } from 'react';
import './FlashCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchReviewCards, swipeFlashCard } from '../../../../store/FlashCard/FlashCardAction';
import { getSections } from '../../../../store/Section/SectionAction';
import Loading from '../../../components/Loading';
import {
  RotateCcwIcon,
  AlertCircleIcon,
  ThumbsUpIcon,
  SparklesIcon,
  HelpCircleIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
  AwardIcon,
  LayersIcon,
} from '../../../components/Icons';

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
          <div className="flashcard-meta-badge">
            <LayersIcon size={14} />
            <span>Spaced Repetition</span>
          </div>
          <h1 className="flashcard-page-title">
            Interactive <span className="title-gradient-accent">Flashcards</span>
          </h1>
          <p className="flashcard-page-desc">
            Test your knowledge through active recall and spaced repetition.
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
                <AwardIcon size={36} />
              </div>
              <h2 className="complete-title">Session Complete</h2>
              <p className="complete-desc">
                You have reviewed all available cards for this study section. New reviews will be scheduled automatically.
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
              {/* Physical Stacked Cards Container */}
              <div className="flashcard-stack-deck">
                {/* Visual Stack Layers (Bottom Deck Cards) */}
                <div className="card-stack-layer stack-layer-2" aria-hidden="true"></div>
                <div className="card-stack-layer stack-layer-1" aria-hidden="true"></div>

                {/* Main Interactive 3D Card */}
                <div 
                  className={`modern-flashcard ${slideDirection} ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => setIsFlipped(!isFlipped)}
                  role="button"
                  tabIndex={0}
                  aria-label="Flashcard. Click or press space to flip."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsFlipped(!isFlipped);
                  }}
                >
                  {/* Front Side (Question) */}
                  <div className="flashcard-face flashcard-front">
                    <div className="face-tag-row">
                      <div className="face-ui-badge badge-question">
                        <HelpCircleIcon size={14} />
                        <span>QUESTION</span>
                      </div>
                      <div className="face-flip-control">
                        <RefreshCwIcon size={13} />
                        <span>Click to flip</span>
                      </div>
                    </div>
                    <div className="face-text-content">
                      <p>{currentCard?.question}</p>
                    </div>
                    <div className="card-bottom-bar">
                      <span className="card-side-indicator">Front</span>
                    </div>
                  </div>

                  {/* Back Side (Answer) */}
                  <div className="flashcard-face flashcard-back">
                    <div className="face-tag-row">
                      <div className="face-ui-badge badge-answer">
                        <CheckCircle2Icon size={14} />
                        <span>ANSWER</span>
                      </div>
                      <div className="face-flip-control">
                        <RefreshCwIcon size={13} />
                        <span>Click to flip</span>
                      </div>
                    </div>
                    <div className="face-text-content">
                      <p>{currentCard?.answer}</p>
                    </div>
                    <div className="card-bottom-bar">
                      <span className="card-side-indicator">Back</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product-Designed Recall Controls */}
              <div className="card-rating-actions" role="group" aria-label="Recall rating actions">
                <button 
                  type="button" 
                  className="rating-action-btn btn-recall-forgot"
                  onClick={() => changeCard('exit-right', 'right')}
                  aria-label="Didn't Remember (Right arrow)"
                >
                  <RotateCcwIcon size={16} />
                  <span className="rating-btn-text">Didn't Remember</span>
                </button>

                <button 
                  type="button" 
                  className="rating-action-btn btn-recall-hard"
                  onClick={() => changeCard('exit-left', 'left')}
                  aria-label="Difficult (Left arrow)"
                >
                  <AlertCircleIcon size={16} />
                  <span className="rating-btn-text">Difficult</span>
                </button>

                <button 
                  type="button" 
                  className="rating-action-btn btn-recall-good"
                  onClick={() => changeCard('exit-up', 'up')}
                  aria-label="Almost Got It (Up arrow)"
                >
                  <ThumbsUpIcon size={16} />
                  <span className="rating-btn-text">Almost Got It</span>
                </button>

                <button 
                  type="button" 
                  className="rating-action-btn btn-recall-perfect"
                  onClick={() => changeCard('exit-down', 'down')}
                  aria-label="Perfect Recall (Down arrow)"
                >
                  <SparklesIcon size={16} />
                  <span className="rating-btn-text">Perfect Recall</span>
                </button>
              </div>

              {/* Keyboard Shortcuts Bar */}
              <div className="keyboard-instructions-legend">
                <span className="legend-title">Shortcuts:</span>
                <div className="legend-keys-list">
                  <span className="legend-item"><kbd className="keycap">SPACE</kbd> Flip card</span>
                  <span className="legend-item"><kbd className="keycap">→</kbd> Didn't remember</span>
                  <span className="legend-item"><kbd className="keycap">←</kbd> Difficult</span>
                  <span className="legend-item"><kbd className="keycap">↑</kbd> Almost</span>
                  <span className="legend-item"><kbd className="keycap">↓</kbd> Perfect</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );    
};

export default FlashCard;