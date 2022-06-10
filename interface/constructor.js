const popupContainer = document.createElement("div");
for (let index = 1; index <= 37; index++) {
    const data = json[index];
    const name = data["name"];
    const videoContainer = document.createElement("div");
    videoContainer.setAttribute("data-name", name);
    const videoTitle = document.createElement("span");
    videoTitle.setAttribute("class", "videoTitle");
    videoTitle.innerHTML = name;
    document.body.appendChild(videoContainer);
    videoContainer.appendChild(videoTitle);
    const video = document.createElement("video");
    videoContainer.appendChild(video);
    const source = document.createElement("source");
    source.setAttribute("src", "../" + name);
    source.setAttribute("type", matchMime(fileType));
    video.appendChild(source);
    video.setAttribute("id", index);
    video.setAttribute("preload", "none");

    if (getStorage(name) == null) {
        video.setAttribute("controls", "");
    } else {
        video.style.filter = "grayscale(100) blur(5px)";
        resetVideo(video, name);
        video.setAttribute("watched", "true");
    }
    video.addEventListener(
        "ended",
        () => {
            setStorage(name, "watched");
            video.setAttribute("watched", "true");
            closeFullscreen(video);
            videoNumber = 1 + parseInt(video.getAttribute("id"));
            let nextVideo = document.getElementById(videoNumber);
            video.style.filter = "grayscale(100) blur(5px)";
            video.removeAttribute("controls");
            resetVideo(video, name);
            if (
                window.fullScreen ||
                (window.innerWidth == screen.width &&
                    window.innerHeight == screen.height)
            ) {
                openFullscreen(nextVideo);
            } else {}
            popupContainer.setAttribute("class", "popupContainer");
        },
        false
    );
}