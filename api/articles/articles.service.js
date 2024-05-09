const Article = require("./articles.schema");

class ArticleService {
  get(id) {
    return User.findById(id);
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  create(data) {
    const article = new Article(data);
    return article.save();
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
}

module.exports = new ArticleService();
