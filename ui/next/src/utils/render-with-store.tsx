import { render, type RenderOptions } from "@testing-library/react";
import { type AppStore, type RootState, setupStore } from "@/store/app-store";
import type { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>
    store?: AppStore
}

export function renderWithStore(
    ui: React.ReactElement,
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): ReactElement {
        return <Provider store={store}>{children}</Provider>
    }
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
