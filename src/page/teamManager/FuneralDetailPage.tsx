import { NavigationProp } from "@react-navigation/native";
import { StyleSheet } from "react-native";

interface IFuneralDetailPageProps {
  navigation: NavigationProp<any>;
}

const FuneralDetailPage = ({navigation}: IFuneralDetailPageProps) => {
  // 장례식장 정보 호출 함수
  const fetchFuneralInfo = async (funeralId: number) => {
    // API 호출 로직
    console.log(`장례식장 정보 호출: ${funeralId}`);
  }

  return (
    
  )

}

export default FuneralDetailPage;

const styles = StyleSheet.create({});