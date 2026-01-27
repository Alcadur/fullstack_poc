import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/app-store";
import type { User } from "@/model/user.model";

type UserSlice = {
    user: User | null;
}

const initialState: UserSlice = { user: null };

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;

export const userSelector = (state: RootState) => state.userData.user;
