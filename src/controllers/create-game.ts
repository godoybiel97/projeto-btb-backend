import { Response, Request } from "express";
import client from "../config/client";

export class CreateGameController {
  async handle(req: Request, res: Response) {
    const { participants } = req.body;

    if (!Array.isArray(participants)) {
      return res
        .status(400)
        .json({ message: "É obrigatório enviar uma lista de participantes" });
    }

    if (participants.length < 2) {
      return res
        .status(400)
        .json({ message: "É obrigatório enviar pelo menos 2 participantes" });
    }

    try {
      const gameExists = await client.game.findFirst({
        where: {
          isAtive: true
        },
      });

      if (gameExists) {
        return res.status(400).json({ message: "Já existe uma votação ativa" });
      }

      const participantsExists = await client.participant.findMany({
        where: {
          id: {
            in: [...new Set(participants)],
          },
          eliminated: false,
        },
      });

      if (participantsExists.length != participants.length) {
        return res
          .status(400)
          .json({ message: "Os participantes informados não são válidos" });
      }

      const createGame = await client.$transaction(async transaction => {
        const newGame = await transaction.game.create({
            data: {},
          });
    
          const createParticipants = participantsExists.map((item: { id: any }) => {
            return {
              gameId: newGame.id,
              participantId: item.id,
            };
          });
    
          await transaction.gameParticipant.createMany({
            data: createParticipants,
          });
    
          const getParticipants = await transaction.gameParticipant.findMany({
            where: {
              gameId: newGame.id,
            },
            include: {
              participant: true,
            },
          });
    
          return {
            ...newGame,
            gameParticipants: getParticipants.map((item: { participant: any }) => {
              return {
                participant: item.participant,
                votes: 0,
                percent: 0,
              };
            }),
          };
      })

      return res.status(201).json(createGame)

    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
