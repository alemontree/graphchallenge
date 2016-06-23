const Promise = require('bluebird');
const readFile = Promise.promisify(require("fs").readFile);

class Graph {
  constructor() {
    this.container = {};
  }
};

Graph.prototype.add = function (x, y) {
  if (!this.container[x]) {
    this.container[x] = [y];
  }
  else {
    this.container[x].push(y)
  }

  if (!this.container[y]) {
    this.container[y] = [x];
  }
 else {
    this.container[y].push(x)
  }
};

Graph.prototype.remove = function (x, y) {
  if (this.container[x]) {
    var index = this.container[x].indexOf(y);
  }
  else {
    console.log(`link between ${x} and ${y} does not exist, remove failed`);
    return;
  }
  if(index != -1)
    this.container[x].splice(index, 1);

  if (this.container[y]) {
    var index = this.container[y].indexOf(x);
  }
  else {
    console.log('link does not exist');
    return;
  }
  if(index != -1)
    this.container[y].splice(index, 1);
};



Graph.prototype.isLinked = function (x, y) {
  let self = this; // to preserve context for graph container

  let findLink = function(x, y) {
    // basic breadth first search through the graph, with linear complexity
    let toDo = [];
    let done = [];
    toDo.push(x);
    let current = x;
    let safetyCounter = 0;
    while(toDo.length > 0) {
      if (safetyCounter > 200) return false; // just to be sure it doesn't hang
      safetyCounter++;
      current = toDo.shift();

      done.push(current);
      console.log(self.container[current].length)
      for(let i=0; i<self.container[current].length; i++) {

        if (self.container[current][i] === y) {
          return true;
        }
        if (done.indexOf(self.container[current][i]) === -1) {
          toDo.push(self.container[current][i]);
        }
      }
    }
    return false;
  };

  if (x === y) {
    return true;
  }
  if (typeof this.container[x] === 'undefined' || typeof this.container[y] === 'undefined') {
    return false;
  }
  if (this.container[x].indexOf(y) !== -1 && this.container[y].indexOf(x) !== -1) {
    return true;
  }
  return findLink(x, y); // inner function that finds if there is a link between distant nodes
  return false;
}


let delegator = function (command, graph) {
  let vertices = command.match(/\d+/g).map((x) => {
    return parseInt(x, 10);
  });

  switch(true) {
    case (command.includes('add', 0)):
      graph.add(...vertices);
      break;
    case(command.includes('remove', 0)):
      graph.remove(...vertices);
      break;
    case(command.includes('is linked', 0)):
      console.log(graph.isLinked(...vertices));
      break;
    default:
      console.log(command);
      console.log("unrecognized command: default option");
  }
}

readFile(__dirname+'/input.txt', "utf8").then((contents) => {
  const re =  /^(add|is linked|remove).*/g;
  let commands = contents
                  .toString()
                  .split('\n')
                  .filter((line) => {
                        if(line.match(re)) return line; })
                  .map((x) => x.trim());

  // console.log("commands are: \n", commands);
  let graph = new Graph;
  for (let i=0, length=commands.length; i<length; i++) {
    delegator(commands[i], graph);
  }
},
(err) => {
  console.error(err);
});
