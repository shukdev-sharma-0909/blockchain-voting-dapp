import React, { useEffect, useState } from "react";

const Winner = ({ state }) => {
  const [pollEnded, setPollEnded] = useState(false);
  const [endTimeInUnix, setUnixTime] = useState(0);
  const [winnerInfo, setWinnerInfo] = useState({
    candidateId: null,
    name: null,
    party: null,
  });

  const getTime = async () => {
    if (!state?.contract) {
      return;
    }

    try {
      const endTime = Number(await state.contract.endTime());
      setUnixTime(endTime);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWinner = async () => {
    if (!state?.contract) {
      return;
    }

    try {
      const val = await state.contract.EcPollInfo();
      const id = Number(val[0]);
      const name = val[1];
      const party = val[2];
      setWinnerInfo({ id, name, party });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTime();
  }, [state?.contract]);

  useEffect(() => {
    if (!endTimeInUnix) {
      setPollEnded(false);
      return;
    }

    const update = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (endTimeInUnix > currentTime) {
        setPollEnded(false);
      } else {
        setPollEnded(true);
        await fetchWinner();
      }
    };

    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [endTimeInUnix]);

  return (
    <>
      <div className="w-[100%]  rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
        <div className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 ">
          <div className="flex gap-4 items-center justify-around">
            {/* party and name starts here  */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-white">
                {pollEnded ? winnerInfo.name || "--" : "Winner will appear here"}
              </h3>
            </div>
            {/* party and name ends here  */}

            {/* candidate id starts here  */}
            <div>
              <h3 className="text-lg font-light text-gray-700 dark:text-gray-600">Party</h3>
              <span className="text-sm tracking-wide text-gray-600 dark:text-gray-400">
                {pollEnded ? winnerInfo.party || "--" : "--"}
              </span>
            </div>
            {/* candidate id ends here  */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Winner;
