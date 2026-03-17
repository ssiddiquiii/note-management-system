import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={imgSrc} alt="No notes" className="w-60 opacity-80 mix-blend-multiply dark:mix-blend-screen" />

      <p className="w-1/2 text-sm font-medium text-[var(--text-secondary)] text-center mt-5 leading-relaxed">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
