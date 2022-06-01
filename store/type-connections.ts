import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
  createAction,
} from '@reduxjs/toolkit';
import {
  getItem,
  setItem,
  upsertItem,
  deleteItem,
  RootState,
} from '../store.ts';

const connectionAdapter = createEntityAdapter<any>();

const typeConnectionSelectors = connectionAdapter.getSelectors<RootState>(
  (state) => state.typeConnections
);

const selectConnectionRepaint = createSelector(
  (state: RootState) => state.typeConnections,
  ({ repaint }): boolean => repaint
);

const setTypeConnections = createAsyncThunk<any[], any>(
  'setTypeConnections',
  (data) => upsertItem('type-connections', data)
);

const removeTypeConnection = createAsyncThunk<any, string>(
  'removeTypeConnection',
  (id) => deleteItem('type-connections', id)
);

const resetTypeConnections = createAsyncThunk<any[], any>(
  'resetTypeConnections',
  () => setItem('type-connections', [])
);

const getConnections = createAsyncThunk<any[], void>('getTypeConnections', () =>
  getItem('type-connections', [])
);

const setConnectionRepaint = createAction<boolean>('setTypeConnectionRepaint');

const typeConnectionSlice = createSlice({
  name: 'typeConnection',
  initialState: connectionAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConnections.pending, (state, { payload }) => {
        //    state.repaint = true;
      })
      .addCase(setTypeConnections.pending, (state, { payload }) => {
        //    state.repaint = false;
      })
      .addCase(setTypeConnections.fulfilled, (state, { payload }) => {
        connectionAdapter.setAll(state, payload);
        //    state.repaint = true;
      })
      .addCase(setTypeConnections.rejected, (a) => {
        console.log(a);
      })
      .addCase(resetTypeConnections.fulfilled, (state) => {
        state.repaint = true;
      })
      .addCase(removeTypeConnection.fulfilled, (state, { payload }) => {
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
  typeConnectionSlice,
  setTypeConnections,
  setConnectionRepaint,
  selectConnectionRepaint,
  resetTypeConnections,
  removeTypeConnection,
  typeConnectionSelectors,
};
