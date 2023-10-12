import moduleAlias from "module-alias";

moduleAlias.addAliases({
  "@n-services": `${__dirname}/services`,
  "@n-repositories": `${__dirname}/repositories`,
  "@n-utils": `${__dirname}/utils`,
  "@n-errors": `${__dirname}/errors`,
  "@n-constants": `${__dirname}/constants`,
  "@n-loggers": `${__dirname}/loggers`,
  "@n-models": `${__dirname}/models`,
  "@n-schemas": `${__dirname}/schemas`,
  "@n-configs": `${__dirname}/configs`,
  "@n-rooms": `${__dirname}/rooms`,
  "@n-types": `${__dirname}/types`,
  "@n-database": `${__dirname}/database`,
  "@n-commands": `${__dirname}/commands`,
  "@n-adapters": `${__dirname}/adapters`,
  "@n-queues": `${__dirname}/queues`,
  "@n-apis": `${__dirname}/apis`,
  "@n-controllers": `${__dirname}/controllers`,
  "@n-validators": `${__dirname}/validators`,
  "@n-routes": `${__dirname}/routes`,
  "@n-templates": `${__dirname}/templates`,
  "@n-helper": `${__dirname}/helper`,
});

import "reflect-metadata";
import { checkQueueConnection } from "@n-configs/queue";
import { checkDatabaseConnection } from "./configs/database";

import ExpressServer from "./ExpressServer";

async function bootstrap() {
  await checkDatabaseConnection();
  await checkQueueConnection();
}

function init() {
  const expressServer = new ExpressServer();
  expressServer.start();
}

bootstrap().then(() => {
  init();
});
