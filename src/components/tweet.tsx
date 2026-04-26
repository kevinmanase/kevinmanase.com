import { Tweet as ReactTweet } from "react-tweet";

export function Tweet({ id }: { id: string }) {
  return (
    <div className="my-6 flex justify-center [&>div]:my-0">
      <ReactTweet id={id} />
    </div>
  );
}
