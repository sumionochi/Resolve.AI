"use client";

import { Resolve } from "@prisma/client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CreateResolve from "./CreateResolve";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  resolve: Resolve;
}

export default function ResolveDisplay({ resolve }: Props) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const wasUpdated = resolve.updatedAt > resolve.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? resolve.updatedAt : resolve.createdAt
  ).toDateString();

  const timeframeFrom = new Date(resolve.timeframeFrom);
  const timeframeTo = new Date(resolve.timeframeTo);
  const daysDifference = Math.floor(
    (timeframeTo.getTime() - timeframeFrom.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalSteps = resolve.nextSteps.length;


  return (
    <>
      {/* Card component for Resolve */}
      <Card className="cursor-pointer dark:bg-black shadow-md shadow-black bg-secondary transition-shadow hover:shadow-lg">
        <CardHeader onClick={() => setShowEditDialog(true)}>
          <CardTitle>{resolve.goal}</CardTitle>
          <CardDescription onClick={() => setShowEditDialog(true)}>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent onClick={() => setShowEditDialog(true)} className="mb-0 pb-0">
          <div className="mb-4">
            <p className="font-bold text-gray-600">Theme : <span className="text-primary font-normal">{resolve.theme}</span></p>
          </div>
          <div className="mb-4">
            <p className="font-bold text-gray-600">Timeframe : <span className="text-primary font-normal">{resolve.timeframeFrom} to {resolve.timeframeTo} in {daysDifference} days</span></p>
          </div>
          <div className="mb-4">
            <p className="font-bold text-gray-600">Description : <span className="text-primary font-normal">{resolve.describe}</span></p>
          </div>
          <div className="mb-4">
              <p className="font-bold text-gray-600">Total Steps to Complete : <span className="text-primary font-normal">{totalSteps}</span></p>
            </div>
        </CardContent>
        <div className="w-full flex justify-end">
          <Button className='p-3 m-6 shadow-md flex flex-row shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl' onClick={() => setShowEditDialog(false)}>
            <Link href="/memories" className="flex flex-row text-center justify-center items-center">
              <Bot className="w-5 h-5 mr-2"/>
              Let's Create Memories
            </Link>
          </Button>
        </div>
      </Card>
      <CreateResolve open={showEditDialog} setOpen={setShowEditDialog} toEdit={resolve}/>
    </>
  );
}