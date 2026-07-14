import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSections } from '../../../../store/Section/SectionAction';
import { uploadFile } from '../../../../store/Upload/UploadAction';
import { clearError, clearSuccess } from '../../../../store/Upload/UploadReducer';
import { toast } from 'react-toastify';
import './Upload.css';
import DoesNotExist from '../../../components/DoesNotExist';

const UploadMaterial = () => {
    const {sectionId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sections = useSelector(state => state.section.sections);
    const loading = useSelector(state => state.section.loading);
    const uploadState = useSelector(state => state.upload);

    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);

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
        const section = sections.find(s => s._id === sectionId);
        setFiles(section ? section.files || [] : []);
    }, [sections, sectionId]);

    const section = sections.find(s => s._id === sectionId);
    if (!section) {
        return <DoesNotExist message="Section not found." />;
    }

    const sectionTitle = section.title || 'Section not found';

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFile(e.dataTransfer.files[0] || null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleBoxClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        fileInputRef.current.click();
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

    return (
        <div className="upload-page">
            <div className="upload-back-link" onClick={() => navigate(`/section/${sectionId}`)}>&larr; Back to {sectionTitle}</div>
            <div className="upload-title-row">
                <span className="upload-title-icon" role="img" aria-label="upload">🗂️</span>
                <h1 className="upload-title">Upload Material</h1>
            </div>
            <div className="upload-subtitle">Add new content to {sectionTitle}</div>
            <div className="upload-box-outer">
                <div
                    className="upload-box"
                    onClick={handleBoxClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div className="upload-box-icon">
                        <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 48 48">
                            <path d="M24 36V12M24 12l-8 8M24 12l8 8" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="8" y="36" width="32" height="4" rx="2" fill="#e5e7eb"/>
                        </svg>
                    </div>
                    <div className="upload-box-title">Upload Your Files</div>
                    <div className="upload-box-desc">Drag and drop files here or click to browse</div>
                    <button
                        className="upload-choose-btn"
                        type="button"
                        onClick={e => { e.stopPropagation(); handleBoxClick(); }}
                    >
                        Choose Files
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept=".pdf"
                    />
                </div>
                {file && (
                    <div className="upload-file-list">
                        <div className="upload-file-item file-item-row">
                            <span>{file.name}</span>
                            <button
                                type="button"
                                className="remove-file-btn"
                                onClick={handleRemoveFile}
                                aria-label={`Remove ${file.name}`}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
                <button
                    className="upload-btn"
                    type="button"
                    onClick={handleUploadFiles}
                    disabled={!file || uploadState.loading}
                >
                    {uploadState.loading ? 'Uploading...(This may take a while)' : 'Upload'}
                </button>
            </div>
            {files && files.length > 0 && (
                <div className="uploaded-files-list">
                    <h3>Uploaded Files</h3>
                    <ul>
                        {files.map((fname, idx) => (
                            <li key={idx}>{fname}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadMaterial;
