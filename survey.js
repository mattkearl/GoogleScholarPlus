// Simply insert survey text onto page at all times
var surveyText = document.getElementById("gs_ab_md").innerHTML = '<p id="survey-link" class="survey-link">' +
    '<a href="https://www.surveymonkey.com/r/3766CY3" target="_blank">Begin Survey</a>' +
    'Help us make Google Scholar Plus better.</p>'
document.getElementById("survey-link").style.display = 'block !important';
