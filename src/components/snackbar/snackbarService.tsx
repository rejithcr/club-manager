export type SnackbarType = "info" | "success" | "warning" | "error";

type Pending = { message: string; type: SnackbarType };

let handle: { show: (message: string, type?: SnackbarType) => void } | null = null;
const pending: Pending[] = [];

export const setSnackbarHandle = (h: typeof handle) => {
  handle = h;
  if (handle) {
    // flush pending
    pending.splice(0, pending.length).forEach((p) => handle!.show(p.message, p.type));
  }
};

export const showSnackbar = (message: string, type: SnackbarType = "info") => {
  if (handle) {
    handle.show(message, type);
  } else {
    pending.push({ message, type });
  }
};
