import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { addSection, getSections, deleteSection } from '../../../store/Section/SectionAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import './SectionContainer.css';
import { toast } from 'react-toastify';

const SectionContainer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        loading,
        success,
        error,
        message,
        currentSection,
        isAuthenticated,
        user
    } = useSelector(state => state.user);

    const sections = useSelector((state) => state.section.sections)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('All Sections');
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getSections());
        }
    }, [dispatch, isAuthenticated]); 


    const filteredSections = sections?.filter(section => {
        const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSection = selectedSection === 'All Sections' || section.title === selectedSection;
        return matchesSearch && matchesSection;
    });

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddCard = () => {
        setIsModalOpen(true);
    };

    const handleCreateCard = () => {
        if (!isAuthenticated || !user || !user._id) {
            toast.error("Please login first");
            return;
        }
        if (newCardTitle.trim()) {
            dispatch(addSection({
                title: newCardTitle,
                description: newCardDescription
            }));
            setNewCardTitle('');
            setNewCardDescription('')
            setIsModalOpen(false);
        }
    };

    const handleDeleteCard = (cardId) => {
        dispatch(deleteSection(cardId));
    };

    const handleCardClick = (cardId) => {
        navigate(`/section/${cardId}`);
    };

    const handleCancel = () => {
        setNewCardTitle('');
        setNewCardDescription('');
        setIsModalOpen(false);
    };

    const handleShowSections = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleSelectSection = (title) => {
        setSelectedSection(title);
        setIsDropdownOpen(false);
    };

    return (
        <div>
            <div className="section-header">
                <h1>Study Sections</h1>
                <div>
                    Manage your study materials and flashcard collections
                </div>
                <div className="section-header-row">
                    <div className="search-container">
                        <input
                            type="text"
                            className="section-search-input"
                            placeholder="Search sections..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {searchQuery && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        )}
                    </div>
                    <div 
                        className="filter-dropdown" 
                        onClick={handleShowSections} 
                        tabIndex={0}
                        data-open={isDropdownOpen}
                    >
                        <span className="filter-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 14 13.414V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 8 17v-3.586a1 1 0 0 0-.293-.707L1.293 6.707A1 1 0 0 1 1 6V4z"/>
                            </svg>
                        </span>
                        <span>{selectedSection}</span>
                        <span className="dropdown-arrow">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 9l-7 7-7-7"/>
                            </svg>
                        </span>
                        {isDropdownOpen && (
                            <div className="section-dropdown-menu">
                                <div 
                                    className={`section-dropdown-item ${selectedSection === 'All Sections' ? 'active' : ''}`}
                                    onClick={() => handleSelectSection('All Sections')}
                                >
                                    All Sections
                                </div>
                                {sections && sections.map(section => (
                                    <div
                                        className={`section-dropdown-item ${selectedSection === section.title ? 'active' : ''}`}
                                        key={section._id || section.id}
                                        onClick={() => handleSelectSection(section.title)}
                                    >
                                        {section.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        className="new-section-btn"
                        onClick={handleAddCard}
                    >
                        + New Section
                    </button>
                </div>
            </div>

            <div className="card-grid">
                {loading && <Loading/>}
                {!loading && filteredSections?.length === 0 && (
                    <div className="no-results">
                        <p>No sections found matching your search.</p>
                    </div>
                )}
                {filteredSections && filteredSections.map(section => (
                    <Section
                        key={section._id || section.id}
                        title={section.title}
                        description={section.description}
                        onClick={() => handleCardClick(section._id || section.id)}
                        onDelete={() => handleDeleteCard(section._id || section.id)}
                    />
                ))}

                {isModalOpen && (
                    <div className="modal-overlay">
                        <form className="modal-content" onSubmit={e => { e.preventDefault(); handleCreateCard(); }}>
                            <h2 className="modal-title">Create New Card</h2>
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Enter card title"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                autoFocus
                            />
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Enter card description"
                                value={newCardDescription}
                                onChange={(e) => setNewCardDescription(e.target.value)}
                            />
                            <div className="modal-buttons">
                                <button type="button" className="modal-button cancel" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="modal-button create"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SectionContainer; 