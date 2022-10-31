import { useRef, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { isImage, createFileChunk } from './utils';
import "./index.less";

interface FileChunks {
  index: number;
  file: Blob;
}

function FileUpload() {
  const dragRef = useRef<any>();
  const [ file, setFile ] = useState();
  const [ chunks, setChunks ] = useState<FileChunks[]>([]);
  const [ hashProgress, setHashProgress ] = useState(0);

  useEffect(() => {
    const dragRefCurrent = dragRef.current as HTMLDivElement;
    const dragoverEvent: any = dragRefCurrent.addEventListener('dragover', (e) => {
      dragRefCurrent.style.borderColor = "red";
      e.preventDefault();
    });
    const dragleaveEvent: any = dragRefCurrent.addEventListener('dragleave', (e) => {
      dragRefCurrent.style.borderColor = "#999";
      e.preventDefault();
    });
    const dropEvent: any = dragRefCurrent.addEventListener('drop', (e: any) => {
      const fileList = e.dataTransfer.files;
      console.log('文件：', fileList);
        setFile(fileList[0]);
        e.preventDefault();
    });

    return () => {
      window.removeEventListener('dragover', dragoverEvent);
      window.removeEventListener('dragover', dragleaveEvent);
      window.removeEventListener('drop', dropEvent);
    }
  }, []);

  const handleFileChange = (e: any) => {
    const [file] = e.target.files;
    if (!file) return;
    setFile(file);
  }

  const calculateHashWorker = async (currChunks: FileChunks[]) => {
    return new Promise((resolve) => {
      const worker = new Worker("/md5/hash.js");
      worker.postMessage({chunks: currChunks});
      worker.onmessage = (e) => {
        const { progress, hash } = e.data;
        setHashProgress(Number(progress.toFixed(2)));
        if (hash) {
          resolve(hash);
        }
      }
    })
  }

  const handleUploadFile = async () => {
    console.log('file', file);
    if (!file) return;
    // if (!(await isImage(file))) {
    //   message.error('文件格式不符');
    //   return;
    // }
    const currChunks = createFileChunk(file);
    setChunks(currChunks);
    const hash = await calculateHashWorker(currChunks);
    console.log('hash:', hash);
  }

  return (
    <div className='file-upload'>
      <div ref={dragRef} className="drag">
        <input type="file" name="file" onChange={handleFileChange} />
      </div>
      <Button type="primary" onClick={handleUploadFile}>开始上传</Button>
      <div>
        <div>当前切片长度：{chunks.length}</div>
      </div>
    </div>
  )
}

export default FileUpload;
