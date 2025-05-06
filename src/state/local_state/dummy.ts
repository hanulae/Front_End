interface IFuneralHome {
  id: number;
  imageUrl: any; // 대표 이미지 (나중에 교체)
  name: string;
  address: string;
}

export const funeralHomeDummyData: IFuneralHome[] = [
  {
    id: 1,
    imageUrl: require('../../assets/dummyHall.png'),
    name: '서울 중앙 장례식장',
    address: '서울특별시 강남구 언주로 123',
  },
  {
    id: 2,
    imageUrl: require('../../assets/dummyHall.png'),
    name: '부산 해운대 장례식장',
    address: '부산광역시 해운대구 해운대로 456',
  },
  {
    id: 3,
    imageUrl: require('../../assets/dummyHall.png'),
    name: '대구 동구 장례식장',
    address: '대구광역시 동구 동촌로 789',
  },
  {
    id: 4,
    imageUrl: require('../../assets/dummyHall.png'),
    name: '광주 서구 장례식장',
    address: '광주광역시 서구 상무대로 321',
  },
  {
    id: 5,
    imageUrl: require('../../assets/dummyHall.png'),
    name: '대전 유성구 장례식장',
    address: '대전광역시 유성구 대학로 654',
  },
];
