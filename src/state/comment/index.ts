import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  comments: [],
  user: null,
  isLogIn: false,
  isSignUp: false,

  logInError: null,
}

export const userComments = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    userSignUpSucceed: (state) => {
      return {
        ...state,
        isSignUp: false,
      }
    },
    userLogInfailed: (state, action) => {
      return {
        ...state,
        isSignUp: true,
      }
    },
    userLogIn: (state, action) => {
      const user = action.payload
      return {
        ...state,
        isLogIn: true,
        isSignUp: false,
        user,
      }
    },
    userLogOut: (state) => {
      return {
        ...state,
        isLogIn: false,
        user: null,
      }
    },
    loadComments: (state, action) => {
      action.payload.map((comments: any) => state.comments.push(comments))
    },
    addedComment: (state, action) => {
      state.comments.push(action.payload)
    },
    loadupdateComment: (state, action) => {
      const { id, comment } = action.payload
      const index = state.comments.findIndex((todo) => todo.id === id)
      const newArray = [...state.comments]
      newArray[index].message = comment
    },
    deleteComment: (state, action) => {
      return {
        ...state,
        comments: state.comments.filter((item) => item.id !== action.payload),
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  // addUser,
  userSignUpSucceed,
  userLogInfailed,
  userLogIn,
  userLogOut,
  loadComments,
  deleteComment,
  addedComment,
  loadupdateComment,
} = userComments.actions

export default userComments.reducer
