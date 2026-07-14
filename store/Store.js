import { configureStore } from '@reduxjs/toolkit'
import userReducer from './User/UserReducer'
import sectionReducer from './Section/SectionReducer'
import uploadReducer from './Upload/UploadReducer'
import ChatReducer from './Chat/ChatReducer';
import flashCardReducer from './FlashCard/FlashCardReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        section: sectionReducer,
        upload: uploadReducer,
        chat: ChatReducer,
        flashcard: flashCardReducer,
    }
})

export default store
