"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { questions } from "@/app/questionList";

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

const SkillAssessment: React.FC = () => {
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

  const onSubmit = (data: FormValues) => {
    console.log("You submitted the following values:", data);
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
              <FormItem key={answer.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};

export default SkillAssessment;