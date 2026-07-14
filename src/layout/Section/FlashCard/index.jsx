import React, { useState, useEffect } from 'react';
import './FlashCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReviewCards, swipeFlashCard } from '../../../../store/FlashCard/FlashCardAction';
import { getSections } from '../../../../store/Section/SectionAction';

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

    const section = sections && sections.find(s => s._id === sectionId);
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
      }, 600); 
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

    useEffect(() => {
      if (reviewCards && reviewCards.length > 0) {
        console.log('[FlashCard] reviewCards IDs:', reviewCards.map(card => card._id));
      } else {
        console.log('[FlashCard] reviewCards is empty');
      }
    }, [reviewCards]);

    return (
      <div className="flashcard-viewport">
        <div
          className="flashcard-back-link"
          onClick={() => navigate(`/section/${sectionId}`)}
          style={{ cursor: 'pointer', color: '#22223b', fontSize: '1.05rem', marginBottom: 32, marginTop: 48, display: 'inline-block', fontWeight: 500 }}
        >
          &larr; Back to {sectionTitle}
        </div>
        <div className="flashcard-container">
          {loading && <p>Loading cards...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {(!loading && !currentCard) ? (
            <p>Session Complete! No flashcards available for review.</p>
          ) : (
            <div 
              className={`flashcard ${slideDirection} ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="card-front">
                <p>{currentCard?.question}</p>
              </div>
              <div className="card-back">
                <p>{currentCard?.answer}</p>
              </div>
            </div>
          )}
          <p className="instructions">
            Press <b>SPACE</b> to flip the card.<br/>
            Use the arrow keys to show how well you remembered:
            <br/>
            <span style={{display: 'inline-block', marginTop: '0.5em'}}>
              <b>→</b> Didn’t remember &nbsp;|&nbsp; 
              <b>←</b> Difficult &nbsp;|&nbsp; 
              <b>↑</b> Almost got it &nbsp;|&nbsp; 
              <b>↓</b> Perfect recall
            </span>
          </p>
        </div>
      </div>
    );    
};

export default FlashCard;