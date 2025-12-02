import React, { useEffect, useState } from "react";

const Card = ({ state }) => {
  const [register, setRegister] = useState(false);
  const [voted, setVoted] = useState(false);
  const [voterId, setVoterId] = useState(null);

  const voterRegisteredCheck = async () => {
    if (!state?.contract) {
      setRegister(false);
      return false;
    }

    try {
      const check = await state.contract.checkVoterRegistered();
      setRegister(check);
      return check;
    } catch (error) {
      console.log(error);
      setRegister(false);
      return false;
    }
  };

  const votedOrNot = async () => {
    if (!state?.contract) {
      setVoted(false);
      return;
    }

    try {
      const check = await state.contract.checkVotedOrNot();
      setVoted(check);
    } catch (error) {
      console.log(error);
      setVoted(false);
    }
  };

  const checkVoterId = async () => {
    if (!state?.contract) {
      setVoterId(null);
      return;
    }

    try {
      const id = Number(await state.contract.checkVoterID());
      setVoterId(id > 0 ? id : null);
    } catch (error) {
      console.log(error);
      setVoterId(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!state?.contract || !mounted) {
        return;
      }

      const isRegistered = await voterRegisteredCheck();
      await votedOrNot();

      if (isRegistered) {
        await checkVoterId();
      } else {
        setVoterId(null);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [state?.contract]);

  return (
    <div className="w-[90%]  rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
      <div className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900">
        <div className="grid grid-flow-col grid-rows-4 gap-4 items-center justify-start">
          <div className="col-span-3 ">
            <p className="ml-[36%] text-md font-semibold tracking-wide ">User Status</p>
          </div>

          <div className="col-span-3 flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-600  dark:text-gray-400 tracking-wide">Registered:</h3>
            {register ? (
              <span className="text-sm font-light tracking-wide text-[#2ABB94]">Voter registered</span>
            ) : (
              <span className="text-sm font-light tracking-wide text-[#F784AD]">Voter not registered</span>
            )}
          </div>

          <div className="col-span-3 flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-600  dark:text-gray-400 tracking-wide">Voter Id:</h3>
            {register && voterId ? (
              <span className="text-sm font-light tracking-wide text-[#2ABB94]">{voterId}</span>
            ) : (
              <span className="text-sm font-light tracking-wide text-[#F784AD]">Voter not registered</span>
            )}
          </div>

          <div className="col-span-3 flex  items-center gap-2 ">
            <h3 className="text-sm font-medium text-gray-600  dark:text-gray-400 tracking-wide">Voted:</h3>
            {voted ? (
              <span className="text-sm font-light tracking-wide text-[#2ABB94]">Voted</span>
            ) : (
              <span className="text-sm font-light tracking-wide text-[#F784AD]">Not Voted</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
// {/* <span className="text-sm font-light tracking-wide text-[#2ABB94]">
//     Voter registered
// </span> */}
