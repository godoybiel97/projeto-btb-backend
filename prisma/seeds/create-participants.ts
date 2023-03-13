import { PrismaClient } from "@prisma/client";

const client = new PrismaClient()

export const participants = [
    {
        name: "SPFC",
        username: "spfc",
        avatar: "https://w0.peakpx.com/wallpaper/207/878/HD-wallpaper-sao-paulo-fc-futebol-tricolor-paulista-soberano-clube-spfc.jpg",
    },
    {
        name: "Santos",
        username: "santos",
        avatar: "https://media.santosfc.com.br/wp-content/uploads/2022/04/cropped-Asset-2.png",
    },
    {
        name: "Corinthians",
        username: "corinthians",
        avatar: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/874.png&h=200&w=200",
    },
    {
        name: "Palmeiras",
        username: "palmeiras",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/1024px-Palmeiras_logo.svg.png",
    }
]

export const createParticipantsSeed = async () => {
    for (const item of participants) {
        await client.participant.upsert({
            where: {
                username: item.username
            },
            create: item,
            update: {}
        })
    }
}