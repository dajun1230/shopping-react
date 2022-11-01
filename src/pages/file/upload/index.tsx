import { useRef, useState, useEffect, useCallback } from "react";
import { Button, message, Spin } from "antd";
import sparkMD5 from "spark-md5";
import cs from "classnames";
import { isImage, createFileChunk } from "./utils";
import "./index.less";

interface FileChunks {
  index?: number;
  file: Blob;
  name?: string;
  hash?: string;
  chunk?: Blob;
  progress?: number;
}

function FileUpload() {
  const dragRef = useRef<any>();
  const [file, setFile] = useState<Blob>();
  const [fileHash, setFileHash] = useState("");
  const [chunks, setChunks] = useState<FileChunks[]>([]);
  const [hashProgress, setHashProgress] = useState(0);

  useEffect(() => {
    const dragRefCurrent = dragRef.current as HTMLDivElement;
    const dragoverEvent: any = dragRefCurrent.addEventListener(
      "dragover",
      (e) => {
        dragRefCurrent.style.borderColor = "red";
        e.preventDefault();
      }
    );
    const dragleaveEvent: any = dragRefCurrent.addEventListener(
      "dragleave",
      (e) => {
        dragRefCurrent.style.borderColor = "#999";
        e.preventDefault();
      }
    );
    const dropEvent: any = dragRefCurrent.addEventListener("drop", (e: any) => {
      const fileList = e.dataTransfer.files;
      console.log("文件：", fileList);
      setFile(fileList[0]);
      e.preventDefault();
    });

    return () => {
      window.removeEventListener("dragover", dragoverEvent);
      window.removeEventListener("dragover", dragleaveEvent);
      window.removeEventListener("drop", dropEvent);
    };
  }, []);

  const handleFileChange = (e: any) => {
    const [file] = e.target.files;
    if (!file) return;
    setFile(file);
  };

  // 计算 hash值 的第一种方式
  const calculateHashWorker = async (currChunks: FileChunks[]) => {
    return new Promise((resolve) => {
      const worker = new Worker("/md5/hash.js");
      worker.postMessage({ chunks: currChunks });
      worker.onmessage = (e) => {
        const { progress, hash } = e.data;
        setHashProgress(Number(progress.toFixed(2)));
        if (hash) {
          resolve(hash);
        }
      };
    });
  };

  // 计算 hash值 的第二种方式
  const calculateHashIdle = async (currChunks: FileChunks[]) => {
    return new Promise((resolve) => {
      const spark = new sparkMD5.ArrayBuffer();
      let count = 0;

      const appendToSpark = async (file: Blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = (e: any) => {
            spark.append(e.target?.result);
            resolve("");
          };
        });
      };

      const workLoop = async (deadline: any) => {
        while (count < currChunks.length && deadline.timeRemaining() > 1) {
          // 空闲时间，且有任务
          await appendToSpark(currChunks[count].file);
          count++;
          if (count < currChunks.length) {
            setHashProgress(Number(((100 * count) / chunks.length).toFixed(2)));
          } else {
            setHashProgress(100);
            resolve(spark.end());
          }
        }

        window.requestIdleCallback(workLoop);
      };

      window.requestIdleCallback(workLoop);
    });
  };

  // 抽象hash法
  const calculateHashSample = async () => {
    // 布隆过滤器 判断一个数据存在与否
    // 1个G的文件，抽样后5M以内
    // hash一样，文件不一定一样
    // hash不一样，文件一定不一样
    return new Promise((resolve) => {
      const spark = new sparkMD5.ArrayBuffer();
      const reader = new FileReader();

      if (!file) return;
      const size = file.size;
      const offset = 2 * 1024 * 1024;
      // 第一个2M，最后一个区块数据全要
      let chunks = [file.slice(0, offset)];

      let cur = offset;
      while (cur < size) {
        if (cur + offset >= size) {
          // 最后一个区块
          chunks.push(file.slice(cur, cur + offset));
        } else {
          // 中间的区块
          const mid = cur + offset / 2;
          const end = cur + offset;
          chunks.push(file.slice(cur, cur + 2));
          chunks.push(file.slice(mid, mid + 2));
          chunks.push(file.slice(end - 2, end));
        }
        cur += offset;
      }
      // 中间的，取前中后各2个字节
      reader.readAsArrayBuffer(new Blob(chunks));
      reader.onload = (e: any) => {
        spark.append(e.target.result);
        resolve(spark.end());
      };
    });
  };

  const handleUploadFile = async () => {
    console.log("file", file);
    if (!file) return;
    // if (!(await isImage(file))) {
    //   message.error('文件格式不符');
    //   return;
    // }
    let currChunks = createFileChunk(file);
    const hash = (await calculateHashWorker(currChunks)) as string;
    // const hash = await calculateHashIdle(currChunks);
    console.log("hash:", hash);

    // 抽样hash 不算全量
    // 布隆过滤器 损失一小部分的精度，换取效率
    // const hash = await calculateHashSample();
    // console.log("文件的hash2", hash2);

    // setFileHash(hash);

    // TODO：问后端，文件是否上传过，如果没有，是否有存在的切片
    // const {
    //   data: { uploaded, uploadedList },
    // } = await $http.post("/checkfile", {
    //   hash: hash,
    //   ext: file.name.split(".").pop(),
    // });

    // if (uploaded) {
    //   // 秒传
    //   return message.success("秒传成功!");
    // }

    currChunks = currChunks.map((chunk, index) => {
      // 切片的名字 hash + index
      const name = hash + "-" + index;
      return {
        file: chunk.file,
        hash,
        name,
        index,
        chunk: chunk.file,
        // 设置进度条，已经上传的，设置为100
        progress: 0,
      };
    });

    setChunks(currChunks);

    // await uploadChunks(uploadedList);
  };

  const uploadChunks = async (uploadedList: string[]) => {
    const requests = chunks
      .filter((chunk) => uploadedList.indexOf(chunk.name || "") === -1)
      .map((chunk, index) => {
        // 转成promise
        const form = new FormData();
        form.append("chunk", chunk.chunk || "");
        form.append("hash", chunk.hash || "");
        form.append("name", chunk.name || "");
        // form.append('index', chunk.index);
        return { form, index: chunk.index, error: 0 }; // error用来记录出错的次数
      });
    // .map(({ form, index }) =>
    //   this.$http.post("/uploadfile", form, {
    //     onUploadProgress: (progress) => {
    //       // 不是整体的进度条了，而是每个区块有自己的进度条，整体的进度条需要计算
    //       this.chunks[index].progress = Number(
    //         ((progress.loaded / progress.total) * 100).toFixed(2)
    //       );
    //     },
    //   })
    // );

    // 异步数据的并发量控制
    // 尝试申请tcp链接过多，也会造成卡顿
    // 异步的并发数控制
    // await Promise.all(requests);

    await sendRequest(requests);

    await mergeRequest();
  };

  // 拓展：TCP慢启动，先上传一个初始区块，比如10kb，根据上传成功时间，决定下一个区块是20k，还是50k，还是5k
  // 在下一个一样的逻辑，可能变成 100k，200k或者2k

  // 上传可能报错
  // 报错之后，进度条变红，开始重试
  // 一个切片重试三次，整体全部终止
  const sendRequest = async (requests: any, limit = 4) => {
    // limit 限制并发数
    // 一个数组，长度限制limit
    // [task1, task2, task3] => [task2, task3, task4] => ...
    return new Promise((resolve, reject) => {
      const len = requests.length;
      let counter = 0;
      let isStop = false;
      const start = async () => {
        if (isStop) return;

        const task = requests.shift();
        if (task) {
          const { form, index } = task;

          try {
            // await $http.post("/uploadfile", form, {
            //   onUploadProgress: (progress: any) => {
            //     // 不是整体的进度条了，而是每个区块有自己的进度条，整体的进度条需要计算
            //     chunks[index].progress = Number(
            //       ((progress.loaded / progress.total) * 100).toFixed(2)
            //     );
            //   }
            // })
            // if (counter == len - 1) {
            //   // 最后一个任务
            //   resolve('');
            // } else {
            //   counter++;
            //   // 启动下一个任务
            //   start();
            // }
          } catch (error) {
            chunks[index].progress = -1;
            if (task.error < 3) {
              task.error++;
              chunks.unshift(task);
              start();
            } else {
              // 错误三次
              isStop = true;
              reject();
            }
          }
        }
      };

      while (limit > 0) {
        // 启动limit个任务
        start();

        // 模拟一下延迟
        // setTimeout(() => {
        //   start();
        // }, Math.random() > 2000);
        limit -= 1;
      }
    });
  };

  const mergeRequest = async () => {
    // $http.post("/mergefile", {
    //   ext: file.name.split(".").pop(),
    //   size: CHUNK_SIZE,
    //   hash: fileHash,
    //   name: file.name,
    // });
  };

  const cubeWidth = useCallback(() => {
    return Math.ceil(Math.sqrt(chunks.length)) * (40 + 3) + 24;
  }, [chunks]);

  const uploadProgress = () => {
    if (!file || chunks.length) {
      return 0;
    }
    // const load = chunks.map((item) => item.chunk.size * item.progress)
    //     .reduce((acc, cur) => acc + cur, 0);
    //   return Number(((loaded * 100) / this.file.size).toFixed(2));
  };

  return (
    <div className="file-upload">
      <div ref={dragRef} className="drag">
        <input type="file" name="file" onChange={handleFileChange} />
      </div>
      <div style={{ marginTop: 20 }}>
        <Button type="primary" onClick={handleUploadFile}>
          开始上传
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        <div>当前切片长度：{chunks.length}</div>
        <ul className="cube-container" style={{ width: cubeWidth() + "px" }}>
          {chunks.map((chunk) => {
            chunk.progress = chunk.progress || 0;
            return (
              <li className="cube" key={chunk.name}>
                <div
                  className={cs("cube-li", {
                    uploading: chunk.progress > 0 && chunk.progress < 100,
                    success: chunk.progress === 100,
                    error: chunk.progress < 0,
                  })}
                >
                  {chunk.progress > 0 && chunk.progress < 100 && <Spin />}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default FileUpload;
