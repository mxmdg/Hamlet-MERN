import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthProvider, { AuthContext } from "./AuthContext";

const AuthState = () => (
  <AuthContext.Consumer>
    {({ setMemberships, usePlan, useSettings }) => (
      <>
        <span>{usePlan}</span>
        <span>{useSettings?.currency}</span>
        <button
          onClick={() =>
            setMemberships([
              {
                tenant: {
                  plan: "pro",
                  settings: { currency: "ARS" },
                },
              },
            ])
          }
        >
          Change membership
        </button>
      </>
    )}
  </AuthContext.Consumer>
);

test("updates plan and settings when memberships change", () => {
  localStorage.clear();
  localStorage.setItem(
    "memberships",
    JSON.stringify([
      {
        tenant: {
          plan: "free",
          settings: { currency: "USD" },
        },
      },
    ]),
  );

  render(
    <MemoryRouter>
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    </MemoryRouter>,
  );

  expect(screen.getByText("free")).toBeInTheDocument();
  expect(screen.getByText("USD")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Change membership"));

  expect(screen.getByText("pro")).toBeInTheDocument();
  expect(screen.getByText("ARS")).toBeInTheDocument();
});
