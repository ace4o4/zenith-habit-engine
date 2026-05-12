import localforage from "localforage";
import type { StateStorage } from "zustand/middleware";

let store: LocalForage | null = null;

function getStore(): LocalForage {
  if (!store) {
    store = localforage.createInstance({
      name: "zenith",
      storeName: "habits",
      description: "Project Zenith — offline habit data",
    });
  }
  return store;
}

export const indexedDbStorage: StateStorage = {
  getItem: async (name) => {
    if (typeof window === "undefined") return null;
    const v = await getStore().getItem<string>(name);
    return v ?? null;
  },
  setItem: async (name, value) => {
    if (typeof window === "undefined") return;
    await getStore().setItem(name, value);
  },
  removeItem: async (name) => {
    if (typeof window === "undefined") return;
    await getStore().removeItem(name);
  },
};
