var models = require('../models/models.js');




//GET /statistics
exports.index = function(req, res, next){
  res.locals.isStatistics=true;
  var statistics ={};
  models.Quiz.count()
    .then(function(result) {
          statistics.nQuestions = result;
          return models.Comment.count();
        })
    .then(function(result){
          statistics.nComments=result;
          return models.Comment.aggregate('QuizId','count',{distinct:true});
        })
    .then(function(result){
          statistics.nQuizWithComments=result;
          statistics.nAverageCommentsByQuestions=(statistics.nComments/statistics.nQuestions).toFixed(2);
          res.render('statistics/index', {statistics:statistics, errors: []});
        })
    .catch(function(error) {next(error);});
};

 models.Comment.count({
        group: ['QuizId']
    })
