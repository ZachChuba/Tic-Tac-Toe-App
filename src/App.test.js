import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Checks that user list not active with login button", () => {
  render(<App />);
  const loginButton = screen.getByText("Join Room");
  expect(loginButton).toBeInTheDocument();
  const userListElement = screen.queryByText("Users Online");
  expect(userListElement).not.toBeInTheDocument();
});

test("Ensure props state isLoggedIn changes and sets login invisible", () => {
  render(<App />);

  const loginButton = screen.getByText("Join Room");
  expect(loginButton).toBeInTheDocument();
  fireEvent.click(loginButton);
  expect(loginButton).not.toBeInTheDocument();
});

test("Test that the play again button is not present if the game is not over", () => {
  render(<App />);

  const loginButton = screen.getByText("Join Room");
  expect(loginButton).toBeInTheDocument();
  fireEvent.click(loginButton);

  const playAgainButton = screen.queryByText("Play Again?");
  expect(playAgainButton).not.toBeInTheDocument();
});
