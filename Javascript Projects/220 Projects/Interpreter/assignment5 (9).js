//interpExpression(state: State, e: Expr): number | boolean
function interpExpression(state, e) {
  if (e.kind === 'number' || e.kind === 'boolean') {
    return e.value;
  } else if (e.kind === 'variable') {
    return (lib220.getProperty(state, e.name)).found ? lib220.getProperty(state, e.name).value : assert(false);
  } else if (e.kind === 'operator') { 
      let v1 = interpExpression(state, e.e1);
      let v2 = interpExpression(state, e.e2);
    // first check to see if v1 and v1 are the same types in order to move onto the operators
      assert(typeof(v1) === typeof(v2));
    // we also need to account for booleans types only matching with || and &&
    // also account for + - * / > < being numbers only not including booleans
    if (e.op === '+') { 
      assert(typeof(v1) === 'number');
      return v1 + v2;
  } else if (e.op === '-') {
      assert(typeof(v1) === 'number');
      return v1 - v2;
  } else if (e.op === '*') {
      assert(typeof(v1) === 'number');  
      return v1 * v2;
  } else if (e.op === '/') {
      assert(typeof(v1) === 'number');  
      return v1 / v2;
  } else if (e.op === '&&') {
      assert(typeof(v1) === 'boolean');  
      return v1 && v2;
  } else if (e.op === '||') {
      assert(typeof(v1) === 'boolean');  
      return v1 || v2;
  } else if (e.op === '>') {
      assert(typeof(v1) === 'number');  
      return v1 > v2;
  } else if (e.op === '<') {
      assert(typeof(v1) === 'number');  
      return v1 < v2;
  } else if (e.op === '===') {
      assert(typeof(v1) === typeof(v2));  
      return v1 === v2;
  } else {
    console.log("operator did not match");
    assert(false);
  }
 } else {
    console.log("e.kind wasn't any of the given expressions");
    assert(false);
 }
}

//interpStatement(state: State, p: Stmt): void
function interpStatement(state, p) {
  if (p.kind === 'let') {
    // if a variable declaration is not found, then you declare it which is what this code does
    let val = interpExpression(state, p.expression);
    return (!lib220.getProperty(state, p.name).found) ? lib220.setProperty(state, p.name, val) : assert(false);
  } else if(p.kind === 'assignment') {
    // if the declaration is found then it's ok but if it's not found, then you must assert false
    let val = interpExpression(state, p.expression);
    return (lib220.getProperty(state, p.name).found) ? lib220.setProperty(state, p.name, val) : assert(false);
  } else if(p.kind === 'if') {
      let value = interpExpression(state, p.test);
      return (value) ? interpBlock(state, p.truePart) : interpBlock(state, p.falsePart);
  } else if(p.kind === 'while') {
      while (interpExpression(state, p.test)) {
        interpBlock(state, p.body);
      }
  } else if(p.kind === 'print') {
      let val = interpExpression(state, p.expression);
      console.log(val);
  } else {
    console.log("was not any of the given statements");
    assert(false);
  }
}

//interpBlock(state, b): void
function interpBlock(state, b) {
  for(let i = 0; i < b.length; ++i) {
    interpStatement(state, b[i]);
  }
}

//interpProgram(p: Stmt[]): State
function interpProgram(p) {
  let state = {};
  interpBlock(state, p);
  return state;
}

//type State = { [key: string]: number | boolean };
let program =
"let x = 3; " +
"let y = 0; " +
"if (x < 0) { " +
" y = -1; " +
"} else { " +
" y = 1; " +
"}";
let p = parser.parseProgram(program);
console.log(p);

test("addition with a variable", function() {
 let r = interpExpression({x: 10}, parser.parseExpression("x + 2").value);
 assert(r === 12);
});
test("subtraction with a variable", function() {
 let r = interpExpression({x: 10}, parser.parseExpression("x - 2").value);
 assert(r === 8);
});
test("multiplication with a variable", function() {
 let r = interpExpression({x: 10}, parser.parseExpression("x * 2").value);
 assert(r === 20);
});
test("division with a variable", function() {
 let r = interpExpression({x: 10}, parser.parseExpression("x / 2").value);
 assert(r === 5);
});
test("and with a variable", function() {
 let r = interpExpression({x: true}, parser.parseExpression("x && true").value);
 assert(r === true);
});
test("and2 with a variable", function() {
 let r = interpExpression({x: false}, parser.parseExpression("x && false").value);
 assert(r === false);
});
test("greater than with a variable", function() {
 let r = interpExpression({x: 10}, parser.parseExpression("x > 2").value);
 assert(r);
});
test("less than with a variable", function() {
 let r = interpExpression({x: 10}, parser.parseExpression("x < 20").value);
 assert(r);
});
test("=== with a variable", function() {
 let r = interpExpression({x: 2}, parser.parseExpression("x === 2").value);
 assert(r);
});
test("assignment", function() {
 let st = interpProgram(parser.parseProgram("let x = 10; x = 20;").value);
 assert(st.x === 20);
});

