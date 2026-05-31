"use client";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import css from "./TaskForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskFormData } from "@/../interfaces/index";
import toast from "react-hot-toast";
import CalendarDatePicker from "../CalendarDatePicker/CalendarDatePicker";
import { useTaskStore } from "@/app/lib/store/taskStore";
import { createTask } from "@/app/lib/api/api";

const today = new Date();
today.setHours(0, 0, 0, 0);
const todayString = format(today, "yyyy-MM-dd");

interface TaskFormValues {
  name: string;
  date: string;
}

const TaskFormSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, "Min 1 symbol")
    .max(96, "Max 96 symbols")
    .required("Enter task"),
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
    date: draft.date || todayString,
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (TaskFormData: TaskFormData) =>
      await createTask(TaskFormData),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["task"],
      });
      toast("Successfully submitted!");
      // setErrors({});
      clearDraft();
      if (afterSubmit) {
        afterSubmit();
      }
    },
    onError: () => toast("Sorry, something went wrong, please try again"),
  });

  const handleSubmit = (
    values: TaskFormValues,
    actions: FormikHelpers<TaskFormValues>,
  ) => {
    mutate(values, {
      onSuccess: () => {
        clearDraft();
        actions.resetForm({
          values: { name: "", date: todayString },
        });
      },
    });
  };

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

        const handleDateChange = (dateString: string) => {
          setDraft({ ...values, date: dateString });
        };

        return (
          <Form className={css.form}>
            <fieldset className={css.fieldset}>
              <legend className={css.legend}>Add new task</legend>
              <div className={css.addTaskInputSet}>
                <div className={css.addTaskInput}>
                  <label htmlFor={`${fieldId}-name`}>Task name</label>
                  <Field
                    type="text"
                    name="name"
                    id={`${fieldId}-name`}
                    placeholder="I am going to ..."
                    onChange={handleNameChange}
                    className={`${css.input} ${
                      errors.name && touched.name ? css.inputError : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="span"
                    className={css.error}
                  />
                </div>
                <div className={css.addTaskInput}>
                  <label htmlFor={`${fieldId}-date`}>Date</label>
                  <Field
                    id={`${fieldId}-date`}
                    name="date"
                    component={CalendarDatePicker}
                    onDateSelect={handleDateChange}
                    // className="date-picker"
                    className={css.input}
                    wrapperClassName="date-picker-wrapper"
                  />
                  <ErrorMessage
                    name="date"
                    component="span"
                    className={css.error}
                  />
                </div>
              </div>
            </fieldset>
            <button className={css.saveBtn} type="submit">
              {isPending ? "Saving" : "Save"}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
