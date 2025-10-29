import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";

describe("Home", () => {
  it("should add a new todo", async () => {
    render(<Home />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText("New Todo");
    await user.type(input, "My new todo");
    expect(input).toHaveValue("My new todo");

    const button = screen.getByRole("button", { name: /submit/i });
    await user.click(button);

    await waitFor(() => expect(input).toHaveValue(""));

    const data = await screen.findByText("My new todo");
    expect(data).toHaveTextContent("My new todo");
  });

  it("should update a todo", async () => {
    render(<Home />);
    const user = userEvent.setup();

    const checkbox = (
      await screen.findAllByRole("checkbox")
    )[0] as HTMLInputElement;
    expect(checkbox.checked).toBeFalsy();
    await user.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
  });

  it("should delete a todo", async () => {
    render(<Home />);
    const user = userEvent.setup();

    // ensure the todo is present
    expect(await screen.findByText("Write Code 💻")).toBeInTheDocument();

    const button = (await screen.findAllByTestId("delete-button"))[0];
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryByText("Write Code 💻")).not.toBeInTheDocument();
    });
  });
});
