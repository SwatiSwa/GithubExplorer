var isRepoLoaded = false;
var isFollowersLoaded = false;

function onRepoFollowersAppLoad(){
    var userId = Number(location.href.split('?')[1]);
    var userList = JSON.parse(localStorage.getItem('users'));
    var userIds = pluck(userList,'id');
    var userIndex = userIds.indexOf(userId);
    var data = userList[userIndex];

    document.getElementById('name').innerHTML = data.name;
    document.getElementById('profileImg').src = data.avatar_url; 
    getReposList(data.login);
    getFollowersList(data.login);
}

function getReposList(username){
    fetch('https://api.github.com/users/'+username+'/repos')
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            isRepoLoaded = true;
            console.log(response);
            var repolist = document.getElementById('repoList');
            var list = "";

            for(var i=0;i<response.length;i++){
                list = list + `<li><a href=`+response[i].html_url+` target='_blank'>`+response[i].name+`</a></li>`;
            }

            repolist.innerHTML = list;

            removeLoadMask();
        });
}

function getFollowersList(username){
    fetch('https://api.github.com/users/'+username+'/followers')
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            isFollowersLoaded = true;

            console.log(response);
            var followerslist = document.getElementById('followersList');
            var list = "";

            for(var i=0;i<response.length;i++){
                list = list + `<li><a href=`+response[i].html_url+` target='_blank'>`+response[i].login+`</a></li>`;
            }

            followerslist.innerHTML = list;
            removeLoadMask();
        });
}

function removeLoadMask(){
    var loadMask = document.getElementById('loading');

    if(isFollowersLoaded && isRepoLoaded){
        loadMask.style.display = "none";
    }
}

