import { listPrograms, listWithSlug } from "./modules/tf1/list.js";
import { getDelivery } from "./modules/tf1/delivery.js";
import { videos } from "./modules/tf1/import.js";
import { download } from "./modules/downloader/dl.js";

let emis : videos[] = (await listWithSlug("ici-tout-commence", "REPLAY", 1, 0));

await download(await getDelivery(emis[0].id), ".", emis[0]);

console.log(emis[0]);