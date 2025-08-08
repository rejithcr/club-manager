import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { setSnackbarHandle, SnackbarType } from "./snackbarService";
import SnackbarItem from "./SnackbarItem";

type Message = { id: string; text: string; type: SnackbarType };

export const SnackbarProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setSnackbarHandle({
      show: (text: string, type: SnackbarType = "info") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        setMessages((prev) => [...prev, { id, text, type }]);
      },
    });

    return () => {
      setSnackbarHandle(null);
    };
  }, []);

  const remove = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <>
      {children}
      <View pointerEvents="box-none" style={styles.container}>
        {messages.map((m, idx) => (
          <SnackbarItem
            key={m.id}
            id={m.id}
            text={m.text}
            type={m.type}
            onHide={() => remove(m.id)}
            index={idx}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
    paddingHorizontal: 12,
  },
});
