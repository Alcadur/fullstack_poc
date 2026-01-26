import { useRef } from "react";
import type { Cancelable } from "@mui/utils/debounce";
import { debounce } from "@mui/material";

export default function useDebounce() {
    const debounceRef = useRef<(() => void) & Cancelable>(null);

    return (callback: () => void, delay: number) => {
        debounceRef.current?.clear()
        debounceRef.current = debounce(callback,  delay);

        debounceRef.current()
    }
}
