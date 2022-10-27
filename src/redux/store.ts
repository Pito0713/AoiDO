import { configureStore,createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';


type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

interface CounterState {
  counter: number,
  showCounter: boolean
}

const initialState = { 
  counter: 0,
  showCounter: true 
} as CounterState

const incrementMiddleWare = store => next => action => {
  if (action.type === 'counter/increment') {
    console.log(action.type);
  }
  next(action);
}

const decrementMiddleWare = store => next => action => {
  if (action.type === 'counter/decrement') {
    console.log(action.type);
  }
  next(action);
}

const increaseMiddleWare = store => next => action => {
  // if (action.type === 'counter/increase') {
  //   return action(store.dispatch, store.getState)
  // }
  next(action);
}

const toggleCounterMiddleware = store => next => action => {
  if (action.type === 'counter/toggleCounter') {
    console.log(action.type);
  }
  next(action);
}

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    increase(state, action) {
      state.counter = state.counter + action.payload;
    },
    toggleCounter(state) {
      state.showCounter = !state.showCounter;
    }
  }
});
const persistConfig = { key: 'root', version: 1 ,storage: AsyncStorage}
const persistedReducer = persistReducer(persistConfig, counterSlice.reducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: [incrementMiddleWare, decrementMiddleWare, increaseMiddleWare, toggleCounterMiddleware],
})

const persistor = persistStore(store)

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const counterActions = counterSlice.actions;
export {store ,persistor};