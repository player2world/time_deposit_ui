import "./App.css";
import { ToastContainer } from "react-toastify";
import AudioProvider from "./components/AudioProvider";
import "react-toastify/dist/ReactToastify.css";
import Elemental from "./components/Modal";

function App() {
  const sampleSongs = ["/music/1.mp3", "/music/2.mp3"];
  return (
    <>
      <AudioProvider initialSongList={sampleSongs}>
        <main className="main">
          <section className="modal on">
            <div className="wrapper">
              <div className="wrapper2">
                <div className="wrapper3">
                  <div className="wrapper4">
                    <ToastContainer
                      pauseOnHover={true}
                      pauseOnFocusLoss={false}
                    />
                    <Elemental />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </AudioProvider>
    </>
  );
}

export default App;
