import { Response, Request } from "express";
import client from "../config/client";

export class FinalizaGameController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const gameExists = await client.game.findFirst({
        where: {
          id,
          isAtive: true,
        },
        include: {
            gameParticipants: {
                include: {
                    participant: true,
                    vote: true
                }
            }
        }
      });

      if (!gameExists) {
        return res.status(404).json({ message: "Game não existe" });
      }

      const participants = gameExists.gameParticipants.map(gameParticipant => {
        return {
            participantId: gameParticipant.participant.id,
            vote: gameParticipant.vote.length
        }
      })

      const eliminatedParticipant = participants.reduce((previous, current) => {
        return current.vote > previous.vote ? current : previous
      })

      await client.$transaction(async transaction => {
        await transaction.game.update({
            where: {
                id: gameExists.id
            },
            data: {
                isAtive: false
            }
        })

        await transaction.participant.update({
            where: {
                id: eliminatedParticipant.participantId
            },
            data: {
                eliminated: true
            }
        })
      })
      return res.status(204).send()

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
