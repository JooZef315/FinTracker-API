/* eslint-disable prettier/prettier */
import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/common/graphqlDefinitions.ts'),
  outputAs: 'class',
  watch: true,
});
