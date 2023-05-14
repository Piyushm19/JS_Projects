import * as feed from './feed.js';
import * as guzzzleAPI from './guzzzle-api.js';

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
    
let userProfile = document.getElementById('user_profile');
userProfile.style.display = "flex";
userProfile.style.marginBottom = "5%";

const cookie_uid = JSON.parse(window.localStorage.getItem("user-info"));
let obj = await guzzzleAPI.readUser(cookie_uid.uid);
const current_user = await guzzzleAPI.currentUser();

let img = createElement('img');
addClasses(img, ["rounded-circle", "profileImg"]);
img.setAttribute("src", obj.profileImage);
img.style.flex = "1";
let name_bio_edit = document.createElement("div");
name_bio_edit.style.flex = "4";
name_bio_edit.style.marginLeft = "5%";

let span1 = createElement('p');
addClasses(span1, ["pfpUserName"]); 
span1.innerText = obj.uid;
let span2 = createElement('p');
addClasses(span2, ["user_Bio"]);
span2.innerText = obj.biography;
appendChildren(name_bio_edit, [span1, span2]);  

if (current_user != null && current_user.uid === cookie_uid.uid) {
    let editButton = createElement('button');
    editButton.innerText = "Profile Settings";
    addClasses(editButton, ["btn", "btn-outline-dark"]);
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#profileoptions");
    let logoutButton = createElement('button');
    logoutButton.innerText = "Logout";
    logoutButton.style.marginLeft = "5%";
    addClasses(logoutButton, ["btn", "btn-outline-danger"]);
    logoutButton.addEventListener('click', async (e) => {
        await guzzzleAPI.logout();
        window.location.href = "../guzzzlin";
    });
    appendChildren(name_bio_edit, [editButton, logoutButton]);
    const deleteButton = document.getElementById("deleteProfileButton");
    deleteButton.addEventListener('click', async (e) => {
        const confirm = window.prompt(`Are you sure you want to delete "${current_user.uid}"? This is permenant. Re-enter your password to continue.`, "Confirm Password");
        if (confirm != null) {
            await guzzzleAPI.deleteUser(confirm);
            await guzzzleAPI.logout();
            window.location.href = "../guzzzlin";
        }
        e.preventDefault();
    });
    const save_changes = document.getElementById("updateProfileButton");
    const oldPW = document.getElementById("old-password");
    const newPW = document.getElementById("new-password");
    const newPWC = document.getElementById("new-password-c");
    const newBio = document.getElementById("new-bio");
    newBio.value = current_user.biography;
    const newPFP = document.getElementById("new-pfp");
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    save_changes.addEventListener('click', async (e) => {
        const files = newPFP.files;
        const img64 = files[0] ? await toBase64(files[0]) : null;
        if (newPW.value === null || newPW.value === "") {
            if (img64 === null) {
                const res = await guzzzleAPI.updateUser(oldPW.value, oldPW.value, current_user.profileImage, newBio.value);
                if (res.hasOwnProperty("error")) {
                    window.alert(res.error);
                }
                else {
                    window.alert("Profile Succesfully Updated!");
                }
            }
            else {
                const res = await guzzzleAPI.updateUser(oldPW.value, oldPW.value, img64, newBio.value);
                if (res.hasOwnProperty("error")) {
                    window.alert(res.error);
                }
                else {
                    window.alert("Profile Succesfully Updated!");
                }
            }
        }
        else if (newPW.value != newPWC.value) {
            window.alert("New Password does not match.");
        }
        else {
            if (img64 === null) {
                const res = await guzzzleAPI.updateUser(oldPW.value, newPW.value, current_user.profileImage, newBio.value);
                if (res.hasOwnProperty("error")) {
                    window.alert(res.error);
                }
                else {
                    window.alert("Profile Succesfully Updated!");
                }
            }
            else {
                const res = await guzzzleAPI.updateUser(oldPW.value, newPW.value, img64, newBio.value);
                if (res.hasOwnProperty("error")) {
                    window.alert(res.error);
                }
                else {
                    window.alert("Profile Succesfully Updated!");
                }
            }
            
        }
    });
}
appendChildren(userProfile, [img, name_bio_edit]);

const user_feed_pids = obj.posts;
let post_objects = [];
for (let post_pid of user_feed_pids) {
    post_objects.push(await guzzzleAPI.readPost(post_pid));
}
feed.renderFeed(post_objects.reverse(), 'user_feed');