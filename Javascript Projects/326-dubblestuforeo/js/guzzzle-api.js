export async function currentUser() {
    try {
        const response = await fetch(`/currentuser`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function login(uid, password) {
    try {
        const response = await fetch(`/login?uid=${uid}&password=${password}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
  }

export async function logout() {
    try {
        const response = await fetch(`/logout`, {
            method: 'GET'
        });
        await response;
    }
    catch(err) {
        console.log(err);
    }
}

export async function createUser(uid, email, password, pfp) {
    try {
        const response = await fetch(`/user_create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: uid, password: password, email: email, pfp: pfp})
        });
        const data = await response.json();
        return login(data.uid, data.password);
    }
    catch(err) {
        console.log(err);
    }
  }
  
export async function readUser(uid) {
    try {
        const response = await fetch(`/user?uid=${uid}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}
  
export async function updateUser(password, newPassword, newProfileImage, newBiography) {
    try {
        const response = await fetch(`/user_update`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password: password, newPassword: newPassword, profileImage: newProfileImage, biography: newBiography})
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}
  
export async function deleteUser(password) {
    try {
        const response = await fetch(`/user_delete?password=${password}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        if (data.hasOwnProperty("error")) {
            window.alert(data.error);
        }
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function createPost(title, image, ingredient_keys, ingredients, instructions, description) {
    try {
        const response = await fetch(`/post_create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, image: image, ingredient_keys: ingredient_keys, ingredients: ingredients, description: description, instructions: instructions})
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function readPost(pid) {
    try {
        const response = await fetch(`/post?pid=${pid}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}

export async function readOtherPosts(pid) {
    try {
        const response = await fetch(`/otherposts?pid=${pid}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',}
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}

export async function updatePost(pid, newTitle, newImage, newIngredient_keys, newIngredients, newInstructions, newDescription) {
    try {
        const response = await fetch(`/post_update`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({pid: pid, title: newTitle, image: newImage, ingredient_keys: newIngredient_keys, ingredients: newIngredients, description: newDescription, instructions: newInstructions})
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}
  
export async function deletePost(pid) {
    try {
        const response = await fetch(`/post_delete?pid=${pid}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        if (data.hasOwnProperty("error")) {
            window.alert(data.error);
        }
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function likePost(pid) {
    try {
        const response = await fetch(`/like?pid=${pid}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function unlikePost(pid) {
    try {
        const response = await fetch(`/unlike?pid=${pid}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json' },
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function followUser(uid_to, uid_from) {
    try {
        const response = await fetch(`/follow?uid_to=${uid_to}&uid_from=${uid_from}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function unfollowUser(uid_to, uid_from) {
    try {
        const response = await fetch(`/unfollow?uid_to=${uid_to}&uid_from=${uid_from}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function commentPost(pid, comment) {
    try {
        const response = await fetch(`/comment?pid=${pid}&comment=${comment}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({comment: comment})
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}

export async function getComments(pid) {
    try {
        const response = await fetch(`/comments_get?pid=${pid}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}

export async function getComment(pid, cid) {
    try {
        const response = await fetch(`/comment_get?pid=${pid}&cid=${cid}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}

export async function commentDelete(pid, cid) {
    try {
        const response = await fetch(`/comment_delete?pid=${pid}&cid=${cid}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
    } 
    catch (err) {
        console.log(err);
    }
}

export async function checkCommentLike(pid, cid) {
    try {
        const response = await fetch(`/comment_check?pid=${pid}&cid=${cid}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data.value;
    } 
    catch (err) {
        console.log(err);
    }
}


export async function likeComment(pid, cid) {
    try {
        const response = await fetch(`/comment_like?pid=${pid}&cid=${cid}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}


export async function unlikeComment(pid, cid) {
    try {
        const response = await fetch(`/comment_unlike?pid=${pid}&cid=${cid}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    } 
    catch (err) {
        console.log(err);
    }
}


export async function queryPosts(ingredients) {
    try {
        let request = '/query?query=';
        for (let i = 0; i < ingredients.length; i++) {
            if (i < ingredients.length - 1) {
                request += `${ingredients[i]}+`;
            } 
            else {
                request += `${ingredients[i]}`;
            }
        }
        const response = await fetch(request, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}

export async function getFeed() {
    try {
        const response = await fetch(`/feed`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        return data;
    }
    catch(err) {
        console.log(err);
    }
}