import { Router } from "express";
import { CreateGameController } from "./controllers/create-game";
import { CreateVoteController } from "./controllers/create-vote";
import { FinalizaGameController } from "./controllers/finzaliza-game";
import { GetGamesController } from "./controllers/get-games";
import { GetParticipantsController } from "./controllers/get-participants";

const routes = Router();
routes.get("/participants", new GetParticipantsController().handle);
routes.post("/games", new CreateGameController().handle);
routes.get("/games", new GetGamesController().handle);
routes.post("/votes", new CreateVoteController().handle);
routes.patch("/games/:id", new FinalizaGameController().handle);

export default routes;
