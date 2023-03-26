import { XMLHttpRequest } from "xmlhttprequest";
import { exec } from "child_process";
import fetch from "node-fetch";

let reqID = "c8dcd52a";

const vidid = () => {
    // Get Last vid with slug

    let slug = process.argv[3];
    let lastvid = process.argv[4];
    if (lastvid == undefined) lastvid = 0;
    let url = `https://www.tf1.fr/graphql/web?id=a6f9cf0e&variables={"offset":0,"programSlug":"${slug}","limit":10,"types":null,"types":["REPLAY"]}`;
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Request-Id": reqID,
        },
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.data.programBySlug === null) {
                console.log("No video found");
                return;
            }
            var vididv = json.data.programBySlug.videos.items;
            let videosArray = [];
            vididv.forEach((e) => {
                    videosArray.push({
                        id: e.id,
                        name: e.program.name,
                        duration: e.playingInfos.duration,
                        episode: e.episode,
                        season: e.season,
                        date: e.date,
                        description: e.decoration.description,
                        fanart: e.decoration.images[1].sources[0].url,
                        type: e.type,

                    });
            });
            console.log(vididv);
        })
        .catch((err) => {
            console.log(err);
        });
}

const mpd = (id) => {

    // Get MPD with video id

    let getmpd = new XMLHttpRequest();
    getmpd.open("GET", "https://mediainfo.tf1.fr/mediainfocombo/" + id + "?pver=4022002&context=MYTF1", false);
    getmpd.send(null);

    if (getmpd.status != 200) {
        mpd(id);
        return;
    }

    console.log(JSON.parse(getmpd.responseText));

    var urlmpd = JSON.parse(getmpd.responseText).delivery.url;

    let dlmpd = new XMLHttpRequest();
    dlmpd.open("GET", urlmpd, false);
    dlmpd.send(null);

    if (dlmpd.status != 200) {
        mpd(id);
        return;
    }

    var mpd = dlmpd;

    console.log(urlmpd)

}


const vname = (slug, id, soap = false) => {

    var preEpN = "Episode ";
    if(soap) preEpN = "S01E";
    let url = `https://www.tf1.fr/graphql/web?id=a6f9cf0e&variables={"offset":0,"programSlug":"${slug}","limit":10,"types":null,"types":["REPLAY"]}`;
    let getvid = new XMLHttpRequest();
    getvid.open("GET", url, false);
    getvid.send(null);

    if (getvid.status != 200) {
	vname(slug, id, soap);
	return;
    }

    var name = "";

    JSON.parse(getvid.responseText).data.programBySlug.videos.items.forEach(e => {
        if (e.id == id) {
            name += e.program.name + " - " + preEpN + e.episode + " - " + dateToHuman(e.date)
        }
    })

    console.log(name)

}

const vname2 = (slug, id) => {

    let url = `https://www.tf1.fr/graphql/web?id=a6f9cf0e&variables={"offset":0,"programSlug":"${slug}","limit":10,"types":null,"types":["REPLAY"]}`;
    let getvid = new XMLHttpRequest();
    getvid.open("GET", url, false);
    getvid.send(null);

    if (getvid.status != 200) {
        vname2(slug, id);
        return;
    }

    var name = "";

    JSON.parse(getvid.responseText).data.programBySlug.videos.items.forEach(e => {
        if (e.id == id) {
            name += dateToHuman(e.date)
        }
    })

    console.log(name)

}

const vnamedesc = (slug, id) => {

    let url = `https://www.tf1.fr/graphql/web?id=a6f9cf0e&variables={"offset":0,"programSlug":"${slug}","limit":10,"types":null,"types":["REPLAY"]}`;
    let getvid = new XMLHttpRequest();
    getvid.open("GET", url, false);
    getvid.send(null);

    if (getvid.status != 200) {
        vnamedesc(slug, id);
        return;
    }

    var name = "";

    JSON.parse(getvid.responseText).data.programBySlug.videos.items.forEach(e => {
        if (e.id == id) {
            name += e.decoration.description.split(" Retrouvez \"")[0]
        }
    })

    console.log(name)

}


const fanart = (slug, id, soap = false) => {

    var preEpN = "Episode ";
    if(soap) preEpN = "S01E";


    let url = `https://www.tf1.fr/graphql/web?id=a6f9cf0e&variables={"offset":0,"programSlug":"${slug}","limit":10,"types":null,"types":["REPLAY"]}`;
    let getvid = new XMLHttpRequest();
    getvid.open("GET", url, false);
    getvid.send(null);

    if (getvid.status != 200) {
        fanart(slug, id, soap);
        return;
    }

    JSON.parse(getvid.responseText).data.programBySlug.videos.items.forEach(e => {
        if (e.id == id) {
            let fanarturl = e.decoration.images[1].sources[0].url
            let name = e.program.name + " - " + preEpN + e.episode + " - " + dateToHuman(e.date)
        }
    })

    exec("curl " + fanarturl + " -o '" + name + "-1.jpg'", (error, stdout, stderr) => {
        console.log(error + stderr + stdout)
    });
    exec("curl " + fanarturl + " -o 'fanart.jpg'", (error, stdout, stderr) => {
        console.log(error + stderr + stdout)
    });

}

const poster = (slug) => {

    let url = `https://www.tf1.fr/graphql/web?id=a6f9cf0e&variables={"offset":0,"programSlug":"${slug}","limit":10,"types":null,"types":["REPLAY"]}`;
    let getvid = new XMLHttpRequest();
    getvid.open("GET", url, false);
    getvid.send(null);

    if (getvid.status != 200) {
        poster(slug);
        return;
    }

    var res = JSON.parse(getvid.responseText).data.programBySlug;
    var back = res.decoration.background.sources[0].url
    var posterv = res.decoration.image.sources[0].url

    exec("curl " + back + " -o 'background.jpg'", (error, stdout, stderr) => {
        console.log(error + stderr + stdout)
    });
    exec("curl " + posterv + " -o 'show.jpg'", (error, stdout, stderr) => {
        console.log(error + stderr + stdout)
    });

}



function dateToHuman(d) {
    let date_ob = new Date(d);
    var weekday = new Array(7);
    weekday[0] = "Dimanche";
    weekday[1] = "Lundi";
    weekday[2] = "Mardi";
    weekday[3] = "Mercredi";
    weekday[4] = "Jeudi";
    weekday[5] = "Vendredi";
    weekday[6] = "Samedi";
    var monthn = new Array(12);
    monthn[1] = "Janvier";
    monthn[2] = "Février";
    monthn[3] = "Mars";
    monthn[4] = "Avril";
    monthn[5] = "Mai";
    monthn[6] = "Juin";
    monthn[7] = "Juillet";
    monthn[8] = "Aout";
    monthn[9] = "Septembre";
    monthn[10] = "Octobre";
    monthn[11] = "Novembre";
    monthn[12] = "Décembre";
    var day = weekday[date_ob.getDay()];
    let date = ("0" + date_ob.getDate()).slice(-2);
    var month = monthn[("" + (date_ob.getMonth() + 1)).slice(-2)];
    let year = date_ob.getFullYear();
    return day + " " + date + " " + month
}



if (process.argv[2] == "vidid") vidid()
if (process.argv[2] == "mpd") mpd(process.argv[3])
if (process.argv[2] == "vtt") vtt(process.argv[3])
if (process.argv[2] == "nameold") vnameold(process.argv[3])
if (process.argv[2] == "name") vname(process.argv[3], process.argv[4], process.argv[5])
if (process.argv[2] == "title") vname2(process.argv[3], process.argv[4])
if (process.argv[2] == "desc") vnamedesc(process.argv[3], process.argv[4])
if (process.argv[2] == "datevid") datevid(process.argv[3])
if (process.argv[2] == "datevidus") datevidus(process.argv[3])
if (process.argv[2] == "postervid") postervid(process.argv[3])
if (process.argv[2] == "poster") poster(process.argv[3])
if (process.argv[2] == "fanart") fanart(process.argv[3], process.argv[4], process.argv[5])
