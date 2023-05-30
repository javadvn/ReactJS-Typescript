import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../redux/store';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  street: string;
  city: string;
  name: string;
}

interface UserState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    getUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getUsersStart, getUsersSuccess, getUsersFailure } = userSlice.actions;

export default userSlice.reducer;

export const fetchUsers = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getUsersStart());
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users = response.data.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      street: user.address.street,
      city: user.address.city,
      name: user.company.name,
    }));
    dispatch(getUsersSuccess(users));
  } catch (error: any) {
    dispatch(getUsersFailure(error.message));
  }
};
