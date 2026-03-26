import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "johndoe",
          email: "contato@curso.dev",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201);

      let responseBody = await response.json();
      responseBody = {
        ...responseBody,
        created_at: new Date(responseBody.created_at),
        updated_at: new Date(responseBody.updated_at),
      };
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "johndoe",
        features: ["read:activation_token"],
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody.created_at).toBeInstanceOf(Date);
      expect(responseBody.updated_at).toBeInstanceOf(Date);

      const userInDatabase = await user.findOneByUsername("johndoe");
      const correctPasswordMatch = await password.compare(
        "senha123",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "SenhaErrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated 'email'", async () => {
      await orchestrator.createUser({
        email: "duplicated@email.com",
      });

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado",
          email: "Duplicated@email.com",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      await orchestrator.createUser({
        username: "usernameduplicado",
      });

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameDuplicado",
          email: "usernameduplicado@email.com",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });
  });

  describe("Default user", () => {
    test("With unique and valid data", async () => {
      const user1 = await orchestrator.createUser();
      await orchestrator.activateUser(user1);
      const user1SessionObject = await orchestrator.createSession(user1.id);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${user1SessionObject.token}`,
        },
        body: JSON.stringify({
          username: "usuariologado",
          email: "usuariologado@curso.dev",
          password: "senha123",
        }),
      });
      expect(user2Response.status).toBe(403);

      const user2ResponseBody = await user2Response.json();
      expect(user2ResponseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action: 'Verifique se o seu usuário possui a feature "create:user".',
        status_code: 403,
      });
    });
  });
});
