import {useState} from 'react';

const useEmailPartsInput = () => {
  const [id, setId] = useState('');
  const [domain, setDomain] = useState('naver.com');
  const [customDomain, setCustomDomain] = useState('');

  const isEmployee = domain === '직원';
  const isDirectInput = domain === '직접입력';

  const fullEmail = isEmployee
    ? id
    : `${id}@${isDirectInput ? customDomain : domain}`;

  return {
    // 상태
    id,
    setId,
    domain,
    setDomain,
    customDomain,
    setCustomDomain,

    // 유틸
    isEmployee,
    isDirectInput,
    fullEmail,
  };
};

export default useEmailPartsInput;
