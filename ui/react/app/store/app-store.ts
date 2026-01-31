import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "@/store/user-slice";
import { tasksSlice } from "@/store/tasks-slice";

const rootReducer = combineReducers({
    userData: userSlice.reducer,
    tasksData: tasksSlice.reducer
})

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    })
}

export const appStore = setupStore()

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
