import toast from "react-hot-toast";
import { Octokit, RequestError } from "octokit";
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

export const checkOrCreateReadme = async (
  octokit: Octokit,
  body: { owner: string; repo: string; path: string; }
) => {
  try {
    const resForSHA = await octokit.rest.repos.getContent({
      ...body,
    });
    // @ts-ignore
    return resForSHA.data.sha as string;
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      toast("Repository empty — creating a README.md");
      return undefined
    } else {
      toast.error((error as Error).message);
    }
  }
};

// TODO: Replace hard-coded values
export const uploadCode = async (
  octokit: Octokit,
  body: {
    owner: string;
    email: string;
    sha?: string;
    content: string;
    repo: string;
  }
) => {
  try {
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
    console.log("File created or updated:", data);
    return data;
  } catch (error) {
    console.error("Error creating or updating file:", error);
    throw error;
  }
};
