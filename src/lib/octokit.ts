import toast from "react-hot-toast";
import { Octokit } from "octokit";
import { generateRoomDescription } from "@/lib/faker";

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

export const createRepo = async (octokit: Octokit, name: string) => {
  try {
    const res = await octokit.rest.repos.createForAuthenticatedUser({
      name,
      description: `Created from Code Crush: ${generateRoomDescription()}`,
    });

    toast.success(`Created repo called '${res.data.name}'`);
  } catch (error) {
    toast.error((error as Error).message);
  }
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
  body: {
    owner: string;
    email: string;
    sha: string;
    content: string;
    repo: string;
  }
) => {
  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    path: "README.md",
    message: "Uploaded Code from Code Crush",
    committer: {
      name: body.owner,
      email: body.email,
    },
    author: {
      name: body.owner,
      email: body.email,
    },
    ...body,
  });

  return data;
};
