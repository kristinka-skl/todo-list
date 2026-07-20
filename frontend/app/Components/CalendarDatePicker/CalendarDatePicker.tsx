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
        calendarClassName="custom-datepicker"
        wrapperClassName="block w-full"
        popperPlacement="bottom"        
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center mb-[14px] w-full px-2">
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