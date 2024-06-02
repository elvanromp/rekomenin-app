"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { questions } from "@/app/assessmentList";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface AnswerState {
  [key: string]: string;
}

interface FormValues {
  answers: {
    [key: string]: string;
  };
}

const SkillAssessment: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const handleNext = () => {
    if (api) {
      api.scrollNext();
    }
  };

  const handlePrevious = () => {
    if (api) {
      api.scrollPrev();
    }
  };

  const methods = useForm<FormValues>({
    defaultValues: {
      answers: {}
    }
  });

  const [answers, setAnswers] = useState<AnswerState>(() => {
    const initialAnswers: AnswerState = {};
    questions.questions.forEach((question) => {
      initialAnswers[question.id.toString()] = "";
    });
    return initialAnswers;
  });

  useEffect(() => {
    console.log('Default answers:', answers);
  }, [answers]);

  const handleRadioChange = (questionId: string, answerId: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    console.log("You submitted the following values:", data);
    const totalPoints = calculateTotalPoints(data.answers);
    const level = classifyLevel(totalPoints);
    localStorage.setItem("level", level);
    const learning_path = "Machine Learning"; // Assuming the user selects this path somewhere in your component
    localStorage.setItem("learning_path", learning_path);
    router.push("/pages/courses");
  };

  const calculateTotalPoints = (answers: { [key: string]: string }) => {
    let totalPoints = 0;

    questions.questions.forEach((question) => {
      const selectedAnswerId = answers[question.id];
      const selectedAnswer = question.answers.find(answer => answer.id.toString() === selectedAnswerId);
      if (selectedAnswer) {
        totalPoints += selectedAnswer.point;
      }
    });

    return totalPoints;
  };

  const classifyLevel = (points: number) => {
    if (points <= 4) return "BEGINNER";
    if (points <= 7) return "INTERMEDIATE";
    return "PROFESSIONAL";
  };

  useEffect(() => {
    methods.reset({ answers });
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [answers, methods, api]);

  return (
    <div>
      <FormProvider {...methods}>
        <form className="space-y-6">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {questions.questions.map((question) => (
                <CarouselItem key={question.id}>
                  <div className="border-[#52B788] border-2 px-4 py-5 rounded-xl">
                    <b>Question {current + 1}</b>
                    <p>{question.question}</p>
                  </div>
                  <FormControl>
                    <Controller
                      name={`answers.${question.id}`}
                      control={methods.control}
                      defaultValue={answers[question.id.toString()]}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleRadioChange(question.id.toString(), value);
                          }}
                        >
                          {question.answers.map((answer) => (
                            <FormItem key={answer.id} className="flex flex-row items-start space-x-3 space-y-0 rounded drop-shadow-md px-10 py-4 my-2 bg-white">
                              <FormControl>
                                <RadioGroupItem value={answer.id.toString()} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{answer.text}</FormLabel>
                              </div>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-between">
            <Button type="button" onClick={handlePrevious} className="bg-white drop-shadow-md rounded">Previous</Button>
            {current === questions.questions.length - 1 ? (
              <Button type="button" onClick={(event) => methods.handleSubmit((data) => onSubmit(data))(event)} className="">Submit</Button>
            ) : (
              <Button type="button" onClick={handleNext} className="bg-white drop-shadow-md rounded">Next</Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SkillAssessment;
