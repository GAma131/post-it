"use client";

import { useEffect } from "react";

type KeyboardShortcutHandler = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcutHandler[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const metaOrCtrlPressed =
          (shortcut.metaKey || shortcut.ctrlKey) && (e.metaKey || e.ctrlKey);
        const altMatches = !shortcut.altKey || e.altKey;
        const shiftMatches = !shortcut.shiftKey || e.shiftKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          metaOrCtrlPressed &&
          altMatches &&
          shiftMatches
        ) {
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
