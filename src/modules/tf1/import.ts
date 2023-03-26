export type videos = {
    id: string;
    name: string;
    label: string;
    duration: number;
    episode: number;
    season: number;
    date: string;
    description: string;
    fanart: string;
    type: string;
}

export type programs = {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    background: string;
    thumbnail: string;
    logo: string;
}

export type delivery = {
    id: string;
    format: string;
    url: string;
}
