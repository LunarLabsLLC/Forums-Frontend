'use client';

import './styles.css'
import useSession from "@/hooks/useSession";
import { FormEvent, useEffect, useRef, useState } from "react";
import { isResultError, newUuid } from "@/libs/Utils";
import Ticket from '@/libs/types/entities/Ticket';
import { CreateReplyTicket } from '@/services/forum/ticket/TicketService';
import TicketCategory from '@/libs/types/entities/TicketCategory';

export interface WriteReplyData {
  parentTicket: Ticket;
  categories: TicketCategory[]
}
const WriteReply = (props: WriteReplyData) => {
  const { parentTicket, categories } = props
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();
  const input = useRef<HTMLTextAreaElement>(null);
  const hiddenDiv = useRef<HTMLDivElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
 
    try {
      const formData = new FormData(event.currentTarget);

      const author = session?.uuid
      if (!author) throw new Error("You're not logged in.")

      const body = formData.get("reply")!.toString()
      if (!body) throw new Error("Please write a reply.")

      // const parentId = `${forumId}.${threadId}`
      // const id = `${parentId}.${newUuid().split('-')[0]}`
      const id = newUuid();

      // if (latestReply) {
      //   const thisPost = getReplyTemplate('', body, forumId, author, parentId, session.username)
      //   latestReply.value._id = ''
      //   latestReply.value.createdAt = '';
      //   if (JSON.stringify(thisPost) == JSON.stringify(latestReply.value)) throw new Error("You just posted that!")
      // }

      const reply: Ticket = {
        _id: id,
        author: author,
        body: body,
        category: categories.find(c => c.name == "Reply")!._id,
        createdAt: Date.now().toFixed(),
        lastUpdatedAt: Date.now().toFixed(),
        parentTicket: parentTicket._id,
        status: "Sent",
        title: `Reply to ${parentTicket._id}`,
        replies: [],
      }

      CreateReplyTicket(reply)
        .then(res => {
          if (isResultError(res)) {
            setError("HTTP " + res[1]);
            setIsLoading(false);
          } else window.location.reload();
        });
      
      // input.current!.value = ""

      // const newReply: any = getReplyTemplate(id, body, forumId, author, parentId, session.username)
      // newReply.createdAt = new Date().getTime().toString();
      // updateReplies({isAdd: true, value: newReply})
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    input.current!.oninput = () => {
      hiddenDiv.current!.innerHTML = input.current!.value + "\n\n";
      hiddenDiv.current!.style.display = "block";
      hiddenDiv.current!.hidden = true;
      input.current!.style.height = hiddenDiv.current!.offsetHeight + "px";
      hiddenDiv.current!.style.display = "none";
      hiddenDiv.current!.hidden = false;
    }
  }, [])

  const isDisabled = parentTicket.status != "open";

  return <>
    <form onSubmit={onSubmit} className="items-center w-full rounded-lg h-fit py-3">
      <div className="relative flex flex-col flex-1 mr-1 h-min">
        <span className="absolute mt-[-26px] bg-base-300 px-2">{error && <p className="text-error mb-1">{error}</p>}</span>
        <textarea disabled={isDisabled} ref={input} name="reply" placeholder="Type a reply..." className="input w-full bg-base-100 content-color" required/>
        <div id="replyhiddendiv" ref={hiddenDiv} className="py-2" />
      </div>
      <button className="btn btn-primary bg-green-800 border-none hover:bg-green-900 flex mt-3 px-2 items-center font-semibold h-8 min-h-8" disabled={isLoading || isDisabled} type="submit">
        {(() => {
          if (isDisabled)
            return "Ticket is closed";
          if (isLoading)
            return "On it...";
          return "Send";
        })()}
      </button>
    </form>
  </>;
}
export default WriteReply;
//
// const getReplyTemplate = (id: string, body: string, forumId: string, author: string, parentId: string, username: string) => ({
//   _id: id,
//   title: "",
//   body: body,
//   forum: forumId,
//   author: author,
//   createdAt: '',
//   lastEditedBy: null,
//   lastEditedAt: "-1",
//   lastReplyAt: "-1",
//   pinned: false,
//   locked: false,
//   parentThreadId: parentId,
//   authorName: username,
//   authorWebColor: "",
//   forumName: "",
//   replies: []
// })
