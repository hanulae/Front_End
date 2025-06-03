import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Typo from './Typo';
import DeleteIcon from '../../assets/Icon/Icon_BtnClose03.svg';
import PdfIcon from '../../assets/Contents/Contents_ReportRed.svg';
import DocIcon from '../../assets/Contents/Contents_ReportBlue.svg';
import XlsIcon from '../../assets/Contents/Contents_ReportGreen.svg';
export interface FileItem {
  name: string;
  uri: string;
  type: string;
  size: number;
}

interface Props {
  files: FileItem[];
  onDelete: (index: number) => void;
}

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
