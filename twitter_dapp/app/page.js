"use client";

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import abi from "./abi/abi"
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useAccount, useAccountEffect, useReadContract, useWriteContract } from 'wagmi'

export default function Home() {

  const contractAddress = '0x0eADaD1E3282e60cBfFc94EA72e6Af1c5080fb8e'

  const account = useAccount();

  const [formData, setFormData] = useState("");

  const { writeContract } = useWriteContract()

  const { data, refetch } = useReadContract({
    abi,
    address: '0x1912887088D5a7E22D42676914C7FbE492b018cD',
    functionName: "getAllTweets",
  })

  function handleSubmit(e) {
    e.preventDefault();
  }

  // useAccountEffect({
  //   onConnect(data) {
  //     console.log('Connected!', data)
  //   },
  //   onDisconnect() {
  //     console.log('Disconnected!')
  //   },
  // })

  // const { data: readContract, isSuccess: readContractSuccess } = useReadContract({
  //   abi,
  //   address: contractAddress,
  //   functionName: 'getAllTweets',
  //   args: []
  // })

  return (
    <>
      <nav className="bg-[#eee] shadow-md text-[#333] p-5 flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-[blue] cursor-pointer">TwiDap</h1>
        <ConnectButton />
      </nav>

      <div className="w-[50%] m-auto mt-20">
        <h1 className="text-center font-bold text-[40px] mb-10">Twitter Dapp</h1>
        <form onSubmit={handleSubmit}>
          <textarea name="tweetId" cols={5} placeholder="Type tweet..." className="bg-[#eee] p-2 rounded-md w-full outline-none border-none text- text-[#333]" onChange={(e) => {
            setFormData(e.target.value)
          }} />
          <div className="flex items-center gap-3">
            <button type="submit" className="mt-5 px-5 py-2 bg-[#0E76FD] rounded-md" onClick={() => {
              writeContract({
                abi,
                address: contractAddress,
                functionName: 'createTweet',
                args: [setFormData],
              })
            }}>
              Tweet
            </button>

            <button className="mt-5 px-5 py-2 bg-[#0E76FD] rounded-md" onClick={() => refetch({})}>
              Get all tweets
            </button>
          </div>
        </form>
      </div>

      <div className="w-[50%] m-auto">
        <ul className="mt-10">
          {data ? data?.map((datas, index) => {
            return <li key={datas.index} className="bg-[#eee] text-[#333] p-5 rounded-md m-2">{datas?.toString()}</li>
          }) : <li className="bg-[#eee] text-[#333] p-5 rounded-md m-2">No tweets yet!</li>}
        </ul>
      </div>
    </>
  );
}

