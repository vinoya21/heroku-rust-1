function register(){
    var username = document.getElementById('signupUsername').value;
    var firstName = document.getElementById('signupFirstName').value;
    var lastName = document.getElementById('signupLastName').value;
    var email = document.getElementById('signupEmail').value;
    var password = document.getElementById('signupPassword').value;
    var validLogin = true;
    if(!validUsername(username)){
        validLogin = false;
    }
    if(!validFirstName(firstName)){
        validLogin = false;
    }
    if(!validLastName(lastName)){
        validLogin = false;
    }
    if(!validEmail(email)){
        validLogin = false;
    }
    if(!validPassword(password)){
        validLogin = false;
    }
    if(validLogin){
        $.post("/register?username=" +username +'&password=' +password +'&firstName=' +firstName +'&lastName=' +lastName +'&email=' +email, function(data){
            if(data == "success"){
                document.getElementById('id02').style.display='none';
                localStorage.setItem('username', username);
                window.location.href = "indexUser.html";
            }else if(data == "usernameFound=trueemailFound=false"){
                alert("username already exists");
            }else if(data == "usernameFound=falseemailFound=true"){
                alert("email already exists");
            }else{
                alert("username and email already exist");
            }
            
        }); //creates user in database logs them in and brings them to homepage
    } else{
        
    } //do nothing
}

function validUsername(a){
    if(a.length < 4){
        alert("minimum username length of 4");
        return false;
    }
    return true;
}
function validFirstName(a){
    var num = /^\d+$/;
    if(a == ''){ // empty 
        return false;
    }
    else if(num.test(a)){ // contains digit
        return false;
    }
    return true;
}
function validLastName(a){
    var num = /^\d+$/;
    if(a == ''){
        return false;
    }
    else if(num.test(a)){
        return false;
    }
    return true;
}
function validEmail(a){
    var email = /[A-Za-z0-9]+@[A-Za-z]+.(edu|com)/
    if(email.test(a)){
        return true;
    }
    return false;
}
function validPassword(a){
    if(a.length < 8){
        alert("minimum password length of 8");
        return false;
    }
    return true;
}