import ImageResizer from '@bam.tech/react-native-image-resizer';

export const uriToFile = async (
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<File> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new File([blob], fileName, {type: mimeType, lastModified: Date.now()});
};

export const convertUrisToFiles = async (
  uris: string[],
): Promise<{uri: string; file: File; name: string; type: string}[]> => {
  const result = await Promise.all(
    uris.map(async (uri, index) => {
      const resized = await ImageResizer.createResizedImage(
        uri,
        800,
        600,
        'JPEG',
        80,
      );
      const file = await uriToFile(
        resized.uri,
        resized.name || `img${index}.jpg`,
        'image/jpeg',
      );
      return {
        uri: resized.uri,
        file,
        name: resized.name || `img${index}.jpg`,
        type: 'image/jpeg',
      };
    }),
  );

  return result;
};
