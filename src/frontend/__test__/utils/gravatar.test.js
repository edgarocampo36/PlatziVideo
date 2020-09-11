import gravatar from "../../utils/gravatar";

test("Gravatar Function Test", () => {
  const email = "edgarocampo36@gmail.com";
  const gravatarUrl =
    "https://gravatar.com/avatar/b66e425f8811974401bd35eebbe9fd20";
  expect(gravatarUrl).toEqual(gravatar(email));
});
