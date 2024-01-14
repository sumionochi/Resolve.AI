"use client"
import {createResolveSchema, CreateResolveSchema } from '@/lib/validation/dashboard'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog,DialogTitle, DialogContent, DialogFooter, DialogHeader } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ArrowLeft, ArrowRight, Loader2, MinusCircle, Plus, PlusCircle, Star, Trash } from 'lucide-react'
import { Resolve } from '@prisma/client'
import LoadingButton from './ui/loading-btn'
import { Droppable, Draggable, DragDropContext } from '@hello-pangea/dnd';
import { DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import styled from '@emotion/styled';


type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    toEdit?: Resolve, 
}

interface StyledDraggableProps {
    isDragging: boolean;
  }

const CreateResolve = ({open, setOpen, toEdit}: Props) => {
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [formStep, setFormStep] = React.useState(0);
    const router = useRouter();

    const StyledDraggable = styled.div<StyledDraggableProps>`
    top: auto !important;
    left: auto !important;
    background-color: ${props => (props.isDragging ? 'lightpurple' : 'initial')};
  `;
    const form = useForm<CreateResolveSchema>({
        resolver: zodResolver(createResolveSchema),
        defaultValues: {
            goal: toEdit?.goal || "",
            theme: toEdit?.theme|| "",
            timeframeFrom: toEdit?.timeframeFrom || "",
            timeframeTo: toEdit?.timeframeTo || "",
            describe: toEdit?.describe || "",
            nextSteps: toEdit?.nextSteps || [],
        },
    });   

    async function onSubmit(input:CreateResolveSchema) {
        console.log("reached the submission area")
        try{
            if (toEdit) {
                const response = await fetch("/api/resolve", {
                  method: "PUT",
                  body: JSON.stringify({
                    id: toEdit.id,
                    ...input,
                  }),
                });
                if (!response.ok) throw Error("Status code: " + response.status);
              } else {
                const response = await fetch("/api/resolve", {
                  method: "POST",
                  body: JSON.stringify(input),
                });
                if (!response.ok) throw Error("Status code: " + response.status);
                form.reset();
              }
            router.refresh();
            setOpen(false);
            setFormStep(0); 
        } catch (error){
            console.error(error);
            alert("Something went wrong, Please try again.");
        }
    }

    async function deleteEvent() {
        if (!toEdit) return;
        setDeleteInProgress(true);
        try {
          const response = await fetch("/api/resolve", {
            method: "DELETE",
            body: JSON.stringify({
              id: toEdit.id,
            }),
          });
          if (!response.ok) throw Error("Status code: " + response.status);
          router.refresh();
          setOpen(false);
        } catch (error) {
          console.error(error);
          alert("Something went wrong. Please try again.");
        } finally {
          setDeleteInProgress(false);
        }
    }

    const generateStep = async (index: number) => {
        const { goal, theme, nextSteps, timeframeFrom, timeframeTo, describe } = form.getValues();
        // Relevant data to get AI-generated question
        console.log(goal, theme, nextSteps, timeframeFrom, timeframeTo, describe)
        try {
          const response = await fetch('/api/generateStep', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: {
                    queryType: 'generateStep', // Set the desired queryType here
                    goal: goal,
                    theme: theme,
                    timeframeFrom: timeframeFrom,
                    timeframeTo: timeframeTo,
                    nextSteps: nextSteps.join('. '),
                    describe: describe 
                },
            }),
          });

          console.log('Response:', response);
      
          if (!response.ok) {
            throw new Error(`Failed to generate AI question. Status code: ${response.status}`);
          }
      
          const generatedQuestion = await response.json();

          console.log(`will now convert json to string :)`);

          const generatedQuestionString = generatedQuestion.question;

          console.log(`result : ${generatedQuestionString}`)
      
          // Updated the question
          const newQuestions = [...form.getValues('nextSteps')];
          newQuestions[index] = generatedQuestionString;
          form.setValue('nextSteps', newQuestions);
        } catch (error) {
          console.error('Error generating AI question:', error);
        }
    };
      
    async function onDragEnd(result: DropResult) {
        if (!result.destination) {return;}
      
        const newQuestions = [...form.getValues('nextSteps')];
        const [movedQuestion] = newQuestions.splice(result.source.index, 1);
        newQuestions.splice(result.destination.index, 0, movedQuestion);
      
        form.setValue('nextSteps', newQuestions);
      }

    const addSteps = () => {
        const newQuestions = [...form.getValues('nextSteps'), ''];
        form.setValue('nextSteps', newQuestions);
    };

    const removeStep = (index: number) => {
        const newQuestions = [...form.getValues('nextSteps')];
        newQuestions.splice(index, 1);
        form.setValue('nextSteps', newQuestions);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{toEdit ? "Edit Assessment" : "Add Assessment"}</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className={cn('space-y-3',{hidden: formStep == 1})}>
                            <FormField control={form.control} name='goal' render={({field})=>(
                            <FormItem>
                                <FormLabel>Your Goal</FormLabel>
                                <FormControl><Input placeholder='Goal: Learn New Skill...' {...field}/></FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}/>
                            <FormField control={form.control} name='theme' render={({field})=>(
                                <FormItem className='flex flex-col gap-0'>
                                    <FormLabel>Theme Of Your Goal</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Theme: Health Improvement...' {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name='timeframeFrom' render={({field})=>(
                            <FormItem className='flex flex-col gap-0'>
                                <FormLabel>Initial Date For Resolution</FormLabel>
                                <FormControl>
                                    <Input placeholder='Today' type="date" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}/>
                            <FormField control={form.control} name='timeframeTo' render={({field})=>(
                            <FormItem className='flex flex-col gap-0'>
                                <FormLabel>Expected Date to reach your goal</FormLabel>
                                <FormControl>
                                    <Input placeholder='Tomorrow' type="date" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}/>
                            <FormField control={form.control} name='describe' render={({field})=>(
                                <FormItem>
                                    <FormLabel>Elaborate Your Goal</FormLabel>
                                    <FormControl>
                                    <Textarea className='h-48' placeholder="Strong MERN development experience for 5+ years and experience in leading a team.
                                    • Expertise in JavaScript
                                    • HTML 5, CSS 3 & JSON
                                    • Superior ability to write good tests for 100% coverage in Jest or Mocha or Chai or Karma or Jasmine or Enzyme or Cypress
                                    • Excellent understanding of database, schema designing and hands-on complex SQL queries
                                    • Excellent understanding of REST services using NodeJS or Java Spring Boot" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>
                        <div className={cn('space-y-3',{hidden: formStep == 0})}>
                            <FormField control={form.control} name='nextSteps' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Steps To Achieve Your Goal</FormLabel>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="resolveId">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {form.getValues('nextSteps').map((nextSteps, index) => (
                                            <Draggable key={index} draggableId={`nextSteps-${index}`} index={index}>
                                            {(provided, snapshot, rubric) => (
                                                <StyledDraggable
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                isDragging={snapshot.isDragging}
                                                ref={provided.innerRef}
                                                >
                                                <FormItem>
                                                    <FormLabel>Step {index + 1}</FormLabel>
                                                    <div className='flex flex-col gap-2'>
                                                        <FormControl>
                                                            <Textarea
                                                                className='mb-2'
                                                                placeholder={`Enter question ${index + 1}`}
                                                                value={nextSteps}
                                                                onChange={(e) => {
                                                                const newQuestions = [...form.getValues('nextSteps')];
                                                                newQuestions[index] = e.target.value;
                                                                form.setValue('nextSteps', newQuestions);
                                                                }}
                                                            />
                                                        </FormControl>
                                                           <div className='flex flex-col gap-2 mb-4 sm:flex-row'>
                                                           <Button className="p-5 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-orange-300 text-white rounded-xl" type="button" onClick={() => generateStep(index)}>
                                                                <Star className="w-5 h-5 mr-2" />
                                                                Curate with AI
                                                            </Button>
                                                            <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-r text-white rounded-xl from-rose-700 to-pink-600' type="button" onClick={() => removeStep(index)}>
                                                                <Trash className="w-5 h-5 mr-2"/>
                                                                Remove Step
                                                            </Button>
                                                           </div>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                                </StyledDraggable>
                                            )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        </div>
                                    )}
                                    </Droppable>
                                </DragDropContext>

                                {/* Add and remove question buttons */}
                                <div className="flex justify-between items-center pt-2">
                                    <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl' type="button" onClick={addSteps}>
                                        <PlusCircle className="w-5 h-5 mr-2" />
                                        Add Step
                                    </Button>
                                </div>
                            </FormItem>
                            )} />
                        </div>
                        <DialogFooter className='w-full gap-1 sm:gap-0 pt-2'>
                            {toEdit && (
                                <LoadingButton
                                    className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-br from-rose-700 to-pink-600 text-white rounded-xl')}
                                    loading={deleteInProgress}
                                    disabled={form.formState.isSubmitting}
                                    onClick={deleteEvent}
                                    type="button"
                                >
                                    Delete Event
                                </LoadingButton>
                            )}
                            <Button className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-orange-300 text-white rounded-xl', {hidden: formStep == 0})} type='submit'>
                                {form.formState.isSubmitting && <Loader2 className='w-4 h-4 animate-spin mr-2'/>}
                                Submit
                            </Button>
                            <Button type='button' onClick={()=>{
                                form.trigger(['goal','theme','timeframeFrom','timeframeTo','describe'])                              
                                const goal = form.getFieldState('goal')
                                const theme = form.getFieldState('theme')
                                const timeframeFrom = form.getFieldState('timeframeFrom')
                                const timeframeTo = form.getFieldState('timeframeTo')
                                const describe = form.getFieldState('describe')
                                
                                if(!toEdit && (!goal.isDirty || goal.invalid)) return;
                                if(!toEdit && (!theme.isDirty || theme.invalid)) return;
                                if(!toEdit && (!timeframeFrom.isDirty || timeframeFrom.invalid)) return;
                                if(!toEdit && (!timeframeTo.isDirty || timeframeTo.invalid)) return;
                                if(!toEdit && (!describe.isDirty || describe.invalid)) return;

                                setFormStep(1)
                                }} className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl', {hidden: formStep == 1})}>
                                Resolution Steps
                                <ArrowRight className='w-5 h-5 ml-1'/>
                            </Button>
                            <Button type='button' onClick={()=>{
                                 form.trigger(['goal','theme','timeframeFrom','timeframeTo','describe'])                              
                                 const goal = form.getFieldState('goal')
                                 const theme = form.getFieldState('theme')
                                 const timeframeFrom = form.getFieldState('timeframeFrom')
                                 const timeframeTo = form.getFieldState('timeframeTo')
                                 const describe = form.getFieldState('describe')
                                 
                                 if(!toEdit && (!goal.isDirty || goal.invalid)) return;
                                 if(!toEdit && (!theme.isDirty || theme.invalid)) return;
                                 if(!toEdit && (!timeframeFrom.isDirty || timeframeFrom.invalid)) return;
                                 if(!toEdit && (!timeframeTo.isDirty || timeframeTo.invalid)) return;
                                 if(!toEdit && (!describe.isDirty || describe.invalid)) return;

                                setFormStep(0)
                                }} className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl ', {hidden: formStep == 0})}>
                                <ArrowLeft className='w-5 h-5 mr-1'/>
                                Resolution
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateResolve