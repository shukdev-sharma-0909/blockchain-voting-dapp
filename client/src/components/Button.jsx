import React from "react";
import { toast } from "sonner";

const Button = ({ event, id, state }) => {
  const vote = async () => {
    if (!state?.contract) {
      toast.error("Connect your wallet before voting.");
      return;
    }

    const candidateId = Number(id);
    if (!Number.isInteger(candidateId) || candidateId <= 0) {
      toast.error("Invalid candidate selected.");
      return;
    }

    try {
      const voterId = Number(await state.contract.checkVoterID());

      if (!Number.isInteger(voterId) || voterId <= 0) {
        toast.error("Register as a voter before casting a vote.");
        return;
      }

      const tx = await state.contract.vote(voterId, candidateId);
      await tx.wait();
      toast.success("You have successfully voted.");
    } catch (error) {
      console.error(error);
      toast.error(error?.reason || error?.shortMessage || error?.message || "Transaction failed");
    }
  };

  return (
    <button
      onClick={vote}
      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-normal rounded-2xl transition-all hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50 duration-700"
    >
      {event}
    </button>
  );
};

export default Button;
// hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)
