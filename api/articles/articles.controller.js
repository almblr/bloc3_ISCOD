const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticleController {
  async create(req, res, next) {
    try {
      const userId = req.user._id;
      const article = await articlesService.create({ ...req.body, user: userId });
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      if(req.user.role !== "admin") throw new UnauthorizedError();
      const id = req.params.id;
      const data = req.body;
      const articleModified = await articlesService.update(id, data);
      res.status(200).json(articleModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if(req.user.role !== "admin") throw new UnauthorizedError();
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticleController();
