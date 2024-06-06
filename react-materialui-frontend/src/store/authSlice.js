import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/http-common';

export const signUp = createAsyncThunk('auth/signUp', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        signIn: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.status = 'Успешно';
            state.error = null;
        },
        signOut: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.status = 'Загрузка';
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'Успешно';
                // state.user = action.payload.user;
                // state.token = action.payload.token;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'Ошибка';
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.status = 'Загрузка';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'Успешно';
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'Ошибка';
                state.error = action.payload;
            });
    },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
