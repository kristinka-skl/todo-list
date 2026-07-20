'use client';

import { FieldProps } from 'formik';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { enUS } from 'date-fns/locale/en-US';

interface CalendarDatePickerProps extends FieldProps {
  onDateSelect?: (dateStr: string) => void;
  placeholderText?: string;
  className?: string;
  disabled?: boolean; 
}

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  form,
  field,
  onDateSelect,
  className,
  ...props
}) => {
  const dateValue = field.value ? new Date(field.value) : null;

  const handleChange = (date: Date | null) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      form.setFieldValue(field.name, dateString);
      if (onDateSelect) {
        onDateSelect(dateString);
      }
    } else {
      form.setFieldValue(field.name, '');
    }
  };

  // Зібрали всі класи в один щільний рядок (без зайвих переносі), щоб Tailwind JIT компілятор нічого не загубив.
  // Додано items-center для центрування календаря всередині білого вікна.
  // Перебиваємо синій колір на зелений (!bg-accent).
  const calendarStyles = "!mt-2 !font-sans !border-none !rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] !bg-card !p-4 !w-[310px] flex flex-col items-center box-border [&_.react-datepicker__month-container]:!w-full [&_.react-datepicker__month-container]:flex [&_.react-datepicker__month-container]:flex-col [&_.react-datepicker__month-container]:items-center [&_.react-datepicker__header]:!bg-transparent [&_.react-datepicker__header]:!border-none [&_.react-datepicker__header]:!p-0 [&_.react-datepicker__day-names]:flex [&_.react-datepicker__day-names]:justify-between [&_.react-datepicker__day-names]:!w-full [&_.react-datepicker__day-names]:!mb-2 [&_.react-datepicker__day-name]:!text-muted-foreground [&_.react-datepicker__day-name]:!font-medium [&_.react-datepicker__day-name]:!text-[14px] [&_.react-datepicker__day-name]:!m-0 [&_.react-datepicker__day-name]:!w-8 [&_.react-datepicker__day-name]:text-center [&_.react-datepicker__month]:!m-0 [&_.react-datepicker__month]:!w-full [&_.react-datepicker__week]:flex [&_.react-datepicker__week]:justify-between [&_.react-datepicker__week]:!w-full [&_.react-datepicker__week]:!mb-1 [&_.react-datepicker__day]:!w-8 [&_.react-datepicker__day]:!h-8 [&_.react-datepicker__day]:flex [&_.react-datepicker__day]:items-center [&_.react-datepicker__day]:justify-center [&_.react-datepicker__day]:!m-0 [&_.react-datepicker__day]:!rounded-full [&_.react-datepicker__day]:!text-foreground [&_.react-datepicker__day]:!text-[14px] [&_.react-datepicker__day]:transition-colors [&_.react-datepicker__day:hover]:!bg-accent/20 [&_.react-datepicker__day:hover]:!text-foreground [&_.react-datepicker__day--selected]:!bg-accent [&_.react-datepicker__day--selected]:!text-background [&_.react-datepicker__day--selected]:!font-semibold [&_.react-datepicker__day--keyboard-selected]:!bg-accent [&_.react-datepicker__day--keyboard-selected]:!text-background [&_.react-datepicker__day--keyboard-selected]:!font-semibold [&_.react-datepicker__day:focus]:!outline-none [&_.react-datepicker__triangle]:!hidden [&_.react-datepicker__day--outside-month]:!text-muted-foreground/30 [&_.react-datepicker__day--outside-month]:!pointer-events-none";

  return (
    <div className="w-full flex justify-center [&_.react-datepicker__input-container]:block [&_.react-datepicker__input-container]:w-full relative">
      <DatePicker
        {...props}
        id={field.name}
        dateFormat="yyyy-MM-dd"
        selected={dateValue}
        onChange={handleChange}
        minDate={new Date()}
        locale={enUS}
        className={className}
        calendarClassName={calendarStyles}
        wrapperClassName="block w-full"
        /* Змінено на 'bottom', щоб попап центрувався відносно інпута, а не прилипав до лівого краю */
        popperPlacement="bottom"        
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center mb-[14px] w-full px-1">
            <div className="text-[18px] font-semibold text-foreground capitalize">
              {format(date, 'LLLL yyyy', { locale: enUS })}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="bg-[#ebfadc] dark:bg-[#46532e38] border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-foreground text-base transition-colors duration-200 hover:bg-accent/20 dark:hover:bg-[#46532e50] disabled:bg-transparent disabled:cursor-default disabled:opacity-30"
              >
                ←
              </button>
              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="bg-[#ebfadc] dark:bg-[#46532e38] border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-foreground text-base transition-colors duration-200 hover:bg-accent/20 dark:hover:bg-[#46532e50] disabled:bg-transparent disabled:cursor-default disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default CalendarDatePicker;