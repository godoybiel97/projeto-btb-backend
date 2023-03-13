import { Response, Request } from "express";
import client from "../config/client";

export class CreateVoteController {
  async handle(req: Request, res: Response) {
    const { participantId, gameId } = req.body;

    if (!participantId || !gameId) {
      return res
        .status(400)
        .json({ message: "É obrigatório enviar um participante e um game" });
    }

    try {
      const gameExists = await client.game.findFirst({
        where: {
          id: gameId,
          isAtive: true,
        },
      });

      if (!gameExists) {
        return res.status(404).json({ message: "O game não existe" });
      }

      const participantInGameExists = await client.gameParticipant.findFirst({
        where: {
          gameId,
          participantId,
        },
      });

      if (!participantInGameExists) {
        return res
          .status(404)
          .json({ message: "O participante não existe" });
      }

      await client.vote.create({
        data: {
            gameParticipantId: participantInGameExists.id
        }
      })
      return res.status(201).send()

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
