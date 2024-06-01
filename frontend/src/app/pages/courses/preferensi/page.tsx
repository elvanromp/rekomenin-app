"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { questions } from "@/app/questionList";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
interface AnswerState {
  [key: string]: {
    [key: string]: boolean;
  };
}

interface FormValues {
  answers: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
}

const Preferensi: React.FC = () => {
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
      initialAnswers[question.id.toString()] = {};
      question.answers.forEach((answer) => {
        initialAnswers[question.id.toString()][answer.id.toString()] = false;
      });
    });
    return initialAnswers;
  });

  useEffect(() => {
    console.log('Default answers:', answers);
  }, [answers]);

  const handleCheckboxChange = (questionId: string, answerId: string) => (checked: boolean) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [answerId]: checked,
      },
    }));
  };

  const router = useRouter();

  const onSubmit = (event: React.FormEvent, data: FormValues) => {
    event.preventDefault();
    console.log("You submitted the following values:", data);
    const scores = calculateScores(data.answers);
    localStorage.setItem("scores", JSON.stringify(scores));
    router.push("/pages/courses/rekomendasi");
  };

  const calculateScores = (answers: { [key: string]: { [key: string]: boolean } }) => {
    const scores: { [key: string]: number } = {};

    questions.questions.forEach((question) => {
      question.answers.forEach((answer) => {
        if (answers[question.id]?.[answer.id]) {
          const paths = answer.learning_path.split(", ");
          paths.forEach((path) => {
            if (!scores[path]) scores[path] = 0;
            scores[path] += answer.point;
          });
        }
      });
    });

    return scores;
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
                  <b>Question {current+1}</b>
                  <p>{question.question}</p>
                </div>
                {question.answers.map((answer) => (
                  <FormItem key={answer.id} className="flex flex-row items-start space-x-3 space-y-0 rounded drop-shadow-md px-10 py-4 my-2 bg-white">
                    <FormControl>
                      <Controller
                        name={`answers.${question.id.toString()}.${answer.id.toString()}`}
                        control={methods.control}
                        defaultValue={answers[question.id.toString()][answer.id.toString()]}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={(checked) => {
                              const isChecked = typeof checked === 'boolean' ? checked : false;
                              field.onChange(isChecked);
                              handleCheckboxChange(question.id.toString(), answer.id.toString())(isChecked);
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{answer.text}</FormLabel>
                    </div>
                  </FormItem>
                ))}
              </CarouselItem>
            ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-between">
            <Button type="button" onClick={handlePrevious} className="bg-white drop-shadow-md rounded">Previous</Button>
            <Button type="button" onClick={handleNext} className="bg-white drop-shadow-md rounded">Next</Button>
            {current===questions.questions.length-1?
              <Button type="submit" onClick={(event) => methods.handleSubmit((data) => onSubmit(event, data))(event)}  className="">Submit</Button> :
              <Button type="button" onClick={handleNext} className="bg-white drop-shadow-md rounded">Next</Button>
            }
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Preferensi;