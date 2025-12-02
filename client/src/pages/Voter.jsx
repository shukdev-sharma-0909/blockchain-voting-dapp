import React from "react";
import Navigation from "./Navigation";
import { toast } from "sonner";

const Voter = ({ state, handleCase }) => {
  const handleVoterInfo = async (event) => {
    event.preventDefault();

    if (!state?.contract) {
      toast.error("Connect your wallet before registering as a voter.");
      return;
    }

    const nameInput = document.querySelector("#nameV");
    const ageInput = document.querySelector("#ageV");
    const genderInput = document.querySelector("#genderV");

    const rawName = nameInput?.value.trim();
    const rawAge = ageInput?.value.trim();
    const rawGender = genderInput?.value.trim();

    if (!rawName || !rawAge || !rawGender) {
      toast.error("Please fill in all voter details.");
      return;
    }

    const age = Number(rawAge);
    if (!Number.isInteger(age) || age <= 0) {
      toast.error("Age must be a positive number.");
      return;
    }

    const voterInfo = {
      name: handleCase(rawName),
      age,
      gender: handleCase(rawGender),
    };

    try {
      const tx = await state.contract.voterRegister(
        voterInfo.name,
        voterInfo.age,
        voterInfo.gender
      );
      await tx.wait();
      toast.success(`Voter ${voterInfo.name} registered successfully.`);
    } catch (error) {
      console.table(error);
      toast.error(error?.reason || error?.shortMessage || error?.message || "Transaction failed");
    }
  };

  const handleVoting = async (event) => {
    event.preventDefault();

    if (!state?.contract) {
      toast.error("Connect your wallet before voting.");
      return;
    }

    const voterIdValue = Number(document.querySelector("#voterId")?.value.trim());
    const candidateIdValue = Number(document.querySelector("#candidateId")?.value.trim());

    if (!Number.isInteger(voterIdValue) || voterIdValue <= 0) {
      toast.error("Enter a valid voter id.");
      return;
    }

    if (!Number.isInteger(candidateIdValue) || candidateIdValue <= 0) {
      toast.error("Enter a valid candidate id.");
      return;
    }

    try {
      const tx = await state.contract.vote(voterIdValue, candidateIdValue);
      await tx.wait();
      toast.success("User voted successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error?.reason || error?.shortMessage || error?.message || "Transaction failed");
    }
  };

  return (
    <>
      <div className="flex  h-[100%] space-x-32">
        <Navigation />
        <div className="w-[60%] h-[70%]">
          <div className="grid grid-flow-col gap-10">
            {/* voter registration starts */}
            <div className="flex flex-col justify-center items-center mt-[10%]">
              <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">
                Voter Registration
              </h1>

              {/* Form for voter registraation starts here */}
              <form className="grid grid-rows-2 grid-flow-col gap-10 justify-center" onSubmit={handleVoterInfo}>
                <div className="grid grid-rows-3 grid-flow-col gap-10">
                  <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
                    <input
                      className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10"
                      placeholder="Enter name"
                      name="nameV"
                      id="nameV"
                    ></input>
                  </div>

                  <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
                    <input
                      className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10"
                      placeholder="Enter age"
                      name="ageV"
                      id="ageV"
                    ></input>
                  </div>

                  <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
                    <input
                      className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10"
                      placeholder="Enter gender"
                      name="genderV"
                      id="genderV"
                    ></input>
                  </div>
                </div>

                {/* Button */}
                <div className="w-[100%] rounded-3xl p-px ">
                  <button
                    className="relative inline-flex ml-32 items-center justify-center  p-0.5 rounded-full  mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900  group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all  duration-200 shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)]"
                    type="submit"
                  >
                    <span className="relative px-5 py-2 transition-all rounded-calc(1.5rem- 1px)] ease-in-out duration-700 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
                      Register
                    </span>
                  </button>
                </div>
              </form>
              {/* Form for voter registraation ends here */}
            </div>
            {/* voter registration ends */}

            {/* Vote starts */}
            <div className="flex flex-col justify-center items-center mt-[10%]">
              <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">
                Vote
              </h1>
              {/* Vote form starts here */}
              <form className="grid grid-rows-2 grid-flow-col gap-10" onSubmit={handleVoting}>
                <div className="grid grid-rows-2 grid-flow-col gap-10">
                  <div className="w-[100%] col-span-9  rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
                    <input
                      className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10"
                      placeholder="Enter voter id"
                      name="voter Id"
                      id="voterId"
                      type="number"
                    ></input>
                  </div>

                  <div className="w-[100%] col-span-9  rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
                    <input
                      className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10"
                      placeholder="Enter candidate id"
                      name="candidate Id"
                      id="candidateId"
                      type="number"
                    ></input>
                  </div>
                </div>

                {/* Button */}
                <div className="w-[100%] rounded-3xl p-px ">
                  <button
                    className="relative inline-flex ml-32 items-center justify-center  p-0.5 rounded-full  mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900  group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all  duration-200 shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)]"
                    type="submit"
                  >
                    <span className="relative px-5 py-2 transition-all rounded-calc(1.5rem- 1px)] ease-in-out duration-700 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
                      Vote
                    </span>
                  </button>
                </div>
              </form>
              {/* Vote form ends here */}
            </div>
            {/* Vote ends */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Voter;

// {/* <div className=" w-[60%]  h-[90%] flex justify-center items-center space-x-20">
//              <div className="flex flex-col justify-center items-center  space-y-6">
//                  <h1 className='p-2 px-6 font-semibold text-[#F784AD] shadow rounded-md dark:bg-slate-900 dark:shadow-cyan-500/50'>Registration of voter</h1>
//                  <form className="grid grid-rows-5 grid-flow-col gap-10" onSubmit={handleVoterInfo}>
//                      <input className='dark:bg-slate-950 shadow-xl dark:shadow-cyan-500/50 dark:text-slate-200 rounded-md p-2 w-96 h-10' placeholder='Enter name' name='nameV' id='nameV'></input>
//                      <input className='dark:bg-slate-950 shadow-xl dark:shadow-cyan-500/50 dark:text-slate-200 rounded-md p-2 w-96 h-10' placeholder='Enter age' name='ageV' id='ageV'></input>
//                      <input className='dark:bg-slate-950 shadow-xl dark:shadow-cyan-500/50 dark:text-slate-200 rounded-md p-2 w-96 h-10' placeholder='Enter gender' name='genderV' id='genderV'></input>
//                      <button className=" bg-[#4263EB] p-3 ml-32 w-[30%] rounded-md text-white hover:bg-[#4e6dec] shadow-2xl shadow-[#4e6dec] transition-all ease-in-out" type='submit'>Register</button>
//                  </form>
//              </div> */}

//              {/* <div className='flex  flex-col justify-center items-center space-y-6'>
//                 <h1 className='p-2 px-6  font-semibold text-[#F784AD] shadow rounded-md dark:bg-slate-900 dark:shadow-cyan-500/50'>Voting</h1>
//                 <form className='grid grid-rows-5 grid-flow-col gap-10' onSubmit={handleVoting}>
//                      <input className='dark:bg-slate-950 shadow-xl dark:shadow-cyan-500/50 dark:text-slate-200 rounded-md p-2 w-96 h-10' placeholder='Enter Voter Id' name='voter Id' id='voterId' type='number'></input>
//                      <input className='dark:bg-slate-950 shadow-xl dark:shadow-cyan-500/50 dark:text-slate-200 rounded-md p-2 w-96 h-10' placeholder='Enter Candidate Id' name='candidate Id' id='candidateId' type='number'></input>
//                      <button className=" bg-[#4263EB] p-3 ml-32 w-[30%] rounded-md text-white hover:bg-[#4e6dec] shadow-2xl shadow-[#4e6dec] transition-all ease-in-out" type='submit'>Vote</button>
//                 </form>
//              </div>

// <div className="flex flex-col justify-center items-center mt-[10%]" >
// <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl ">Voter Registration</h1>

// <form className="grid grid-rows-6 grid-flow-col gap-10" onSubmit={handleVoterInfo}>

//       <div className="w-[100%] col-span-5  rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
//           <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10" placeholder='Enter name' name='nameV' id='nameV' ></input>
//       </div>
//       <div className="w-[100%] col-span-5 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
//           <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10" placeholder='Enter age' name='ageV' id='ageV' ></input>
//       </div>
//       <div className="w-[100%] col-span-5 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
//           <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10" placeholder='Enter gender' name='genderV' id='genderV'></input>
//       </div>
//       {/* <div className="w-[100%] col-span-5 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 ">
//           <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200  h-10" placeholder="Enter gender" name="" id="gender"></input>
//       </div> */}

//       {/* <button className=" bg-[#4263EB] p-3 ml-32  rounded-md text-white hover:bg-[#4e6dec] shadow-2xl shadow-[#4e6dec] transition-all ease-in-out" type='submit'>Register</button> */}
//       <button className=" bg-[#4263EB] p-4 ml-32  rounded-md text-white hover:bg-[#4e6dec] shadow-2xl shadow-[#4e6dec] transition-all ease-in-out" type='submit'>Register</button>
// </form>
// </div>
