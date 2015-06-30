var models = require('../models/models.js');





//GET /statistics
exports.index = function(req, res, next){
  var statistics ={};
  models.Quiz.count()
    .then(function(c) {
          statistics.nQuestions = c;
          models.Comment.count()
          .then(function(c){
                statistics.nComments=c;
                res.render('statistics/index', {statistics:statistics, errors: []});
          })
          .catch(function(error) {next(error);});
    })
    .catch(function(error) {next(error);});
};
