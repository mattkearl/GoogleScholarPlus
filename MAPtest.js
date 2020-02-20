const GrabLink = document.querySelectorAll(".gs_ri a:first-of-type");
var Linkstep = GetLinkList()
var medlink = parseInt(Linkstep);
var ResPageArr = [];
for (var j = 0; j < GrabLink.length; j++) {
    GrabLink[j].className = parseInt(medlink) + parseInt(j);
    ResPageArr.push(0);
    GrabLink[j].onclick = function () {
        SetLinkList(0);
        ResPageArr[j] = 1;
        ResultClick(this.className);
    }
    SetLinkList(parseInt(medlink) + parseInt(j));
}
