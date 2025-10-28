import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home", () => {
  it("Should have 'Documentation' text", () => {
    // Arrange
    render(<Home />);

    // Act
    const myElem = screen.getByText("Documentation");

    // Assert
    expect(myElem).toBeInTheDocument();
  });

  it("Should have 'Templates' text", () => {
    // Arrange
    render(<Home />);

    // Act

    const myElem = screen.getByText(/templates/i);

    // Assert
    expect(myElem).toBeInTheDocument();
  });

  it("Should have a Heading", () => {
    // Arrange
    render(<Home />);

    // Act
    const myElem = screen.getByRole("heading", {
      name: /to get started, edit the page\.tsx file\./i,
    });

    // Assert
    expect(myElem).toBeInTheDocument();
  });
});
