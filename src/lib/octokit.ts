import { Octokit } from "octokit";
import { generateRepoName, generateRoomDescription } from "@/lib/faker";

// The flow: retrieveSHA -> uploadCode
// The other 3 are optional repo stuff

export const initOctokit = (providerToken: string) =>
  new Octokit({
    auth: providerToken,
  });

export const repoExists = async (octokit: Octokit, checkFor: string) => {
  const res = await octokit.rest.repos.listForAuthenticatedUser();

  const exists = res.data.find(({ name }) => name === checkFor);

  return exists ? true : false;
};

// TODO: Turn repo name and description into props if needed
export const createRepo = async (octokit: Octokit) => {
    const repoName = generateRepoName();

  const res = await octokit.rest.repos.createForAuthenticatedUser({
    name: repoName,
    description: `Created from Code Crush: ${generateRoomDescription()}`,
  });

  console.log(`Created repo called '${res.data.name}'`);
};

export const retrieveSHA = async (
  octokit: Octokit,
  body: { owner: string; repo: string; path: string }
): Promise<string> => {
  const resForSHA = await octokit.rest.repos.getContent({
    ...body,
  });

  // @ts-ignore
  return resForSHA.data.sha;
};

// TODO: Replace hard-coded values
export const uploadCode = async (
  octokit: Octokit,
  body: { owner: string; email: string; sha: string }
) => {
  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    repo: "index-solid-state-program",
    path: "README.md",
    message: "😫😢😭🤡",
    content: window.btoa("me fr"),
    committer: {
      name: body.owner,
      email: body.email,
    },
    author: {
      name: body.owner,
      email: body.email,
    },
    // owner: owner,
    // sha: sha,
    ...body,
  });

  return data;
};

