import api from '../../../api/config';

const fetchFuneralRooms = async () => {
  const response = api.get('/funeral/room/listco');
};
