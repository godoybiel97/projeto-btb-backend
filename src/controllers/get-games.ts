import { Response, Request } from "express";
import client from "../config/client";

export class GetGamesController {
  async handle(req: Request, res: Response) {
    
    try {
        const games = await client.game.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                gameParticipants: {
                    include: {
                        game: true,
                        participant: true,
                        vote: true
                    }
                }
            }
        })

        const gameView = games.map(item => {
            const totalVotes = item.gameParticipants.reduce((acc, curr) => {
                return acc + curr.vote.length
            }, 0)
            return {
                ...item,
                gameParticipants: item.gameParticipants.map(itemParticipant => {
                    return {
                        participant: itemParticipant.participant,
                        votes: itemParticipant.vote.length,
                        percent: totalVotes > 0 ? ((itemParticipant.vote.length / totalVotes) * 100) : 0
                    }
                })
            }
        })
        return res.json(gameView)

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}