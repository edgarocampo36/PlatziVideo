import { setFavoriteRequest, loginRequest } from "../../actions/index";
import movieMock from "../../__mocks__/movieMock";

describe("Actions", () => {
  test("Set Favorite Request", () => {
    const payload = movieMock;
    const expectedAction = {
      type: "SET_FAVORITE_REQUEST",
      payload,
    };
    expect(setFavoriteRequest(payload)).toEqual(expectedAction);
  });

  test("LoginRequest", () => {
    const payload = {
      email: "test@test.com",
      password: "password",
    };
    const expectedAction = {
      type: "LOGIN_REQUEST",
      payload,
    };
    expect(loginRequest(payload)).toEqual(expectedAction);
  });
});
