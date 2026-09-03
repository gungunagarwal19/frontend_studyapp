import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSections } from '../../../../store/Section/SectionAction';
import { uploadFile } from '../../../../store/Upload/UploadAction';
import { clearError, clearSuccess } from '../../../../store/Upload/UploadReducer';
import { toast } from 'react-toastify';
import './Upload.css';
import DoesNotExist from '../../../components/DoesNotExist';

const UploadMaterial = () => {
    const { sectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sections = useSelector(state => state.section.sections);
    const uploadState = useSelector(state => state.upload);

    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!sections || sections.length === 0) {
            dispatch(getSections());
        }
    }, [dispatch, sections]);

    useEffect(() => {
        if (uploadState.success) {
            toast.success(uploadState.message || 'File uploaded successfully!', {
                position: 'top-right',
                bodyStyle: { fontSize: '16px' }
            });
            dispatch(clearSuccess());
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
        if (uploadState.error) {
            toast.error(uploadState.message || 'Error uploading file!', {
                position: 'top-right',
                bodyStyle: { fontSize: '16px' }
            });
            dispatch(clearError());
        }
    }, [uploadState.success, uploadState.error, uploadState.message, dispatch]);

    useEffect(() => {
        const section = sections?.find(s => (s._id || s.id) === sectionId);
        setFiles(section ? section.files || [] : []);
    }, [sections, sectionId]);

    const section = sections?.find(s => (s._id || s.id) === sectionId);
    if (!section && sections && sections.length > 0) {
        return <DoesNotExist message="Study section not found." />;
    }

    const sectionTitle = section?.title || 'Section';

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleBoxClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        fileInputRef.current?.click();
    };

    const handleUploadFiles = async () => {
        if (!file) return;
        const result = await dispatch(uploadFile({ file, sectionId }));
        if (result?.payload?.files) {
            setFiles(result.payload.files);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="upload-page-container">
            {/* Header Navigation */}
            <div className="upload-header-nav">
                <Link to={`/section/${sectionId}`} className="workspace-back-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back to {sectionTitle}</span>
                </Link>
            </div>

            <div className="upload-hero">
                <div className="workspace-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    <span className="badge-dot" style={{ backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                    <span>Document Upload</span>
                </div>
                <h1 className="upload-hero-title">Upload Study Material</h1>
                <p className="upload-hero-desc">
                    Attach PDF lecture notes, textbooks, and syllabus files to {sectionTitle}.
                </p>
            </div>

            {/* Upload Box Card */}
            <div className="upload-card">
                <div
                    className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                    onClick={handleBoxClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleBoxClick(); }}
                >
                    <div className="dropzone-icon-bubble">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                    </div>
                    <h3 className="dropzone-title">Drag & drop your PDF file here</h3>
                    <p className="dropzone-hint">Supports PDF documents up to 50MB</p>
                    <button
                        className="btn btn-secondary browse-files-btn"
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleBoxClick(); }}
                    >
                        Browse Files
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept=".pdf"
                    />
                </div>

                {/* Selected File Preview */}
                {file && (
                    <div className="selected-file-card">
                        <div className="selected-file-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                        </div>
                        <div className="selected-file-info">
                            <span className="selected-file-name">{file.name}</span>
                            <span className="selected-file-size">{formatFileSize(file.size)}</span>
                        </div>
                        <button
                            type="button"
                            className="remove-file-icon-btn"
                            onClick={handleRemoveFile}
                            aria-label={`Remove ${file.name}`}
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Upload Action Button */}
                <button
                    className="btn btn-primary upload-submit-btn"
                    type="button"
                    onClick={handleUploadFiles}
                    disabled={!file || uploadState.loading}
                >
                    {uploadState.loading ? (
                        <>
                            <span className="btn-spinner"></span>
                            <span>Processing & Uploading...</span>
                        </>
                    ) : (
                        'Upload Document'
                    )}
                </button>
            </div>

            {/* Uploaded Documents List */}
            {files && files.length > 0 && (
                <div className="uploaded-documents-card">
                    <h2 className="uploaded-heading">
                        <span>Uploaded Documents</span>
                        <span className="badge">{files.length}</span>
                    </h2>
                    <ul className="uploaded-items-list">
                        {files.map((fname, idx) => (
                            <li key={idx} className="uploaded-item-row">
                                <div className="doc-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                </div>
                                <span className="doc-name">{fname}</span>
                                <span className="doc-ready-pill">Ready</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadMaterial;
