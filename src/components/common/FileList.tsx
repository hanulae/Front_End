import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from './Typo';
import DeleteIcon from '../../assets/Icon/Icon_BtnClose03.svg';
import PdfIcon from '../../assets/Contents/Contents_ReportRed.svg';
import DocIcon from '../../assets/Contents/Contents_ReportBlue.svg';
import XlsIcon from '../../assets/Contents/Contents_ReportGreen.svg';

/**
 * 업로드/첨부 파일 아이템 인터페이스
 * @param name - 파일명 (확장자 포함)
 * @param uri - 파일의 로컬 또는 원격 경로
 * @param type - MIME 타입
 * @param size - 파일 크기 (bytes)
 */
export interface FileItem {
  name: string;
  uri: string;
  type: string;
  size: number;
}

/**
 * FileList Props 인터페이스
 * @param files - 렌더링할 파일 배열
 * @param onDelete - 삭제 버튼 클릭 시 호출되는 콜백 (index 전달)
 */
interface Props {
  files: FileItem[];
  onDelete: (index: number) => void;
}

/**
 * 파일명(확장자)을 기준으로 아이콘 컴포넌트 반환
 * @param name - 파일명
 * @returns 파일 타입에 해당하는 SVG 아이콘
 * 목적: 파일 확장자별 시각적 구분 제공 (pdf/doc/xls), 그 외는 기본 아이콘
 */
const getIconByFileName = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
    return <PdfIcon width={20} height={20} />;
  }
  if (ext === 'doc' || ext === 'docx') {
    return <DocIcon width={20} height={20} />;
  }
  if (ext === 'xls' || ext === 'xlsx') {
    return <XlsIcon width={20} height={20} />;
  }
  // 그 외 모든 확장자는 기본 아이콘 사용
  return <PdfIcon width={20} height={20} />;
};

/**
 * 첨부 파일 목록 컴포넌트
 *
 * 주요 기능:
 * - 파일 아이콘 + 파일명 + 삭제 버튼을 가로로 배치하여 리스트 렌더링
 * - 긴 파일명은 한 줄로 자르고 말줄임 처리
 * - 아이템별 삭제 콜백 제공
 */
const FileList = ({files, onDelete}: Props) => {
  return (
    <FlatList
      data={files}
      keyExtractor={(item, index) => item.uri + index}
      renderItem={({item, index}) => (
        <View style={styles.itemContainer}>
          {getIconByFileName(item.name)}
          <Typo numberOfLines={1} style={styles.fileName}>
            {item.name}
          </Typo>
          <TouchableOpacity onPress={() => onDelete(index)}>
            <DeleteIcon width={16} height={16} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default FileList;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
});
