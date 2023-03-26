import youtubedl from 'youtube-dl-exec';
import { spawnSync, SpawnSyncReturns } from 'child_process';
import { videos, delivery } from '../tf1/import';

export function download(deliv: delivery, path: string, video: videos): Promise<void> {
    return new Promise( async (resolve, reject) => {
        let dl: SpawnSyncReturns<Buffer> = spawnSync(`youtube-dl "${deliv.url}" -o "${path}/${video.label}.mp4"`, { shell: true })
        if (dl.status == 0) {
            let ff: SpawnSyncReturns<Buffer> = spawnSync(`ffmpeg -i "${path}/${video.label}.mp4"
            -metadata:s:a:0 language=fra
            -metadata title="${video.label}"
            -metadata description="${video.description}"
            -c copy "${path}/${video.label}.mp4"`, { shell: true })
            if (ff.status == 0)
                resolve();
            else
                reject(ff.stderr.toString());
        } else {
            reject(dl.stderr.toString());
        }
    });
}