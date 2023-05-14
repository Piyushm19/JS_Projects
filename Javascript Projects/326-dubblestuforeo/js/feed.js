import * as guzzzleAPI from './guzzzle-api.js'

const this_user = await guzzzleAPI.currentUser();
renderFeed(await guzzzleAPI.getFeed(), "feed");

export async function renderFeed(post_objects, element) {
    let feed = document.getElementById(element);
    if (feed == null) return;
    if (feed != null) {
        feed.innerHTML = "";
    }
    if (post_objects.length === 0) {
        feed.innerHTML = 
        "<img class =\"empty-feed-img\" src=\"https://atlas-content-cdn.pixelsquid.com/stock-images/empty-beer-mug-glass-oJvMKWB-600.jpg\">" +
        "<h2 style=\'text-align: center\'>Your feed or search has no posts. Search some guides and follow your friends!</h2>";
    }
    for (const post_object of post_objects) {
            //get the user that posted it
            let posting_user = await guzzzleAPI.readUser(post_object.uid);

            // containing post div
            let post = createElement("div");
            addClasses(post, ["container-fluid", "post"]);
        
            //first row in container
            let row_1 = createElement("div");
            addClasses(row_1, ["row"]);
        
            //create user button
            let user_bar = createElement("a");
            user_bar.addEventListener('click', event => {
                window.localStorage.setItem("user-info", JSON.stringify({
                    uid: post_object.uid
                }));
            });
            addClasses(user_bar, ["col-12", "col-sm-10", "btn", "post-options-button", "post-options-profile"]);
            user_bar.href = "../guzzzler"; //FIX THIS
            let user_pfp = createElement("img");
            //set pfp from posting_user
            user_pfp.src = posting_user.profileImage;
            addClasses(user_pfp, ["rounded-circle", "user-pfp"]);
            let user_name = createElement("span");
            addClasses(user_name, ["button-label"]);
            //set username as uid of poster
            user_name.innerText = posting_user.uid;
            appendChildren(user_bar, [user_pfp, user_name]);
        
            //create follow button
            let follow_bar = createElement("a");
            addClasses(follow_bar, ["col", "btn", "post-options-button", "post-options-follow"]);
            let follow_icon = createElement("i");
            follow_icon.id = "follow-icon";
            let follow_text = createElement("span");
            addClasses(follow_text, ["button-label"]);
            if (this_user != null && this_user.following.includes(post_object.uid)) {
                addClasses(follow_icon, ["bi-person-check-fill", "icon"]);
                follow_text.innerText = "Following";
            }
            else {
                addClasses(follow_icon, ["bi-person-plus", "icon"]);
                follow_text.innerText = "Follow";
            }
            //add event listener for following from feed
            follow_bar.addEventListener("click", async function(event) {
                if (this_user === null) {
                    window.location.href = "../guzzzlegate";
                }
                else if (follow_icon.classList.contains("bi-person-plus")) {
                    follow_icon.classList.remove("bi-person-plus");
                    addClasses(follow_icon, ["bi-person-check-fill"]);
                    //follow user
                    follow_text.innerText = "Following";
                    await guzzzleAPI.followUser(this_user.uid, posting_user.uid);
                }
                else {
                    follow_icon.classList.remove("bi-person-check-fill");
                    addClasses(follow_icon, ["bi-person-plus"]);
                    //unfollow user
                    follow_text.innerText = "Follow";
                    await guzzzleAPI.unfollowUser(this_user.uid, posting_user.uid);
                }
                event.preventDefault();
            });
            appendChildren(follow_bar, [follow_icon, follow_text]);
        
            //add to row_1
            appendChildren(row_1, [user_bar, follow_bar]);
        
            //second row in container
            let row_2 = createElement("div");
            addClasses(row_2, ["row", "post-info"]);
            //create title/date
            let post_title = createElement("div");
            addClasses(post_title, ["post-info-title"]);
            //set post title from post object
            post_title.innerText = post_object.title;
            let post_date = createElement("div");
            addClasses(post_date, ["post-info-date"]);
            //set post date from post object
            post_date.innerText = "Posted: " + post_object.date;
        
            //add to row_2
            appendChildren(row_2, [post_title, post_date]);
        
            //create thrid row
            let row_3 = createElement("div");
            addClasses(row_3, ["row"]);
            let post_img = createElement("img");
            addClasses(post_img, ["post-image"]);
            //set post image to post object image
            post_img.src = post_object.image;
        
            //add ro row_3
            appendChildren(row_3, [post_img]);
        
            //create fourth row
            let row_4 = createElement("div");
            addClasses(row_4, ["row", "post-body-description"]);
            row_4.innerText = post_object.description;
        
            //create last row
            let row_5 = createElement("div");
            addClasses(row_5, ["row"]);
            
            //create view guide button
            let view_guide = createElement("a");
            //add event listener to use local storage on click
            //so when guide is viewed, know where from
            view_guide.addEventListener('click', event => {
                window.localStorage.setItem("guide-info", JSON.stringify({
                    uid: post_object.uid,
                    pid: post_object.pid
                }));
            });
            view_guide.href = "../guzzzleguide";
            addClasses(view_guide, ["col-sm-8", "col-12", "btn", "post-options-button", "post-options-view"]);
            let view_icon = createElement("i");
            addClasses(view_icon, ["bi-cup-straw", "icon"]);
            let view_text = createElement("span");
            addClasses(view_text, ["button-label"]);
            view_text.innerText = "View Guide";
            appendChildren(view_guide, [view_icon, view_text]);
        
            //create like guide button
            let like_guide = createElement("a");
            addClasses(like_guide, ["col", "btn", "post-options-button", "post-options-like"]);
            let like_icon = createElement("i");
            if (this_user != null && this_user.likes.includes(post_object.pid)) {
                addClasses(like_icon, ["bi-balloon-heart-fill", "icon"]);
            }
            else {
                addClasses(like_icon, ["bi-balloon-heart", "icon"]);
            }
            let like_text = createElement("span");
            addClasses(like_text, ["button-label"]);
            like_text.innerText = "Likes: " + post_object.likes;
            like_guide.addEventListener("click", async function(event) {
                if (this_user === null) {
                    window.location.href = "../guzzzlegate";
                }
                else if (like_icon.classList.contains("bi-balloon-heart")) {
                    like_icon.classList.remove("bi-balloon-heart");
                    addClasses(like_icon, ["bi-balloon-heart-fill"]);
                    //like post
                    let updated_post_object = await guzzzleAPI.likePost(post_object.pid);
                    like_text.innerText = "Likes: " + updated_post_object.likes;
                }
                else {
                    like_icon.classList.remove("bi-balloon-heart-fill")
                    //unlike post
                    addClasses(like_icon, ["bi-balloon-heart"]);
                    let updated_post_object = await guzzzleAPI.unlikePost(post_object.pid);
                    like_text.innerText = "Likes: " + updated_post_object.likes;
                }
            });
            appendChildren(like_guide, [like_icon, like_text]);
        
            //create like guide button
            let comment_guide = createElement("a");
            comment_guide.addEventListener('click', event => {
                window.localStorage.setItem("guide-info", JSON.stringify({
                    uid: post_object.uid,
                    pid: post_object.pid
                }));
            });
            comment_guide.href="../guzzzleguide";
            addClasses(comment_guide, ["col", "btn", "post-options-button", "post-options-comment"]);
            let comment_icon = createElement("i");
            addClasses(comment_icon, ["bi-chat", "icon"]);
            let comment_text = createElement("span");
            addClasses(comment_text, ["button-label"]);
            comment_text.innerText = "Comments: " + Object.keys(post_object.comments).length;
            appendChildren(comment_guide, [comment_icon, comment_text]);
        
            appendChildren(row_5, [like_guide, comment_guide, view_guide]);
        
            //place all rows in container
            appendChildren(post, [row_1, row_5, row_2, row_3, row_4]);
            //add this post to feed
            if (feed != null) {
                feed.appendChild(post);
            }
    }
}

const appendChildren = function (element, children) {
    children.forEach(child => {
        element.appendChild(child);
    });
};

const addClasses = function (element, classlist) {
    classlist.forEach(class_name => {
        element.classList.add(class_name);
    });
};

const createElement = function (element_name) {
    return document.createElement(element_name);
};