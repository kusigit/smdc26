import { configureStore } from '@reduxjs/toolkit';
import { elementSlice } from './element-store.ts';
import { typeSlice } from './type-store.ts';
import { connectionSlice } from './connection-store.ts';
import { typeConnectionSlice } from './store/type-connections.ts';
import { merge } from 'lodash';

const getItem = (key, defaultValue) => {
  return JSON.parse(localStorage.getItem(key)) || defaultValue;
};

const setItem = (key, value) => {
  const jsonTxt = JSON.stringify(value);
  localStorage.setItem(key, jsonTxt);
  return value;
};

const upsertItem = (key, value) => {
  let items = getItem(key, []);
  let found = items.find((item) => item.id === value.id);

  if (found) {
    found = merge(found, value);
    items = items.map((i) => (i.id === value.id ? found : i));
  } else {
    items.push(value);
    found = value;
  }

  const jsonTxt = JSON.stringify(items);
  localStorage.setItem(key, jsonTxt);

  return found;
};

const deleteItem = (key, id) => {
  let items = getItem(key, []);
  items = items.filter((element) => element.id !== id);

  const jsonTxt = JSON.stringify(items);
  localStorage.setItem(key, jsonTxt);
  return id;
};
/*
const upsertItemX = (key, value) => {
  let items = getItem(key, []);

  const found = items.find((item) => item.id === value.id);

  if (found) {
    items = items.map((element) =>
      element.id === value.id
        ? {
            ...element,
            ...value,
          }
        : element
    );
  } else {
    items.push(value);
  }

  const jsonTxt = JSON.stringify(items);
  localStorage.setItem(key, jsonTxt);
  return value;
};
*/
const store = configureStore({
  reducer: {
    elements: elementSlice.reducer,
    types: typeSlice.reducer,
    connections: connectionSlice.reducer,
    typeConnections: typeConnectionSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

export { getItem, setItem, deleteItem, upsertItem, RootState };

export default store;
