const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");

jest.mock("../middlewares/auth", () => jest.fn((req, res, next) => {
    req.user = {
        _id: "663d15cdd7ac3dfe1b3e7fb1",
        email: "nfegeg@gmail.com",
        role: "admin",
        age: "20",
    };
    next();
}));

describe("tester API articles", () => {
  let token;
  const MOCK_DATA = [
    {
      _id: "663d15cdd7ac3dfe1b3e7fb1",
      email: "nfegeg@gmail.com",
      role: "admin",
      age: "20",
    },
  ];
  const MOCK_DATA_CREATED_ARTICLE = {
    _id: "663d314cc179acd1b271e23a",
    title: "dumb title",
    content: "dumb content",
    user: mongoose.Types.ObjectId("663d15cdd7ac3dfe1b3e7fb1"),
  };
  const MOCK_DATA_UPDATED_ARTICLE = {
    _id: "663d314cc179acd1b271e23a",
    title: "new title",
    content: "dumb content",
    user: mongoose.Types.ObjectId("663d15cdd7ac3dfe1b3e7fb1"),
  };

  beforeEach(() => {
    token = jwt.sign({ userId: "663d15cdd7ac3dfe1b3e7fb1" }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_DATA, "findById");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED_ARTICLE, "save");
    mockingoose(Article).toReturn(MOCK_DATA_UPDATED_ARTICLE, "findOneAndUpdate");
    mockingoose(Article).toReturn({id: "663d314cc179acd1b271e23a"}, "deleteOne");
  });

  test("[Article] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED_ARTICLE)
      .set("x-access-token", token)
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED_ARTICLE.title);
  });

  test("[Article] Update Article", async () => {
    const res = await request(app)
      .put("/api/articles/663d314cc179acd1b271e23a")
      .send(MOCK_DATA_UPDATED_ARTICLE)
      .set("x-access-token", token)
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_DATA_UPDATED_ARTICLE.title);
  })

  test("[Article] Delete Article", async () => {
    const res = await request(app)
      .delete("/api/articles/663d314cc179acd1b271e23a")
      .set("x-access-token", token)
    expect(res.status).toBe(204);
  });
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });
