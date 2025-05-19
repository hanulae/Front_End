import {useState} from 'react';

const useEmailPartsInput = (initialEmail = '') => {
  const [id, setId] = useState(() => initialEmail.split('@')[0] || '');
  const [domain, setDomain] = useState(() => {
    const parts = initialEmail.split('@');
    const domainPart = parts[1] || 'naver.com';
    if (domainPart === '직원') return '직원';
    return domainPart;
  });
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
