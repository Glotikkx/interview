"use client"

import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image'
import { useRouter } from 'next/navigation'; // Changed from 'next/router' to 'next/navigation'
import React, { useEffect, useState } from 'react'

enum CallStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    CONNECTING = "CONNECTING",
    FINISHED = "FINISHED",
}

interface AgentProps {
    userName: string;
    userId: string;
    type: string;
}

interface SavedMessage {
  role : "user" | "system" | "assistant";
  content: string;
}

const Agent = ({userName, userId, type}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    }; 

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) router.push("/");
  }, [messages, callStatus, type, userId, router]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
    <div className="call-view">
        <div className="card-interview" style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
            <div className="avatar"> 
                <Image src="/ai-avatar.png" alt="vapi"
                width={65} height={54} className="object-cover" />
                {isSpeaking && <span className="animate-speak"/>}
            </div> 
            <h3>Ai Interviewer</h3>
        </div>

    <div className="card-border" style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}> 
        <div className="card-content">
            <Image src="/user-avatar.png" alt="user avatar" 
            width={540} height={540} className="rounded-full object-cover size-[120px]" />
            <h3>{userName}</h3>
        </div>
    </div>
    </div>
    {messages.length > 0 && (
        <div className="transcript-border" style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
            <div className="transcript">
                <p key={latestMessage} className={cn(
                    "transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100"
                )}>
                    {latestMessage}
                </p>
            </div>
        </div>
    )}
   <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick = {handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {isCallInactiveOrFinished
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick = {handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};
export default Agent;