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
    let selectedLink
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
        function playLink(tabs){
            if(selectedLink.substring(23)==""){
                alert("Bruh")
            }
            browser.tabs.executeScript(
                tabs[0].id,{
                    code:'window.location.href =" '+ selectedLink.substring(23) +'"' 
                }
            )
            playMusic(tabs)
              
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
        }else if(e.target.classList.contains("play-link")){
            selectedLink = e.target.id
            browser.tabs.query({url:"https://www.youtube.com/*"})
            .then(playLink)
            .catch(reportError);
        }
    });
    document.addEventListener("mouseover",(e)=>{
        function clearCookie(tabs){
            selectedLink = ""
            browser.tabs.executeScript(
                tabs[0].id,{
                    code:`
                    ar res = document.cookie;
            var multiple = res.split(";");
            for(var i = 0; i < multiple.length; i++) {
               var key = multiple[i].split("=");
               document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC"
            }    
                `
                })
                addCookie(tabs)
        }
        function addCookie(tabs){
            browser.tabs.executeScript(
                tabs[0].id,{
                    code:`
                    recomLinks = []
                    arrayElements = []
                    arrayTitles=[]
                    arrayLinks=[]
                    sidebarTitleClass = "#secondary h3 span#video-title.style-scope.ytd-compact-video-renderer"
                    recomTitles = document.querySelectorAll(sidebarTitleClass)
                    sidebarClass = "yt-simple-endpoint inline-block style-scope ytd-thumbnail"
                    recomLinksElements =  document.getElementsByClassName(sidebarClass)
                    Array.from(recomLinksElements).forEach(child => {
                        if(!child.href.includes('start_radio=1'))
                            arrayLinks.push(child)
                    });

                    Array.from(recomTitles).forEach((child,index) => {
                        arrayTitles.push(child.innerHTML.trim())
                    
                        for(var i = 0;i<10;i++){
                        document.cookie = "title-"+i+"="+arrayTitles[i]
                        document.cookie = "link-"+i+"="+arrayLinks[i]
                    }
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
            linkArr  = cookies.filter(element => {
                if(element.name.match(/^link-[\d]+$/)!=null)    
                {
                    return true
                }
            });       
            titleArr = cookies.filter(element => {
                if(element.name.match(/^title-[\d]+$/)!=null)    
                {
                    return true
                }
            });
            titleArr.sort()
            linkArr.sort()
            var recomDiv = document.getElementById("recom")
            recomDiv.innerHTML = ''
            for(var i = 0;i<10;i++){
                //alert(titleArr[i].value)
                //alert(titleArr[i].value === "undefined")
                if(typeof titleArr[i].value !== "undefined"){
                    recomDiv.innerHTML +=`<div class="play-link" style ="display:flex">
                    <div class="recom">`+titleArr[i].value +`</div>
                    <div id = "`+ linkArr[i].value + `" class="button play-link">
                        <img id = "`+ linkArr[i].value + `" class = "play-link" src="/icons/play.svg" alt="Ply">
                    </div>
                </div>` 
                }
        }
        }
      

        if(e.target.classList.contains("shuffle")){
            selectedLink = ""
            document.querySelector("#recom").classList.remove("hidden")
            browser.tabs.query({url:"https://www.youtube.com/*"})
            .then(clearCookie)
            .catch(reportError);
        }
    })

})()

