import {
  createSlice,
  createAsyncThunk,
  createAction,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {
  getItem,
  setItem,
  updateItem,
  upsertItem,
  deleteItem,
  RootState,
} from './store.ts';
import Type from './type.ts';
import { Attribute } from './types';

const typeAdapter = createEntityAdapter<any>();

const typeSelectors = typeAdapter.getSelectors<RootState>(
  (state) => state.types
);

const selectTypeRepaint = createSelector(
  (state: RootState) => state.types,
  ({ repaint }): boolean => repaint
);

const setTypes = createAsyncThunk<any[], any>('setTypes', (data) =>
  setItem('types', data)
);

const editType = createAsyncThunk<any, any>('editType', (data) =>
  upsertItem('types', data)
);

const savePosition = createAsyncThunk<any, any>('saveTypePosition', (data) =>
  upsertItem('types', data)
);

const deleteType = createAsyncThunk<any, any>('deleteType', (id) =>
  deleteItem('types', id)
);

const addType = createAsyncThunk<any, any>('addType', (data) =>
  upsertItem('types', data)
);

const getTypes = createAsyncThunk<any[], void>('getTypes', () =>
  getItem('types', [])
);

const setTypeRepaint = createAction<boolean>('setTypeRepaint');

const typeSlice = createSlice({
  name: 'type',
  initialState: typeAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTypes.pending, (state, { payload }) => {
        //    state.repaint = true;
      })
      .addCase(getTypes.fulfilled, (state, { payload }) => {
        typeAdapter.setAll(state, payload);
        //    state.repaint = true;
      })
      .addCase(setTypes.fulfilled, (state, { payload }) => {
        typeAdapter.setAll(state, payload);
      })
      .addCase(addType.fulfilled, (state, { payload }) => {
        //        typeAdapter.setAll(state, payload);
        typeAdapter.addOne(state, payload);
        state.repaint = true;
      })
      .addCase(addType.rejected, (state, a) => {
        console.log(a);
      })
      .addCase(editType.pending, (state, a) => {
        //  state.repaint = true;
      })
      .addCase(editType.fulfilled, (state, { payload }) => {
        typeAdapter.updateOne(state, { id: payload.id, changes: payload });
        state.repaint = true;
        // console.log(a);
      })
      .addCase(savePosition.rejected, (state, a) => {
        // typeAdapter.updateOne(state, payload);
        console.log(a);
      })
      .addCase(savePosition.pending, (state, { payload }) => {
        //   state.repaint = false;
      })
      .addCase(savePosition.fulfilled, (state, { payload }) => {
        typeAdapter.updateOne(state, { id: payload.id, changes: payload });
      })
      .addCase(deleteType.fulfilled, (state, { payload }) => {
        typeAdapter.removeOne(state, payload);
      })
      .addCase(setTypeRepaint, (state, { payload }) => {
        state.repaint = payload;
      });
  },
});

export {
  getTypes,
  addType,
  editType,
  deleteType,
  savePosition,
  selectTypeRepaint,
  typeSlice,
  setTypeRepaint,
  setTypes,
  typeSelectors,
};
