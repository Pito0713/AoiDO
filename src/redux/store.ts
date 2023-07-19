import { configureStore, createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

interface State {
  token: string | undefined | null,
  account: string,
  password: string,
  rememberInfo: boolean,
  permission: string,
  id: string,
}
interface action {
  err?: string,
  key?: string,
  type?: string,
  payload?: {
    [Key in string]?: string | undefined
  }
}

const initialState = {
  token: '',
  account: '',
  password: '',
  rememberInfo: false,
  permission: ''
} as State

const reduxText = (action: any) => {
  let Text = (action) ? `redeux [${action.type}] ${action.payload}` : `[redeuxError]`
  return Text
}

const accountMiddleWare = (store: any) => (next: any) => (action: action) => {
  if (action.type === 'register/SET_ACCOUNT') {
    let TextRes = reduxText(action)
    console.log(TextRes)
  }
  next(action);
}
const tokenMiddleWare = (store: any) => (next: any) => (action: action) => {
  if (action.type === 'register/SET_TOKEN') {
    let TextRes = reduxText(action)
    console.log(TextRes)
  }
  next(action);
}

const passwordMiddleWare = (store: any) => (next: any) => (action: action) => {
  if (action.type === 'register/SET_PASSWORD') {
    let TextRes = reduxText(action)
    console.log(TextRes)
  }
  next(action);
}
const rememberInfoMiddleWare = (store: any) => (next: any) => (action: action) => {
  if (action.type === 'register/SET_REMEMBERINFO') {
    let TextRes = reduxText(action)
    console.log(TextRes)
  }
  next(action);
}
const permissionMiddleWare = (store: any) => (next: any) => (action: action) => {
  if (action.type === 'register/SET_PERMISSION') {
    let TextRes = reduxText(action)
    console.log(TextRes)
  }
  next(action);
}

const IdMiddleWare = (store: any) => (next: any) => (action: action) => {
  if (action.type === 'register/SET_ID') {
    let TextRes = reduxText(action)
    console.log(TextRes)
  }
  next(action);
}

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    SET_ACCOUNT(state, action) {
      state.account = action.payload;
    },
    SET_PASSWORD(state, action) {
      state.password = action.payload;
    },
    SET_TOKEN(state, action) {
      state.token = action.payload;
    },
    SET_REMEMBERINFO(state, action) {
      state.rememberInfo = action.payload;
    },
    SET_PERMISSION(state, action) {
      state.permission = action.payload;
    },
    SET_ID(state, action) {
      state.id = action.payload;
    },
  }
});

const persistConfig = { key: 'root', version: 1, storage: AsyncStorage }
const persistedReducer = persistReducer(persistConfig, registerSlice.reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [accountMiddleWare, passwordMiddleWare, tokenMiddleWare, rememberInfoMiddleWare, permissionMiddleWare, IdMiddleWare],
})

const persistor = persistStore(store)

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const registerActions = registerSlice.actions;
export { store, persistor };