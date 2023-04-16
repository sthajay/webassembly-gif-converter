import { useState } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useEffect } from "react";
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [isConverting, setIsConverting] = useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGit = async () => {
    setIsConverting(true);
    // writing file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));
    //run ffmpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "2.5",
      "-ss",
      "1.0",
      "-f",
      "gif",
      "out.gif"
    );
    // read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
    setIsConverting(false);
  };

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="400" src={URL.createObjectURL(video)}></video>
      )}
      <h3>
        {video
          ? isConverting
            ? ""
            : gif
            ? ""
            : "Video Uploaded!!!!"
          : "Upload a Video"}
      </h3>
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      {video && (
        <h3>
          {gif
            ? "Result"
            : isConverting
            ? "Check Console Log in Browser!!"
            : "Click Convert to convert uploaded video into gif"}
        </h3>
      )}
      {video && !gif && (
        <button onClick={convertToGit} disabled={isConverting}>
          {isConverting ? "Converting" : "Convert"}
        </button>
      )}
      {gif && <img src={gif} width="500" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
