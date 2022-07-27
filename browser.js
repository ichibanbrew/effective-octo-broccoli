(() => {
    if (!window.location.pathname.includes("viewtopic.php")) { return; }
    
    let data = sessionStorage.getItem("posts");
    if (!data) { return; }

    let posts = JSON.parse(data);
    if (!posts.length) { return; }
    
    console.log("# of Posts: " + posts.length);

    let textarea = document.getElementsByTagName("textarea")[0];
    if (!textarea) { 
        alert("No textarea for reply");
        return; 
    }

    textarea.value = posts.shift();
    sessionStorage.setItem("posts", JSON.stringify(posts)); 

    setTimeout(() => {
        document.getElementsByName("post")[0].click();
    }, 3500);
})();
