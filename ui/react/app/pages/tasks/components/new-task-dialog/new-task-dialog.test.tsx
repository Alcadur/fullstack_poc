import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { NewTaskDialog } from "./new-task-dialog";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";

jest.mock("@/pages/tasks/components/new-task-form/new-task-form", () => ({
    NewTaskForm: ({ onSubmitStart, onSubmitEnd }: { onSubmitStart?: () => void; onSubmitEnd?: () => void }) => (
        <div>
            <button type="button" onClick={onSubmitStart}>start</button>
            <button type="button" onClick={onSubmitEnd}>end</button>
        </div>
    ),
}));

describe("NewTaskDialog", () => {
    it("assigns the dialog element to the forwarded ref", () => {
        const dialogRef = createRef<HTMLDialogElement>();

        render(<NewTaskDialog ref={dialogRef} />);

        expect(dialogRef.current).not.toBeNull();
        expect(dialogRef.current?.tagName).toBe("DIALOG");
    });

    it("calls dialog.close when the close button is clicked", async () => {
        const userAction = userEvent.setup();
        const originalClose = HTMLDialogElement.prototype.close;
        if (!originalClose) {
            HTMLDialogElement.prototype.close = () => {};
        }
        const closeSpy = jest.spyOn(HTMLDialogElement.prototype, "close").mockImplementation(() => {});
        const { container } = render(<NewTaskDialog />);

        const closeButton = container.querySelector("button.closeButton");
        expect(closeButton).not.toBeNull();

        await userAction.click(closeButton as HTMLButtonElement);

        expect(closeSpy).toHaveBeenCalledTimes(1);
        closeSpy.mockRestore();
        if (!originalClose) {
            delete (HTMLDialogElement.prototype as { close?: () => void }).close;
        }
    });

    it("toggles the loading class based on form submission lifecycle", async () => {
        const userAction = userEvent.setup();
        const { container } = render(<NewTaskDialog />);
        const closeButton = container.querySelector("button.closeButton");
        expect(closeButton).not.toBeNull();

        expect(closeButton as HTMLButtonElement).not.toHaveClass("loading");

        await userAction.click(screen.getByText("start"));
        expect(closeButton as HTMLButtonElement).toHaveClass("loading");

        await userAction.click(screen.getByText("end"));
        expect(closeButton as HTMLButtonElement).not.toHaveClass("loading");
    });
});
