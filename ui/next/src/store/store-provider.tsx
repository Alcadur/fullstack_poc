"use client";

import { type ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { type AppStore, setupStore } from "./app-store";

export default function StoreProvider({
  children
}: {
    children: ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null);
    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        storeRef.current = setupStore();
    }

    // eslint-disable-next-line react-hooks/refs
    return <Provider store={storeRef.current}>{children}</Provider>;
}
