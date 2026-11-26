import { getErrorMessage } from "@/lib/errors";

describe("getErrorMessage", () => {
  it("usa el mensaje de un Error", () => {
    expect(getErrorMessage(new Error("Invalid credentials"))).toBe("Invalid credentials");
  });

  it("usa el mensaje de un objeto de error de Appwrite", () => {
    expect(getErrorMessage({ message: "User not found", code: 404 })).toBe("User not found");
  });

  it("acepta strings", () => {
    expect(getErrorMessage("Network error")).toBe("Network error");
  });

  it("devuelve el texto de respaldo si no hay mensaje", () => {
    expect(getErrorMessage(null, "Fallback")).toBe("Fallback");
    expect(getErrorMessage({})).toBe("Something went wrong");
  });
});
