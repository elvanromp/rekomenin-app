"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import axios from "axios";
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
import React from "react";

interface Question {
  id_assessment: number;
  question: string;
  learning_path: string;
}

interface Answer {
  id_answer: number;
  id_assessment: number;
  point: number;
  text: string;
  learning_path: string;
}

interface AnswerState {
  [key: string]: string;
}

interface FormValues {
  answers: {
    [key: string]: string;
  };
}

const SkillAssessment: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const methods = useForm<FormValues>({
    defaultValues: {
      answers: {},
    },
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedLearningPath = localStorage.getItem('selectedLearningPath');

        if (selectedLearningPath) {
          const questionsResponse = await axios.get(`/api/skill-assessment?learning_path=${selectedLearningPath}`);
          const answersResponse = await axios.get(`/api/answer-assessment?learning_path=${selectedLearningPath}`);

          const filteredQuestions = questionsResponse.data.filter((question: Question) => question.learning_path === selectedLearningPath);
          setQuestions(filteredQuestions);

          const filteredAnswers = answersResponse.data.filter((answer: Answer) =>
            answer.id_assessment !== null && answer.learning_path === selectedLearningPath
          );
          setAnswers(filteredAnswers);

          const initialAnswers: AnswerState = {};
          filteredQuestions.forEach((question: Question) => {
            initialAnswers[question.id_assessment.toString()] = "";
          });
          methods.reset({ answers: initialAnswers });
        } else {
          console.error("No learning path selected");
          router.push("/pages/recommendations");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [methods, router]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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

  const handleRadioChange = (questionId: string, answerId: string) => {
    const { answers } = methods.getValues();
    answers[questionId] = answerId;
    methods.setValue('answers', answers);
  };

  const calculateTotalPoint = (selectedAnswers: AnswerState): number => {
    return Object.keys(selectedAnswers).reduce((total, key) => {
      const selectedAnswerId = parseInt(selectedAnswers[key], 10);
      const answer = answers.find(answer => answer.id_answer === selectedAnswerId);
      return total + (answer ? answer.point : 0);
    }, 0);
  };

  const onSubmit = async (data: FormValues) => {
    console.log("You submitted the following values:", data);
    const totalPoint = calculateTotalPoint(data.answers);
    const level = classifyLevel(totalPoint);
    localStorage.setItem("assessment_level", level);
    const learningPath = questions[0]?.learning_path || "Unknown";
    localStorage.setItem("learning_path", learningPath);

    try {
      await axios.post('/api/score', {
        learning_path: learningPath,
        assessment_point: totalPoint,
      });
      router.push("/pages/courses");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const classifyLevel = (point: number) => {
    if (point <= 4) return "BEGINNER";
    if (point <= 7) return "INTERMEDIATE";
    return "PROFESSIONAL";
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form className="space-y-6">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {questions.map((question, index) => (
                <CarouselItem key={question.id_assessment}>
                  <div className="border-[#52B788] border-2 px-4 py-5 rounded-xl">
                    <b>Question {index + 1}</b>
                    <p>{question.question}</p>
                  </div>
                  <FormControl>
                    <Controller
                      name={`answers.${question.id_assessment}`}
                      control={methods.control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleRadioChange(
                              question.id_assessment.toString(),
                              value
                            );
                          }}
                        >
                          {answers
                          .filter((answer) => answer.id_assessment === question.id_assessment)
                          .map((answer) => (
                            <FormItem
                              key={answer.id_answer}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded drop-shadow-md px-10 py-4 my-2 bg-white"
                            >
                              <FormControl>
                                <RadioGroupItem value={answer.id_answer.toString()} />
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
            <Button type="button" onClick={handlePrevious} className="bg-white drop-shadow-md rounded">
              Previous
            </Button>
            {current === questions.length - 1 ? (
              <Button
                type="button"
                onClick={(event) => methods.handleSubmit(onSubmit)(event)}
                className=""
              >
                Submit
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} className="bg-white drop-shadow-md rounded">
                Next
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SkillAssessment;
