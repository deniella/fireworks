let tbInput = document.getElementById("tbInput").value;
let btnEnter = document.getElementById("btnEnter");

btnEnter.onclick = function(){
  let input = document.getElementById("tbInput").value; //input that will be changed to postfix and calculated
  let converted = convert(input);
  sortArray(converted);
  document.getElementById('output2').innerHTML = 'Postfix notation: ' + print(outputQueue);
  calculatePostFix();
  document.getElementById('output7').innerHTML = 'Result: ' + resultStack.pop();
  console.log(resultStack);
}

// Enables pressing enter in text box to do btnEnter
document.querySelector('#tbInput').addEventListener("keyup", event => {
    if(event.key !== "Enter") return; // Use `.key` instead.
    document.querySelector('#btnEnter').click(); // Things you want to do.
    event.preventDefault(); // No need to `return false;`.
});

//make node
function node(_content) {
  this.content = _content;
  this.last = null;
  this.next = null;
}

//make stack
function stack() {
  this.bottom = null;
  this.top = null;
  this.push = function(_content){ //puts new node at end
    if (this.bottom == null) { // no nodes
      this.bottom = new node(_content);
      this.top = this.bottom;
    }
    else{ // 1 or more nodes
      let nodeHold = new node(_content);
      nodeHold.last = this.top;
      this.top.next = nodeHold;
      this.top = nodeHold;
    }
  }
  this.pop = function() { //takes node at end and returns its content
    if (this.bottom == null) { // no nodes
      console.log("nothing in stack!");
      return null;
    }
    if (this.top == this.bottom) { // one node
      let nodeHold = this.bottom;
      this.top = null;
      this.bottom = null;
      return nodeHold.content;
    }
    let nodeHold = this.top; // more than 1 node
    this.top = this.top.last;
    this.top.next = null;
    return nodeHold.content;
  }
  this.peek = function() { // returns node on top and its content
    if(this.top == null) {return null}
    return this.top.content;
  }
}

//make queue
function queue (){
  this.bottom = null;
  this.top = null;
  this.enqueue = function(_content){ //puts new node at end
    if (this.bottom == null) { // no nodes
      this.bottom = new node(_content);
      this.top = this.bottom;
    }
    else{ // 1 or more nodes
      let nodeHold = new node(_content);
      nodeHold.last = this.top;
      this.top.next = nodeHold;
      this.top = nodeHold;
    }
  }
  this.dequeue = function(){ //removes node at beginning and returns its content
    if (this.bottom == null) { // no nodes
      console.log("nothing in queue!");
      return null;
    }
    if(this.top == this.bottom){ // 1 node
      let nodeHold = this.bottom;
      this.top = null;
      this.bottom = null;
      return nodeHold.content;
    }
    let nodeHold = this.bottom; //more than 1 node
    this.bottom = this.bottom.next;
    this.bottom.last = null;
    return nodeHold.content;
  }
  this.peek = function() { // returns node on bottom and its content
    if(this.bottom == null) {return null}
    return this.bottom.content;
  }
}

//prints stack
function print(_stack) {
  if (_stack.bottom == null) { //if stack is empty
    //console.log("nothing to print");
    return null
  }
  let strOutput = ""; //temp holds output into string
  let currentNode = _stack.bottom;
  while (currentNode != null) { //loops through stack or queue
    console.log(currentNode.content);
    strOutput += currentNode.content + ","; //saves content of node into temp hold
    currentNode = currentNode.next;
  }
  return strOutput;
}

//fix these
//add
function add(_stack) {
  let num2 = _stack.pop();
  let num1 = _stack.pop();
  let output = _stack.push(num1 + num2);
  console.log(num1 + " + " + num2 + " = " + (num1 + num2))
}

//subtract
function subtract(_stack) {
  let num2 = _stack.pop();
  let num1 = _stack.pop();
  let output = _stack.push(num1 - num2);
  console.log(num1 + " - " + num2 + " = " + (num1 - num2))
}

//multiply
function multiply(_stack) {
  let num2 = _stack.pop();
  let num1 = _stack.pop();
  let output = _stack.push(num1 * num2);
  console.log(num1 + " * " + num2 + " = " + (num1 * num2))
}

//divide
function divide(_stack) {
  let num2 = _stack.pop();
  let num1 = _stack.pop();
  let output = _stack.push(num1 / num2);
  console.log(num1 + " / " + num2 + " = " + (num1 / num2))
}

var outputQueue = new queue(); //queue where post fix notation will go into

var opStack = new stack(); //stack for all the operators

function convert(_input){ // go through string array input and remove all spaces, accounts for double digits and parentheses
  let numHold = ""; //temp holder for numbers
  let strArray = []; //new array
  for (let i of _input){
    if (i == " ") {continue} //if space skip
    if (!(isNaN (parseInt(i)))){ //if a number
      numHold += i; //hold character into numhold
    }
    if(isNaN(parseInt(i))){ //if not a number 
      if(numHold != ""){ //push what's in numHold if it's not empty into new array
        strArray.push(numHold);
        numHold = ""; // reset numhold
      }
      strArray.push(i); //push i into new array
    }
  }
  strArray.push(numHold); //push any remaining number into new array
  console.log(strArray);
  return strArray;
}

function sortArray(_strArray){ //sorts string array of input into either outputqueue or opstack then queues all of opstack into outputqueue
  for(let i of _strArray){
    let parsed = parseInt(i, 10);
    if(!isNaN(parsed)) outputQueue.enqueue(parsed); //if it's a number queue into outputQueue
    let operators = {
      "+" : {
        precedence : 2
      },
      "-" : {
        precedence : 2
      },
      "*" : {
        precedence : 3
      },
      "/" : {
        precedence : 3
      }
    }
    if("+-*/".indexOf(i) != -1){ // if it's an operator
      if(opStack.peek() != null){ // check if operator on top of stack is not empty
        while( opStack.peek() != "(" && opStack.peek() != null && operators[opStack.peek()].precedence >= operators[i].precedence){ //if op on top of stack is not empty or left facing ( and op on top has higher precedence
          outputQueue.enqueue(opStack.pop()); //queue top of opstack
            console.log(opStack);
        }
      }
      opStack.push(i); //if there is nothing on top of op stack push
    }
    
    if (i == "("){ //if it's a left parenethesis push into opstack
      opStack.push(i);
    }
    if (i == ")"){ //if it's a right parenthesis
      while(opStack.peek() != "("){ //while the top is not left parenthesis
        outputQueue.enqueue(opStack.pop()); //queue top of op stack
      }
      if ( opStack.peek() == "("){ //when top of opstack is left parenthesis
        opStack.pop(); //discard left parenthesis
      }
    }
  }
  if (opStack.peek() != null){ //after loop, if opstack is not empty
    while (opStack.peek() != null) { //loop through opStack 
      outputQueue.enqueue(opStack.pop()); //queue remaining
    }
  }
}

//calculate postfix expression
let resultStack = new stack();

function calculatePostFix(){ // 
  //loop through output queue by dequeueing
  while(outputQueue.peek() != null){ //if there is something in the output queue
    let currentNode = outputQueue.dequeue(); //hold current node
    //push any numbers into result stack
    if(!isNaN(currentNode)){
      resultStack.push(currentNode);
      console.log("aaaa");
    }
      switch(currentNode){
      case "+":
      add(resultStack);
      break;
      case "-":
      subtract(resultStack);
      break;
      case "*":
      multiply(resultStack);
      break;
      case "/":
      divide(resultStack);
      break;
      default:
      console.log("unknown operator")
    }
  }
}



/*let input = "10 / 2";
  console.log("outsideinput" + input)
  let converted = convert(input);
  console.log("converted " + converted)
  sortArray(converted);

  calculatePostFix();
*/

//document.getElementById('output2').innerHTML = 'outputQueue ' + print(outputQueue);
//document.getElementById('output3').innerHTML = 'opstack ' + print(opStack);
//document.getElementById('output5').innerHTML = 'result stack ' + print(resultStack);


/*let operators = { //extra examples for testing how to use object properties
      "+" : {
        precedence : 2
      },
      "-" : {
        precedence : 2
      },
      "*" : {
        precedence : 3
      },
      "/" : {
        precedence : 3
      }
    }
    console.log("+*-/".indexOf("a")) //search if a is part of string, it will be -1 if it is not there or the index if it is; good for finding operators
    console.log(operators["+"].precedence) //object example  //2

let stacko = new stack();

stacko.push(1);
stacko.push(2);
stacko.push(3);
stacko.push(4);

stacko.pop();
stacko.pop();
stacko.pop();
stacko.pop();

console.log(stacko);

let queueo = new queue();

queueo.enqueue(1);
queueo.enqueue(2);
queueo.enqueue(4);
queueo.enqueue(6);

queueo.dequeue();
queueo.dequeue();
queueo.dequeue();
queueo.dequeue();
queueo.dequeue();

console.log(queueo);

document.getElementById('output1').innerHTML = 'Push some nodes ' + print(stacko);
document.getElementById('output4').innerHTML = 'queueo ' + print(queueo);
*/