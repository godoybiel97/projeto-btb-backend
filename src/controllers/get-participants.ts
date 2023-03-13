import { Response, Request } from "express";
import client from "../config/client";

export class GetParticipantsController {
  async handle(req: Request, res: Response) {
    const { active } = req.query;
    try {
      if (active) {
        const participants = await client.participant.findMany({
          where: {
            eliminated: false,
          },
        });
        return res.json(participants);
      }

      const participants = await client.participant.findMany();
      return res.json(participants);
      
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
