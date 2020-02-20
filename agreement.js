/* 20th:10:30 - 11:45pm
        2:21 -


*/

// User Agreement Popup Content
    var userAgreementText = '<div id="consent-popup" class="consent-popup">' +
        '<h3>User Agreement Policy</h3>' +
        '<p class="agreement-p-text">By using this plugin, you agree to our agreement policy and understand that</p>' +
        '<p>&#8226; Any information we gather is for research<br><br>&#8226; Survey data will help us better the plugin</p>' +
        '<div style="display: none;" class="agreement-text-box"><p class="agreement-p-text agreement-text">' +

        // User Agreement
        'To evaluate and measure the effectivity of the ESS artifact, this research uses two primary approaches. First, by using two widely recognized evaluation measures named mean average precision (MAP) (Craswell, 2009) and normalized discounted cumulative gain (NDCG). Both are excellent methods in evaluating relevancy in search engines. <br><br>Between the two measures, better insight into how effective the artifact is can be identified. Second, two surveys will be administered to give insight into how the users felt the artifact could be improved during development and  how well it performed during deployment. To accomplish this, the survey will be administered at different times of the research.<br><br>First, a formative survey will be given to testers to identify usability issues that the evaluation measures MAP or NDCG might not be able to describe during assessment. It can also describe how the interface is perceived by users, how queries were formed, and how the user experience might be enriched. Second, a summative survey will be administered to users to evaluate the impact of ESS on GS. This is valuable data only gained through a survey of its users' +

        '</p></div>' +
       '<p class="agreement-p-text agreementButton"><a class="agreementLink" href="#">View Agreement Policy</a></p><button class="close opt-in-button">Agree</button><button class="close opt-out-button">Disagree</button>' +
    '</div>';

var disableExtensionText = '<div id="disable-popup" class="consent-popup">' +
        '<h3>Thank you for your consideration</h3>' +
        '<p class="agreement-p-text">Please go ahead remove <b>Google Scholar Plus</b> from your browser.</p>' +
        '<p>&#8226; No user or personal information has been stored<br><br>&#8226; If you wish to use the extension, you will have to accept the user agreement</p>' +
        '<button class="close disablebutton" style="width:100%;" onclick="window.location.href = \'https://chrome.google.com/webstore/detail/google-scholar-plus/gagjclacbanihohlpldfkbpplljbindj\';">Remove Extension</button>' +
    '</div>';


/*
User should have the option to click accept or deny everytime they use the tool.
If they have accepted the agreement, it should not come up again.
If they denied it, it will disable the tool.

Show agreement if "UserAgreement" does not exist or not "agree", then show options to accept.
If agreement is accepted, then show tool. Turn var "UserAgreement" to "agree"
if not, then disable tool.
*/

if(localStorage.getItem('UserAgreementPolicy') != 'agree'){
    //Show the form to agree or disagree

    // Insert User Agreement Policy
        $('#gs_hdr').before(userAgreementText);
        $("#consent-popup").delay(1000).fadeIn();

        // Show or hide agreement policy in popup
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

        // Remove User Agreement Policy and allow functionality if user agrees with agreement policy
        $('.opt-in-button').click(function(e) {
            localStorage.setItem('UserAgreementPolicy', 'agree'); // Set "UserAgreement to "agree"
            $('#consent-popup').fadeOut(); // Now the pop up is hidden
        });

        $('.opt-out-button').click(function(e) {
            localStorage.setItem('UserAgreementPolicy', 'disagree'); // Set "UserAgreement to "agree"
            $('#consent-popup').fadeOut(); // Now the pop up is hidden

            $("#advQuery").remove();
            $("#search-term-list").remove();
            $(".survey-link").remove();
            // Fix google page styling
            document.getElementById("gs_hdr").style.paddingBottom = "0px";
            $('#gs_hdr').before(disableExtensionText);
            $("#disable-popup").delay(1000).fadeIn();

        });

}
