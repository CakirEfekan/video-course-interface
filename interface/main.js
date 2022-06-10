docReady(() => {
    function inVideos(fn) {
        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
            fn(video);
        });
    }
    let checkerVideo = (video) => {
        if (isInViewport(video)) video.setAttribute("preload", "metadata");
    };

    scrollIntoCenter(getVideo("next"));
    popupContainer.setAttribute("class", "popupContainer hidden");
    document.body.appendChild(popupContainer);
    const popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    const yesButton = document.createElement("button");
    yesButton.setAttribute("name", "yes");
    const noButton = document.createElement("button");
    noButton.setAttribute("name", "no");
    popup.innerHTML = "Do you want to watch more? <br>";
    yesButton.innerHTML = "Yeaaa";
    noButton.innerHTML = "Nope!";
    popup.appendChild(yesButton);
    popup.appendChild(noButton);
    popupContainer.appendChild(popup);

    yesButton.addEventListener("click", () => {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            // true for mobile device
            openFullscreen(getVideo("next"));
        } else {
            // false for not mobile device
        }
        scrollIntoCenter(getVideo("next"));
        //
        getVideo("next").play();
        popupContainer.setAttribute("class", "popupContainer hidden");
    });
    noButton.addEventListener("click", () => {
        popupContainer.setAttribute("class", "popupContainer hidden");
    });
    addEventListener("fullscreenchange", (event) => {
        scrollIntoCenter(getVideo("next"));
    });
    window.addEventListener("blur", function() {
        document.title = "Do not forget the course!";
    });
    window.addEventListener("focus", function() {
        document.title = "Enjoy!";
    });

    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        video.currentTime = getStorage(video.getAttribute("id") + "-currentTime");
        addListeners(video, ["focusin", "playing", "play"], () => {
            focusVideo(video);
        });
        video.addEventListener("timeupdate", (e) => {
            setStorage(video.getAttribute("id") + "-currentTime", video.currentTime);
        });
        video.addEventListener("focusout", (e) => {
            document.body.style.background = "#fff";
            getContainer(video).style.maxWidth = "33%";
            setTimeout(() => {
                scrollIntoCenter(video);
            }, 800);
        });
        video.addEventListener("seeking", (e) => {
            e.preventDefault();
        });
        window.addEventListener("blur", function() {
            video.pause();
        });
    });
    inVideos(checkerVideo);
    document.addEventListener("scroll", () => {
        inVideos(checkerVideo);
    });

    inVideos((video) => {
        addListener(video, "drop", (event) => {
            dropHandler(event, video);
        });
        addListener(video, "dragover", (event) => {
            getContainer(video).style.filter = "drop-shadow(0px 0px 10px black)";
            dragOverHandler(event);
            getContainer(video).querySelector(".videoTitle").innerHTML =
                "Leave the subtitle";
        });

        addListeners(video, ["dragleave", "drop"], () => {
            getContainer(video).querySelector(".videoTitle").innerHTML =
                getContainer(video).getAttribute("data-name");
            getContainer(video).style.filter = "";
        });
    });
});