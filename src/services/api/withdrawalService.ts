import api from '../../api/config';

// 회원탈퇴 관련 타입 정의

export interface WithdrawalCheckResponse {
  success: boolean;
  data: {
    canDelete: boolean;
    reason?: string;
    message: string;
    activeCount?: number;
    cashAmount?: number;
    cashInfo?: {
      hasCash: boolean;
      amount: number;
    };
    cashMessage?: string;
  };
}

export interface WithdrawalSMSResponse {
  success: boolean;
  message: string;
  phoneNumber?: string;
}

export interface WithdrawalDeleteResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
    deletedAt: string;
  };
}

export interface WithdrawalDeleteRequest {
  smsCode: string;
}

/**
 * Manager 회원탈퇴 API 서비스
 */
export const managerWithdrawalService = {
  /**
   * 탈퇴 가능 여부 확인
   */
  async checkDeletionEligibility(): Promise<WithdrawalCheckResponse> {
    const response = await api.get('/manager/withdrawal/check');
    return response.data;
  },

  /**
   * SMS 인증코드 발송
   */
  async sendVerificationSMS(): Promise<WithdrawalSMSResponse> {
    const response = await api.post('/manager/withdrawal/send-sms');
    return response.data;
  },

  /**
   * 회원탈퇴 실행
   */
  async deleteAccount(
    request: WithdrawalDeleteRequest,
  ): Promise<WithdrawalDeleteResponse> {
    const response = await api.post('/manager/withdrawal/delete', request);
    return response.data;
  },
};

/**
 * Funeral 회원탈퇴 API 서비스
 */
export const funeralWithdrawalService = {
  /**
   * 탈퇴 가능 여부 확인
   */
  async checkDeletionEligibility(): Promise<WithdrawalCheckResponse> {
    const response = await api.get('/funeral/withdrawal/check');
    return response.data;
  },

  /**
   * SMS 인증코드 발송
   */
  async sendVerificationSMS(): Promise<WithdrawalSMSResponse> {
    const response = await api.post('/funeral/withdrawal/send-sms');
    return response.data;
  },

  /**
   * 회원탈퇴 실행
   */
  async deleteAccount(
    request: WithdrawalDeleteRequest,
  ): Promise<WithdrawalDeleteResponse> {
    const response = await api.post('/funeral/withdrawal/delete', request);
    return response.data;
  },
};

/**
 * 공통 회원탈퇴 서비스 (userType에 따라 분기)
 */
export const withdrawalService = {
  /**
   * 사용자 타입에 따른 탈퇴 가능 여부 확인
   */
  async checkDeletionEligibility(
    userType: 'manager' | 'funeral',
  ): Promise<WithdrawalCheckResponse> {
    if (userType === 'manager') {
      return managerWithdrawalService.checkDeletionEligibility();
    } else {
      return funeralWithdrawalService.checkDeletionEligibility();
    }
  },

  /**
   * 사용자 타입에 따른 SMS 인증코드 발송
   */
  async sendVerificationSMS(
    userType: 'manager' | 'funeral',
  ): Promise<WithdrawalSMSResponse> {
    if (userType === 'manager') {
      return managerWithdrawalService.sendVerificationSMS();
    } else {
      return funeralWithdrawalService.sendVerificationSMS();
    }
  },

  /**
   * 사용자 타입에 따른 회원탈퇴 실행
   */
  async deleteAccount(
    userType: 'manager' | 'funeral',
    request: WithdrawalDeleteRequest,
  ): Promise<WithdrawalDeleteResponse> {
    if (userType === 'manager') {
      return managerWithdrawalService.deleteAccount(request);
    } else {
      return funeralWithdrawalService.deleteAccount(request);
    }
  },
};
