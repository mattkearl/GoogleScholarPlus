var SORTEDLIST = []
var QUERYLIST = []
var RELATEDSEARCHTERMS = []
var stopwords = ['||','i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
var INACTIVETERMS = [];
var checkBoxArray = [];
localStorage.setItem("Control", 1);

$(document).mouseup(function(e) {
    var height = $('.gs_hdr');
    var container = $(".checkbox-dropdown-list");
    var container2 = $(".checkbox-dropdown");

    // if the target of the click isn't the container nor a descendant of the container
    if ((!container2.is(e.target) && container2.has(e.target).length === 0) ) {
        container.hide();
        $(".is-active").removeClass("is-active");
    } else {
        container.show();
    }
}); 

// Simply insert survey text onto page at all times
var surveyText = document.getElementById("gs_ab_md").innerHTML = '<p id="survey-link" class="survey-link"><a href="https://qtrial2019q4az1.az1.qualtrics.com/jfe/form/SV_6nkraDeL2QpVCNn" target="_blank">Please support our research efforts by taking this 1 minute survey &#8594</a></p>';
document.getElementById("survey-link").style.display = 'block !important';


$(function () {
    var newListWord = document.createElement("ul");
    newListWord.setAttribute("id", "search-term-list");

    // User Agreement Popup Content
    var userAgreementText = '<div id="consent-popup" class="consent-popup">' +
        '<h3>User Agreement Policy</h3>' +
        '<p class="agreement-p-text">By using this plugin, you agree to our agreement policy and understand that</p>' +
        '<p>&#8226; Any information we gather is for research<br><br>&#8226; Survey data will help us better the plugin</p>' +
        '<div style="display: none;" class="agreement-text-box">' +
            '<p class="agreement-p-text agreement-text">To evaluate and measure the effectivity of the ESS artifact, this research uses two primary approaches. First, by using two widely recognized evaluation measures named mean average precision (MAP) (Craswell, 2009) and normalized discounted cumulative gain (NDCG). Both are excellent methods in evaluating relevancy in search engines. <br><br>Between the two measures, better insight into how effective the artifact is can be identified. Second, two surveys will be administered to give insight into how the users felt the artifact could be improved during development and  how well it performed during deployment. To accomplish this, the survey will be administered at different times of the research.<br><br>First, a formative survey will be given to testers to identify usability issues that the evaluation measures MAP or NDCG might not be able to describe during assessment. It can also describe how the interface is perceived by users, how queries were formed, and how the user experience might be enriched. Second, a summative survey will be administered to users to evaluate the impact of ESS on GS. This is valuable data only gained through a survey of its users</p>' +
        '</div>' +
       '<p class="agreement-p-text agreementButton"><a class="agreementLink" href="#">View Agreement Policy</a></p><button class="close opt-in-button">Agree</button><button class="close opt-out-button">Disagree</button>' +
    '</div>';

    $('#gs_hdr_tsi').after('<div id="advQuery"></div>');
    $('#advQuery').after(newListWord);

    // Repopulate the Global Lists from data save in session storage when the page loads
    if(sessionStorage.getItem("QUERYLIST") != null){
        QUERYLIST = JSON.parse(sessionStorage.getItem("QUERYLIST"));
        sessionStorage.removeItem("QUERYLIST");
    }
    if(sessionStorage.getItem("RELATEDSEARCHTERMS") != null){
        RELATEDSEARCHTERMS = JSON.parse(sessionStorage.getItem("RELATEDSEARCHTERMS"));
        sessionStorage.removeItem("RELATEDSEARCHTERMS");
    }
    convertQuery();

    if(sessionStorage.getItem("SORTEDLIST") != null){
        SORTEDLIST = JSON.parse(sessionStorage.getItem("SORTEDLIST"));
        sessionStorage.removeItem("SORTEDLIST");
    }
    if(sessionStorage.getItem("INACTIVETERMS") != null){
        INACTIVETERMS = JSON.parse(sessionStorage.getItem("INACTIVETERMS"));
        sessionStorage.removeItem("INACTIVETERMS");
    }
    if(sessionStorage.getItem("boxes") != null){
        checkBoxArray = JSON.parse(sessionStorage.getItem('boxes'));
        sessionStorage.removeItem("boxes")
    }

     // After the Global lists are repopulated Print the related search terms to the screen 
     printRelatedSearchTerms();

    $(".checkbox-dropdown").click(function () {
        $(this).toggleClass('is-active');

        $(".checkbox-dropdown").not(this).removeClass("is-active");
    });

    $(".checkbox-dropdown ul").click(function(event) {

        event.stopPropagation();
    });

    if(localStorage.getItem('popState') != 'shown'){
        // Insert User Agreement Policy
        $('#gs_hdr').before(userAgreementText);
        $("#consent-popup").delay(1000).fadeIn();
        localStorage.setItem('popState','shown');

        // Show / hide agreement policy in popup
        $(".agreementButton").click(function() {
            var label = $(".agreementButton").text().trim();

            if(label == "Hide") {
                $(".agreementButton").text("View");
                $(".agreement-text-box").hide();
            }
            else {
                $(".agreementButton").text("Hide");
                $(".agreement-text-box").show();
            }
        });
    }

    // Remove User Agreement Policy and allow functionality if user agrees with agreement policy
    $('.opt-in-button').click(function(e) {
        $('#consent-popup').fadeOut(); // Now the pop up is hidden
    });

    // Remove plugin content if user disagrees with agreement policy
    $('.opt-out-button').click(function(e) {
    	localStorage.setItem('popupConsent', 'denied');
        $('#consent-popup').fadeOut(); // Now the pop up is hidden
        $("#advQuery").remove();
        $("#search-term-list").remove();
        $(".survey-link").remove();
        // Fix google page styling
        document.getElementById("gs_hdr").style.paddingBottom = "0px";
    });

    
    if(localStorage.getItem('popupConsent') == 'denied'){
        $('#consent-popup').fadeOut(); // Now the pop up is hidden
        $("#advQuery").remove();
        $("#search-term-list").remove();
        $(".survey-link").remove();
        // Fix google page styling
        document.getElementById("gs_hdr").style.paddingBottom = "0px";    	
	}

    // Select all the related search terns and if their value is in the list of INACTIVETERMS 
    // switch thier class to inactive so they appear grey and are not included in the new querylist
    setTimeout(function(){ 
        var currentSearchBoxText = q.value
        var listOfTerms = currentSearchBoxText.split(" ||");
        var firstWord = listOfTerms[0];
        var firstSerchTerm = firstWord.replace(/"/g, '');
        q.value = firstSerchTerm;

     }, 1000);

     resetInactiveTerms();
});


// Loop through the related search terms and if their value is in the INACTIVETERMS list set the class to unactive
function resetInactiveTerms(){
    var relatedTerms = document.getElementsByClassName("relatedTerm");
    for(i=0; i<relatedTerms.length; i++){
        var term = relatedTerms[i].innerHTML;
        var index = INACTIVETERMS.indexOf(term);
        if (index != -1) {
            relatedTerms[i].classList.add('unactive');
            relatedTerms[i].classList.remove('activeButton');
        }
    };
}


function convertQuery() {
    // clear out list of words
    document.getElementById('advQuery').innerHTML = "";

    // split the query up by space
    var query = q.value.split(" ");

    if(query == ""){
        // display no checkbox
        // clear out previous search term list
        document.getElementById('search-term-list').innerHTML = "";
 
    } else {
        var columnCount = 0;
        for( i = 0; i < query.length; i++) {
            if (query[i] !== "") {
                if (query[i] === "||") {
                    break
                }
                sortOutStopWords(query[i], columnCount);
                columnCount++;
            }
        }
    }

}

function sortOutStopWords(word, column){
    word = word.replace('"', '');
    var newColumn = [];
    newColumn.push(word);
    SORTEDLIST.push(newColumn);

    // Check if current word is in stopwords if it is remove the word and increment the column number (count)
    if(stopwords.includes(word)){
        return
    }


    var listDiv = document.createElement("div");
    var listUL = document.createElement("ul");
    listUL.className += "checkbox-dropdown-list";
    listDiv.className += "checkbox-dropdown";
    
    listDiv.innerHTML = word;

    $.ajax({
        type: 'GET',
        url: 'https://api.datamuse.com/words?ml=' + word + '&max=10',
        dataType: 'json',
        success: function (data) {
            
            $.each(data, function(index, element) {

                var newListItem = document.createElement("li");
                var newLabel = document.createElement("label");

                //for styling material checkbox
                newLabel.classList.add('pure-material-checkbox');

                var newInput = document.createElement("input");
                newInput.type = "checkbox";
                //make span container for word
                var span = document.createElement("span");
                span.innerHTML = element.word
                newInput.value = element.word;
                newInput.setAttribute("data-column", column);
                newLabel.innerHTML = `<span>` + element.word + `</span>`;

                // if the inputs value is in the list of checked boxes set its property to checked
                $(".pure-material-checkbox").find('input:checkbox').each(function() {
                    $(this).prop("checked", ($.inArray($(this).val(), checkBoxArray) !== -1));
                });
                
                newInput.onclick = function(){
                    if($(this).prop("checked") == true){
                       
                        // add checked attr
                        $(this).prop('checked', true);
                        
                        // add to the checkBoxArray
                        checkBoxArray = [];
                        $('input:checkbox:checked').each(function() {
                            checkBoxArray.push($(this).val());    
                        });
                        
                        // Save the inputs value and column and send it to the addWordToSortedList function
                        var value = $(this).val();
                        var column = $(this).attr("data-column");
                        addWordToSortedList(column, value);
                    }
                    else if($(this).prop("checked") == false){
                        // remove checked attr
                        $(this).prop('checked', false);
                        
                        // reset the checkBoxArray
                        checkBoxArray = [];
                        $('input:checkbox:checked').each(function() {
                            checkBoxArray.push($(this).val());
                        });
                                                
                        var value = $(this).val();
                        var column = $(this).attr("data-column");
                        removeWordFromSortedList(column, value);
                       
                    }
                };

                newLabel.appendChild(newInput);
                newListItem.appendChild(newLabel);
                listUL.appendChild(newListItem);

            });
        }
    });

    listDiv.appendChild(listUL);
    advQuery.appendChild(listDiv);
}




function addWordToSortedList(column, value) {
    // create the word as an dictionary to preserve the column option
    SORTEDLIST[column].push(value);
    RELATEDSEARCHTERMS = []
    RELATEDSEARCHTERMS = getCombinations(SORTEDLIST);

    printRelatedSearchTerms();
    updateQueryList();
}

function removeWordFromSortedList(column, value) {
    // remove unchecked word from list

    var list = SORTEDLIST[column];
    var indexOfValue = list.indexOf(value);

    SORTEDLIST[column].splice(indexOfValue, 1);

    RELATEDSEARCHTERMS = []
    RELATEDSEARCHTERMS = getCombinations(SORTEDLIST);

    printRelatedSearchTerms();
    updateQueryList();
}


// Combine the words from each column into one list of combined search terms and return it
function getCombinations(arr) {
    if (arr.length === 0) return [[]];
    let res = [], [first, ...rest] = arr;
    let remaining = getCombinations(rest);
    first.forEach(e => {
        remaining.forEach(smaller => {
        res.push([e].concat(smaller));
        });
    });
    return res;
}


// Print the combine search terms to the screen
function printRelatedSearchTerms(){
    var relatedTermsUL = document.querySelector("#search-term-list");

    // Clear out the ul and reset it
    relatedTermsUL.innerHTML = "";

    var firstItemArray = RELATEDSEARCHTERMS[0]
    console.log('first item', firstItemArray)
    if (RELATEDSEARCHTERMS.length > 0) {
        var firstWordTerm = "";

        for (k=0; k < firstItemArray.length;k++) {
            
            
                
                firstWordTerm += firstItemArray[k] + " ";
           
            
        }
        firstWordTerm = $.trim(firstWordTerm);

        // Create the new elements
        var li = document.createElement("li");
        var btn = document.createElement("button");
    
        // Set attributes on the new elements
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "createQueryList");
        btn.classList.add("originalTerm");
        btn.classList.add("relatedTerm");
        btn.innerHTML = `"` + firstWordTerm + `"`;
        btn.value = firstWordTerm;
        
        li.appendChild(btn);
        relatedTermsUL.appendChild(li);
    }
    
    

    for (var i=1; i < RELATEDSEARCHTERMS.length; i++){

        var array = RELATEDSEARCHTERMS[i];
        var term = "";
        for(j=0; j<array.length;j++){
            if(j != array.length -1){
                term += array[j] + " ";
            } else {
                term += array[j]
            }
        }

        // Create the new elements
        var li = document.createElement("li");
        var btn = document.createElement("button");

        // Set attributes on the new elements
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "createQueryList");
        btn.classList.add("activeButton");
        btn.classList.add("relatedTerm");
        btn.innerHTML = `"` + term + `"`;
        btn.value = term;
        

        // Set the onclick for the button that adds and removes classes
        btn.onclick = function(){
            var value = $(this).val();
            modifyQueryList(value);
            if ($(this).hasClass('unactive')) {
                $(this).removeClass('unactive');
                $(this).addClass('activeButton');
            } else {
                $(this).addClass('unactive');
                $(this).removeClass('activeButton');
            }
            return false;
        };

        li.appendChild(btn);
        relatedTermsUL.appendChild(li);
    }


    resetInactiveTerms();
}


// When a checkbox is clicked add/remove terms with that word in it from the QUERYLIST
function updateQueryList() {
    QUERYLIST = [];
    RELATEDSEARCHTERMS.forEach( array => {
        var queryString = "";
        for(i=0;i<array.length;i++){
            if(i != array.length -1){
                queryString += array[i] + "+";
            }
            else {
                // dont add a plus sign to the last word in the string
                queryString += array[i];
            }
        }

        // Add the new query string to the list of querystrings
        // if statement removes duplicate queryString
        if (QUERYLIST.includes(queryString) === false){
            QUERYLIST.push(queryString);
        }
    });

}



function modifyQueryList(searchTerm){
    // Gets the selected combination string
    var array = searchTerm.split(" ");

    //seperate each word in the selected combination string with a plus sign and save it to a variable called queryString
    var queryString = "";
    for(i=0;i<array.length;i++){
        if(i != array.length -1){
            queryString += array[i] + "+";
        }
        else {
            // dont add a plus sign to the last word in the string
            queryString += array[i];
        }
    }

    var index = QUERYLIST.indexOf(queryString);

    if (index > -1) {
        QUERYLIST.splice(index, 1);
    } else {
        QUERYLIST.push(queryString);
    }
}


//added for sending data database
//added by Eliott

function CalcNDCG() {
    var Oav = 0;
    var Rav = 0;
    if (localStorage.getItem('UserRRay') === null) {
        return
    } else {
        var RRay = JSON.parse(localStorage.getItem('UserRRay'));
        var RRay = RRay.map(Number);
        var IRay = JSON.parse(localStorage.getItem('UserIRay'));
        var IRay = IRay.map(Number);
    }
    var ORay = sort(RRay);
    ORay.reverse();
    for (var k = 0; k < RRay.length; k++) {
        //check math here if answer is wrong.
        var val1 = RRay[k] / Math.log2(IRay[k] + 1);
        Rav = parseFloat(Rav) + parseFloat(val1);;
    }
    for (var l = 0; l < ORay.length; l++) {
        //check math here if answer is wrong.
        var val1 = ORay[l] / Math.log2(IRay[l] + 1);
        Oav = parseFloat(Oav) + parseFloat(val1);
    }
    //Rav = Rav / IRay.length;
    //Oav = Oav / IRay.length;
    var NDCG = parseFloat(Rav) / parseFloat(Oav);
    console.log("NDCG", NDCG);
    return NDCG;
}

function ClearSearch () {
    console.log("clearing search data and sending cookies");
    var SendSID = sessionStorage.getItem('GAUser');
    var SendAP = localStorage.getItem('UserAP');
    var sap = JSON.stringify({ SendAP });
    console.log("SID", ThisUser, "AP", SendAP);
    var controller = localStorage.getItem("Control");
    if ( SendAP === null) {
        console.log('No AP');
    } else {
        LinkPassData(ThisUser, sap, controller);
    }
    SetLinkList(0);
    var SendAP = CalcNDCG();
    var sadg = JSON.stringify({ SendAP });
    ResultPassData(ThisUser, sadg, 1, controller);
    sessionStorage.removeItem('GAUSer');
    localStorage.removeItem('UserAP');
    localStorage.setItem('UserLO', 1);
    localStorage.removeItem('UserRRay');
    localStorage.removeItem('UserIRay');
    localStorage.removeItem('UserStarsClicked');
}

//Sending function
function ResultPassData (searchid, result, rating, control) {
    //var phpurl = browser.runtime.getURL('NewDataConnect.php');
    //console.log("php location", phpurl);
    $.ajax({
        url: "https://eliott.online/gsas/DataConnect.php",
        type: 'POST',
        data: {psearchid:searchid, presult:result, prating:rating, ptestcontrol:control, resclick:"1"},
        success: function (getreturn) {
            console.log("Data sent ", getreturn)
        }
    });
}

function LinkPassData (searchid, result, control) {
    //var phpurl = chrome.runtime.getURL('NewDataConnect.php');
    //console.log("php location", phpurl);
    $.ajax({
        url: "https://eliott.online/gsas/DataConnect.php",
        type: 'POST',
        data: {psearchid:searchid, presult:result, ptestcontrol:control, linkclick:"1"},
        success: function (getreturn) {
            console.log("Data sent ", getreturn)
            //alert("Data sent ", getreturn)
        }
    });

}



//Change the query selector in this line to query googles search btn instead of the button on our index.html page and everything should work
var updateSearchBtn = document.querySelector("#gs_hdr_tsb");
updateSearchBtn.onclick = function(){


    // Check the search box for a new search term
    var currentSearchBoxText = q.value
    var finalWord = currentSearchBoxText.replace(/ /g, "+");
    var index = QUERYLIST.indexOf(finalWord);
    var searchCount = localStorage.getItem("searchCount");

    // Check if it is the first time a user is searching
    /* trying something different -Eliott
    if(!QUERYLIST.length){
        console.log("This is a first search");
        var searchCount = localStorage.getItem("searchCount")
        searchCount = 1;
        localStorage.setItem("searchCount", searchCount);
        return
    } 
    // Check if the user is entering a new search
    else if(index == -1){
        var searchCount = localStorage.getItem("searchCount")
        searchCount = 1;
        localStorage.setItem("searchCount", searchCount);
        return
    } 
    */

    if (localStorage.getItem("searchCount") === null) {
        localStorage.setItem("searchCount", 1);
    }

    // Check if this is the 20th search and dont build the whole querystring to collect controlled data
    else if(searchCount == 20){
         //Set control bit
         localStorage.setItem("Control", 0);
         console.log("This is control search");
         // Reset the local stroage number to 0
         localStorage.setItem("searchCount", 0);

         // We still want to save all of the session info so nothing appears different to the user
         sessionStorage.setItem("RELATEDSEARCHTERMS", JSON.stringify(RELATEDSEARCHTERMS));
         sessionStorage.setItem("QUERYLIST", JSON.stringify(QUERYLIST));
         sessionStorage.setItem("SORTEDLIST", JSON.stringify(SORTEDLIST));
         sessionStorage.setItem('boxes', JSON.stringify(checkBoxArray));
         INACTIVETERMS = [];
         var unactiveTerms = document.getElementsByClassName("unactive");
         for(i=0; i<unactiveTerms.length; i++){
             INACTIVETERMS.push(unactiveTerms[i].innerHTML);
         }
         sessionStorage.setItem("INACTIVETERMS", JSON.stringify(INACTIVETERMS));

         // Build the query string to only contain the first term in the QUERYLIST
         var queryString = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C45&q=";
         var controledTerm = QUERYLIST[0];
         controledTerm+= `"` +controledTerm+ `"&btnG=`;
         queryString += controledTerm

         // Replace the search location with the new query string.
         window.location = queryString;
        localStorage.removeItem("searchCount");
        ClearSearch();
         return false;

     }
    // Otherwise function normally 
    else {

        var searchCount = localStorage.getItem("searchCount")
        searchCount = parseInt(searchCount) + parseInt(1);
        localStorage.setItem("searchCount", searchCount);

        sessionStorage.setItem("RELATEDSEARCHTERMS", JSON.stringify(RELATEDSEARCHTERMS));
        sessionStorage.setItem("QUERYLIST", JSON.stringify(QUERYLIST));
        sessionStorage.setItem("SORTEDLIST", JSON.stringify(SORTEDLIST));
        sessionStorage.setItem('boxes', JSON.stringify(checkBoxArray));
        INACTIVETERMS = [];
        var unactiveTerms = document.getElementsByClassName("unactive");
        for(i=0; i<unactiveTerms.length; i++){
            INACTIVETERMS.push(unactiveTerms[i].innerHTML);
        }
        sessionStorage.setItem("INACTIVETERMS", JSON.stringify(INACTIVETERMS));

        var queryString = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C45&q=";
        QUERYLIST.forEach(query=> {
            if (query != QUERYLIST[QUERYLIST.length -1]){
                var queryWithQuotes = `"` + query + `"`;
                queryString += queryWithQuotes + "+%7C%7C+";
            } else {
                queryString += `"` + query + `"&btnG=`;
            }
        })
        window.location = queryString;
        
        ClearSearch();

        return false;
    }
}




function bannerAutoGrow() {
    if($('.is-active').length > 0) {
        // document.getElementById('gs_hdr').style.height="500px!important";
        $('#gs_hdr').attr('style', 'height: 500px !important');

        // $('#gs_hdr').attr('id', 'setHeight');
    } else {
        $('#gs_hdr').attr('style', 'height: auto !important');
    }

 };


$(document).mouseup(function(e) {
    var container = $(".checkbox-dropdown-list");
    var container2 = $(".checkbox-dropdown");

    // if the target of the click isn't the container nor a descendant of the container and remove is-active class
    if ((!container2.is(e.target) && container2.has(e.target).length === 0) ) {
        container.hide();
        container2.removeClass("is-active");

    } else {
        container.show();
    }

});

var q = document.getElementById("gs_hdr_tsi");
//Listen for a Keyup and then make changes
q.addEventListener("keyup", convertQuery, false);
q.addEventListener("click", bannerAutoGrow, false);