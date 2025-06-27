import AsyncStorage from '@react-native-async-storage/async-storage';
import {FuneralData} from '../api/funeralService';

const CART_STORAGE_KEY = 'manager_cart';

interface CartItem extends FuneralData {
  addedAt: string; // 추가 시간
}

interface LocalCartResponse {
  success: boolean;
  message: string;
  addedCount?: number;
  alreadyExistsCount?: number;
  data?: CartItem[];
}

export const localCartService = {
  // 장바구니 추가
  addToCart: async (
    funeralItems: FuneralData[],
  ): Promise<LocalCartResponse> => {
    try {
      const existingCart = await localCartService.getCartList();
      const currentItems = existingCart.data || [];

      let addedCount = 0;
      let alreadyExistsCount = 0;

      const newItems: CartItem[] = [];

      funeralItems.forEach(item => {
        const exists = currentItems.find(
          (cartItem: CartItem) => cartItem.funeralListId === item.funeralListId,
        );

        if (exists) {
          alreadyExistsCount++;
        } else {
          newItems.push({
            ...item,
            addedAt: new Date().toISOString(),
          });
          addedCount++;
        }
      });

      const updatedCart = [...newItems, ...currentItems];
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));

      return {
        success: true,
        message: `${addedCount}개의 항목이 장바구니에 추가되었습니다.`,
        addedCount,
        alreadyExistsCount,
        data: updatedCart,
      };
    } catch (error) {
      console.error('❌ 장바구니 추가 실패', error);
      return {
        success: false,
        message: '장바구니 추가에 실패했습니다.',
        addedCount: 0,
      };
    }
  },

  // 장바구니 목록 조회
  getCartList: async (): Promise<LocalCartResponse> => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      const items: CartItem[] = cartData ? JSON.parse(cartData) : [];

      return {
        success: true,
        message: '장바구니 조회 성공',
        data: items,
      };
    } catch (error) {
      console.error('❌ 장바구니 조회 실패', error);
      return {
        success: false,
        message: '장바구니 조회에 실패했습니다.',
        data: [],
      };
    }
  },

  // 장바구니 삭제
  deleteFromCart: async (
    funeralListId: string[],
  ): Promise<LocalCartResponse> => {
    try {
      const existingCart = await localCartService.getCartList();
      const currentItems = existingCart.data || [];

      const updatedItems = currentItems.filter(
        item => !funeralListId.includes(item.funeralListId),
      );

      await AsyncStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(updatedItems),
      );

      return {
        success: true,
        message: '성공적으로 장바구니에서 삭제되었습니다.',
        data: updatedItems,
      };
    } catch (error) {
      console.error('❌ 장바구니 삭제 실패', error);
      return {
        success: false,
        message: '장바구니 삭제에 실패했습니다.',
      };
    }
  },

  // 장바구니 전체 비우기
  clearCart: async (): Promise<LocalCartResponse> => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      return {
        success: true,
        message: '장바구니가 비워졌습니다.',
        data: [],
      };
    } catch (error) {
      console.error('❌ 장바구니 전체 비우기 실패', error);
      return {
        success: false,
        message: '장바구니 전체 비우기에 실패했습니다.',
      };
    }
  },
};

export type {LocalCartResponse, CartItem};
