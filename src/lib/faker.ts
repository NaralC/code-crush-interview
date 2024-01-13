import { faker } from "@faker-js/faker";

export const generateUsername = () => faker.internet.userName();

export const generateRoomName = () => faker.company.name();

export const generateRoomDescription = () => faker.company.catchPhrase();

export const generateRepoName = () => faker.git.commitMessage();
