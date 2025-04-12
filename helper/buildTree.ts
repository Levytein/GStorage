interface Folder {
    id: number;
    parentId: number | null;
    children?: Folder[];
}

function buildFolderTree(folders: Folder[], parentId: number | null = null): Folder[] {
    return folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => ({
        ...folder,
        children: buildFolderTree(folders, folder.id)
      }));
  }

  export default buildFolderTree;