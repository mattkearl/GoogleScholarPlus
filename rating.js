//This stuff all is added to head tags
//jQuery and Cookies plugin
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//Include Fontawesome inside the head tags
var script2 = document.createElement('script');
script2.src = 'https://kit.fontawesome.com/f0549b06ac.js';
script2.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script2);


/*

--Rating System--

User enters query and gets results
The query is assigned to a Session variable "UserQuery"
The "UserQuery" variable will be reset everytime a new search is made

The function setStage() will place the stars under each result
Stars are added to each result with unique ID for each. star_on_1_20, star_on_2_20, star_on_3_20
The setStage() will also help place ids on each result for MAP tracking
The attribute target="_blank" will be added to each result.

User clicks on result and it opens in new tab (This should also send a flag for validation)
User rates article. AP is added to MAP for search query

The star rating system will only apply to that unique query no matter how many pages down they are
Once the query is changed, that rating system will go away




--MAP--
* I need to have a MAP of all queries no matter the user.
* MAP should be calculated if an article is clicked on, or rated with the star system
* AV should be calculated for each set of results including sub pages
* It will record what results (by number) were clicked on each query up to the page viewed (page 3 would be 40 results)


If user clicks result and the search query stays the same (no matter the page)
    Look at number on list
    Calulate the precision for that page (ie result 3, 1/3 results were clicked, its precision is .67)
    Add precision value to session id on specific query
    
If a user clicks on a star:
    See if NDGC exists for that star
    check the star
    change the view of the star (fill in gold and grey where needed)
    add NDCG number


If new search is made or page is closed, add all precision together and submit to server.


*/

//This will look at GET variables and return whatever you want from the URL
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

//This will add stars and identifers to each result/page, assign unique ids to each to click on later.
function setStage() {
    $(function(){
        // Detect the current page to assign to variables
        var page = getQueryVariable("start");
        if (page>1) { page = page / 10; } else { page = 0;} // Sets the page number to the variable 
        
        $(".gs_or").each(function(i,value){ // Loops through all results

            $(this).find("h3 a").attr("target","_blank"); // Adds a target_blank to each entry
            $(this).find("h3 a").attr("id",page + "_" + i); // Adds a target_blank to each entry
            $(this).append("<span class='stars' id='stars" + i + "'>" +
                           "<input type='radio' id='radio" + page + "_" + i + "_2' name='radio" + i + "'><label for='radio" + page + "_" + i + "_2' class='fas fa-star'></label>" +
                           "<input type='radio' id='radio" + page + "_" + i + "_1' name='radio" + i + "'><label for='radio" + page + "_" + i + "_1' class='fas fa-star'></label>" +
                           "<input type='radio' id='radio" + page + "_" + i + "_0' name='radio" + i + "'><label for='radio" + page + "_" + i + "_0' class='fas fa-star'></label>" +
                           "<span></span>" +
                           "</span>"); // Add stars to each result with a label the user can click
        }); // Ends the each loop on all results
    }); // Ends jQuery code on setStage
} // Ends setStage() function


//This will be used to collect MAP data. Fix me!!!!!!!!!!!
function collectClicks () {
    $(function(){
        $("#radio0_0_0").click(function(){
            alert("sent");
    });
})};



// Sets Session Variable to the Query
sessionStorage.setItem('UserQuery' , getQueryVariable('q'));
setStage();
collectClicks();


