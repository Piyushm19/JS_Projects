import * as guzzzleAPI from './guzzzle-api.js'
import * as feed from './feed.js';

const nav_bar = document.getElementById("navigation");
const navbar_src = "../templates/navbar.html";

const loggedin_user = await guzzzleAPI.currentUser();

const data = [
    {
        "icon": "/images/booze.png",
        "type": "Booze",
        "list": [
            "Brandy",
            "Gin",
            "Rum",
            "Tequlia",
            "Vodka",
            "Whiskey",
            "Bourbon",
            "Scotch",
            "Liqueur",
            "Vermouth",
            "Red Wine",
            "White Wine",
            "Beer",
            "Sake"
        ]
    },
    {
        "icon": "/images/juice.png",
        "type": "Juice",
        "list": [
            "Lemon Juice",
            "Lime Juice",
            "Orange Juice",
            "Pineapple Juice",
            "Cranberry Juice",
            "Tomato Juice",
            "Lemonade",
            "Tonic Water",
            "Seltzer Water",
            "Ginger Beer"
        ]
    },
    {
        "icon": "/images/fruit.png",
        "type": "Fruit",
        "list": [
            "Lemon",
            "Lime",
            "Olive",
            "Orange",
            "Pineapple",
            "Strawberry",
            "Watermelon",
            "Marachino Cherry",
            "Rasberry"
        ]
    },
    {
        "icon": "/images/vegtable.png",
        "type": "Vegetable",
        "list": [
            "Carrot",
            "Celery",
            "Pepper",
            "Cucumber",
            "Pickle"
        ]
    },
    {
        "icon": "/images/garnish.png",
        "type": "Garnish",
        "list": [
            "Mint",
            "Cinnamon",
            "Salt",
            "Sugar",
            "Flowers",
            "Nutmeg",
            "Ginger"
        ]
    }
];

await fetch(navbar_src).then((response) => response.text()).then((html) => {
    nav_bar.innerHTML = html;
    let meat = "";
    data.forEach((entry) => {
        meat = meat + 
        "<li class=\"nav-item\">" +
            "<nav class=\"navbar navbar-light bg-light\">" +
                "<div class=\"container-fluid\">" +
                    "<a class=\"navbar-brand\">" +
                        "<img src=\"" + entry.icon +"\" alt=\"" + entry.type +"\" width=\"30\" height=\"24\" class=\"d-inline-block align-text-top\"> " + entry.type + 
                    "</a>" +
                    "<button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#" + entry.type + "List\" aria-controls=\"navbarToggleExternalContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">" + 
                        "<span class=\"navbar-toggler-icon\"></span>" + 
                    "</button>" + 
                "</div>" +
            "</nav>" + 
            "<div class=\"collapse\" id=\"" + entry.type + "List\">" + 
                "<div class=\"bg-light p-4\"\>"
                entry.list.forEach((ingred) => {
                    meat = meat + 
                    "<div class=\"form-check\">" +
                        "<input id=\"" + ingred +"\" class=\"form-check-input\" type=\"checkbox\" id=\"flexCheckDefault\">" +
                        "<label class=\"form-check-label\" for=\"" + ingred + "\"\>" + ingred + "</label>" +
                    "</div>";
                });
         meat = meat + 
                "</div>" + 
            "</div>" +
        "</li>";
    });
    const ingredientList = document.getElementById("ingredientList");
    ingredientList.innerHTML = ingredientList.innerHTML + meat;

    const user_profile = document.getElementById("user_profile");
    user_profile.addEventListener('click', event => {
        if (!loggedin_user.hasOwnProperty("error")) {
            window.localStorage.setItem("user-info", JSON.stringify({uid: loggedin_user.uid}));
        }
    });
    if (loggedin_user === null) {
        user_profile.innerText = "Login/Signup";
        user_profile.href = "../guzzzlegate";
    }
    else {
        user_profile.href ="../guzzzler";
        let createPost = document.createElement("a");
        createPost.type = "submit";
        createPost.innerText = "Create Post";
        createPost.href = "../guzzzlecreate";
        createPost.classList.add("createPostButton");
        user_profile.appendChild(createPost);
        let pfp_img = document.createElement("img");
        pfp_img.src = loggedin_user.profileImage;
        pfp_img.alt ="user-profile";
        pfp_img.classList = "d-inline-block align-text-top rounded-circle";
        pfp_img.width = "32";
        pfp_img.height = "24";
        user_profile.appendChild(pfp_img);
    }

    data.forEach(entry => {
        entry.list.forEach(ingred => {
            let box = document.getElementById(ingred);
            box.addEventListener("click", event => {
                if (box.hasAttribute("checked")) {
                    box.removeAttribute("checked");
                }
                else {
                    box.setAttribute("checked", "");
                }
            });
        });
    });

    const ingredientQuerySubmit = document.getElementById("ingredientQuerySubmit");
    ingredientQuerySubmit.addEventListener("click", async function (event){
        let formInfo = [];
        data.forEach((entry) => {
            entry.list.forEach((ingred) => {
                let test = document.getElementById(ingred);
                if (test.hasAttribute("checked")) {
                    formInfo.push(test.id.replace(" ", "_"));
                }
            });
        });
        const posts = await guzzzleAPI.queryPosts(formInfo);
        feed.renderFeed(posts, "results");
        event.preventDefault();
    });

    const searchBox = document.getElementById("searchBox");
    const serachBoxSubmit = document.getElementById("serachBoxSubmit");
    serachBoxSubmit.addEventListener("click", async function (event){
        event.preventDefault();
        const result = await guzzzleAPI.readUser(searchBox.value);
        if (result.hasOwnProperty("error")) {
            window.alert(result.error);
        }
        else {
            window.localStorage.setItem("user-info", JSON.stringify({uid: searchBox.value}));
            window.location.href = "../guzzzler";
        }
    });
});
