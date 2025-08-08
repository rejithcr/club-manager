import React from "react";

export type SnackbarType = "success" | "error" | "warning" | "info";

export interface SnackbarHandle {
  show: (message: string, type?: SnackbarType) => void;
}

export const snackbarRef = React.createRef<SnackbarHandle>();
