'use client';
import { FieldProps } from 'formik';
import DatePicker, { registerLocale } from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale/uk';
import css from './CalendarDatePicker.module.css';

registerLocale('uk', uk);

interface CalendarDatePickerProps extends FieldProps {
  onDateSelect?: (dateStr: string) => void;
  placeholderText?: string;
  className?: string;
  disabled?: boolean; //кастомні пропси, щоб використовувати можливості react date picker, за потреби можна розширити
}

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  form,
  field,
  onDateSelect,
  ...props
}) => {
  const dateValue = field.value ? new Date(field.value) : null; //формуємо початкове значення

  const handleChange = (date: Date | null) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd'); //готуємо дату в форматі рядочка для валідації Formik+Yup
      form.setFieldValue(field.name, dateString); //так ми зв'язуємо і передаємо дані react date picker в Formik
      if (onDateSelect) {
        onDateSelect(dateString);
      }
    } else {
      form.setFieldValue(field.name, '');
    }
  };
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="custom-datepicker-wrapper">
      <DatePicker
        {...props}
        id={field.name}
        dateFormat="yyyy-MM-dd"
        selected={dateValue}
        onChange={handleChange}
        minDate={new Date()}
        locale="uk"
        className={css.inputField}
        calendarClassName={css.pinkCalendarTheme}
        wrapperClassName={css.datePickerWrapper}
        popperPlacement="bottom-start"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            className="react-datepicker__custom-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <div className={css.monthTitle}>
              {format(date, 'LLLL yyyy', { locale: uk })
                .charAt(0)
                .toUpperCase() +
                format(date, 'LLLL yyyy', { locale: uk }).slice(1)}
            </div>
            <div className={css.navContainer}>
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className={css.navButton}
              >
                ←
              </button>
              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className={css.navButton}
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

//приклад використання з Formik:

{
  /* <Field
      id={`${fieldId}-date`}
      name="date"
      component={CalendarDatePicker}
      onDateChange={handleDateChange}
      className="date-picker"
      wrapperClassName="date-picker-wrapper"
    /> */
}
