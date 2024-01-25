'use client';
import './styles.css';
import Image from "next/image";
import useMcUuid from "@/hooks/useMcUuid";
import React from 'react';
import HashLink from "@/components/HashLink";

interface MCBustProps {
  username?: string;
  className?: string;
  shadowColor?: string;
}
const MCBust = ({ username: username, className: className, shadowColor: shadowColor = "#ee0000" }: MCBustProps) => {
  const defaultUrl = '/img/fem-alex-head.png';
  const uuid = useMcUuid(username);
  const title = username ?? "Fem Alex's Head";
  return (
    <HashLink href={`/u/${username}`} className={`w-fit h-fit text-center flex items-center justify-center mc-head ${className}`}
      style={{filter: `drop-shadow(0px 0px 5px ${shadowColor})`}}
    >
      <svg className="my-px mx-[3px]" height="70" width="61" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="hex-small">
            <path d="M24.248711305964278 3.4999999999999996Q30.31088913245535 0 36.373066958946424 3.5L54.55960043841963 14Q60.6217782649107 17.5 60.6217782649107 24.5L60.6217782649107 45.5Q60.6217782649107 52.5 54.55960043841963 56L36.373066958946424 66.5Q30.31088913245535 70 24.24871130596428 66.5L6.06217782649107 56Q0 52.5 0 45.5L0 24.5Q0 17.5 6.062177826491071 14Z"></path>
          </clipPath>
        </defs>
        <foreignObject className="text-left" width="130%" height="100%" clipPath="url(#hex-small)">
          <Image className="mt-[-3px] ml-[-10px]" width={180} height={191} title={title} alt={title} src={uuid ? `https://skins.mcstats.com/skull/${uuid}` : defaultUrl}/>
        </foreignObject>
      </svg>
    </HashLink>
  );
}
export default MCBust;