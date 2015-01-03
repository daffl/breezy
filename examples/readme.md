# Breezy examples

This folder contains the Breezy [TodoMVC](http://todomvc.com) example for both, the browser and Node with Express.
To run them install Express and the TodoMVC common dependencies. In this folder (`/examples`) run:

> npm install express
> cd todomvc
> bower install
> cd ..

You can run the Express application with

> node app.js

Then visit [http://localhost:3000/](http://localhost:3000/) to see the client side TodoMVC application with the full functionality.
At [http://localhost:3000/all](http://localhost:3000/all) the same template will be rendered but in Node generating
some random Todos. Currently the server side example can only filter Todos
([http://localhost:3000/active](http://localhost:3000/active), [http://localhost:3000/complete](http://localhost:3000/complete))
but it should demonstrate how to use the shared view-model.

The application logic used on both sides is in `/todomvc/js/view-model.js`. The file either exposes `window.ViewModel`
on the Browser or exports the module for Node.
