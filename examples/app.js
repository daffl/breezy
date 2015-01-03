var express = require('express');
var app = express();
var breezy = require('../lib/breezy');

var publicFolder = __dirname + '/todomvc';
// Load the shared view model
var ViewModel = require('./todomvc/js/view-model');
var todos = [];
// Create a new ViewModel
var viewModel = ViewModel.create(todos);
// Create some Todos
for(var i = 0; i < 10; i++) {
  todos.push({
    text: 'Node Todo #' + i,
    complete: Math.random() <.5
  });
}

viewModel.isServer = true;

app.engine('html', breezy.renderFile);
app.set('view engine', 'html');
app.set('views', publicFolder);
// Render the different selections on the server
app.get('/:selection', function(req, res) {
  viewModel.setSelection(req.params.selection);
  res.render('index', viewModel)
});
app.use(express.static(publicFolder));
app.use('/dist', express.static(__dirname + '/../dist'));

app.listen(3000);
