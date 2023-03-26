import { delivery as deliveryT } from "./import";

export function getDelivery(id: string): Promise<deliveryT> {
    return new Promise((resolve, reject) => {
        fetch(`https://mediainfo.tf1.fr/mediainfocombo/${id}?pver=4022002&context=MYTF1`)
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    resolve({
                        id: "",
                        format: "",
                        url: ""
                    });
                    return;
                }
                resolve({
                    id: data.media.id,
                    format: data.delivery.format,
                    url: data.delivery.url
                });
            })
            .catch((err) => reject(err));
    });
}
