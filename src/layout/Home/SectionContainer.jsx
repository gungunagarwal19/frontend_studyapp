import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import { addSection, getSections, deleteSection } from '../../../store/Section/SectionAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import { CheckIcon } from '../../components/Icons';
import './SectionContainer.css';
import { toast } from 'react-toastify';

const SectionContainer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        loading,
        isAuthenticated,
        user
    } = useSelector(state => state.user);

    const sections = useSelector((state) => state.section.sections);
    const sectionLoading = useSelector((state) => state.section.loading);

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
        if (!isAuthenticated) {
            toast.info("Please login to create study sections");
            navigate("/login");
            return;
        }
        setIsModalOpen(true);
    };

    const handleCreateCard = () => {
        if (!isAuthenticated || !user || !user._id) {
            toast.error("Please login first");
            return;
        }
        if (newCardTitle.trim()) {
            dispatch(addSection({
                title: newCardTitle.trim(),
                description: newCardDescription.trim()
            }));
            setNewCardTitle('');
            setNewCardDescription('');
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
        <div className="section-container-root">
            {/* Hero & Header Section */}
            <div className="dashboard-hero">
                <div className="hero-badge">
                    <span className="hero-badge-dot"></span>
                    <span>Smart Study Workspace</span>
                </div>

                <h1 className="hero-title">
                    {isAuthenticated && user?.name
                        ? `Welcome back, ${user.name.split(' ')[0]}`
                        : "Empower Your Learning"}
                </h1>

                <p className="hero-description">
                    Organize your course materials, review interactive 3D flashcards, and get instant explanations with AI.
                </p>

                {/* Search & Actions Bar */}
                <div className="dashboard-toolbar">
                    <div className="search-bar-wrapper">
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            className="dashboard-search-input"
                            placeholder="Search study sections..."
                            value={searchQuery}
                            onChange={handleSearch}
                            aria-label="Search sections"
                        />
                        {searchQuery && (
                            <button
                                className="clear-search-btn"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search query"
                            >
                                &times;
                            </button>
                        )}
                    </div>

                    <div className="toolbar-actions-group">
                        {/* Filter Dropdown */}
                        <div
                            className="filter-dropdown-trigger"
                            onClick={handleShowSections}
                            tabIndex={0}
                            role="button"
                            aria-haspopup="listbox"
                            aria-expanded={isDropdownOpen}
                        >
                            <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            <span className="filter-selected-label">{selectedSection}</span>
                            <svg className={`filter-arrow ${isDropdownOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m6 9 6 6 6-6" />
                            </svg>

                            {isDropdownOpen && (
                                <div className="dropdown-menu-list" role="listbox">
                                    <div
                                        className={`dropdown-menu-item ${selectedSection === 'All Sections' ? 'active' : ''}`}
                                        onClick={() => handleSelectSection('All Sections')}
                                        role="option"
                                        aria-selected={selectedSection === 'All Sections'}
                                    >
                                        <span>All Sections</span>
                                        {selectedSection === 'All Sections' && <CheckIcon size={14} className="checkmark" />}
                                    </div>
                                    {sections && sections.map(section => (
                                        <div
                                            className={`dropdown-menu-item ${selectedSection === section.title ? 'active' : ''}`}
                                            key={section._id || section.id}
                                            onClick={() => handleSelectSection(section.title)}
                                            role="option"
                                            aria-selected={selectedSection === section.title}
                                        >
                                            <span>{section.title}</span>
                                            {selectedSection === section.title && <CheckIcon size={14} className="checkmark" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* New Section Button */}
                        <button
                            className="btn btn-primary create-section-btn"
                            onClick={handleAddCard}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            <span>New Section</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sections Grid or States */}
            {(loading || sectionLoading) && <Loading />}

            {!loading && !sectionLoading && filteredSections?.length === 0 && (
                <div className="empty-sections-state">
                    <div className="empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                            <path d="M9 10h6" />
                            <path d="M9 14h4" />
                        </svg>
                    </div>
                    <h3 className="empty-state-title">
                        {searchQuery ? "No matching sections found" : "No study sections yet"}
                    </h3>
                    <p className="empty-state-desc">
                        {searchQuery
                            ? "Try checking your spelling or clearing the search filter."
                            : "Create your first study section to upload documents, review flashcards, and chat with AI."}
                    </p>
                    {searchQuery ? (
                        <button className="btn btn-secondary" onClick={() => setSearchQuery('')}>
                            Clear Search
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleAddCard}>
                            + Create First Section
                        </button>
                    )}
                </div>
            )}

            {!loading && !sectionLoading && filteredSections && filteredSections.length > 0 && (
                <div className="sections-grid">
                    {filteredSections.map(section => (
                        <Section
                            key={section._id || section.id}
                            title={section.title}
                            description={section.description}
                            onClick={() => handleCardClick(section._id || section.id)}
                            onDelete={() => handleDeleteCard(section._id || section.id)}
                        />
                    ))}
                </div>
            )}

            {/* Create New Section Modal */}
            {isModalOpen && (
                <div className="modal-backdrop" onClick={handleCancel}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="modal-header">
                            <div className="modal-header-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14" />
                                    <path d="M5 12h14" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="modal-title">Create New Study Section</h2>
                                <p className="modal-subtitle">Add a collection for your course notes and flashcards.</p>
                            </div>
                        </div>

                        <form onSubmit={e => { e.preventDefault(); handleCreateCard(); }}>
                            <div className="modal-form-body">
                                <div className="modal-form-group">
                                    <label htmlFor="section-title-input" className="modal-label">
                                        Section Title <span className="required-star">*</span>
                                    </label>
                                    <input
                                        id="section-title-input"
                                        type="text"
                                        className="modal-input-field"
                                        placeholder="e.g. Operating Systems, Data Structures, Physics 101"
                                        value={newCardTitle}
                                        onChange={(e) => setNewCardTitle(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div className="modal-form-group">
                                    <label htmlFor="section-desc-input" className="modal-label">
                                        Description <span className="optional-tag">(optional)</span>
                                    </label>
                                    <textarea
                                        id="section-desc-input"
                                        className="modal-textarea-field"
                                        placeholder="Brief summary of what this study section covers..."
                                        value={newCardDescription}
                                        onChange={(e) => setNewCardDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions-row">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || !newCardTitle.trim()}
                                >
                                    {loading ? 'Creating...' : 'Create Section'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionContainer;