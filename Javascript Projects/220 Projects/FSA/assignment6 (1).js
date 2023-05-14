class FSA {
  constructor() {
    let currentState = undefined;
    let arrayOfStates = [];
    this.nextState = function(s) { // fluent method so should return this;
      if(currentState === undefined){
        return this;
      } else {
        let filterState = arrayOfStates.filter(x => x.getName() === currentState.nextState(s));
        if (filterState.length > 0){
          currentState = filterState[0]; 
        }
      }
      return this;
    }
    this.createState = function(s, transitions) { // fluent method so should return this;
      let newState = new State().setName(s);
      transitions.map(function(x) {return newState.addTransition(Object.keys(x)[0], Object.values(x)[0]);});   
      if (arrayOfStates.length === 0){
        currentState = newState;
        arrayOfStates.push(newState);
      } else {
        arrayOfStates = arrayOfStates.filter(function(x) {return !(x.getName() === s)});
        arrayOfStates.push(newState);
      }
      return this;
    }
    this.getStateDescription = function() {
      return currentState.getName();
    }
    this.createMemento = function() {
      return new Memento().storeState(currentState);
    }
    this.restoreMemento = function(m) {
      if(m.getState() === undefined) { 
        return this; 
      }
      currentState = m.getState();
      return this;
    }
    class State {
      constructor() {
        let name = "";
        let transitions = [];
        this.getName = function() { return name; }       
        this.nextState = function(s) {
          let foundMatches = transitions.filter(function(x) { return lib220.getProperty(x, s).found; });
          if (foundMatches.length > 0) {
            return lib220.getProperty(foundMatches[Math.floor(Math.random() * foundMatches.length)], s).value;
          } else {
            return "";
          }
        }
        this.setName = s => {
          name = s;
          return this;
        }
        this.addTransition = function(s1, s2) {
          let emptyObj = {}
          lib220.setProperty(emptyObj, s1, s2);
          transitions.push(emptyObj);
          return this;
        }
      }  
    } // end of state class
    class Memento {
      constructor() {
        let state = undefined;
        this.getState = () => { return state; }
        this.storeState = s => {
          state = s;
          return this;
        }
      }
    } // end of memento class
  } // end of FSA Constructor
} // end of FSA class
test("creating an FSA object", function() {
  let obj = new FSA(); 
  let empt = {}; 
  lib220.setProperty(empt, "from x to y", "y"); 
  obj.createState("y", [{next: "y"}]);
});
test("test nextState starting from 1 ending at 2", function() {
  let obj = new FSA(); 
  let empt = {}; 
  lib220.setProperty(empt, "1", "2"); 
  obj.createState("1", [empt , {next:"2"}]);
  obj.createState("2", [{before:"1"}, {next:"2"}]);
  obj.nextState("next");
  assert(obj.getStateDescription() === "2");  
});


