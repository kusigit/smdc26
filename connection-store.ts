import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createAction,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {
  getItem,
  setItem,
  upsertItem,
  deleteItem,
  RootState,
} from './store.ts';

const connectionAdapter = createEntityAdapter<any>();

const connectionSelectors = connectionAdapter.getSelectors<RootState>(
  (state) => state.connections
);

const selectConnectionRepaint = createSelector(
  (state: RootState) => state.connections,
  ({ repaint }): boolean => repaint
);

const setConnections = createAsyncThunk<any[], any>('setConnections', (data) =>
  upsertItem('connections', data)
);

const resetConnections = createAsyncThunk<any[], any>('resetConnections', () =>
  setItem('connections', [])
);

const getConnections = createAsyncThunk<any[], void>('getConnections', () =>
  getItem('connections', [])
);

const removeConnection = createAsyncThunk<any, string>(
  'removeConnection',
  (id) => deleteItem('connections', id)
);

const setConnectionRepaint = createAction<boolean>('setConnectionRepaint');

const connectionSlice = createSlice({
  name: 'connection',
  initialState: connectionAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setConnections.pending, (state, { payload }) => {
        //    state.repaint = false;
      })
      .addCase(setConnections.fulfilled, (state, { payload }) => {
        connectionAdapter.setAll(state, payload);
      })
      .addCase(getConnections.pending, (state, { payload }) => {
        //  connectionAdapter.setAll(state, payload);
        //    state.repaint = true;
      })
      .addCase(removeConnection.fulfilled, (state, { payload }) => {
        connectionAdapter.removeOne(state, payload);
      })
      .addCase(getConnections.fulfilled, (state, { payload }) => {
        connectionAdapter.setAll(state, payload);
        state.repaint = true;
      })
      .addCase(setConnectionRepaint, (state, { payload }) => {
        state.repaint = payload;
      });
  },
});

export {
  getConnections,
  connectionSlice,
  setConnections,
  selectConnectionRepaint,
  setConnectionRepaint,
  connectionSelectors,
  removeConnection,
  resetConnections,
};
