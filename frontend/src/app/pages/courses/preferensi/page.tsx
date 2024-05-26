"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { questions } from "@/app/questionList";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

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

  const onSubmit = (data: FormValues) => {
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
  }, [answers, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {questions.questions.map((question) => (
          <div key={question.id}>
            <h2>{question.question}</h2>
            {question.answers.map((answer) => (
              <FormItem key={answer.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 my-2">
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
          </div>
        ))}
        <Button type="submit" className="">Submit</Button>
      </form>
    </FormProvider>
  );
};

export default Preferensi;