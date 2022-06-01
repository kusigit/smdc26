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
} from './store.ts';
import { typeConnectionSelectors } from './store/type-connections.ts';
import { v4 as uuidv4 } from 'uuid';
import { Attribute, UserData } from './types';

const elementAdapter = createEntityAdapter<any>();

const elementSelectors = elementAdapter.getSelectors<RootState>(
  (state) => state.elements
);

const selectElementRepaint = createSelector(
  (state: RootState) => state.elements,
  ({ repaint }): boolean => repaint
);

const addElement = createAsyncThunk<any, any>(
  'addElement',
  ({ item, userData }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    let elements = elementSelectors.selectAll(state);
    let connections = typeConnectionSelectors.selectAll(state);

    //  console.log(item);
    //  console.log(userData);
    //  console.log(connections);
    /*
    const ports = {
      top: connections.find(
        (c) =>
          c.source.includes(userData.ports[0]) ||
          c.target.includes(userData.ports[0])
      ),
      right: connections.find(
        (c) =>
          c.source.includes(userData.ports[1]) ||
          c.target.includes(userData.ports[1])
      ),
      bottom: connections.find(
        (c) =>
          c.source.includes(userData.ports[2]) ||
          c.target.includes(userData.ports[2])
      ),
      left: connections.find(
        (c) =>
          c.source.includes(userData.ports[3]) ||
          c.target.includes(userData.ports[3])
      ),
    };
*/
    const outputPorts = connections
      .filter(
        (c) => c.source.parentId === userData.typeId
        //       c.target.parentId === userData.typeId
      )
      .map((item) => ({
        //      [item.source.position || item.target.position]: {
        id: uuidv4(),
        allowed: item.source.id,
        position: item.source.position,
        //      },
      }));

    const inputPorts = connections
      .filter(
        (c) =>
          //      c.source.parentId === userData.typeId ||
          c.target.parentId === userData.typeId
      )
      .map((item) => ({
        //      [item.source.position || item.target.position]: {
        id: uuidv4(),
        allowed: item.source.parentId,
        position: item.target.position,
        //      },
      }));

    // console.log(outputPorts);

    const data: Attribute = {
      ...item,
      id: uuidv4(),
      userData: {
        ...userData,
        //   level: 1,
        //   buttons: this.types,
        //   typeId: item.id,
        ports: [...outputPorts, ...inputPorts],
        // sources,
        //   ports: [uuidv4(), uuidv4(), uuidv4(), uuidv4()],
        // sour
      },
    };

    elements = [...elements, data];
    setItem('elements', elements);

    return data;
  }
);

const setElements = createAsyncThunk<any[], void>('setElements', (data) =>
  setItem('elements', data)
);

const resetElements = createAsyncThunk<any[], void>('resetElements', () =>
  setItem('elements', [])
);

const getElements = createAsyncThunk<any[], void>('getElements', () =>
  getItem('elements', [])
);

const updateElement = createAsyncThunk<any, any>(
  'saveElementPosition',
  (data) => upsertItem('elements', data)
);

const deleteElement = createAsyncThunk<any, any>('deleteElement', (id) =>
  deleteItem('elements', id)
);

const setElementRepaint = createAction<boolean>('setElementRepaint');

const elementSlice = createSlice({
  name: 'element',
  initialState: elementAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setElements.fulfilled, (state, { payload }) => {
        elementAdapter.setAll(state, payload);
      })
      .addCase(resetElements.fulfilled, (state, { payload }) => {
        elementAdapter.setAll(state, payload);
        state.repaint = true;
      })
      .addCase(getElements.pending, (state, { payload }) => {
        //     state.repaint = true;
      })
      .addCase(getElements.fulfilled, (state, { payload }) => {
        elementAdapter.setAll(state, payload);
        //     state.repaint = true;
      })
      .addCase(addElement.pending, (state, { payload }) => {
        //     state.repaint = true;
      })
      .addCase(addElement.fulfilled, (state, { payload }) => {
        //        console.log(payload);
        elementAdapter.addOne(state, payload);
        state.repaint = true;
      })
      .addCase(addElement.rejected, (state, a) => {
        console.log(a);
      })
      .addCase(updateElement.pending, (state, { payload }) => {
        //       state.repaint = false;
      })
      .addCase(updateElement.fulfilled, (state, { payload }) => {
        elementAdapter.updateOne(state, { id: payload.id, changes: payload });
        // state.repaint = false;
      })
      .addCase(setElementRepaint, (state, { payload }) => {
        state.repaint = payload;
      });
  },
});

export {
  getElements,
  elementSlice,
  addElement,
  elementSelectors,
  resetElements,
  setElementRepaint,
  deleteElement,
  selectElementRepaint,
  updateElement,
  setElements,
};
