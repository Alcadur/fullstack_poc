import type { Task } from "@/model/task.model";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/app-store";

type TasksSlice = {
    tasks: Task[]
}

const initialState: TasksSlice = { tasks: [] };

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action) => {
            const taskIndex = state.tasks.findIndex(task => task.uuid === action.payload.uuid);
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = action.payload;
            }
        }
    }
})

export const { setTasks, addTask, updateTask } = tasksSlice.actions;
export const tasksSelector = (state: RootState) => state.tasksData.tasks;
