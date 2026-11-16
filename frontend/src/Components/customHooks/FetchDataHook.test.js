import axios from "axios";
import { getPrivateElements } from "./FetchDataHook";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

test("uses the current token and tenant for each request", async () => {
  axios.get.mockResolvedValue({ data: [] });
  localStorage.setItem("token", "first-token");
  localStorage.setItem(
    "memberships",
    JSON.stringify([{ tenant: { id: "first-tenant" } }]),
  );

  await getPrivateElements("jobs");

  localStorage.setItem("token", "new-token");
  localStorage.setItem(
    "memberships",
    JSON.stringify([{ tenant: { id: "new-tenant" } }]),
  );

  await getPrivateElements("jobs");

  expect(axios.get.mock.calls[0][1].headers).toEqual({
    Authorization: "Bearer first-token",
    "X-Tenant": "first-tenant",
  });
  expect(axios.get.mock.calls[1][1].headers).toEqual({
    Authorization: "Bearer new-token",
    "X-Tenant": "new-tenant",
  });
});
