function onApplicationLoad(){
    console.log('Document is loaded fully');

    var loadingGif = document.getElementById('loading');
    var userSection = document.querySelector('section.page-section');
    var addedUsers = localStorage.getItem('users');
    var userContainer    = document.querySelector('#pagesContainer');


    if(addedUsers){
        addedUsers = JSON.parse(addedUsers);

        for(var i=0;i<addedUsers.length;i++){
            var newCardDiv       = document.createElement('div');
            newCardDiv.className = "card";
            newCardDiv.innerHTML = createUserCard(addedUsers[i]);

            userContainer.appendChild(newCardDiv);
            newCardDiv.setAttribute('id',addedUsers[i].id);
        }
    }
    else{
        userContainer.innerHTML = '<img class="githubIcon" src="resources/githubIcon.gif" alt="Github loading" srcset="">';
    }
    loadingGif.style.display = "none";
    userSection.style.opacity = "unset";
    assignCardEvent();
    onClickReset();
}

function onPressEnter(e){

}

function onClickSubmit(){
    var username = document.querySelector('#username').value;
    var loadingGif = document.getElementById('loading');
    var userSection = document.querySelector('section.page-section');

    if(username){
        loadingGif.style.display = "block";
        userSection.style.opacity = 0.4;

        fetch('https://api.github.com/users/'+username)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response);

            loadingGif.style.display = "none";
            userSection.style.opacity = "unset";

            if(response){
                if(response.message == "Not Found"){
                    alert("User Not Found : Please enter a valid username");
                }
                else{
                    var userContainer = document.querySelector('#pagesContainer');
                    var githubIcon = userContainer.querySelector('img.githubIcon');
                    var newCardDiv = document.createElement('div');
                    newCardDiv.className = "card";
                    newCardDiv.innerHTML = createUserCard(response);
    
                    newCardDiv.setAttribute('id',response.id);
    
                    if(!localStorage.getItem('users')){
                        userContainer.removeChild(githubIcon);
                        userContainer.appendChild(newCardDiv);
                        localStorage.setItem('users',JSON.stringify([response]));
                    }
                    else{
                        var previousUsers = JSON.parse(localStorage.getItem('users'));
                        var userIds = pluck(previousUsers,'id');
    
                        if(userIds.indexOf(response.id)>=0){
                            alert('User is already added.');
                        }
                        else{
                            userContainer.appendChild(newCardDiv);
                            previousUsers.push(response);
                            localStorage.setItem('users',JSON.stringify(previousUsers));
                        }
                    }
                    assignCardEvent();
                }
            }
            else{
                alert('Unable to fetch response, Please try again');
            }
        });
    }
    else{
        alert("Please enter a username!!!");
    }
}

function assignCardEvent(){
    var userCards = document.querySelectorAll('div.card');

    for(var i=0;i<userCards.length;i++){
        userCards[i].onclick=function(e){
            var userId = e.currentTarget.getAttribute('id');
            window.open('../index2.html?'+userId,'_blank');

            //window.postMessage(e.currentTarget.getAttribute('username'),'http://127.0.0.1:5500/index2.html');
            
        }
    }
}

function onClickReset(){
    var username = document.getElementById('username');

    username.value="";
    username.focus();

    username.onkeydown = function(e){
        if(e.keyCode==13){
            onClickSubmit();
        }
    }
}

function onClickResetSearch(){
    localStorage.clear();
    onApplicationLoad();
}

function createUserCard(data){
    
    return `
        <div id="imgDiv">
            <img src=`+data.avatar_url+`>
        </div>
        <div class="card-body">
            <a href=`+data.html_url+` target="_blank">`+data.name+`</a>
            <div>
            <span class="label">Bio :</span>`+data.bio+`<br/>
            <span class="label">Location :</span>`+data.location+`
            </div>
        </div>
    `;
}
