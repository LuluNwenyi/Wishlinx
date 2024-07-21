export const isServer = typeof window === "undefined";

export const readData = (name: string) => {
  if (!isServer) {
    const cookie = localStorage?.getItem(name);
    if (cookie) {
      try {
        return JSON.parse(cookie);
      } catch (error) {
        // console.error("Error parsing JSON from localStorage", error);
        return null;
      }
    }
  }
  return null;
};

export const clearData = (name: string) => {
  if (!isServer) {
    localStorage?.removeItem(name);
  }
};

export const createData = (name: string, value: any) => {
  if (!isServer) {
    localStorage?.setItem(name, JSON.stringify(value));
  }
};
