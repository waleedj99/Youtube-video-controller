let selectedTab
function isTabPlaying(tabs){
    if(tabs[0]!=undefined){
        showPlay()
    }else{
        hidePlay()
    }
} 
function showPlay(){
    document.querySelector(".pause").classList.add("hidden");
    document.querySelector(".play").classList.remove("hidden");
}
function hidePlay(){
    document.querySelector(".play").classList.add("hidden");
    document.querySelector(".pause").classList.remove("hidden");
}
(function listenForClicks() {
    browser.tabs.query({url:"https://www.youtube.com/*",audible:false}).then(isTabPlaying)
    document.addEventListener("click", (e) => {
        function pauseMusic(tabs) {
            //alert(tabs)
            selectedTab = tabs[0].id
            showPlay()
            browser.tabs.executeScript(
                selectedTab,{
                code:'document.getElementsByClassName("ytp-play-button ytp-button")[0].click()'
                })
        }
        function shuffleMusic(tabs){
            browser.tabs.executeScript(
                tabs[0].id,{
                code:`let recomLinks = []
                arrayElements = []
                sidebarClass = "yt-simple-endpoint inline-block style-scope ytd-thumbnail"
                recomLinksElements =  document.getElementsByClassName(sidebarClass)
                Array.from(recomLinksElements).forEach(child => {
                   arrayElements.push(child)
                });
                arrayElements.forEach(element => {
                    recomLinks.push(element.getAttribute("href"))
                });
                window.location.href = recomLinks[Math.floor(Math.random() * 6)] 
                `
            })  
            //playMusic(tabs)
        }
        function playMusic(tabs) {
            hidePlay()
            
            if(selectedTab!=undefined){
                browser.tabs.executeScript(
                    selectedTab,{
                    code:'document.getElementById("movie_player").click()'
                    })    
            }else{
            browser.tabs.executeScript(
                tabs[0].id,{
                code:'document.getElementsByClassName("ytp-play-button ytp-button")[0].click()'
                })
            }
        }
        function nextMusic(tabs){
            browser.tabs.executeScript(
                tabs[0].id,{
                code:'document.getElementsByClassName("ytp-next-button ytp-button")[0].click()'
                })
        }    
        function prevMusic(tabs){
            browser.tabs.executeScript(
                tabs[0].id,{
                code:'window.history.back();'
                })
                
        }
        function replayMusic(tabs){
            browser.tabs.executeScript(
                tabs[0].id,{
                    code:`document.getElementsByClassName("ytp-left-controls")[0].innerHTML = '<button class="ytp-play-button ytp-button" title="Replay"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-259"></use><path class="ytp-svg-fill" d="M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z" id="ytp-id-259"></path></svg></button >'
                    document.getElementsByClassName("ytp-play-button ytp-button")[0].click()`
                })
        }
        if (e.target.classList.contains("pause")) {
            browser.tabs.query({url:"https://www.youtube.com/*",audible:true})
            .then(pauseMusic)
            .catch(reportError);
        }else if(e.target.classList.contains("play")){
            browser.tabs.query({url:"https://www.youtube.com/*",audible:false})
            .then(playMusic)
            .catch(reportError);
        }
        else if (e.target.classList.contains("next")) {
        browser.tabs.query({url:"https://www.youtube.com/*",audible:true })
        .then(nextMusic)
        .catch(reportError);
        }else if(e.target.classList.contains("prev")){
        browser.tabs.query({url:"https://www.youtube.com/*",audible:true })
        .then(prevMusic)
        .catch(reportError);
        }else if(e.target.classList.contains("replay")){
            browser.tabs.query({url:"https://www.youtube.com/*",audible:true })
        .then(replayMusic)
        .catch(reportError);
        }else if(e.target.classList.contains("shuffle")){
            browser.tabs.query({url:"https://www.youtube.com/*"})
            .then(shuffleMusic)
            .catch(reportError);
        }
    });
    document.addEventListener("mouseover",(e)=>{
        function addCookie(tabs){
            browser.tabs.executeScript(
                tabs[0].id,{
                    code:`
                    recomLinks = []
                    arrayElements = []
                    arrayTitles=[]
                    sidebarTitleClass = "#secondary h3 span#video-title.style-scope.ytd-compact-video-renderer"
                    recomTitles = document.querySelectorAll(sidebarTitleClass)
                Array.from(recomTitles).forEach((child,index) => {
                    document.cookie = "title-"+index+"="+child.innerHTML.trim()
                 });    
                
                    `
                })
                getCookies(tabs)
                
        }
        function getCookies(tabs){
            browser.cookies.getAll({
                url: tabs[0].url,
                storeId:tabs[0].cookieStoreId
              }).then(showRecom)
        }
        function showRecom(cookies){
            
        newArr = cookies.filter(element => {
                if(element.name.match(/^title-[\d]+$/)!=null)    
                {
                    return true
                }
            });

        var recomDiv = document.getElementById("recom")
        recomDiv.innerHTML = ''
        newArr.forEach(element => {
            recomDiv.innerHTML += '<h5><b>'+element.value +'</b></h5>'
        });
            
        }
        if(e.target.classList.contains("shuffle")){
            document.querySelector("#recom").classList.remove("hidden")
            browser.tabs.query({url:"https://www.youtube.com/*"})
            .then(addCookie)
            .catch(reportError);
        }
    })
    document.addEventListener("mouseout",(e)=>{
        if(e.target.classList.contains("shuffle")){
            document.querySelector("#recom").classList.add("hidden")
        }
    })
})()

