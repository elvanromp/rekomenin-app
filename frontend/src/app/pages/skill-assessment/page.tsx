"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller  } from "react-hook-form"
import { z } from "zod"
import { questions } from '@/app/questionList';

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
const FormSchema = z.object({
  answers: z.record(z.string(), z.record(z.string(), z.boolean())).default({}),
});

const SkillAssessment: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data) {
    console.log("You submitted the following values:");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {questions.questions.map((question) => (
          <div key={question.id}>
            <h2>{question.question}</h2>
            {question.answers.map((answer) => (
              <div key={answer.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Controller
                  name={`answers[${question.id}][${answer.id}]`}
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{answer.text}</FormLabel>
              </div>
            </div>
            ))}
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
export default SkillAssessment;