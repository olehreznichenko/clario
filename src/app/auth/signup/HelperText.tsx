import type { ErrorState } from "./page";

export const HelperText = ({
  message,
  errorState,
}: {
  message: string;
  errorState: ErrorState;
}) => {
  const colour =
    errorState === "error"
      ? "text-[#FF8080]"
      : errorState === "initial"
        ? ""
        : "text-[#27B274B2]";
  return (
    <span className={`${colour} text-[13px] leading-[18px] ml-5 font-normal`}>
      {message}
    </span>
  );
};
