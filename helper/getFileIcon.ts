function getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
  
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fa-solid fa-file-image';
      case 'pdf':
        return 'fa-solid fa-file-pdf';
      case 'zip':
      case 'rar':
        return 'fa-solid fa-file-zipper';
      case 'doc':
      case 'docx':
        return 'fa-solid fa-file-word';
      case 'xls':
      case 'xlsx':
        return 'fa-solid fa-file-excel';
      case 'ppt':
      case 'pptx':
        return 'fa-solid fa-file-powerpoint';
      case 'mp3':
      case 'wav':
        return 'fa-solid fa-file-audio';
      case 'mp4':
      case 'mov':
      case 'webm':
        return 'fa-solid fa-file-video';
      case 'txt':
        return 'fa-solid fa-file-lines';
      default:
        return 'fa-solid fa-file';
    }
  }
  
  export default getFileIcon;