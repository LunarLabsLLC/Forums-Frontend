import HeaderContext from "@/components/HeaderContext";

export default function Page() {
  const headerContent: [string, string] = ["Radio", `Listen to the best of MC music. Let's feel some nostalgia?`];
  return <>
    <HeaderContext setTo={headerContent}/>
    <section className="flex flex-col justify-center items-center min-h-0">
      <div className="flex flex-row flex-wrap h-min w-full max-w-screen-xl inner bg-base-300 rounded-xl overflow-hidden p-2 gap-2">

      </div>
    </section>
  </>;
}