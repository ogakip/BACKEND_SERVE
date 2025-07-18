import "reflect-metadata";
import { app } from "./app";
import { AppDataSource } from "./database/datasource";

export const init = async () => {
  const PORT = process.env.PORT ? process.env.PORT : 3333;

  await AppDataSource
    .initialize()
    .then(() => {
      console.log(`CONNECTION STABLISHED WITH DATABASE`);
    })
    .catch((error: any) => {
      console.log(error);
    });

  app.listen(PORT, () => {
    console.log(`Application running on port: ${PORT}`);
  });
};
init();
