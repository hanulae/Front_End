// 날짜를 선택하는 Input 컴포넌트

import { useState } from "react";
import BaseInput from "./BaseInput";

// interface IDateInputProps {
//   visible: boolean;
//   onConfirm: (date: Date) => void;
//   onClose: () => void;
// }

const DateInput = ({}) => {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <>
      <BaseInput
        value={selectedDate ? selectedDate.toLocaleDateString('ko-KR', {
        })}
      />
    </>
  )
};

export default DateInput;
