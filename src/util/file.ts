import {keepLocalCopy} from '@react-native-documents/picker';

export interface LocalFile {
  name: string;
  uri: string;
  type: string;
  size: number;
}

export const getLocalFileCopy = async (
  uri: string,
  fileName: string,
): Promise<LocalFile> => {
  const result = await keepLocalCopy({
    files: [{uri, fileName}],
    destination: 'documentDirectory',
  });

  const res = result[0]; // 단일 파일 기준

  if (res.status === 'error') {
    console.warn(`파일 복사 실패: ${res.copyError}`);
    throw new Error(res.copyError);
  }

  return {
    name: fileName,
    uri: res.localUri,
    type: 'application/octet-stream', // MIME type은 keepLocalCopy에서는 제공되지 않음
    size: 0, // 사이즈 정보도 없음. 별도로 필요 시 다른 방법 사용
  };
};

export const getLocalFileCopies = async (
  files: {uri: string; fileName: string}[],
): Promise<LocalFile[]> => {
  if (files.length === 0) {
    return [];
  }

  const [first, ...rest] = files;

  const results = await keepLocalCopy({
    files: [first, ...rest],
    destination: 'documentDirectory',
  });

  return results.flatMap((res, index) => {
    if (res.status === 'success') {
      return [
        {
          name: files[index].fileName,
          uri: res.localUri,
          type: 'application/octet-stream',
          size: 0,
        },
      ];
    } else {
      console.warn(
        `파일 복사 실패 [${files[index].fileName}]: ${res.copyError}`,
      );
      return [];
    }
  });
};
