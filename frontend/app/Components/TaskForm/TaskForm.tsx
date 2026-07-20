"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskFormData } from "@/../interfaces/index";
import toast from "react-hot-toast";
import CalendarDatePicker from "../CalendarDatePicker/CalendarDatePicker";
import { useTaskStore } from "@/app/lib/store/taskStore";
import { createTask } from "@/app/lib/api/api";
import { ChevronDown } from "lucide-react"; 

const today = new Date();
today.setHours(0, 0, 0, 0);
const todayString = format(today, "yyyy-MM-dd");

interface TaskFormValues {
  name: string;
  priority: number;
  date: string;
}

const TaskFormSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, "Min 1 symbol")
    .max(96, "Max 96 symbols")
    .required("Enter task"),
  priority: Yup.number().min(1).max(10).required(),
  date: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD")
    .test("min-date", "Date cannot be in the past", (value) => {
      if (!value) return false;
      return value >= todayString;
    }),
});

interface AddTaskFormProps {
  afterSubmit?: () => void;
}

export default function TaskForm({ afterSubmit }: AddTaskFormProps) {
  const fieldId = useId();

  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useTaskStore();
  const initialValues: TaskFormValues = {
    name: draft.name || "",
    priority: draft.priority || 1,
    date: draft.date || todayString,
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (TaskFormData: TaskFormData) =>
      await createTask(TaskFormData),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["task"],
      });
      toast.success("Successfully submitted!");
      clearDraft();
      if (afterSubmit) {
        afterSubmit();
      }
    },
    onError: () => toast.error("Sorry, something went wrong, please try again"),
  });

  const handleSubmit = (
    values: TaskFormValues,
    actions: FormikHelpers<TaskFormValues>,
  ) => {
    mutate(values, {
      onSuccess: () => {
        clearDraft();
        actions.resetForm({
          values: { name: "", priority: 1, date: todayString },
        });
      },
    });
  };

  const baseInputStyles =
    "w-full h-[37px] min-[1440px]:h-[40px] px-3 py-2 border border-gray-300 rounded-xl bg-transparent text-base leading-snug outline-none transition-colors hover:border-accent focus:border-accent";
  const errorInputStyles = "!border-[var(--color-red)]";

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={TaskFormSchema}
      enableReinitialize
    >
      {({ values, handleChange, errors, touched }) => {
        const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e);
          setDraft({ ...values, name: e.target.value });
        };
        const handlePriorityChange = (
          e: React.ChangeEvent<HTMLInputElement>,
        ) => {
          handleChange(e);
          setDraft({ ...values, priority: Number(e.target.value) });
        };
        const handleDateChange = (dateString: string) => {
          setDraft({ ...values, date: dateString });
        };

        return (
          <Form className="flex flex-col mx-auto gap-6 w-full max-w-[400px] md:max-w-[480px]">
            <fieldset className="border-none p-0 m-0 mb-6">
              <legend className="block w-full text-center mb-7 p-0 font-semibold text-xl leading-tight tracking-[0.01em]">
                Add Task
              </legend>
              <div className="flex flex-col gap-6">
                
                <div className="relative flex flex-col gap-2">
                  <label htmlFor={`${fieldId}-name`} className="text-base leading-snug">
                    Task name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id={`${fieldId}-name`}
                    placeholder="I am going to ..."
                    onChange={handleNameChange}
                    className={`${baseInputStyles} ${
                      errors.name && touched.name ? errorInputStyles : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="span"
                    className="absolute top-[73px] left-3 text-xs text-[var(--color-red)] font-normal"
                  />
                </div>

                <div className="relative flex flex-col gap-2">
                  <label htmlFor={`${fieldId}-priority`} className="text-base leading-snug">
                    Task priority
                  </label>
                  <div className="relative w-full">
                    <Field
                      as="select"
                      name="priority"
                      id={`${fieldId}-priority`}
                      onChange={handlePriorityChange}
                      className={`appearance-none pr-10 cursor-pointer ${baseInputStyles} ${
                        errors.priority && touched.priority ? errorInputStyles : ""
                      }`}
                    >
                      {Array.from({ length: 10 }, (_, index) => index + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ),
                      )}
                    </Field>
                    
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <ErrorMessage
                    name="priority"
                    component="span"
                    className="absolute top-[73px] left-3 text-xs text-[var(--color-red)] font-normal"
                  />
                </div>

                <div className="relative flex flex-col gap-2">
                  <label htmlFor={`${fieldId}-date`} className="text-base leading-snug">
                    Date
                  </label>
                  <Field
                    id={`${fieldId}-date`}
                    name="date"
                    component={CalendarDatePicker}
                    onDateSelect={handleDateChange}
                    className={baseInputStyles}
                  />
                  <ErrorMessage
                    name="date"
                    component="span"
                    className="absolute top-[73px] left-3 text-xs text-[var(--color-red)] font-normal"
                  />
                </div>
              </div>
            </fieldset>
            
            <button
              className="flex items-center justify-center rounded-[60px] p-4 w-full max-w-[335px] h-[44px] bg-accent font-medium text-base text-background mx-auto transition-opacity duration-300 hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}