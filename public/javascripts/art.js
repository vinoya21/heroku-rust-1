var map;
function init() {
    $.post('/retrieve?type=art', function (art) { // POST for art info
        // loop through all art objects 
        var titleList = new Array();

        for (var i = 1; i < art.length; i++) {
            if (art[i].TITLE != '') { // don't want art with no title
                // object title
                var title = art[i].TITLE;


                if (!titleList.includes(title)) {

                    titleList.push(title);

                    // create row
                    var x = document.createElement("TR");
                    x.setAttribute("id", "'entry" + i + "'");

                    var latitude = art[i].LATITUDE;
                    var longitude = art[i].LONGITUDE;
                    var location = {lat: latitude, lng: longitude};
                    addRowListener(x, location);

                    // add to table
                    document.getElementById("arttable").appendChild(x);

                    // create column w/ info
                    var y = document.createElement("TD");

                    // put newly created element in the art class
                    y.className = "artclass";

                    var t = document.createTextNode(title);
                    y.appendChild(t);
                    document.getElementById("'entry" + i + "'").appendChild(y);
                }

            }
        }
        // add table to display art info
        var infoTable = document.createElement("TABLE");
        infoTable.setAttribute("width", "700");
        infoTable.setAttribute("id", "infotable");
        document.getElementById('displaytext').appendChild(infoTable);
        var x = document.createElement("TR");
        x.setAttribute("id", "row");
        document.getElementById("infotable").appendChild(x);
        var y = document.createElement("TD");
        y.setAttribute("id", "textinfo");
        var t = document.createTextNode("");
        y.appendChild(t);
        document.getElementById("row").appendChild(y);
    });
}

function addRowListener(row, location){
    row.addEventListener('click', function () {
        if(map.getZoom() < 20)
            map.setZoom(20);
        map.panTo(location);
    });
}

//search art function
function search_art() {
    let input = document.getElementById('searchbar_input_art').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('artclass');
    
    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "table-cell";
        }
    }


}

var activeInfoWindow;

function favoriteButton(user, title) {
    var foundTitle = false;
    $.post("/retrieveFavorite?user=" + user + "&title=" + title, function (result) {
        if (result[0].FAVORITES != null) {
            favoriteList = (result[0].FAVORITES).split(",");
            for (var i = 0; i < favoriteList.length; i++) {
                if (favoriteList[i] == title) {
                    foundTitle = true;
                }
            }
        }
        if (foundTitle) {
            removeItem(user, title);
            var content = activeInfoWindow.getContent();
            content = content.slice(0, -21);
            content = content +';</span></div></div>';
            activeInfoWindow.setContent(content);
        }
        else {
            addItem(user, title);
            var content = activeInfoWindow.getContent();
            content = content.slice(0, -20);
            content = content +'f;</span></div></div>';
            activeInfoWindow.setContent(content);
        }
    });
}

function initFavorite(user, title){
    var foundTitle = false;
    $.post("/retrieveFavorite?user=" + user + "&title=" + title, function (result) {
        if (result[0].FAVORITES != null) {
            favoriteList = (result[0].FAVORITES).split(",");
            for (var i = 0; i < favoriteList.length; i++) {
                if (favoriteList[i] == title) {
                    foundTitle = true;
                }
            }
        }
        var content = activeInfoWindow.getContent();
        content = content.slice(0, -20);
        if(content.substring(content.length - 1) == "f"){
            content = content.slice(0, -1);
        }
        if (foundTitle) {
            content = content +'f;</span></div></div>';
            activeInfoWindow.setContent(content);
        }
        else {
            content = content +';</span></div></div>';
            activeInfoWindow.setContent(content);
        }
    });
}

/*
FIXED ISSUE WITH NOT GOING IN ADDITEM AND REMOVEITEM FUNCTION
https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function.
*/
function addItem(user, title) {
    $.post("/changeFavorites?type=add&cat=art&user=" + user + "&title=" + title, function (result) {
    });
}

function removeItem(user, title) {
    $.post("/changeFavorites?type=remove&user=" + user + "&title=" + title, function (result) {
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 21.4689, lng: -158.0001},
        zoom: 10.25
    });
    $.post('/retrieve?type=art', function (art) { // POST for art info
        // loop through all art objects 
        for (var i = 1; i < art.length; i++) {
            if (art[i].TITLE != '') { // don't want art with no title
                // object title
                var title = art[i].TITLE;
                var latitude = art[i].LATITUDE;
                var longitude = art[i].LONGITUDE;
                var location = {lat: latitude, lng: longitude};
                var description = art[i].DESCRIPTION;
                var access = art[i].ACCESS;
                var creator = art[i].CREATOR;
                var credit = art[i].CREDIT;
                var date = art[i].DATE;
                createMarker(location, title, description, access, creator, credit, date);
            }
        }
    });
}
function createMarker(pos, name, description, access, creator, credit, date){
    var marker = new google.maps.Marker({title: name, position: pos, map: map});
    var creatorCreditDate = "";
    if(creator != ""){
        if(credit !=""){
            if(date != ""){
                creatorCreditDate = '<p>'+
                creator+ ', '+ credit+ ', '+ date+
                '</p>';
            } else{
                creatorCreditDate = '<p>'+
                creator+ ', '+ credit+
                '</p>';
            }
        } else{
            if(date != ""){
                creatorCreditDate = '<p>'+
                creator+ ', '+ date+
                '</p>';
            } else{
                creatorCreditDate = '<p>'+
                creator+
                '</p>';
            }
        }
    } else{
        if(credit !=""){
            if(date != ""){
                creatorCreditDate = '<p>'+
                credit+ ', '+ date+
                '</p>';
            } else{
                creatorCreditDate = '<p>'+
                credit+
                '</p>';
            }
        } else{
            if(date != ""){
                creatorCreditDate = '<p>'+
                date+
                '</p>';
            }
        }
    }
    var favoriteButton = "";
    var user = localStorage.getItem('username');
    if (user != null) {
        favoriteButton = '<span class="favoriteButton" onclick="favoriteButton(\''+user+'\', \''+name+'\')">&star;</span>';
    }
    var content = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+
    name+
    '</h1>'+
    '<div id="bodyContent">'+
    '<p>'+
    description+
    '</p>'+
    creatorCreditDate+
    '<p>'+
    " Access: "+
    access+
    '</p>'+
    favoriteButton+
    '</div>'+
    '</div>'
    var infowindow = new google.maps.InfoWindow({
        content: content
    });
    google.maps.event.addListener(marker, 'click', function() {
        if(map.getZoom() < 15)
            map.setZoom(15);
        map.panTo(marker.getPosition());
        if (activeInfoWindow){
            activeInfoWindow.close();
        }
        infowindow.open(map, marker);
        activeInfoWindow = infowindow;
        if (user != null) {
            initFavorite(user, name);
        }
    }); 
}
/*
    version: 23 FEB 2020
    TODO: have list scrollable, while info display is fixed on page
*/