function docReady(fn) {
    window.addEventListener("load", fn);
}

function getStorage(name, json = false) {
    if (json == true) {
        return JSON.parse(window.localStorage.getItem(name));
    } else {
        return window.localStorage.getItem(name);
    }
}

function setStorage(name, val, json = false) {
    if (json == true) {
        window.localStorage.setItem(name, JSON.stringify(val));
    } else {
        window.localStorage.setItem(name, val);
    }
}

function removeStorage(name) {
    window.localStorage.removeItem(name);
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen(elem) {
    if (elem.exitFullscreen) {
        elem.exitFullscreen();
    } else if (elem.webkitExitFullscreen) {
        elem.webkitExitFullscreen();
    } else if (elem.mozCancelFullScreen) {
        elem.mozCancelFullScreen();
    } else if (elem.msExitFullscreen) {
        elem.msExitFullscreen();
    }
}

function getVideo(status = "next" || "current") {
    if (document.querySelectorAll("[watched]").length > 0) {
        let videoID = parseInt(
            document
            .querySelectorAll("[watched]")[document.querySelectorAll("[watched]").length - 1].getAttribute("id")
        );
        if (status == "next") {
            videoID += 1;
        } else if (status == "current") {}
        return document.getElementById(videoID);
    } else {
        return document.getElementById(1);
    }
}

function scrollIntoCenter(element) {
    element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
    });
}

function isInViewport(element) {
    var elementHeight = element.offsetHeight;
    var elementWidth = element.offsetWidth;
    var bounding = element.getBoundingClientRect();

    if (
        bounding.top >= -elementHeight &&
        bounding.left >= -elementWidth &&
        bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth) +
        elementWidth &&
        bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) +
        elementHeight
    ) {
        return true;
    } else {
        return false;
    }
}

let extensions = [
    ".flv",
    ".mp4",
    ".m3u8",
    ".ts",
    ".3gp",
    ".mov",
    ".avi",
    ".wmv",
];
let mimetypes = [
    "video/x-flv",
    "video/mp4",
    "application/x-mpegURL",
    "video/MP2T",
    "video/3gpp",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
];

function matchMime(theextension, extAr = extensions, mimeAr = mimetypes) {
    for (
        let index = 0; index < extAr.length && theextension.length > 2; index++
    ) {
        if (extAr[index].includes(theextension)) {
            return mimeAr[index];
        }
    }
}

function resetVideo(video, name) {
    video.addEventListener("click", () => {
        removeStorage(name);
        removeStorage(video.getAttribute("id") + "-currentTime");
        setTimeout(location.reload(), 1000);
    });
}

function inVideos(fn) {
    const videos = document.querySelectorAll("video");
    videos.forEach((avideo) => {
        fn(avideo);
    });
}
let checkerVideo = (video) => {
    if (isInViewport(video)) video.setAttribute("preload", "metadata");
};

function focusVideo(video) {
    document.body.style.background = "#000";
    video.style.border = " solid white 2px";
    getContainer(video).style.maxWidth = "75%";
}

function dropHandler(ev, video) {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === "file") {
                var subtitleFile = ev.dataTransfer.items[i].getAsFile();
                if (getExtension(subtitleFile.name) == "srt") {
                    subtitleFile.text().then(function(srt) {
                        let vtt = convertVTT(srt);
                        addSubtitle(vtt, video);
                    });
                } else if (getExtension(subtitleFile.name) == "vtt") {
                    subtitleFile.text().then(function(vtt) {
                        addSubtitle(vtt, video);
                    });
                }
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log(
                "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
            );
        }
    }
}

function dragOverHandler(ev) {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function getContainer(element) {
    return element.closest("div");
}

function addListener(element, event, fn) {
    element.addEventListener(event, (ev) => {
        fn(ev);
    });
}

function addListeners(element, events, fn) {
    events.forEach((event) => {
        element.addEventListener(event, (ev) => {
            fn(ev);
        });
    });
}

function getExtension(name) {
    return name.split(".").pop();
}

function reader(file) {
    let reader = new FileReader();
    return reader.readAsText(file);
}

function convertVTT(srt) {
    /*https://github.com/videojs/video.js/issues/4822*/
    var vtt = "";
    srt = srt.replace(/\r+/g, "");
    var list = srt.split("\n");
    for (var i = 0; i < list.length; i++) {
        var m = list[i].match(
            /(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/
        );
        if (m) {
            vtt +=
                m[1] +
                ":" +
                m[2] +
                ":" +
                m[3] +
                "." +
                m[4] +
                " --> " +
                m[5] +
                ":" +
                m[6] +
                ":" +
                m[7] +
                "." +
                m[8] +
                "\n";
        } else {
            vtt += list[i] + "\n";
        }
    }
    vtt = "WEBVTT\n\n\n" + vtt;
    vtt = vtt.replace(/^\s+|\s+$/g, "");
    return vtt;
}

function addSubtitle(vtt, video) {
    let subtitle = document.createElement("track");
    let blob = new Blob([vtt], {
        type: "text/vtt",
    });
    subtitle.setAttribute("src", URL.createObjectURL(blob));
    subtitle.setAttribute("kind", "subtitles");
    subtitle.setAttribute("default", "");
    video.appendChild(subtitle);
}