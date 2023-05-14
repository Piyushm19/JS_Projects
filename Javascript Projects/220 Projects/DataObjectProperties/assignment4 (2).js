let data =
 lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');

class FluentRestaurants {
//getProperty(obj: Object, memberStr: string): { found: true, value: any } | { found: false }
  constructor(jsonData) {
    this.data = jsonData;
  }

//fromState(stateStr: string): FluentRestaurants
  fromState(stateStr) {
    let check = this.data.filter(function(x) {
      return(lib220.getProperty(x, "state").found && lib220.getProperty(x, "state").value === stateStr);
    });
    return new FluentRestaurants(check);
  }

//ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating) {
    let check = this.data.filter(function(x) {
      return(lib220.getProperty(x, "stars").found && lib220.getProperty(x, "stars").value <= rating);
    });
    return new FluentRestaurants(check);
  }

//ratingGeq(rating: number): FluentRestaurants
  ratingGeq(rating) {
    let check = this.data.filter(function(x) {
      return(lib220.getProperty(x, "stars").found && lib220.getProperty(x, "stars").value >= rating);
    });
    return new FluentRestaurants(check);
  }

//category(categoryStr: string): FluentRestaurants
  category(categoryStr) {
    let check = this.data.filter(function(x) {
      return(lib220.getProperty(x, "categories").found && lib220.getProperty(x, "categories").value.includes(categoryStr));
    });
    return new FluentRestaurants(check);
  }

//hasAmbience(ambienceStr: string): FluentRestaurants
  hasAmbience(ambienceStr) {
    let check = this.data.filter(function(x) {
      if(lib220.getProperty(x, "attributes").found) {
        if(lib220.getProperty(x.attributes, "Ambience").found) {
          if(lib220.getProperty(x.attributes.Ambience, ambienceStr).found) {
            return(lib220.getProperty(x.attributes.Ambience, ambienceStr).value);
          }
        }
      }  
      return false;
    });
    return new FluentRestaurants(check);
  }

//bestPlace(): Restaurant | {}
  bestPlace() {
    //First check to see if there are any ratings
    let ratings = this.data.filter(function(x) {return lib220.getProperty(x, "stars").found;});
    let highestRated = ratings.reduce(function(acc, e) {return Math.max(e.stars, acc);}, 0);
    //filter through the ratings to find the highest rated restaurant
    ratings = ratings.filter(function(x) { return lib220.getProperty(x,"stars").value === highestRated;});
    //now return an empty object if there are no ratings
    function checkRating() {return (ratings.length === 0) ? {} : ratings[0];}
    if (ratings.length < 2) {return checkRating();}
  // ---------------------------------------
    let reviews = ratings.filter(function(x) {return lib220.getProperty(x,"review_count").found;});
    let highestReview = ratings.reduce(function(acc, e) {return Math.max(e.review_count, acc);}, 0);
    //filter through the reviews to find the highest reviewed restaurant when there's a tie in ratings
    reviews = reviews.filter(function(x) { return lib220.getProperty(x,"review_count").value === highestReview;});   
    function checkReview() {return (reviews.length === 0 || reviews.length !== 0) ? reviews[0] : reviews[0];}
    return checkReview();
  }

  
//mostReviews(): Restaurant | {}
  mostReviews() {
    //First check to see there a restaurant has been reviewed
    let reviews = this.data.filter(function(x) {return lib220.getProperty(x, "review_count").found;});
    let highestReview = reviews.reduce(function(acc, e) {return Math.max(e.review_count, acc);}, 0);
    //check to see if the highest reviewed one is found
    reviews = reviews.filter(function(x) { return lib220.getProperty(x,"review_count" ).value === highestReview;});
    //return an empty object if there are no reviews
    function checkReview() {return (reviews.length === 0) ? {} : reviews[0];}
    if (reviews.length < 2) {return checkReview();}
  // ---------------------------------------
  //First check to see if there are any ratings
    let ratings = reviews.filter(function(x) {return lib220.getProperty(x, "stars").found;});
    let highestRated = reviews.reduce(function(acc, e) {return Math.max(e.stars, acc);}, 0);
    //filter through the ratings to find the highest rated restaurant
    ratings = ratings.filter(function(x) { return lib220.getProperty(x, "stars").value === highestRated;});  
    //find the highest rated restaurant if there's a trie in reviews 
    function checkRating() {return (ratings.length === 0 || ratings.length !== 0) ? ratings[0] : ratings[0];}
    return checkRating();
  }
}

const testData = [
{
 name: "Applebee's",
 state: "NC",
 stars: 2,
 review_count: 6,
 },
 {
 name: "China Garden",
 state: "NC",
 stars: 2,
 review_count: 10,
 },
 {
 name: "Beach Ventures Roofing",
 state: "AZ",
 stars: 4,
 review_count: 30,
 },
 {
 name: "Alpaul Automobile Wash",
 state: "NC",
 stars: 4,
 review_count: 30,
 }
]
test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
});
test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'Alpaul Automobile Wash');
});
test('ratingLeq1 filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.ratingLeq(4).data;
  assert(list.length === 4);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Beach Ventures Roofing");
  assert(list[3].name === "Alpaul Automobile Wash"); 
});
test('ratingLeq2 filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.ratingLeq(2).data;
  assert(list.length === 2);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
});
test('ratingGeq1 filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.ratingGeq(4).data;
  assert(list.length === 2);
  assert(list[0].name === "Beach Ventures Roofing");
  assert(list[1].name === "Alpaul Automobile Wash");
});
test('ratingGeq2 filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.ratingGeq(2).data;
  assert(list.length === 4);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Beach Ventures Roofing");
  assert(list[3].name === "Alpaul Automobile Wash"); 
});