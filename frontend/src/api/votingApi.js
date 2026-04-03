import apiClient from "./client";

export const getActiveElectionPositions = () => apiClient.get("/voting/elections/active/positions/");

export const getCandidatesByPosition = (positionId) =>
  apiClient.get(`/voting/positions/${positionId}/candidates/`);

export const createElection = (payload) => apiClient.post("/voting/elections/create/", payload);

export const createPosition = (payload) => apiClient.post("/voting/positions/create/", payload);

export const createCandidate = (payload) => apiClient.post("/voting/candidates/create/", payload);

export const castVote = (payload) => apiClient.post("/voting/votes/cast/", payload);

export const getResults = (electionId) =>
  apiClient.get("/voting/results/", {
    params: electionId ? { election_id: electionId } : {},
  });
