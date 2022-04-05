import { configureStore } from '@reduxjs/toolkit'
import toastsReducer from './toasts'
import userReducer from './user'
import campaignReducer from './campaigns'
import tokensReducer from './tokens'
import tokenLocksReducer from './tokenLocks'
import blockReducer from './block'
import commentReducer from './comment'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    toasts: toastsReducer,
    user: userReducer,
    campaigns: campaignReducer,
    tokens: tokensReducer,
    tokenLocks: tokenLocksReducer,
    block: blockReducer,
    comment: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
