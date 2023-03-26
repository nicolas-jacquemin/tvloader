import { videos as videosT, programs as programsT } from "./import.js";

export function listWithSlug(slug: string, type: string, limit: number, offset: number): Promise<videosT[]> {
    return new Promise((resolve, reject) => {
        fetch(`https://www.tf1.fr/graphql/web?id=a6f9cf0e&variables={"limit": ${limit},"offset":${offset},"programSlug":"${slug}","limit":10,"types":null,"types":["${type}"]}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.data.programBySlug === null) {
                    resolve([]);
                    return;
                }
                let videosList: videosT[] = [];
                data.data.programBySlug.videos.items.forEach((video: any) => {
                    videosList.push({
                        id: video.id,
                        name: video.program.name,
                        label: video.decoration.label,
                        duration: video.playingInfos.duration,
                        episode: video.episode,
                        season: video.season,
                        date: video.date,
                        description: video.decoration.description,
                        fanart: video.decoration.images[1].sources[0].url,
                        type: video.type
                    });
                });
                resolve(videosList);
            })
        .catch((err) => reject(err));
    });
}


export function listPrograms(limit: number, offset: number): Promise<programsT[]> {
    return new Promise((resolve, reject) => {
        fetch(`https://www.tf1.fr/graphql/web?id=6b8de788&variables={"limit": ${limit},"offset":${offset},"context":{"persona":"PERSONA_2","application":"WEB","device":"DESKTOP","os":"WINDOWS"}}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.data.programs === null) {
                    resolve([]);
                    return;
                }
                let programsList: programsT[] = [];
                data.data.programs.items.forEach((program: any) => {
                    programsList.push({
                        id: program.id,
                        name: program.name,
                        slug: program.slug,
                        description: program.decoration.description,
                        image: program.decoration.image.sources[0].url,
                        background: program.decoration.background.sources[0].url,
                        thumbnail: program.decoration.thumbnail.sources[0].url,
                        logo: program.decoration.logo.sources[0].url
                    });
                });
                resolve(programsList);
            })
            .catch((err) => reject(err));
    });
}
