//backlog
//stop writing blank sets to the database
//MCDG working
//fix database


//rating.js handles data collection and collection engine DOM modification.

//jQuery and Cookies plugin
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//fontawesome

var script2 = document.createElement('script');
script2.src = 'https://kit.fontawesome.com/f0549b06ac.js';
script2.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script2);


//control bit
var Control = 1;

//global link count

//Create SearchID
var SearchID = 000000;
SearchID = Math.floor((Math.random() * 10000000) + 10000);
var ThisUser = '';
CheckCookie();
//SetLinkList();


//pulls list value from URL and sets.
var urlParams = new URLSearchParams(window.location.search);
console.log('start value from url: ',urlParams.get('start'));
if (urlParams.get('start') === null) {
    var medlink = 0;
} else {
    var medlink = urlParams.get('start');
};

/* Moved to content
var SearchButton = document.querySelector('#gs_hdr_tsb');
SearchButton.onclick = function () {
    ClearSearch();
}
*/

//Set Local Storage
//For session ID
function CheckCookie() {
    if (sessionStorage.getItem('GAUSer') === null) {
        sessionStorage.setItem("GAUSer", SearchID);
        ThisUser = SearchID;
        console.log("cookie has been set", ThisUser);
    } else {
        ThisUser = sessionStorage.getItem('GAUSer');
        console.log("Cookie found", ThisUser);
    }
}

//for Link List
function GetLinkList() {
    if (localStorage.getItem('GAListCount') === null) {
        return 0;
    } else {
        return localStorage.getItem('GAListCount')
    }

}

function SetLinkList(indexlist) {
    localStorage.setItem('GAListCount', indexlist);
    //this needs to clear when page is reloaded.
}

//for AP
function StoreAP(pvalue) {
    if (localStorage.getItem('UserAP') === null) {
        localStorage.setItem('UserAP', pvalue);
        console.log("storing new AP", pvalue);
    } else {
        console.log("pvalue", pvalue);
        console.log("Stored AP ", localStorage.getItem('UserAP'));

        tempstore = (pvalue*1 + localStorage.getItem('UserAP')*1) / 2;
        localStorage.setItem('UserAP', tempstore);
        //alert(tempstore);

    }
}

//for Link click order
function SetLinkOrder () {
    if (localStorage.getItem('UserLO') === null) {
        localStorage.setItem('UserLO', 1)
    }
}



//Cycle through each search result and Place stars
const AddRater = document.querySelectorAll(".gs_or"); // Look at all items on the page.
for (var i = 0; i < AddRater.length; i++) { // For each one do the following.

    var Relevance = document.createElement("div"); // Place a div at the top
    //Relevance.setAttribute("class", "relevanceIndicator");
    //AddRater[i].appendChild(Relevance); // At the top of each result, add the div.
    //AddRater[i].getElementsByClassName('relevanceIndicator')[0].appendChild("div");

    var that = this;
    for (var ii = 1; ii <= 3; ii++) {
        var star = document.createElement("div");
        var rateblock = parseInt(i) + parseInt(medlink);
        var tempname = "star" + ii + 0 + rateblock;
        star.innerHTML = '<i class="fas fa-star"></i>';
        star.setAttribute("class", "StarButton");
        star.setAttribute("id", tempname);
        AddRater[i].appendChild(star);
        //console.log(star.id);
        star.onclick = function () {
            if (localStorage.getItem('UserStarsClicked') === null) {
                var starRay = [];
                starRay.push(this.id);
                //RateDesc.innerHTML = "Less Relevant";
                if (this.id.substr(4, 1) == 2) {
                    starRay.push(this.id.substr(0, 4) + 1 + this.id.substr(5));
                    //RateDesc.innerHTML = "Somewhat Relevant";
                } else if (this.id.substr(4, 1) == 3) {
                    starRay.push(this.id.substr(0, 4) + 1 + this.id.substr(5));
                    starRay.push(this.id.substr(0, 4) + 2 + this.id.substr(5));
                    //RateDesc.innerHTML = "More Relevant";
                }
                //AddRater[i].appendChild(RateDesc);
                localStorage.setItem('UserStarsClicked', JSON.stringify(starRay));
                //AddRater[i].appendChild(RateDesc);
            } else {
                var starRay = JSON.parse(localStorage.getItem('UserStarsClicked'));
                starRay.push(this.id);
                //RateDesc.innerHTML = "Less Relevant";
                if (this.id.substr(4, 1) == 2) {
                    starRay.push(this.id.substr(0, 4) + 1 + this.id.substr(5));
                    //RateDesc.innerHTML = "Somewhat Relevant";
                } else if (this.id.substr(4, 1) == 3) {
                    starRay.push(this.id.substr(0, 4) + 1 + this.id.substr(5));
                    starRay.push(this.id.substr(0, 4) + 2 + this.id.substr(5));
                   // RateDesc.innerHTML = "More Relevant";
                }
                //AddRater[i].appendChild(RateDesc);
                localStorage.setItem('UserStarsClicked', JSON.stringify(starRay));
            }
            //AddRater[i].appendChild(RateDesc);
            this.innerHTML = '<i class="fas fa-star"></i>';
            this.setAttribute("class", "SuperStarButton");
            if (this.id.substr(4, 1) == 2) {
                document.getElementById(this.id.substr(0, 4) + 1 + this.id.substr(5)).innerHTML = '<i class="fas fa-star"></i>';
                document.getElementById(this.id.substr(0, 4) + 1 + this.id.substr(5)).setAttribute("class", "SuperStarButton");
            } else if (this.id.substr(4, 1) == 3) {
                document.getElementById(this.id.substr(0, 4) + 1 + this.id.substr(5)).innerHTML = '<i class="fas fa-star"></i>';
                document.getElementById(this.id.substr(0, 4) + 1 + this.id.substr(5)).setAttribute("class", "SuperStarButton");
                document.getElementById(this.id.substr(0, 4) + 2 + this.id.substr(5)).innerHTML = '<i class="fas fa-star"></i>';
                document.getElementById(this.id.substr(0, 4) + 2 + this.id.substr(5)).setAttribute("class", "SuperStarButton");
            }
            RateClick(this.id);

        }

    }
    //AddRater[i].appendChild(RateDesc);





}

//marks all the stars that need to be marked.
if (localStorage.getItem('UserStarsClicked') === null) {
    var starRay = [];
} else {
    var starRay = JSON.parse(localStorage.getItem('UserStarsClicked'));
}
for (var m = 0; m < starRay.length; m++) {
    document.getElementById(starRay[m]).innerHTML = '<i class="fas fa-star"></i>';
    document.getElementById(starRay[m]).setAttribute("class", "SuperStarButton");
}

//Triggered when rating is clicked.
function RateClick(star) {
    if (localStorage.getItem('UserRRay') === null) {
        var tempRRay = [];
        tempRRay.push(star[4]);
        localStorage.setItem("UserRRay", JSON.stringify(tempRRay));
        var tempIRay = [];
        tempIRay.push(parseFloat(star.substr(-2)) + parseFloat(1));
        localStorage.setItem("UserIRay", JSON.stringify(tempIRay));
    } else {
        var tempRRay = JSON.parse(localStorage.getItem('UserRRay'));
        tempRRay.push(star[4]);
        localStorage.setItem("UserRRay", JSON.stringify(tempRRay));
        var tempIRay = JSON.parse(localStorage.getItem('UserIRay'));
        tempIRay.push(parseFloat(star.substr(-2)) + parseFloat(1));
        localStorage.setItem("UserIRay", JSON.stringify(tempIRay));
    }
}

//array sorter
function sort(arr) {
    return arr.concat().sort();
}


/* Moved to Content
function CalcNDCG() {
    var Oav = 0;
    var Rav = 0;
    var RRay = JSON.parse(localStorage.getItem('UserRRay'));
    var RRay = RRay.map(Number);
    var IRay = JSON.parse(localStorage.getItem('UserIRay'));
    var IRay = IRay.map(Number);
    var ORay = sort(RRay);
    for (var k = 0; k < RRay.length; k++) {
        //check math here if answer is wrong.
        var val1 = RRay[k] / Math.log2(IRay[k] + 1);
        console.log("val1", val1);
        Rav = parseInt(Rav) + parseInt(val1);;
        console.log("Rav", Rav);
    }
    for (var l = 0; l < ORay.length; l++) {
        //check math here if answer is wrong.
        var val1 = ORay[l] / Math.log2(IRay[l] + 1);
        console.log("val1", val1);
        Oav = parseInt(Oav) + parseInt(val1);
        console.log("Oav", Oav);
    }
    //Rav = Rav / IRay.length;
    //Oav = Oav / IRay.length;
    console.log("RRay", RRay);
    console.log("IRay", IRay);
    console.log("ORay", ORay);
    console.log("Oav", Oav);
    console.log("Rav", Rav);
    var NDCG = Rav / Oav;
    console.log("NDCG", NDCG);
    return NDCG;
}


function ClearSearch () {
    console.log("clearing search data and sending cookies");
    var SendSID = sessionStorage.getItem('GAUser');
    var SendAP = localStorage.getItem('UserAP');
    var sap = JSON.stringify({ SendAP });
    console.log("SID", ThisUser, "AP", SendAP);
    if ( SendAP === null) {
        console.log('No AP');
    } else {
        LinkPassData(ThisUser, sap);
    }
    SetLinkList(0);
    var SendAP = CalcNDCG();
    console.log("ndcg SendAP", SendAP);
    var sadg = JSON.stringify({ SendAP });
    ResultPassData(ThisUser, sadg, 1);
    sessionStorage.removeItem('GAUSer');
    localStorage.removeItem('UserAP');
    localStorage.setItem('UserLO', 1);
    localStorage.removeItem('UserRRay');
    localStorage.removeItem('UserIRay');
    localStorage.removeItem('UserStarsClicked');
}

*/

//capture link that have been clicked
//don't worry, this makes me cry too.
const GrabLink = document.querySelectorAll(".gs_rt");
var Linkstep = GetLinkList()
//var medlink = urlParams.get('start');
var LinkOrder = localStorage.getItem('UserLO');
console.log("link Order ", LinkOrder);
console.log("medlink: ", medlink);
console.log("List of results ",GrabLink.length)
for (var j = 0; j < GrabLink.length; j++) {
    GrabLink[j].className = parseInt(medlink) + parseInt(j);
    //GrabLink[j].setAttribute('target', '_blank');
    GrabLink[j].onclick = function () {
        var pvalue = LinkOrder / (parseInt(medlink) + parseInt(this.className) + 1);
        localStorage.setItem('UserLO', parseInt(LinkOrder) + parseInt(1));
        StoreAP(pvalue);
    }

    //SetLinkList(parseInt(medlink) + parseInt(j));
}

//increment medlink for next page
/* Depricated code
const Nextbutton = document.querySelector("td:nth-of-type(12)");
Nextbutton.onclick = function () {
    console.log("incrementing Medlink")
    SetLinkList(parseInt(medlink) + parseInt(j));
}

const Lastbutton = document.querySelector("td:nth-of-type(1)");
Lastbutton.onclick = function () {
    console.log("de - incrementing Medlink")
    SetLinkList(parseInt(medlink) - parseInt(j));
}

*/

function StarClick (starid) {
    ResultPassData(ThisUser, starid[4], starid[5]);
}

function ResultClick (link) {
    LinkPassData(ThisUser, link)

}


//Delay page load for result send
$('a').delegate('a', 'click', function(event) {
    var url = this.href;

    setTimeout(function() {
        window.location = url;
        console.log('Delaying page');
    }, 100);
    event.preventDefault
})

/* Moved to Content
function ResultPassData (searchid, result, rating) {
    //var phpurl = browser.runtime.getURL('NewDataConnect.php');
    //console.log("php location", phpurl);
    $.ajax({
        url: "https://eliott.online/gsas/DataConnect.php",
        type: 'POST',
        data: {psearchid:searchid, presult:result, prating:rating, ptestcontrol:Control, resclick:"1"},
        success: function (getreturn) {
            console.log("Data sent ", getreturn)
        }
    });
}

function LinkPassData (searchid, result) {
    //var phpurl = chrome.runtime.getURL('NewDataConnect.php');
    //console.log("php location", phpurl);
    $.ajax({
        url: "https://eliott.online/gsas/DataConnect.php",
        type: 'POST',
        data: {psearchid:searchid, presult:result, ptestcontrol:Control, linkclick:"1"},
        success: function (getreturn) {
            console.log("Data sent ", getreturn)
            //alert("Data sent ", getreturn)
        }
    });

}
*/
