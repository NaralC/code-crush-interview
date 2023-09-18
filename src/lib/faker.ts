import { faker } from "@faker-js/faker";

export const generateUsername = (): string => faker.internet.userName();

export const generateRoomName = (): string => faker.company.name();

export const generateRoomDescription = (): string =>
  faker.company.catchPhrase();
