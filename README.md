<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework Final Backend-JS Project repository. 
For correctly working project you will need PostgreSQL and Redis.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash

#in case database is not starting try migration in package.json. Click GREEN PLAY button near these commands: "typeorm": "typeorm-ts-node-commonjs  --dataSource ./ormconfig.ts",
#"migrate:generate": "npm run typeorm migration:generate ./src/database/migrations/init","migrate:run": "npm run typeorm -- migration:run" or try commands below:

$ npm run typeorm
$ npm run migrate:generate
$ npm run migrate:run

# watch mode
$ npm run start:dev
```




## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
