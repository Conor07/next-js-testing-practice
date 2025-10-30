import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";
import { server } from "@/mocks/server";
import { rest } from "msw";

describe("Home", () => {
  it("should add a new todo", async () => {
    render(<Home />); // ARRANGE

    // ACT
    const input = screen.getByPlaceholderText("New Todo");
    await userEvent.type(input, "My new todo");

    // ASSERT
    expect(input).toHaveValue("My new todo");

    // ACT
    const button = screen.getByRole("button", {
      name: "Submit",
    });

    await userEvent.click(button);

    waitFor(
      () => {
        expect(input).toHaveValue(""); // ASSERT
      },
      { timeout: 1000 }
    );

    const data = await screen.findByText("My new todo");

    expect(data).toHaveTextContent("My new todo");
  });

  it("should not add a new todo if the request fails", async () => {
    server.use(
      rest.post("/todos", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    render(<Home />); // ARRANGE

    // ACT
    const input = screen.getByPlaceholderText("New Todo");
    await userEvent.type(input, "My new todo");

    // ASSERT
    expect(input).toHaveValue("My new todo");

    // ACT
    const button = screen.getByRole("button", {
      name: "Submit",
    });

    await userEvent.click(button);

    waitFor(
      () => {
        expect(input).toHaveValue(""); // ASSERT
      },
      { timeout: 1000 }
    );

    const data = await screen.queryByText("My new todo");

    expect(data).not.toBeInTheDocument(); // ASSERT
  });

  it("should update a todo", async () => {
    render(<Home />); // ARRANGE

    // ACT
    const checkboxArray = (await screen.findAllByRole(
      "checkbox"
    )) as HTMLInputElement[];

    const checkbox = checkboxArray[0];

    expect(checkbox.checked).toBeFalsy();

    await userEvent.click(checkbox);

    waitFor(
      () => {
        expect(checkbox.checked).toBeTruthy(); // ASSERT
      },
      { timeout: 1000 }
    );
  });

  it("should not update a todo if the request fails", async () => {
    render(<Home />); // ARRANGE

    // ACT
    const checkboxArray = (await screen.findAllByRole(
      "checkbox"
    )) as HTMLInputElement[];

    const checkbox = checkboxArray[0];

    expect(checkbox.checked).toBeFalsy();

    server.use(
      // rest.put(`/todos/:id`, (req, res, ctx) => {
      rest.put(`/todos/${checkbox.id}`, (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    await userEvent.click(checkbox);

    waitFor(
      () => {
        expect(checkbox.checked).toBeFalsy(); // ASSERT
      },
      { timeout: 1000 }
    );
  });

  it("should delete a todo", async () => {
    render(<Home />); // ARRANGE

    const todoText = await screen.findByText("Write Code 💻");

    expect(todoText).toBeInTheDocument(); // ASSERT

    // ACT
    const buttons = await screen.findAllByTestId("delete-button");

    const button = buttons[0];

    await userEvent.click(button);

    expect(todoText).not.toBeInTheDocument(); // ASSERT
  });

  it("should not delete a todo if the request fails", async () => {
    render(<Home />); // ARRANGE

    const checkboxArray = (await screen.findAllByRole(
      "checkbox"
    )) as HTMLInputElement[];

    const checkbox = checkboxArray[0];

    expect(checkbox).toBeInTheDocument(); // ASSERT

    server.use(
      // rest.delete(`/todos/:id`, (req, res, ctx) => {
      rest.delete(`/todos/${checkbox.id}`, (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    const buttons = await screen.findAllByTestId("delete-button");

    const button = buttons[0];

    await userEvent.click(button);

    const toDoText = await screen.findByText("Write Code 💻");

    expect(toDoText).toBeInTheDocument(); // ASSERT
  });
});
