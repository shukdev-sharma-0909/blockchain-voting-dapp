import React, { useEffect, useMemo, useState } from "react";
import Navigation from "./Navigation";
import List from "../components/List";
import UserCard from "../components/UserCard";
import ElectionCard from "../components/ElectionCard";
import Winner from "../components/Winner";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import { toast } from "sonner";

const Dashboard = ({ state, info, details, pIdEc, setinfo }) => {
  const [loading, setLoading] = useState(false);

  const queryUrl = "https://api.studio.thegraph.com/query/55899/testing/version/latest";
  const client = useMemo(
    () =>
      createClient({
        url: queryUrl,
        exchanges: [cacheExchange, fetchExchange],
      }),
    []
  );

  const buildQuery = (pollId, electionCommission) => `{
    ecWinners(first: 10, where: {_electionCommission: "${(electionCommission || "").toLowerCase()}"}) {
      id
      _info_pollId
      _info_winnerName
      _info_partyName
      _electionCommission
    }
    candidates(first: 100, where: {_pollId: "${pollId ?? ""}"}) {
      id
      _name
      _party
      _candidateId
      _electionCommission
      _pollId
    }
    voters(where: {_pollId: "${pollId ?? ""}"}, first: 100) {
      _name
      _voterAdd
      _votedTo
      _pollId
      _electionCommission
    }
  }`;

  useEffect(() => {
    if (!state?.contract) {
      return;
    }

    const getPidEc = async () => {
      try {
        const pollId = Number(await state.contract.nextPollId());
        const electionCommission = await state.contract.electionCommission();
        if (typeof details === "function") {
          details(pollId, electionCommission);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error?.reason || error?.shortMessage || error?.message || "Unable to fetch poll details"
        );
      }
    };

    getPidEc();
  }, [details, state?.contract]);

  useEffect(() => {
    if (!state?.contract) {
      return;
    }

    if (!pIdEc?.pollId || Number(pIdEc.pollId) <= 0) {
      if (typeof setinfo === "function") {
        setinfo(undefined);
      }
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const query = buildQuery(pIdEc.pollId, pIdEc.EcAddress);
        const { data, error } = await client.query(query).toPromise();

        if (error) {
          throw error;
        }

        if (typeof setinfo === "function") {
          setinfo(data ?? {});
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client, pIdEc?.EcAddress, pIdEc?.pollId, setinfo, state?.contract]);

  const isConnected = Boolean(state?.contract);
  const candidates = Array.isArray(info?.candidates) ? info.candidates : [];
  const hasCandidates = candidates.length > 0;

  return (
    <div className="flex  h-[100%]  space-x-12 ">
      <Navigation />
      <div className=" p-4 w-full flex space-x-20 dark:text-slate-50">
        {/* Candidate detail cards starts */}
        <div className=" w-[60%] h-[100%] p-4 " id="UserVotingStatus">
          <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">Registered Candidates</h1>

          {!isConnected ? (
            <div className="w-[100%] min-h-[200px] flex items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-600">
              <p className="text-gray-600 dark:text-gray-300 text-lg text-center">
                Connect your wallet to load dashboard data.
              </p>
            </div>
          ) : (
            <div className=" w-[100%] gap-4">
              {/* Candidate detail cards start here */}
              {hasCandidates ? (
                <div className="grid grid-rows-2 grid-flow-col gap-12 w-[90%] md:mb-10">
                  {candidates.map((candidate) => (
                    <List
                      state={state}
                      key={candidate.id || `${candidate._candidateId}-${candidate._pollId}`}
                      name={candidate._name}
                      party={candidate._party}
                      id={Number(candidate._candidateId)}
                      setValue={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-rows-1 grid-flow-col gap-12 w-[90%] md:mb-10">
                  <List setValue={false} loading={loading} />
                </div>
              )}
              {/* Candidate detail cards end here */}

              {/* Winner starts here */}
              <div className=" w-[90%] ">
                <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">Winner</h1>
                <Winner state={state} />
              </div>
              {/* Winner ends here */}
            </div>
          )}
        </div>
        {/* Candidate detail cards ends */}

        {/* Election and user detail cards starts */}
        <div className=" w-[35%] h-[100%] p-4 flex flex-col space-y-10 " id="UserVotingStatus">
          <ElectionCard state={state} info={info} />
          <UserCard state={state} />
        </div>
        {/* Election and user detail cards ends */}
      </div>
    </div>
  );
};

export default Dashboard;

// THE REST OF THE FILE CONTAINS LEGACY COMMENTED CODE THAT WAS KEPT FOR REFERENCE
// ...
