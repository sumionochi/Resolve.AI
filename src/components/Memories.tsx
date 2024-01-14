"use client"
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Camera, Divide, FlipHorizontal, Focus, MoonIcon, PersonStanding, SunIcon, Video, Volume2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import { toast } from "sonner"

type Props = {}

let interval: any = null;
let stopTimeout: any = null;

const Memories = (props: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const [mirrored, setMirrored] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false)
  const [volume, setVolume] = useState(0.8);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // initialize the media recorder
  useEffect(() => {
    if (webcamRef && webcamRef.current) {
      const stream = (webcamRef.current.video as any).captureStream();
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            const recordedBlob = new Blob([e.data], { type: 'video' });
            const videoURL = URL.createObjectURL(recordedBlob);

            const a = document.createElement('a');
            a.href = videoURL;
            a.download = `${formatDate(new Date())}.webm`;
            a.click();
          }
        };
        mediaRecorderRef.current.onstart = (e) => {
          setIsRecording(true);
        }
        mediaRecorderRef.current.onstop = (e) => {
          setIsRecording(false);
        }
      }
    }
  }, [webcamRef])

  return (
    <div className='flex overflow-hidden antialiased min-h-screen flex-col items-center justify-between'>
      <div className='w-full p-4 flex justify-center flex-col gap-4 items-center'>
          <h1 className='text-4xl text-white font-semibold'>Snap Some Memories</h1>  
          <Webcam ref={webcamRef}
            mirrored={mirrored}
            className='rounded-lg' 
            videoConstraints={{ facingMode: 'user' }}
          />
          <div className='flex flex-row gap-4'>
            <Button className='p-6 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl' onClick={() => {setMirrored((prev) => !prev)}}><FlipHorizontal /></Button>
            <Button className='p-6 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl' onClick={userPromptScreenshot}>
                <Camera />
            </Button>    
            <Button className={cn('p-6 shadow-md shadow-black border-none bg-gradient-to-br from-rose-700 to-pink-600 text-white rounded-xl')} onClick={userPromptRecord}>
              {!isRecording ? <Video /> : <Focus/>}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button className='p-6 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl' >
                  <Volume2 />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='p-6 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl'>
                <Slider
                  max={1}
                  min={0}
                  step={0.2}
                  defaultValue={[volume]}
                  onValueCommit={(val) => {
                    setVolume(val[0]);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
      </div>
    </div>              
  )

  function userPromptScreenshot() {

    // take picture
    if(!webcamRef.current){
      toast('Camera not found. Please refresh');
    }else{
      const imgSrc = webcamRef.current.getScreenshot();
      console.log(imgSrc);
      const blob = base64toBlob(imgSrc);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formatDate(new Date())}.png`
      a.click();
    }
    // save it to downloads

  }

  function userPromptRecord() {

    if (!webcamRef.current) {
      toast('Camera is not found. Please refresh.')
    }

    if (mediaRecorderRef.current?.state == 'recording') {
      // check if recording
      // then stop recording 
      // and save to downloads
      mediaRecorderRef.current.requestData();
      clearTimeout(stopTimeout);
      mediaRecorderRef.current.stop();
      toast('Recording saved to downloads');

    } else {
      // if not recording
      // start recording 
      startRecording(false);
    }
  }

  function startRecording(doBeep: boolean) {
    if (webcamRef.current && mediaRecorderRef.current?.state !== 'recording') {
      mediaRecorderRef.current?.start();
      doBeep

      stopTimeout = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.requestData();
          mediaRecorderRef.current.stop();
        }

      }, 30000);
    }
  }

  function toggleAutoRecord() {
    if (autoRecordEnabled) {
      setAutoRecordEnabled(false);
      toast('Autorecord disabled')
      // show toast to user to notify the change

    } else {
      setAutoRecordEnabled(true);
      toast('Autorecord enabled')
      // show toast
    }

  }
}

export default Memories


function formatDate(d: Date) {
  const formattedDate =
    [
      (d.getMonth() + 1).toString().padStart(2, "0"),
      d.getDate().toString().padStart(2, "0"),
      d.getFullYear(),
    ]
      .join("-") +
    " " +
    [
      d.getHours().toString().padStart(2, "0"),
      d.getMinutes().toString().padStart(2, "0"),
      d.getSeconds().toString().padStart(2, "0"),
    ].join("-");
  return formattedDate;
}

function base64toBlob(base64Data: any) {
  const byteCharacters = atob(base64Data.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteCharacters.length);
  const byteArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: "image/png" }); // Specify the image type here
}